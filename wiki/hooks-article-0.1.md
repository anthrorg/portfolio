# Hooks As A Synchronous Safety Net

**How three Claude Code hooks hold the agent in lock step with the standards — per write, per turn, with reviewer memory that survives between calls.**

*Design and implementation walkthrough for the hook system in the `jim.sylphie.live` portfolio repo. The scripts are short — three bash files, ~250 lines together — but the shape of how they compose is the part worth writing down.*

---

## The problem

A coding agent that grades its own work declares done early. Not maliciously — the loop just doesn't have a reason to keep going once the visible diff "looks right." Per-file code smells slip in. Scope drifts a file or two beyond what was asked. A UI change "looks fine" without anyone having clicked the button. The model is doing its best, but its best is one judgment call per turn, and that call is the same one that just made the changes.

The fix isn't to write a better agent. The fix is to add a second pair of eyes that the agent *can't bypass* — and to add them at the moments where drift actually happens. Two moments matter: the instant a file is written (line-level drift), and the instant the turn ends (delivery-level drift). Catch both and the agent stays *in lock step* with the standards the repo has agreed on, rather than drifting away by degrees over a long session.

That's what this hook system does. It's three bash scripts wired through `.claude/settings.json` against three Claude Code lifecycle events. Each script is small. The composition is what makes the loop tight.

*This article is about the per-write and per-turn review hooks in this portfolio repo. For the related pattern of using hooks to inject long-term memory into prompts, see [memory-pkg](./long-term-memory-article-0.2.md). For the graph-backed map of a codebase that the agent queries instead of re-reading, see [sylphie-pkg](./sylphie-pkg-article-0.2.md).*

## What the system is

Three hooks, three lifecycle events, one shared state directory under `.claude/`. The whole wiring fits in 40 lines of `settings.json` ([`.claude/settings.json:1-40`](https://github.com/)):

1. **`snapshot-baseline.sh`** runs on every `UserPromptSubmit`. It hashes the current code-file diff and writes the hash to `.claude/.turn-baseline-hash`. Cheap (10 s timeout), silent, no LLM. Its only job is to mark *where this turn started*. ([`.claude/hooks/snapshot-baseline.sh`](https://github.com/))

2. **`review-on-write.sh`** runs on every `PostToolUse` whose tool matches `Write|Edit|MultiEdit`. It spawns a Sonnet reviewer with a single instruction: read this one file and decide `APPROVED` or `ISSUES`. Silent on `APPROVED`; injects `ISSUES` back into the parent session as `additionalContext`. 90 s timeout. ([`.claude/hooks/review-on-write.sh`](https://github.com/))

3. **`review-on-stop.sh`** runs on every `Stop` — i.e., the moment the agent thinks it's done. It compares the current diff hash against the baseline. If this turn produced no code changes, the hook exits silently. Otherwise it spawns a Sonnet reviewer with tools — git, the session transcript, Playwright — and verifies the cumulative diff actually delivers what the user asked for. 300 s timeout. ([`.claude/hooks/review-on-stop.sh`](https://github.com/))

Two files give the reviewers continuity across their stateless `claude -p` invocations: `.claude/review-overrides.md` (committed; intentional choices the reviewer should not re-flag) and `.claude/review-log/YYYY-MM-DD.md` (gitignored; auto-appended record of every review).

## Architecture at a glance

```
┌─ User prompt submitted ───────────────────────────────────────┐
│                                                               │
│  UserPromptSubmit ─▶ snapshot-baseline.sh                     │
│                       hash(diff) ▶ .turn-baseline-hash        │
│                                                               │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌─ Agent works ─────────────────────────────────────────────────┐
│                                                               │
│  Write|Edit|MultiEdit ─▶ review-on-write.sh                   │
│   (every file write)     ├─ skip non-code extensions          │
│                          ├─ read review-overrides.md          │
│                          ├─ spawn `claude -p --model sonnet`  │
│                          │   "review THIS FILE ONLY"          │
│                          ├─ append result to review-log/      │
│                          └─ on ISSUES: emit additionalContext │
│                              back to parent session           │
│                                                               │
│  …many writes per turn, each reviewed individually…           │
│                                                               │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
┌─ Agent stops ─────────────────────────────────────────────────┐
│                                                               │
│  Stop ─▶ review-on-stop.sh                                    │
│           ├─ hash(diff) — compare to .turn-baseline-hash      │
│           │   if equal: this turn changed no code, exit       │
│           ├─ compare to .last-review-hash — dedup re-fires    │
│           ├─ read review-overrides.md                         │
│           ├─ spawn `claude -p --model sonnet` with tools:     │
│           │   1. read transcript, recover original intent     │
│           │   2. inspect cumulative diff for cross-file drift │
│           │   3. run `npx playwright test`                    │
│           │   4. grep transcript for mcp__playwright__browser_│
│           │      tool calls (navigate / screenshot / console) │
│           ├─ append result to review-log/                     │
│           └─ emit systemMessage back to parent session        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

Two state files anchor the system. `.claude/.turn-baseline-hash` resets on every prompt and tells the Stop hook whether *this turn* changed code. `.claude/.last-review-hash` persists across turns and tells the Stop hook whether we've already reviewed exactly this diff content (e.g., when Stop re-fires after a no-op turn).

## The per-write reviewer

Every `Write`, `Edit`, or `MultiEdit` triggers a Sonnet review of that one file. The prompt is short and pointed ([`review-on-write.sh:35-67`](https://github.com/)):

> Review THIS FILE ONLY — do not audit the rest of the repo, do not run tests, do not read other files unless strictly necessary to interpret a symbol in this one. Focus on: best-practice violations, code smells, premature abstractions, dead code, scope creep, half-finished pieces, obvious bugs, security issues. Be terse. Skip nitpicks.

The output contract is two-state: `APPROVED — <one-line summary>` or `ISSUES\n- ...`. The hook is silent on approval and emits the issues as `additionalContext` only when the reviewer found something. ([`review-on-write.sh:82-87`](https://github.com/)) That's the lock-step move: the parent session sees the review feedback *on its very next turn*, not at the end of the session, not after a manual `/review` command, not after the user notices. The reviewer's word becomes part of the parent's context exactly when the parent is about to make its next decision.

Three details under the surface are load-bearing:

- **Code-file gate.** A 22-extension regex (`.ts`, `.tsx`, `.py`, `.go`, `.rs`, …) keeps `package.json`, `README.md`, and config edits from triggering a reviewer call. Pure cost control. ([`review-on-write.sh:23-26`](https://github.com/))
- **Re-entry guard.** The spawned `claude -p` will itself emit `Write`/`Edit` calls — without a guard, the hook recurses into oblivion. `CLAUDE_REVIEW_HOOK_RUNNING=1` is set in the env before the subprocess fires, and the hook short-circuits when it sees its own marker on entry. ([`review-on-write.sh:9-11, 70`](https://github.com/))
- **No-jq parsing.** Git Bash on Windows often lacks `jq`. The hook parses tool input via a one-liner `node -e` instead. Same trick in all three scripts. Portability detail, but enough to break the system if missed.

## The per-turn reviewer

When the agent thinks it's done, `Stop` fires and `review-on-stop.sh` runs. The first thing it does is *decide whether to run at all*. ([`review-on-stop.sh:30-63`](https://github.com/))

It collects the current diff over tracked + untracked code files and SHA-1 hashes the content. Then two checks, in order:

1. **Baseline check.** If the current hash equals `.turn-baseline-hash` (set on the user's prompt), this turn produced no code changes — exit silently. The agent might have been asked an exploratory question. No review needed.
2. **Dedup check.** If the current hash equals `.last-review-hash` (set by the previous successful Stop), the diff hasn't changed since the last review. Exit silently. This handles cases like the user prompting again with a non-code response from the agent.

Only when both checks fail does the Sonnet reviewer spawn. The prompt gives it a tool budget and a checklist ([`review-on-stop.sh:74-142`](https://github.com/)):

1. Run `git diff HEAD` and `git ls-files --others --exclude-standard`. See exactly what changed.
2. Find the session transcript under `~/.claude/projects/` by session id. Recover the user's original prompt(s) and what work was actually done.
3. Verify, in order, stopping early on the first fail:
   - **Intent fidelity.** Does the cumulative diff deliver what the user asked for?
   - **Cross-file drift.** Unrelated files touched? Scope creep across the diff as a whole? (Per-file code smells are explicitly *out of scope* — the PostToolUse reviewer already covered them.)
   - **Playwright verification.** If `playwright.config.*` exists, run `npx playwright test` and fail on any failure. If Playwright isn't configured, fail with a specific message — verification missing is itself a failure, not a pass.
   - **Manual MCP browser pass.** Grep the transcript for `mcp__playwright__browser_*` tool calls. Require at least one `browser_navigate`, one `browser_take_screenshot`, and one `browser_console_messages`. Scripted tests can't see the experience; the agent must have driven a browser by hand.

Two design choices in that list matter more than they look. The first: the Stop reviewer is told *not* to redo the per-file review work — that's already been done synchronously, write by write. Each reviewer has a different job and a different vantage point. The second: "Playwright not configured" doesn't just produce a warning; it's a fail. Verification missing is treated as identical to verification failed. That's what keeps the lock-step honest — the agent can't ship a UI change and self-attest that it looks good.

The hook emits the result back to the parent session as a `systemMessage` JSON payload. ([`review-on-stop.sh:164`](https://github.com/)) The hash is persisted to `.last-review-hash` *only after* the emit succeeds — otherwise a failed emit would mark the diff as already-reviewed and the user would never see the feedback.

## Reviewer memory — overrides and the log

The reviewers are stateless. Each `claude -p` call gets a fresh context: no memory of yesterday's reviews, no memory of which choices have already been argued through and accepted. Without something to bridge that gap, the same false-positive surfaces every single time — the user spends their day arguing with a reviewer that doesn't learn.

Two files form the bridge.

**`.claude/review-overrides.md`** (committed) is a curated list of intentional choices the reviewer should not re-flag. Both hooks include it verbatim inside an `<overrides>` block in the reviewer prompt. ([`review-on-write.sh:35-50`](https://github.com/), [`review-on-stop.sh:74-87`](https://github.com/)) Entries are one line: the pattern, an em-dash, the reason it's intentional. Sample entries from this repo:

```markdown
- `set -uo pipefail` without `-e` — intentional. The scripts use `|| true`
  patterns and tolerate specific subshell failures; `-e` would abort on those.
- `mapfile` builtin — bash 5.2 is confirmed. Portability flags about bash 3.x
  (macOS default) do not apply.
- `sha1sum` — present in Git Bash on Windows via MSYS coreutils. Portability
  flags about macOS (`shasum -a 1`) do not apply.
```

These are exactly the kinds of "well actually" notes that would otherwise burn a clarification round on every review. With the override file in front of it, the reviewer simply omits them — and if it would have flagged *only* override-covered items, it returns `APPROVED`.

The override file is itself a piece of project memory the user maintains. When the user rejects a reviewer flag, they add a line. The friction of writing the line is intentional: if the override needs more than a one-line reason, the override probably isn't sound and the flag deserves a second look. ([`.claude/review-overrides.md:46-49`](https://github.com/))

**`.claude/review-log/YYYY-MM-DD.md`** (gitignored) is the audit trail. Every review — `APPROVED` or `ISSUES`, per-write or per-turn — gets appended with a UTC timestamp. ([`review-on-write.sh:73-80`](https://github.com/), [`review-on-stop.sh:150-157`](https://github.com/)) The reviewer doesn't read it; the user does. It's how you skim what's been flagged today, spot patterns across reviews, and decide whether a new override entry is warranted.

The split is deliberate: overrides are *curated* (consumed by the reviewer, written by the human), the log is *automatic* (consumed by the human, written by the hooks). One is reviewer memory; the other is user memory about the reviewer.

## Fail-safe, not fail-open

A design difference worth contrasting with the memory-pkg injection hook described in [the long-term-memory article](./long-term-memory-article-0.2.md): that hook *fails open*. If the retrieval CLI errors, if the DB is down, if anything goes wrong, the hook silently exits and the user's prompt proceeds untouched. Memory enrichment is a nice-to-have; not blocking the user is the priority.

The review hooks fail *safe*. If the reviewer fails to spawn, the failure is captured and emitted as the review output: `[reviewer failed: ...]`. ([`review-on-write.sh:71`](https://github.com/), [`review-on-stop.sh:148`](https://github.com/)) The user sees that something went wrong instead of silently shipping unreviewed work. The hash is persisted only after a successful emit, so the next Stop re-runs the review instead of skipping over a lost result.

Different jobs, different defaults. Inject-style hooks should fail open because their value is additive. Review-style hooks should fail safe because their value is gating.

## What this costs

**Compute.** Two Sonnet invocations per code-changing turn, plus one per file write. The per-write reviewer is tightly scoped — one file, no full-repo audit, no other-file reads unless necessary to resolve a symbol — and the prompt is short, so each call is cheap. The Stop reviewer is heavier; it runs git, reads the transcript, runs `npx playwright test`, and inspects MCP transcript entries. Cost ceiling is bounded by the 300 s timeout in `settings.json`. ([`.claude/settings.json:9`](https://github.com/))

**Latency.** Per-write review fires in the background after each Write/Edit. Its issues land on the agent's *next* turn — so the cost is mostly invisible during normal work, only felt as the agent occasionally acknowledging an `ISSUES` block before continuing. Stop review is foreground — the user sees a `Sonnet reviewing completed work…` status while it runs. The baseline check makes it free on non-code turns.

**Wall time saved.** Every issue caught here is one that doesn't surface after a commit, a push, a PR review, or — worst case — a regression in production. The per-write reviewer in particular catches things the parent session is biased not to see, because the parent session is the one that just wrote them. A second reviewer with a single-file vantage is structurally better-positioned to spot drift than the writer is.

**Token cost in the parent session.** The injected `additionalContext` and `systemMessage` payloads consume parent-session tokens. Empirically these are short — one-line summaries on `APPROVED`, a few bullets on `ISSUES`. The trade is paying a small token tax per turn to keep the agent from declaring done prematurely. The ratio favors the tax by a wide margin.

## What this doesn't do (yet)

- **Cross-turn pattern learning.** The reviewer reads `review-overrides.md` but never reads `review-log/`. Patterns of repeated false positives across days don't compound into anything except the human noticing and writing an override.
- **Auto-generated override proposals.** When the user rejects a flag, the override has to be written by hand. A nice extension would be a small skill that proposes an override entry based on the rejected flag's text.
- **Multi-reviewer voting.** One Sonnet pass per gate. A more paranoid setup could run two reviewers and require agreement before injecting issues — overkill for the current scope.
- **Cost tracking.** The review log records output but not token usage. A wrapper that captured tokens-in/tokens-out per review would let the cost story stop being a hand-wave.

## Why it matters

A solo agent is a writer with no editor. It gets a lot done, but the second pass that turns "done" into *actually* done is the one humans always wanted from a junior engineer and rarely got. These hooks are that second pass — automated, synchronous, gated. The agent and the standards stay locked together because they're checked against each other at exactly the moments where they might drift: every file write, every turn end.

The whole system is three short bash scripts and two markdown files. Nothing here is clever. The leverage is in *where* it fires, not what it does.

## Code map

| Component | Path |
|---|---|
| UserPromptSubmit baseline hook | `.claude/hooks/snapshot-baseline.sh` |
| PostToolUse per-write reviewer | `.claude/hooks/review-on-write.sh` |
| Stop per-turn reviewer | `.claude/hooks/review-on-stop.sh` |
| Hook wiring | `.claude/settings.json` |
| Reviewer overrides (committed) | `.claude/review-overrides.md` |
| Review log (gitignored) | `.claude/review-log/YYYY-MM-DD.md` |
| Per-turn baseline hash | `.claude/.turn-baseline-hash` |
| Last reviewed diff hash | `.claude/.last-review-hash` |
| Project standards the hooks enforce | `CLAUDE.md` (Definition of Done section) |
