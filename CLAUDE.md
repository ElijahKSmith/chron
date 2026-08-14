# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

chron is a Tauri 2 desktop app for tracking recurring reset-based tasks in video games (dailies/weeklies). The frontend is React 19 + TanStack Router (Vite build); the backend is a thin Rust shell (`src-tauri`) whose only real job is hosting a local SQLite database via `tauri-plugin-sql`. There is no server component — all state lives in the local `chron.db` SQLite file plus a little `localStorage` for UI settings.

## Commands

```bash
npm install          # install JS deps
npm run dev           # vite dev server only (no Tauri window) — for pure frontend work
npm run tauri dev     # full app: spawns vite dev server + opens the Tauri webview window
npm run build          # tsc --noEmit type-check, then vite build (frontend only, outputs to dist/)
npm run tauri build    # full desktop build (invokes the frontend build, then bundles a native binary)
npm run lint            # eslint .
npm run ui add <name>   # add/update a shadcn/ui component (npx shadcn@latest add ...)
```

There is no test suite in this repo (no `test` script, no test runner configured) — don't assume Vitest/Jest exists.

Rust side (`src-tauri/`) can be checked directly with `cargo check` / `cargo build` from that directory if you're only touching Rust.

## Architecture

### Frontend/backend split

- `src/`, `components/`, `lib/`, `hooks/` — the React app, bundled by Vite.
- `src-tauri/` — the Rust shell. `src-tauri/src/lib.rs` is where the Tauri `Builder` is configured: plugins (`sql`, `shell`, `log`, `single-instance`) and the SQLite migration list live here. There is essentially no other Rust logic — all business logic lives in TypeScript.
- The two are glued together by `src-tauri/tauri.conf.json` (`beforeDevCommand`/`beforeBuildCommand` run the npm scripts above) and by `@tauri-apps/plugin-*` JS APIs called from `lib/`.

### Data layer

- **Schema/migrations**: defined inline in `src-tauri/src/lib.rs` as a `Vec<Migration>` passed to `tauri_plugin_sql`. To change the schema, add a new migration with the next version number — don't edit an existing migration once it has shipped.
- **Queries**: all SQL lives in `lib/database.ts`, which opens the db via `Database.load("sqlite:chron.db")` per call. There are two tables, `games` and `tasks` (one-to-many via `gameId`, `ON DELETE CASCADE`).
- SQLite has no boolean type, so `games.open` and `tasks.done` are stored as `0`/`1` integers. Every read path in `database.ts` manually coerces these back to `boolean` (`!!game.open`) — remember to do the same for any new boolean column.
- Domain types (`GameItem` in `lib/game.ts`, `TaskItem`/`TaskType` in `lib/task.ts`) are hand-maintained TS interfaces that mirror the SQL columns; they are not generated from the migrations. Zod validation schemas for the create/edit forms (`lib/zod.ts`, using zod v4's `error` callback API) are a **separate, manually-kept-in-sync** definition of roughly the same shape — update both when a field changes.

### Reset-time logic

`lib/timer.ts` computes daily/weekly reset windows. Key conventions:
- `dailyTime` is always a string in `HH:mm:ss.sssZ` form (a JS Date time-string suffix), combined with today's date and parsed as UTC.
- `weeklyDay` is 0–6 (JS `Date.getDay()`/`date-fns setDay` convention, i.e. 0 = Sunday).
- Functions are pure and take the reset config in; they don't read from the DB or React state themselves.

### React app structure

- Routing is file-based via `@tanstack/react-router`'s Vite plugin: files under `src/routes/` are scanned and compiled into `src/routeTree.gen.ts`, which is **generated and gitignored** — never hand-edit it, and don't be surprised if it's missing before the first dev/build run. `src/routes/__root.tsx` defines the app shell (theme, sidebar, providers); `src/routes/index.tsx` is the dashboard; new pages are added by dropping a file in `src/routes/`.
- The router uses **hash history** (`createHashHistory`), specifically so deep links survive under Tauri's custom asset protocol without extra Rust-side URL rewriting — don't switch this to browser history without checking that still holds.
- Two app-level React contexts wrap everything in `__root.tsx`:
  - `TimerProvider` (`components/chron/timer-context.tsx`) — ticks a shared `currentTimestamp` every second; use `useTimer()` instead of each component running its own interval.
  - `SettingsProvider` (`components/chron/settings-context.tsx`) — wraps `GameSettings` (`lib/game-settings.ts`) in `localStorage` via `use-local-storage.tsx`.
- `components/ui/` is shadcn/ui (new-york style, generated — see `components.json`); treat it as vendored and prefer adding new primitives via `npm run ui add` rather than hand-writing. `components/chron/` is app-specific composition on top of it (game cards, task lists, dialogs, sidebar).

### Path aliases

`@chron/*` resolves to the repo root (configured in both `tsconfig.json` paths and the Vite `resolve.alias`) — e.g. `@chron/lib/database`, `@chron/components/ui/button`. Use this instead of relative `../../..` imports.

### Tauri capabilities

Any new Tauri plugin/API surface used from the frontend needs a matching permission added to `src-tauri/capabilities/default.json`, or the call will fail at runtime with a permission error even though it type-checks.

## Conventions

- **PR titles must follow Conventional Commits** (`<type>(<scope>): <subject>`, lowercase imperative subject) — the repo squash-merges PRs using the PR title as the commit message, so individual commit messages on a branch don't matter, only the PR title does. This is enforced by CI (`.github/workflows/conventional-commit-title.yml`); allowed types are `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- `npm run lint` intentionally keeps a minimal ESLint rule set (just `react-hooks/rules-of-hooks` + `exhaustive-deps`) to stay behavior-preserving with the pre-refactor Next.js setup and avoid flagging existing shadcn/ui code — see comments in `eslint.config.mjs` before adding stricter rules.
- The app version is duplicated in `package.json` and `src-tauri/tauri.conf.json`; bump both together (see recent `chore: bump version to x.y.z` commits).
- Every PR triggers `test-build.yml`, which does a full Tauri build matrix (macOS arm64/x86_64, Ubuntu, Windows) — a change that only builds on one platform will surface there.
