#!.venv/bin/python
import hashlib
import logging
import os
import sqlite3
from contextlib import contextmanager
from functools import wraps
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from passlib.apache import HtpasswdFile

from werkzeug.exceptions import HTTPException

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    if gunicorn_logger.handlers:
        logger.handlers = gunicorn_logger.handlers
        logger.setLevel(gunicorn_logger.level)
DB_PATH = os.path.join(".", "checkpoints.sqlite3")
HTPASSWD_PATH = ".htpasswd"  # Path to your .htpasswd file
AUTH_ENABLED = os.environ.get("auth", "false").strip().lower() == "true"


@app.after_request
def add_cors_headers(response):
    response.headers.setdefault("Access-Control-Allow-Origin", "*")
    response.headers.setdefault(
        "Access-Control-Allow-Headers", "Content-Type, Authorization"
    )
    response.headers.setdefault(
        "Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS"
    )
    return response


@app.errorhandler(HTTPException)
def handle_http_exception(e):
    logger.warning(f"HTTP {e.code} error on {request.path}: {e.description or e.name}")
    response = e.get_response()
    response.data = jsonify({"message": e.description or e.name}).data
    response.content_type = "application/json"
    return response


def requires_auth(f):
    """Decorator to authenticate requests using a .htpasswd file."""

    @wraps(f)
    def decorated(*args, **kwargs):
        if not AUTH_ENABLED:
            return f(*args, **kwargs)

        auth = request.authorization
        if not auth or not auth.username or not auth.password:
            logger.warning(
                f"Missing credentials from IP: {request.remote_addr}"
            )
            return (
                jsonify({"message": "Unauthorized"}),
                401,
                {"WWW-Authenticate": 'Basic realm="Login Required"'},
            )

        try:
            # Load the .htpasswd file and check user/password validity
            ht = HtpasswdFile(HTPASSWD_PATH)
            if not ht.check_password(auth.username, auth.password):
                logger.warning(
                    f"Invalid password for user '{auth.username}' from IP: {request.remote_addr}"
                )
                return (
                    jsonify({"message": "Unauthorized"}),
                    401,
                    {"WWW-Authenticate": 'Basic realm="Login Required"'},
                )
        except FileNotFoundError:
            logger.error(f"Authentication file not found at {HTPASSWD_PATH}")
            return jsonify({"message": "Server authentication configuration error"}), 500

        return f(*args, **kwargs)

    return decorated


@contextmanager
def get_db():
    os.makedirs("db", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as db:
        cur = db.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='checkpoints';"
        )
        existed = cur.fetchone() is not None

        if not existed:
            db.execute(
                "CREATE TABLE checkpoints ("
                "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                "tag VARCHAR, state VARCHAR, prev VARCHAR)"
            )
            logger.info("Table 'checkpoints' did not exist and was created.")
        else:
            logger.info("Table 'checkpoints' already exists.")

        return existed


with app.app_context():
    init_db()


def query_db(query, args=(), one=False):
    with get_db() as db:
        cur = db.execute(query, args)
        rv = cur.fetchall()
        return (rv[0] if rv else None) if one else rv


@app.route("/", methods=["GET"])
def list_checkpoints():
    rows = query_db("SELECT tag, state, prev FROM checkpoints")
    logger.info("Listed all checkpoints")
    for r in rows:
        if r["tag"] is None:
            logger.warning("Encountered a checkpoint with a NULL tag in the database.")
        logger.debug(f"Checkpoint: {r['tag']}, State: {r['state']}, Prev: {r['prev']}")
    return jsonify(
        {
            r["tag"]: {
                "tag": r["tag"],
                "state": r["state"],
                "prevstate": r["prev"],
            }
            for r in rows
        }
    )


@app.route("/*reset", methods=["GET"])
@requires_auth
def reset_checkpoints():
    with get_db() as db:
        db.executescript(
            "DROP TABLE IF EXISTS checkpoints; CREATE TABLE checkpoints (id INTEGER PRIMARY KEY AUTOINCREMENT, tag VARCHAR, state VARCHAR, prev VARCHAR);"
        )
    logger.warning("Database has been completely RESET!")
    return jsonify({"result": "DB RESET"})


@app.route("/<tag>", methods=["GET"])
def get_checkpoint(tag):
    row = query_db(
        "SELECT tag, state, prev FROM checkpoints WHERE tag = ?", (tag,), one=True
    )
    if not row:
        logger.info(f"Checkpoint not found: {tag}")
        abort(404)
    logger.info(f"Retrieved checkpoint: {tag}")
    logger.debug(f"Checkpoint: {row['tag']}, State: {row['state']}, Prev: {row['prev']}")
    return jsonify(
        {"tag": row["tag"], "state": row["state"], "prevstate": row["prev"]}
    )


@app.route("/*share", methods=["POST"])
@requires_auth
def share_checkpoint():
    d = request.get_json(silent=True) or {}
    tag, state, prev = d.get("tag"), d.get("state"), d.get("prev")
    if query_db("SELECT 1 FROM checkpoints WHERE tag = ?", (tag,), one=True):
        logger.warning(
            f"Conflict: Attempted to share existing checkpoint '{tag}'"
        )
        abort(409)
    query_db(
        "INSERT INTO checkpoints (tag, state, prev) VALUES (?, ?, ?)",
        (tag, state, prev),
    )
    logger.info(f"Successfully shared new checkpoint: {tag}")
    logger.debug(f"Checkpoint: {tag}, State: {state}, Prev: {prev}")
    return jsonify({"tag": tag, "state": state, "prevstate": prev})


@app.route("/<tag>", methods=["POST"])
@requires_auth
def update_checkpoint(tag):
    row = query_db(
        "SELECT state FROM checkpoints WHERE tag = ?", (tag,), one=True
    )
    if not row:
        logger.info(f"Update failed - Checkpoint not found: {tag}")
        abort(404)
    d = request.get_json(silent=True) or {}
    try:
        new_val = str(int(d.get("state", 0)) | int(row["state"]))
    except (ValueError, TypeError):
        new_val = str(d.get("state"))
    query_db("UPDATE checkpoints SET state = ? WHERE tag = ?", (new_val, tag))
    logger.debug(f"Checkpoint '{tag}' updated from state {row['state']} with {d.get('state')} to {new_val}")
    logger.info(f"Updated checkpoint '{tag}' state to: {new_val}")
    return jsonify({"state": new_val})

@app.route("/<tag>", methods=["DELETE"])
@requires_auth
def delete_checkpoint(tag):
    if not query_db(
        "SELECT 1 FROM checkpoints WHERE tag = ?", (tag,), one=True
    ):
        logger.info(f"Delete failed - Checkpoint not found: {tag}")
        abort(404)
    pwd = (request.get_json(silent=True) or {}).get("password", "")
    if (
        hashlib.sha256(pwd.encode()).hexdigest()
        != "d7dbaf19d9827ff39ac45e9ac5b2a8275577bb94c2556d22b2c6a1736ba8f1db"
    ):
        logger.warning(
            f"Failed deletion attempt on '{tag}' due to incorrect password."
        )
        abort(401)
    query_db("DELETE FROM checkpoints WHERE tag = ?", (tag,))
    logger.info(f"Successfully deleted checkpoint: {tag}")
    return jsonify({"message": "User deleted successfully"})


if __name__ == "__main__":
    logger.info("Starting Flask development server...")
    if not AUTH_ENABLED:
         logger.warning("authentication disabled");
    app.run(host='0.0.0.0', debug=True, port=5000)
