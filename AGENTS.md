# AGENTS.md

QR "Checkpoint Checker": a mobile PWA (React) for scanning participant QR codes and
tracking checkpoint check-ins, backed by a small Flask/SQLite service.

## Two independent apps (the key fact)

- Repo root = **React frontend** (Create React App, **plain JSX — NOT TypeScript**).
  Entry `src/index.js` → `components/ChecklistApp`. Components `src/components`, CSS
  Modules `src/styles` (`*.module.css`). After `npm run build` it is static files only —
  the frontend is **not** a server and does no server-side work.
- `rest/` = **Flask backend** (Python). See `rest/AGENTS.md` (auto-loaded in that dir) for
  authoritative backend details — don't restate them here.

They are **separate OS processes sharing nothing** (no imports, build steps, or runtime).
The **only** interaction is HTTP, and every frontend request goes through the single helper
`api(baseurl, path, options)` in `src/services/api.js` (plus `toBig()` to parse state).
Components call `api(...)`, never raw `fetch` to the backend. Treat that HTTP API as the
entire frontend↔backend contract.

**Data model (both sides):** each checkpoint's `state` is a **BigInt bitmask**, one bit per
participant in `teilnehmer.csv`. Check-ins flip a bit locally; sync sends the BigInt and the
backend **OR**-merges it. States cross the wire and localStorage as **strings** — never coerce
to JS `Number` (precision loss). `jsonstringify` + a `BigInt` reviver in `ChecklistApp.jsx`
enforce this.

Local dev runs **both** processes (frontend :3000 + backend :5000); neither alone exercises
the app.

## Frontend (repo root)

- `npm start` (dev :3000) · `npm run build` (→ `build/`) · `npm test` (react-scripts/Jest
  watch; **no test files exist yet**). start/build set `GENERATE_SOURCEMAP=false` and inject
  `REACT_APP_BUILD_ID=<git short sha>@<utc ts>`.
- Plain `.jsx` only; no lint/typecheck/format scripts (ESLint runs only via CRA `react-app`).
- React 19 + react-router-dom v7. Routing uses **`HashRouter`** with `homepage: "./"` so the
  build works from any static subpath — don't switch to `BrowserRouter` without fixing deploy.
- `jsconfig.json` sets `baseUrl: "src"` → use bare absolute imports:
  `import ChecklistApp from "components/ChecklistApp"`, `import "styles/app.css"` (no `../`,
  no `src/` prefix).
- **`.env` is tracked in git and points to PRODUCTION** (`https://www2.in.tum.de/check/backend/`),
  which is also the hardcoded fallback in `ChecklistApp.jsx` — a local dev server therefore
  silently hits prod. Override with gitignored `.env.local`
  (`REACT_APP_WEBSERVICE_URL=http://localhost:5000/`) or the in-app Settings page (persisted to
  `localStorage`).
- Participant roster loads at runtime from `teilnehmer.csv` (`fetch('./teilnehmer.csv')` in
  `Checklist.jsx` and `PUBLIC_URL + '/teilnehmer.csv'` in `ChecklistApp.jsx`).
- Scanned QR payloads must start with `settings.qrprefix` (default `FA<currentYear>`);
  `RegisterPerson.jsx` matches it as the first token.

## Backend (`rest/`)

- Read `rest/AGENTS.md`. Cross-cutting reminders: run the server/tests from `rest/`
  (`DB_PATH` is relative `./checkpoints.sqlite3`); `POST /<tag>` OR-merges states; CORS is
  always on; auth is OFF unless env `auth=true`. Two backend tests are currently red by design
  drift (see `rest/AGENTS.md`).

## Operational gotchas

- Yearly participant import: copy the new fa-db CSV export into **BOTH** `public/teilnehmer.csv`
  **and** `build/teilnehmer.csv` (build/ is untracked; copying it avoids a rebuild).
- Production deploy (`www2.in.tum.de/check`): set `homepage` + `REACT_APP_WEBSERVICE_URL`,
  rebuild; served via nginx (Basic-auth frontend, `/check/backend` → gunicorn `backend:app`
  on `127.0.0.1:5000`). Full steps in `README.md`.
- PWA service worker is registered (`src/serviceWorkerRegistration.js`); stale caches happen —
  hard-reload / unregister when verifying frontend changes.
- Aux QR image script lives in the misspelled dir `auxilliary/createQR.sh`.
- No CI/CD, no pre-commit hooks, no formatter configured.
