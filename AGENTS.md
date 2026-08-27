# AGENTS.md

**Read [`CLAUDE.md`](./CLAUDE.md) before you change any file in this repository.**

`CLAUDE.md` is the authoritative instruction file for every coding agent that
works here, whatever tool you run under. It applies to you. This file exists
only so that tools which look for `AGENTS.md` are pointed at it.

## This file holds no rules of its own

That is deliberate. Two files describing the same conventions drift apart, and
an agent then follows whichever copy it happened to open — usually the stale
one. So the rules live in exactly one place.

If you add or change a convention, edit `CLAUDE.md`. Do not copy a rule into
this file, and do not add a summary of `CLAUDE.md` here. A short pointer that
stays correct is worth more than a summary that rots.

## Do not skip it because the repo looks small

chron is a small codebase, so the instructions are easy to read in full and the
temptation to skim is high. Resist it. `CLAUDE.md` documents several behaviors
that are wrong to guess at, including:

- How SQLite values come back typed, and where the TypeScript types do not
  match what is actually in memory.
- How the daily and weekly reset times are computed, and which stated
  conventions in the code comments are incorrect.
- Which generated and stale config files must not be trusted or hand-edited.
- The required style for code comments and for pull request titles.

The list above is a table of contents, not a summary. Each item is a real trap
that costs a debugging session if you assume the obvious behavior instead.

## Related files

- [`CLAUDE.md`](./CLAUDE.md) — agent instructions. Authoritative.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — human contribution process, and the
  authoritative description of the pull request title rules.
- [`README.md`](./README.md) — what the product is, for end users.
