import hashlib
import logging
import os
import sqlite3
from contextlib import contextmanager
from functools import wraps
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from passlib.apache import HtpasswdFile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)
DB_PATH = os.path.join(".", "checkpoints.sqlite3")
HTPASSWD_PATH = ".htpasswd"  # Path to your .htpasswd file


def requires_auth(f):
    """Decorator to authenticate requests using a .htpasswd file."""

    @wraps(f)
    def decorated(*args, **kwargs):
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
            if not ht.check(auth.username, auth.password):
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


def query_db(query, args=(), one=False):
    with get_db() as db:
        cur = db.execute(query, args)
        rv = cur.fetchall()
        return (rv[0] if rv else None) if one else rv


@app.route("/", methods=["GET"])
def list_checkpoints():
    rows = query_db("SELECT tag, state, prev FROM checkpoints")
    logger.info("Listed all checkpoints")
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
    logger.info(f"Updated checkpoint '{tag}' state to: {new_val}")
    return jsonify({"state": new_val})


@app.route("/", defaults={"tag": ""}, methods=["PUT"])
@app.route("/<tag>", methods=["PUT"])
def handle_put(tag):
    return jsonify({"message": "User updated successfully"}), 400


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
    app.run(host='0.0.0.0', debug=True, port=5000)
