# Review overrides

The reviewer hooks read this file before evaluating a change. Anything listed
here has already been considered by the parent assistant and is intentional —
do not re-flag it unless the surrounding context has materially changed.

Add a new entry the first time you reject a flagged issue. Each entry is one
line: the rule, then a `—`, then the reason that justifies the override.

## Project context

- OS: Windows 11, Git Bash (MSYS) shell for hooks.
- Bash: 5.2 confirmed on this system.
- Node: 24+ available; project ships Vite/React/TS.
- Repo is single-platform (Windows). Per CLAUDE.md, do not add defensive code
  for conditions that can't happen on this platform.

## Bash hook scripts (`.claude/hooks/*.sh`)

- `set -uo pipefail` without `-e` — intentional. The scripts use `|| true`
  patterns and tolerate specific subshell failures; `-e` would abort on those.
- `mapfile` builtin — bash 5.2 is confirmed. Portability flags about bash 3.x
  (macOS default) do not apply.
- `sha1sum` — present in Git Bash on Windows via MSYS coreutils. Portability
  flags about macOS (`shasum -a 1`) do not apply.
- `VAR=$(cmd) || VAR="fallback referencing $VAR"` — bash assigns the captured
  output to `VAR` *before* evaluating the `||` exit-code branch, so `$VAR`
  in the fallback expression is the captured stderr. This is correct.
- Passing review output via `process.env` to a short-lived `node -e` — fine.
  Transcript-grade data, not secrets; subprocess lifetime is milliseconds.
- `SESSION_ID` interpolated into reviewer prompt text — `SESSION_ID` comes
  from Claude Code's own hook stdin (a UUID), not user input, and the prompt
  is text passed to `claude -p`, not shell. No injection surface.

## Phase-0 stubs awaiting real content

- `src/content/career.ts` empty `roles`, `education`, `certifications` arrays — intentional; the route renders an `Updating soon.` empty state under each section heading until Jim authors entries. The `languages` section ships with real EN/JA values.
- `src/routes/about.tsx` short lede copy — intentional; the long-form bio ships once Jim writes it. The page header pattern matches every other route.

## Comment style

- Multi-paragraph JSDoc and multi-line block comments in `src/components/case-study/CaseTOC.tsx` and `src/components/case-study/CaseStudyLayout.tsx` — intentional; CLAUDE.md does not impose a one-line comment rule, and these blocks explain non-obvious layout/observer mechanics future readers need.

## How to add a new override

When you reject a reviewer flag, add it here in the form:

```
- <pattern or rule> — <one-sentence reason it's intentional>
```

Keep entries terse. If the reason needs more than a sentence, the override
might not be sound — re-evaluate.
