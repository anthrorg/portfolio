# Working Style

- **Conversational mode**: Always work in a conversational manner. Discuss before acting.
- **Read-only by default**: Allowed to read, but not write. Do not modify files unless explicitly asked.
- **Report, don't fix**: Report findings rather than starting a fix. Wait for the user to direct any changes.
- **Parallel agents**: Spawn agents in parallel for execution speed whenever the work is independent.
- **Coordinated workflow**: Coordinate the full process — planning → implementation → verification → testing — using the appropriate agent for each phase.

# Definition of Done

When code changes are made, work is **not complete** until every item below is true. A Stop-hook reviewer (Sonnet) re-checks these on every turn that produces code changes, so do not declare done prematurely.

1. **Delivers the original ask** — the cumulative diff actually solves what the user prompted for. No drift, no substitution of a different problem.
2. **All per-write reviews cleared** — every Write/Edit/MultiEdit triggers a senior-engineer review automatically; any `ISSUES` it surfaces must be addressed before declaring done. (You can't bypass this — the hook runs whether you ask or not.)
3. **Minimal cross-file drift** — no unrelated files touched, no holistic gaps the per-write reviewer can't see. The diff matches the ask in shape and size.
4. **Playwright verification** — behavior is proven end-to-end:
   - If `playwright.config.*` exists, `npx playwright test` must run and pass.
   - If Playwright isn't configured yet, that itself fails this check — verification is missing and must be set up or explicitly waived by the user.
   - If tests exist but don't cover the changed surface, flag the gap rather than claiming verified.
5. **Manual MCP browser pass** — scripted tests assert behavior contracts; they don't see the experience. Whenever code changes this turn, the agent must drive the Playwright MCP server (`mcp__playwright__browser_*` tools, configured in `.mcp.json`) against a live dev server and verify the affected surfaces by hand. Required: at least one `browser_navigate`, at least one `browser_take_screenshot`, and at least one `browser_console_messages` check. Report what was actually observed — not "looks good." If the visit reveals a regression, fix it before declaring done.

# Reviewer Hooks

Two hooks form the safety net — do not disable either without telling the user:

- **PostToolUse(Write|Edit|MultiEdit)** at `.claude/hooks/review-on-write.sh` — per-file senior-engineer review on every code write. Catches code smells, premature abstractions, dead code, half-finished pieces, bugs, security issues at the line level. Silent on `APPROVED`; injects `ISSUES` back as `additionalContext` on the next turn.
- **Stop** at `.claude/hooks/review-on-stop.sh` — per-turn holistic check covering items 1, 3, 4, and 5 of Definition of Done. Gated on a `UserPromptSubmit` baseline (`.claude/hooks/snapshot-baseline.sh`) so it only fires when *this turn* produced code changes — pre-existing untracked files don't trigger it.

The two hooks have different jobs: per-write is line-level code review, Stop is holistic delivery + behavior verification. Don't make Stop redo per-file work.

# Reviewer Memory

The reviewers are stateless `claude -p` invocations — each call is a fresh context. Two files give them continuity:

- **`.claude/review-overrides.md`** (committed) — a curated list of intentional choices the reviewer should not re-flag. Both hooks include this in every prompt. When you reject a flagged issue, add a one-line entry here so future reviews don't repeat the noise. Keep entries terse; if the reasoning needs a paragraph, the override probably isn't sound.
- **`.claude/review-log/YYYY-MM-DD.md`** (gitignored) — auto-appended record of every review (APPROVED or ISSUES) the hooks produce. Use it to skim what's been flagged today; not consumed by the reviewer itself.
