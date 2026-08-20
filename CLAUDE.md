# CLAUDE.md

This file provides guidance to AI coding assistants (e.g. Claude Code, opencode) when working with this repository.

## Project overview

"FA Checkpoint Checker" (Ferienakademie Checkpoint Checker) – a mobile-first React PWA for
checking QR-coded participants against checklists, with cloud subscription/sync support.

- Frontend only in this analysis scope: React 18 (Create React App / `react-scripts` 5.0.1), plain JSX (no TypeScript).
- App state is persisted in `localStorage` (no backend database in the client).
- QR scanning via `html5-qrcode`, icons via `react-icons`, routing via `react-router-dom` v6 (`HashRouter`).
- **Out of scope**: the `rest/` (Python backend) and `webservice/` (PHP) folders. Do not modify them when working on the frontend.

## Commands

All commands run from the repository root:

- `npm start` – start dev server (http://localhost:3000); hot reload; runs with `GENERATE_SOURCEMAP=false`.
- `npm run build` – production build into `build/` (gitignored); also `GENERATE_SOURCEMAP=false`.
- `npm test` – run Jest via `react-scripts test` in watch mode. Use `CI=true npm test` for a single run.
- There is **no separate lint script**; linting runs inside `react-scripts` (ESLint config `react-app`, `react-app/jest` in `package.json`). No Prettier config exists.
- `npm run eject` – available but should never be used.

## Project structure

- `src/index.js` – entry point; renders `<ChecklistApp/>` and registers the service worker (`src/serviceWorkerRegistration.js` with custom `src/service-worker.js`).
- `src/components/` – all React components (`*.jsx`).
- `src/styles/` – all CSS. Global `app.css` (imports `corporate.css`), plus one CSS Module per component (e.g. `Checklist.module.css` ↔ `Checklist.jsx`).
- `public/` – static assets served as-is: `index.html`, `manifest.json`, logos, and **`teilnehmer.csv`** (the participant list, the app's primary data source).
- `auxilliary/` – logos, participant-data docs, QR generation scripts (not part of the build).
- `jsconfig.json` – sets `baseUrl: "src"`, enabling imports like `components/Checklist` / `styles/Checklist.module.css` (no `@/` alias; both absolute-from-`src` and relative `./` imports are used).

## Routing

`HashRouter` (works on static hosting, `homepage: "./"`). Routes in `ChecklistApp.jsx`:

| Path | Component |
|---|---|
| `/` | `Home` |
| `/yesno` | `YesNoDialog` |
| `/settings` | `Settings` |
| `/checkpoint` | `Checklist` (current checklist) |
| `/cloud` | `RegisterCloud` (manage cloud subscriptions) |
| `/share` | `ShareCheckpoint` |
| `/newcheckpoint` | `CreateCheckpoint` |
| `/managecheckpoints` | `DeleteCheckpoints` |

## Data model (localStorage)

- `checkpoints` – `{ __current: key, [key]: { name, state: bigint, prevstate: bigint, prev?, tag? } }`.
  - A checklist's `state`/`prevstate` are **BigInt bitmasks**; person index `i` (1-based) is bit `i-1`: `state & (1n << BigInt(i-1))`.
  - `tag` marks a checkpoint as a cloud subscription (prefixed `#`); `prev` links a branch to its parent.
  - `__current` is the active checklist key.
- `settings` – `{ webservice, qrprefix, username }`; `webservice` is the base URL of the sync backend (default `https://www2.in.tum.de/~petter/webservice/`).
- BigInt cannot be `JSON.stringify`-ed directly: use the `jsonstringify` helper (defined in `ChecklistApp.jsx:64`) and the BigInt reviver in `loadLists` (`ChecklistApp.jsx:38`). Files using BigInt carry `/* global BigInt */`.
- State updates use functional `setLists((lsts) => ...)`; all list mutations live in `ChecklistApp.jsx` and are passed down as callbacks (`toggleCurrent`, `switchTo`, `reset`, `sync`, `share`, `branchOff`, `createCheckpoint`, `delCheckpoint`, `rename`).

## Participant data (teilnehmer.csv)

Fetched at runtime via `fetch(process.env.PUBLIC_URL + '/teilnehmer.csv')` (or `'./teilnehmer.csv'`). CSV columns: `First Name,Last Name,decoded QR ID (intPersonID),Hof,Kursnummer` (header row skipped; some rows may have 4 columns and are skipped). Parsed in `Checklist.jsx` (`people` state) and `ChecklistApp.jsx`.

## Backend sync

The frontend talks to `settings.webservice` with JSON bodies:
- `GET <base>` – list of available tags.
- `POST <base>/<tag>` – publish/update state `{ tag, state }`.
- `GET <base>/<tag>` – fetch a tag's `{ state, prevstate }` (see `syncTo` in `RegisterCloud`).
- `DELETE <base>/<tag>` – server-side delete (with password prompt).

## Code conventions

- **Naming**: mixed conventions – feature/leaf components are often suffixed `.component.jsx` (`Home.component.jsx`, `RegisterCloud.component.jsx`, `YesnoDialog.component.jsx`), others are plain `*.jsx` (`Checklist.jsx`, `Sidebar.jsx`, `QRScanner.jsx`). Custom hooks may live in `.component.jsx` files too (`OnlineStatus.component.jsx` exports `useOnlineStatus`). When adding a component, follow the naming of the folder it fits (suffixed if it is a self-contained feature widget, plain otherwise).
- Components are function components (arrow functions or `const X = (props) => ...`), always with a **default export**.
- Hooks: `useState`/`useEffect`; custom hook `useOnlineStatus` for connectivity; `useNavigate`/`useLocation`/`Link` for navigation.
- Styling: CSS Modules (`import styles from 'styles/X.module.css'`, kebab-case class names) + global `app.css`/`corporate.css` with TUM design tokens (`var(--tum-blue-dark-6)`, `--tum-yellow`, ...). Add a matching `*.module.css` when creating a component.
- Code style: 4-space indentation, single-quoted strings, semicolons, minimal comments (URL docs for external libraries are okay), `console.log`/`console.dir` left in place in some files.
- No TypeScript, no PropTypes, no test files exist yet despite `@testing-library/*` being installed – if adding tests, place them next to components as `X.test.jsx` (CRA convention).

## Gotchas / constraints

- QR scanner (`html5-qrcode` in `QRScanner.jsx`) requires HTTPS and camera permission (desktop/mobile Chrome or Firefox); camera uses `facingMode: "environment"`. Props required: `qrCodeSuccessCallback` (throws otherwise) and `toggleQR`.
- `Home`/`Checklist` fetch `teilnehmer.csv` relative to the deployed base path – keep the file in `public/` and respect `process.env.PUBLIC_URL`.
- Service worker registration in `src/index.js` is custom; cache names are versioned in `src/service-worker.js` – bump the cache version when changing assets.
- Dev mode disables sourcemaps (`GENERATE_SOURCEMAP=false`) to match the production build.
- Deployed under a user homepage path (`homepage: "./"`, relative asset URLs), so never use absolute `/` asset paths.
