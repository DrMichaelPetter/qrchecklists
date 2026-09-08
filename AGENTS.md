# AGENTS.md

QR "Checkpoint Checker": a mobile PWA for scanning participant QR codes and
tracking checkpoint check-ins.

## Structure (two independent apps)

- Repo root = **React frontend** (Create React App, plain JSX — NOT TypeScript).
  Entry: `src/index.js` → `components/ChecklistApp`. Components in `src/components`,
  CSS Modules in `src/styles` (`*.module.css`). After `npm run build` it's just static
  files (HTML/JS/CSS) — the frontend is **not** a server and does no server-side work.
- `rest/` = **Flask backend** (Python). Entrypoint module is `rest/backend.py`
  (Flask instance named `app`). `rest/db.py` is a manual SQLite scratch script, not
  imported by the app.

**The two are separate, independently running OS processes that share nothing** —
no shared code, imports, build steps, or runtime. The backend never imports or serves
frontend code, and there is no server-side rendering. **The only way they interact is
HTTP**: the browser-side frontend issues `fetch` calls to the backend's REST API at
`REACT_APP_WEBSERVICE_URL` (e.g. `ChecklistApp.jsx`, `RegisterCloud.component.jsx`).
The frontend can be served as static files from anywhere; the backend runs as its own
HTTP server. Treat that HTTP API as the entire frontend↔backend contract.

`AGENTS.md` lives at the workspace root. Frontend and backend have separate
toolchains — cd into the right one before running commands. During local dev you must
run **both** processes at once (frontend :3000 + backend :5000); neither alone exercises
the full app.

## Frontend (repo root)

- `npm start` (dev, :3000) · `npm run build` (production → `build/`) · `npm test`
  (CRA/Jest, watch mode). Both start/build set `GENERATE_SOURCEMAP=false`.
- Plain JS (`.jsx`), no typecheck/lint/format scripts. ESLint runs only via CRA
  (`react-app` config in `package.json`). No frontend test files exist.
- `jsconfig.json` sets `baseUrl: "src"` → use bare absolute imports like
  `import ChecklistApp from "components/ChecklistApp"`, `import "styles/app.css"`
  (no `../`, no `src/` prefix).
- Routing uses **`HashRouter`** and `homepage: "./"` so the build works from any
  static subpath. Don't switch to `BrowserRouter` without fixing deployment.
- Backend URL comes from `process.env.REACT_APP_WEBSERVICE_URL` (see `.env`), with a
  hardcoded `https://www2.in.tum.de/check/backend/` fallback in `ChecklistApp.jsx`.
- Participant roster is loaded at runtime via `fetch(process.env.PUBLIC_URL + '/teilnehmer.csv')`.

## Backend (`rest/`)

- Setup: `bash setup.sh` (creates `.venv`, installs `requirements.txt`).
- Run dev server: `.venv/bin/python backend.py` → binds `0.0.0.0:5000`, `debug=True`.
- Runs as a standalone HTTP server; the only consumer is the browser frontend over
  HTTP. CORS is enabled (`flask_cors.CORS` + an `add_cors_headers` hook) so cross-origin
  `fetch` calls work — this HTTP API is the sole integration surface.
- Tests: `cd rest && .venv/bin/python -m pytest`. Single test:
  `-k test_name` or `pytest test_backend.py::test_name`.
- **`DB_PATH` is relative (`./checkpoints.sqlite3`)** → always run the server/tests
  from `rest/` or the DB file lands elsewhere. Tests use `tmp_path` + monkeypatch, so
  they don't touch the real `checkpoints.sqlite3`.
- Auth is OFF by default. Enable with env `auth=true` → requests hit a `.htpasswd`
  file via Basic auth (`requires_auth` decorator).
- API shape is unusual and easy to get wrong:
  - `GET /` → all checkpoints keyed by tag.
  - `GET /<tag>` → one checkpoint (404 if missing).
  - `POST /*share` → create a tag (409 on conflict). The `*` is a **literal** segment.
  - `GET /*reset` → drops & recreates the table.
  - `POST /<tag>` → update state = **bitwise OR** of the int states.
  - `DELETE /<tag>` → requires a body `password` whose **sha256 equals a hardcoded
    hash** in `backend.py`, AND Basic auth.
- **Two backend tests currently fail** against `backend.py` (`test_init_db_creates_table`,
  `test_delete_missing`) — the test expectations drifted from the code. Don't assume a
  green baseline; treat a failing run as possibly pre-existing, not caused by you.

## Operational gotchas

- Yearly participant import: after a new fa-db CSV export, copy it into BOTH
  `public/teilnehmer.csv` and `build/teilnehmer.csv`.
- Production deploy (`www2.in.tum.de/check`): set `homepage: "https://www2.in.tum.de/check"`
  and `REACT_APP_WEBSERVICE_URL=https://www2.in.tum.de/check/backend/`, then rebuild.
  Served via nginx (Basic-auth for frontend, `/check/backend` proxied to gunicorn on
  `127.0.0.1:5000`) under a systemd unit running `gunicorn backend:app`. Full steps in README.
- PWA: a service worker is registered (`src/serviceWorkerRegistration.js`); stale
  caches can occur — hard-reload / unregister when verifying frontend changes.
- `auxilliary/createQR.sh` generates QR code images for participants.
- No CI/CD, no pre-commit hooks, no formatter configured.
