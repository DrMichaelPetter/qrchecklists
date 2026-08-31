# rest

Flask backend for the checklists project — a "checkpoints" state store backed by SQLite.

## Commands

```bash
# Setup (first time)
./setup.sh                     # creates .venv, installs requirements.txt

# Run the server
./backend.py    # serves on 0.0.0.0:5000 (debug mode)

# Run tests
./test_backend.py    # runs pytest suite
```

## Environment variables

| Variable | Effect |
| --- | --- |
| `auth` | If exactly `true` (case-insensitive), Basic auth is enforced via `.htpasswd`. Any other value or unset disables auth entirely. Read at import time — restart the server after changing it. |

When auth is enabled, a `.htpasswd` file must exist next to `backend.py` (e.g. `htpasswd -c .htpasswd user`), otherwise authenticated routes return 500. It is not committed to the repo.

## Architecture

- `backend.py` — the whole Flask app (routes, auth decorator, DB helpers). SQLite DB lives at `./checkpoints.sqlite3`; `init_db()` ensures the `checkpoints` table exists on startup; `get_db()`/`query_db()` are the only DB access helpers.
- `db.py` — standalone one-off script (creates the table, prints first row); not used by the server.
- `test_backend.py` — pytest suite. Uses a temp DB + temp `.htpasswd` per test, so the real `checkpoints.sqlite3` is never touched. The `client` fixture enables auth by default; use `monkeypatch.setattr(backend, "AUTH_ENABLED", False)` to test auth-disabled behavior.
- `setup.sh` — venv bootstrap.

## Routes

| Method | Path | Auth | Behavior |
| --- | --- | --- | --- |
| GET | `/` | no | List all checkpoints as `{tag: {tag, state, prevstate}}` |
| GET | `/*reset` | yes | Drop + recreate the `checkpoints` table |
| GET | `/<tag>` | no | Get one checkpoint, 404 if missing |
| POST | `/*share` | yes | Insert checkpoint; 409 if tag exists |
| POST | `/<tag>` | yes | Bitwise-OR `state` with existing state (numeric fallback to raw string); 404 if missing |
| DELETE | `/<tag>` | yes | Deletes checkpoint; requires `password` in JSON body matching a hardcoded SHA-256 hash, else 401 |

## Known quirks

- The DELETE password is a hardcoded SHA-256 hash in `backend.py`; the plaintext is not in the repo, so the DELETE success path is untestable without it.
- The `/*reset` and `/*share` paths are literal (the `*` is not a converter).
- `HtpasswdFile` in passlib 1.7.x has `check_password()`, not `check()` — don't "fix" it back.
- Logs go to `app.log` in the repo root.
