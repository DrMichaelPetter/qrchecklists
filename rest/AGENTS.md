# AGENTS.md — `rest/` (Flask backend)

SQLite-backed REST API for the QR Checkpoint Checker. The React frontend lives at
the repo root and calls this service; see the root `AGENTS.md` for the full picture.
Run all commands from this directory.

## Entrypoints & toolchain

- `backend.py` is the whole app: Flask instance named `app`. Dev server:
  `.venv/bin/python backend.py` → binds `0.0.0.0:5000`, `debug=True`.
- Production runs under gunicorn: `gunicorn backend:app` (module `backend`, attr `app`).
- Setup: `bash setup.sh` → creates `.venv` and installs `requirements.txt`
  (Flask, flask-cors, Flask-SQLAlchemy, pydantic, passlib, pytest, gunicorn).
  Note: SQLAlchemy/pydantic are listed but the code uses the raw `sqlite3` module.

## Commands

- Dev server: `.venv/bin/python backend.py`
- Tests: `.venv/bin/python -m pytest`
- Single test: `.venv/bin/python -m pytest -k test_name` or
  `pytest test_backend.py::test_name`.

## Data / paths

- **`DB_PATH` is relative (`./checkpoints.sqlite3`)** → run the server/tests from
  `rest/` or the DB lands in the wrong place. The real `checkpoints.sqlite3` is an
  untracked runtime artifact (not in git).
- Tests monkeypatch `backend.DB_PATH`, `backend.HTPASSWD_PATH`, and
  `backend.AUTH_ENABLED` and use `tmp_path` with `app.test_client()`, so they never
  touch the real DB or `.htpasswd`.

## Auth

- OFF by default. Enable with env `auth=true` (read at import time via
  `AUTH_ENABLED`). Then `@requires_auth` enforces HTTP Basic auth against a
  `.htpasswd` file (`HTPASSWD_PATH`, default `.htpasswd`, not tracked).
- `DELETE /<tag>` has an *extra* check independent of Basic auth: the JSON body
  `password` must have a sha256 matching a hardcoded hash in `backend.py`.

## API shape (unusual — easy to get wrong)

- `GET /` → all checkpoints, keyed by tag.
- `GET /<tag>` → one checkpoint, 404 if missing.
- `POST /*share` → create tag, 409 on conflict. The `*` is a **literal** segment in
  the path, not a wildcard; `*reset` (GET) is the same idea and drops+recreates the table.
- `POST /<tag>` → update state = **bitwise OR** of `int(new)` and `int(old)`.
- CORS is always on: `flask_cors` plus an `after_request` that uses
  `headers.setdefault(...)`, and an `HTTPException` handler that re-emits CORS headers
  on error responses (404/401/409) — preserve this when changing error handling.

## Known-broken

- **Two tests currently fail** against `backend.py`: `test_init_db_creates_table`
  (expects `init_db()` to return `False`/`True`, it returns `None`) and
  `test_delete_missing` (expects `404`, gets `401` from the password check). The test
  expectations drifted from the code — a red run here may be pre-existing, not your fault.

## Logging

- Logs go to `app.log` (untracked artifact) and stdout; `backend.py` swaps to the
  gunicorn logger when imported rather than run directly.
