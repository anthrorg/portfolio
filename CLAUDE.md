# Voice

User-facing prose follows `.claude/voice-guide.md`. Any agent producing copy (especially `content-creator`) should Read that file first — §4 (anti-patterns) and §8 (revision checklist) are the gate before showing drafts to the user. Direct, evidence-led, no validating openers, no recruiter bromides.

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

# Deploy (Railway)

The site is hosted on Railway. Project: `portfolio`, environment: `production`, service: `portfolio`. Auto-deploys on push to `main`.

**Railway auth — where the creds live:**

- The Railway CLI session token is at `~/.railway/config.json` (on this box: `C:\Users\Jim\.railway\config.json`). It's a long-lived user session, refreshed by `railway login`. Run `railway whoami` to confirm — current account: `andythrorg@gmail.com`.
- The `railway` CLI in PATH (Git Bash: `/c/nvm4w/nodejs/railway`) reads this config automatically — no env vars needed.
- The **Railway MCP server** uses the same CLI under the hood, so it inherits the same auth — *unless* something overrides `RAILWAY_API_TOKEN` in its environment.

**The `.env` gotcha (don't wrap Railway MCP in dotenv):**

`.env` contains `RAILWAY_API_TOKEN=` (empty). If `.mcp.json` wraps the Railway server in `dotenv-cli -e .env --`, that empty string gets injected into the subprocess and shadows the CLI config, making every Railway MCP call fail with "Not logged in." Keep the Railway entry in `.mcp.json` as a plain `npx -y @railway/mcp-server` invocation. If a project token is ever actually needed, export `RAILWAY_API_TOKEN` in the shell instead of via `.env`.

**Build / lockfile hazard (node version pinning):**

The Railway build runs `npm ci`, which requires `package.json` and `package-lock.json` to be perfectly in sync. Railway resolves `engines.node: ">=20"` to **node 20.20.2 / npm 10.8.2**. If you regenerate the lockfile under a newer npm (e.g. node 24 / npm 11), the resulting `lockfileVersion 3` file encodes platform-specific transitive deps in a form npm 10 rejects with `Missing: @emnapi/core@... from lock file` (or similar). The lockfile parses fine locally but Railway's `npm ci` fails.

When that happens, regenerate with the exact npm Railway uses. On this box (nvm-windows):

```
$LOCALAPPDATA/nvm/v20.20.2/npm.cmd install --no-audit --no-fund
```

Or install node 20 if missing: `nvm install 20.20.2`. Then commit the regenerated lockfile alongside any package.json change in the same commit. Never push a `package.json` edit without a lockfile produced by node 20's npm. (Long-term, bumping `engines.node` to `^24` would let local npm 11 match Railway, but that is a separate decision.)

The build is also slow (~5–10 min) because `package.json`'s `build` script runs `npx playwright install chromium --with-deps` for the prerender step. That is intentional and currently required — see commits `d78d091` / `dc24f32`.

**Verifying a deploy:**

After `git push origin main`, check status with the CLI (preferred — instant) or the Railway MCP tools (after restart):

```
railway status                     # confirm linked project + env
railway list                       # list recent deployments and statuses
railway logs <deployment-id> -b -n 200   # build logs, last 200 lines
```

The MCP equivalents: `mcp__railway__list-deployments`, `mcp__railway__get-logs`. They only work once Claude Code has been restarted with a fixed `.mcp.json`.
