# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

chron is a Tauri 2 desktop app for tracking recurring reset-based tasks in video games (dailies/weeklies). The frontend is React 19 + TanStack Router (Vite build); the backend is a thin Rust shell (`src-tauri`) whose only real job is hosting a local SQLite database via `tauri-plugin-sql`. There is no server component — all state lives in the local `chron.db` SQLite file plus a little `localStorage` for UI settings.

## Commands

```bash
npm install             # install JS deps
npm run dev             # vite dev server only (no Tauri window) — for pure frontend work
npm run tauri dev       # full app: spawns vite dev server + opens the Tauri webview window
npm run build           # tsr generate → tsc --noEmit → vite build (frontend only, outputs to dist/)
npm run tauri build     # full desktop build (invokes the frontend build, then bundles a native binary)
npm run preview         # serve a previously built dist/ (plain browser, no Tauri APIs — most of the app will fail)
npm run lint            # eslint .
npm run ui add <name>   # add a shadcn/ui component (npx shadcn@latest add ...) — see the caveat below
```

`package.json` pins `engines` to Node `^24.12.0` and npm `^11.7.0`. If a build fails in a way that makes no sense, check the Node version first.

`npm run build` runs `tsr generate` before `tsc --noEmit` on purpose: `src/routeTree.gen.ts` is gitignored, so a clean checkout has no route tree and the type-check would fail on the missing import. Don't reorder those steps.

Rust side (`src-tauri/`) can be checked directly with `cargo check` / `cargo build` from that directory if you're only touching Rust.

### There is no test suite

No `test` script, no test runner, no test files — don't assume Vitest/Jest exists and don't invent an `npm test` invocation. Until a runner is added, "verified" means one of:

- `npm run build` for type and compile errors, and `npm run lint`.
- `npm run tauri dev` and exercising the actual behavior in the app window, for anything touching the database, reset timers, or UI state.

Say which one you did. Type-checking a change to reset logic is not evidence the reset logic is right.

`lib/timer.ts` and `lib/database.ts` are the two places where a test suite would pay for itself most, if you are ever asked where to start.

## Architecture

### Frontend/backend split

- `src/`, `components/`, `lib/`, `hooks/` — the React app, bundled by Vite. Note that only `src/` holds routes and entrypoints; `components/`, `lib/`, and `hooks/` sit at the repo root, not under `src/`.
- `src-tauri/` — the Rust shell. `src-tauri/src/lib.rs` is where the Tauri `Builder` is configured: plugins (`sql`, `shell`, `log`, `single-instance`) and the SQLite migration list live here. There is essentially no other Rust logic — all business logic lives in TypeScript.
- The two are glued together by `src-tauri/tauri.conf.json` (`beforeDevCommand`/`beforeBuildCommand` run the npm scripts above) and by `@tauri-apps/plugin-*` JS APIs called from `lib/`.

### Data layer

- **Schema/migrations**: defined inline in `src-tauri/src/lib.rs` as a `Vec<Migration>` passed to `tauri_plugin_sql`. To change the schema, add a new migration with the next version number — don't edit an existing migration once it has shipped, because existing installs have already run it and will never re-run it.
- **Queries**: all SQL lives in `lib/database.ts`, which opens the db via `Database.load("sqlite:chron.db")` per call. There are two tables, `games` and `tasks` (one-to-many via `gameId`, `ON DELETE CASCADE`).
- All queries use bound parameters (`$1`, `$2`, ...). Keep it that way — never build a statement by string concatenation, even for a value that looks safe.

#### SQLite has no rich types, and the TS types lie about it

This is the single biggest source of surprise in this codebase. `db.select<T[]>(...)` is an unchecked cast: whatever SQLite returns is asserted to be `T`, with no validation and no conversion. So a declared type is a claim, not a guarantee.

Current state of that gap:

- `games.open` and `tasks.done` are stored as `0`/`1` integers. `getAllGames` and `getTasksByGameId` manually coerce them back with `!!` — **do the same for any new boolean column**, in every read path, or the value will be a truthy `0`/`1` number.
- `tasks.nextReset` is stored as an integer (written as `nextReset?.getTime()`) but declared `Date | null` on `TaskItem`. **Nothing converts it back.** At runtime a task loaded from the database has a `number` there. It currently works only because `date-fns` `isAfter` also accepts a timestamp. Don't call a `Date` method on it, and don't trust the declared type.
- `TaskItem` has no `gameId` field even though the column exists and `SELECT *` returns it.

If you touch this area, prefer narrowing the gap (convert at the boundary in `database.ts`) over adding another consumer that works around it.

#### Duplicated shape definitions

Three separate hand-maintained definitions describe roughly the same data, and none is generated from another:

| Definition | Lives in | Covers |
| --- | --- | --- |
| SQL columns | `src-tauri/src/lib.rs` migrations | Storage |
| TS interfaces | `lib/game.ts` (`GameItem`), `lib/task.ts` (`TaskItem`, `TaskType`) | Runtime shape |
| Zod schemas | `lib/zod.ts` (`gameSchema`, `taskSchema`, `TaskType`) | Create/edit form validation |

Adding or changing a field means editing all three. `TaskType` in particular exists twice — as a TS union in `lib/task.ts` and as a `z.enum` in `lib/zod.ts`.

`lib/zod.ts` uses zod v4's `error` callback API (`z.string({ error: (issue) => ... })`), not the older `required_error`/`invalid_type_error` options. Match the surrounding style.

### Reset-time logic

`lib/timer.ts` computes daily/weekly reset windows. Read the whole file before changing any of it — it is small, and the conventions are easy to get subtly wrong.

- `dailyTime` is a string in `HH:mm:ss.sssZ` form, built by `formatDailyTime(hours, minutes)` from the `dailyHour`/`dailyMinute` integer columns. Note that the database stores hour and minute, not the string; the string only exists in memory.
- **The `Z` suffix does not mean the reset is UTC.** `getTodayTimes` parses `${todayDate}T${dailyTime}` as UTC, then immediately reads it back with local-time `getHours()`/`getMinutes()` and applies those to today via `set()`. The net effect is that the configured time is shifted by the machine's UTC offset. Treat this as the current behavior, not as an intended spec — if you are asked to "fix timezone handling", this is the code that matters, and changing it will move every existing user's reset time.
- `weeklyDay` is 0–6 in the JS `Date.getDay()` / `date-fns` `setDay` convention, i.e. **0 = Sunday**. Several JSDoc comments in the file call it "ISO date of the week", which is wrong — ISO weekdays are 1–7 starting Monday. Trust the code and this note, not those comments.
- **These functions are not pure.** Every one of them calls `new Date()` internally through `getTodayTimes`, so results depend on the wall clock and cannot be tested without faking time. They do not read the database or React state.

### React app structure

- Routing is file-based via `@tanstack/react-router`'s Vite plugin: files under `src/routes/` are scanned and compiled into `src/routeTree.gen.ts`, which is **generated and gitignored** — never hand-edit it, and don't be surprised if it's missing before the first dev/build run (`npx tsr generate` regenerates it on demand). Current routes: `src/routes/__root.tsx` (app shell), `src/routes/index.tsx` (dashboard), `src/routes/settings.tsx`. New pages are added by dropping a file in `src/routes/`.
- The router uses **hash history** (`createHashHistory` in `src/router.tsx`), specifically so deep links survive under Tauri's custom asset protocol without extra Rust-side URL rewriting — don't switch this to browser history without checking that still holds.
- Three providers wrap everything in `__root.tsx`, outermost first: `ThemeProvider` (`next-themes`, class strategy, defaults to dark), then `SettingsProvider`, then `TimerProvider`, then `SidebarProvider`.
  - `TimerProvider` (`components/chron/timer-context.tsx`) ticks a shared `currentTimestamp` every second; use `useTimer()` instead of each component running its own interval.
  - `SettingsProvider` (`components/chron/settings-context.tsx`) wraps `GameSettings` (`lib/game-settings.ts`) in `localStorage` via `components/chron/use-local-storage.tsx`.
- `components/ui/` is shadcn/ui (new-york style, generated — see `components.json`); treat it as vendored. `components/chron/` is app-specific composition on top of it (game cards, task lists, dialogs, sidebar).

#### `components.json` is stale, so `npm run ui add` needs cleanup

It still carries Next.js-era settings from before the Vite refactor and nobody has corrected them:

- `"rsc": true` — this repo has no React Server Components. Generated files may arrive with a `"use client"` directive that does nothing here.
- `"tailwind.config": "tailwind.config.ts"` — that file does not exist (Tailwind v4 is configured through `@tailwindcss/postcss`, no JS config file).
- `"tailwind.css": "app/globals.css"` — the real stylesheet is `src/styles/globals.css`.

Still prefer `npm run ui add` over hand-writing a primitive, but **read the generated file before committing it** and strip anything the paths above dragged in. Fixing `components.json` itself is a welcome small PR.

### Path aliases

`@chron/*` resolves to the repo root, configured in **two** places that must stay in sync: `paths` in `tsconfig.json` (for the type-checker) and `resolve.alias` in `vite.config.ts` (for the bundler). Editing only one produces a build that type-checks and fails at runtime, or vice versa. Use `@chron/lib/database`, `@chron/components/ui/button`, etc. instead of relative `../../..` imports.

### Tauri capabilities

Any new Tauri plugin/API surface used from the frontend needs a matching permission added to `src-tauri/capabilities/default.json`, or the call will fail at runtime with a permission error even though it type-checks. The current list is deliberately narrow (`shell:allow-open`, the `sql:*` set, `log:*`) — adding a permission widens what the webview can do, so add the specific one you need rather than a broad default.

## Code comments

Default to no comment. Well-named functions and variables already say what the code does; a comment that restates them is noise that later goes stale. Add one only for a hidden constraint, a non-obvious workaround, or a reason a reader would find surprising — the kind of thing that explains *why*, not *what*.

A comment that overstates what the code guarantees is worse than no comment. If you find one, correcting it may be the whole fix. There are live examples in `lib/timer.ts` (see the reset-time section above).

### Write comments in Simplified Technical English (ASD-STE100)

Comments in this repo follow ASD-STE100 Simplified Technical English. The point is that a comment should be readable once, quickly, with no ambiguity — so apply the rules that carry that, not the full aerospace specification:

- **One idea per sentence.** Keep sentences under about 20 words.
- **Active voice, with a subject.** "`getTodayTimes` reads the local clock", not "the local clock is read".
- **One word, one meaning.** Pick a term and reuse it exactly. Don't alternate between "task", "item", and "entry" for the same thing.
- **Use the simple present tense** for what the code does, and the simple past only for history ("this replaced the Next.js loader").
- **Keep the articles.** "the migration list", not "migration list". Telegraphic style reads as ambiguous.
- **No slang, idiom, or filler.** No "basically", "just", "simply", "obviously", "magic", "hacky". If something is non-obvious, say what makes it non-obvious.
- **Say the condition before the action.** "If the column is new, coerce it in every read path" is clearer than the reverse order.
- **Spell out an acronym on first use** in a file, unless it is a proper name in the codebase (SQL, UTC, UI are fine).

Technical names — identifiers, file paths, plugin names, SQL keywords — are always allowed and should be written exactly as they appear in the code.

Good:

```ts
// The Z suffix parses as UTC, but getHours() reads back in local time.
// The configured reset therefore shifts by the machine's UTC offset.
```

Avoid:

```ts
// NOTE: we basically just parse the time here — it's a bit of a hack but
// timezone stuff is always messy so this was simply the easiest approach
// that could possibly have been taken given the circumstances.
```

The same standard applies to commit messages, PR descriptions, and code review comments.

## User-facing copy

On-screen strings are ordinary product English, not Simplified Technical English — but keep them free of AI-sounding grammar. No em dashes in real copy (use a period or comma, or restructure), and no AI buzzwords (seamless, leverage, robust, elevate, unlock, empower, dive into, game-changer). This applies to strings a user reads, not to code comments. A `'—'` used as an empty-value placeholder in the UI is a display convention, not prose, and is fine.

## Conventions

- **PR titles must follow Conventional Commits.** `CONTRIBUTING.md` is the authoritative description — read it rather than relying on a summary here. The short version: the repo squash-merges using the PR title as the commit message, so only the PR title has to match `<type>(<scope>): <subject>`; commit messages on the branch are discarded. CI enforces it (`.github/workflows/conventional-commit-title.yml`), and editing the PR title re-runs the check with no push needed.
- **ESLint is not as thin as it looks.** `eslint.config.mjs` layers `js.configs.recommended` and `tseslint.configs.recommended` underneath the two `react-hooks` rules, with two targeted opt-outs (`no-useless-assignment`, and `src/routeTree.gen.ts` ignored). The comments in that file explain that the rule set was chosen to stay behavior-preserving with the pre-refactor Next.js setup and to avoid flagging existing shadcn/ui code — read them before adding a stricter rule, and expect any new rule to light up vendored `components/ui/` files.
- The app version is duplicated in `package.json` and `src-tauri/tauri.conf.json`; bump both together (see recent `chore: bump version to x.y.z` commits).
- Every PR triggers `test-build.yml`, which runs a full Tauri build matrix (macOS arm64/x86_64, Ubuntu, Windows). A change that only builds on one platform will surface there — Rust dependency and bundler changes are the usual culprits.

## Finishing a piece of work

- Run `npm run build` and `npm run lint` for anything touching TypeScript. Run `cargo check` in `src-tauri/` for anything touching Rust.
- Exercise the change in `npm run tauri dev` when it touches the database, reset timers, or UI state — the type-checker cannot see those.
- Update this file if you changed a convention it describes, and delete a rule here that stops being true. A stale rule is worse than a missing one, because an agent will spread it.
- Leave no leftover git worktrees, scratch files, or debug output. A leftover worktree is a second full copy of the repo, so later searches return near-duplicate hits.
