#!/usr/bin/env bash
# Stop-hook reviewer: spawns an Opus agent to verify completed work
# only when code files have actually changed since the last review.
set -uo pipefail

# Re-entry guard: when the spawned `claude -p` finishes, its own Stop
# event fires this same hook. Skip so we don't recurse into oblivion.
if [ "${CLAUDE_REVIEW_HOOK_RUNNING:-0}" = "1" ]; then
  exit 0
fi

# Read hook stdin (we only need the session id). Parse without jq —
# Git Bash on Windows often lacks it; node ships with the project.
INPUT=$(cat)
SESSION_ID=$(printf '%s' "$INPUT" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write(JSON.parse(d).session_id||"")}catch{}})' 2>/dev/null || true)

# Resolve project root via git so paths work regardless of cwd.
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

STATE_DIR="$REPO_ROOT/.claude"
STATE_FILE="$STATE_DIR/.last-review-hash"
mkdir -p "$STATE_DIR"

# Code-file extensions worth reviewing. Excludes md/json/lock/config noise.
CODE_RE='\.(ts|tsx|js|jsx|mjs|cjs|vue|svelte|astro|html|css|scss|sass|less|py|go|rs|rb|php|java|kt|swift|cpp|cc|c|h|hpp|lua|sh|sql)$'

# Collect tracked + untracked code-file changes. `|| true` so empty greps
# don't trip pipefail.
TRACKED=$(git diff --name-only HEAD 2>/dev/null | grep -E "$CODE_RE" || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | grep -E "$CODE_RE" || true)

if [ -z "$TRACKED" ] && [ -z "$UNTRACKED" ]; then
  exit 0
fi

# Hash the actual content so re-firing on the same diff is a no-op.
DIFF_CONTENT=""
if [ -n "$TRACKED" ]; then
  mapfile -t TRACKED_ARR <<< "$TRACKED"
  DIFF_CONTENT=$(git diff HEAD -- "${TRACKED_ARR[@]}" 2>/dev/null)
fi
if [ -n "$UNTRACKED" ]; then
  mapfile -t UNTRACKED_ARR <<< "$UNTRACKED"
  for f in "${UNTRACKED_ARR[@]}"; do
    DIFF_CONTENT+=$'\n--- new file: '"$f"' ---\n'
    DIFF_CONTENT+=$(cat "$f" 2>/dev/null || true)
  done
fi
CURRENT_HASH=$(printf '%s' "$DIFF_CONTENT" | sha1sum | cut -d' ' -f1)

# Per-turn gate: if the diff hasn't changed since the user's last prompt,
# this turn produced no code changes — exit silently.
BASELINE_FILE="$STATE_DIR/.turn-baseline-hash"
BASELINE_HASH=$(cat "$BASELINE_FILE" 2>/dev/null || true)
if [ -n "$BASELINE_HASH" ] && [ "$CURRENT_HASH" = "$BASELINE_HASH" ]; then
  exit 0
fi

LAST_HASH=$(cat "$STATE_FILE" 2>/dev/null || true)
if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
  exit 0
fi

# Read the overrides file so the reviewer doesn't re-flag intentional choices.
OVERRIDES_FILE="$STATE_DIR/review-overrides.md"
OVERRIDES_CONTENT=""
if [ -f "$OVERRIDES_FILE" ]; then
  OVERRIDES_CONTENT=$(cat "$OVERRIDES_FILE")
fi

# Build the review prompt. The Sonnet reviewer has tools — let it inspect
# the diff, the transcript, and run Playwright to verify behavior.
REVIEW_PROMPT=$(cat <<EOF
You are a post-work reviewer for a Claude Code session that just stopped in
this repository. Catch drift before it ships. Be terse — this output goes
back to the user as a system message.

Repo: $REPO_ROOT
Session id: $SESSION_ID

The repo maintains a list of intentional choices that have already been
evaluated. DO NOT re-flag anything covered by them:

<overrides>
$OVERRIDES_CONTENT
</overrides>

Do this in order:

1. Run \`git diff HEAD\` and \`git ls-files --others --exclude-standard\` to
   see exactly what changed.

2. Find the session transcript. It lives somewhere under
   ~/.claude/projects/ — the directory name is the cwd with slashes
   replaced by dashes. Match by session id (\`$SESSION_ID\`) in the .jsonl
   filename. Read it to recover the user's original prompt(s) and what
   work was actually done.

3. Verify, in order, and stop early if any check fails:
   a. Intent fidelity — does the cumulative diff actually deliver what
      the user originally asked for this turn?
   b. Cross-file drift — unrelated files touched, holistic gaps the
      per-write reviewer can't see, scope creep across the diff as a
      whole. Per-file code smells, premature abstractions, dead code,
      half-finished pieces are already handled by the PostToolUse
      senior-engineer hook — DO NOT redo that work here. Focus on what
      can only be seen with the whole diff in view.
   c. Playwright verification: code changed, so behavior must be proven.
      - If \`playwright.config.\*\` exists, run \`npx playwright test\`
        (capture the exit code) and fail this check if any test fails.
      - If Playwright isn't configured in this repo yet, fail this check
        with the message "Playwright not configured — cannot verify
        behavior end-to-end" so the user knows verification is missing.
      - If Playwright tests exist but don't cover the changed surface,
        flag that gap.
   d. Manual MCP browser pass: scripted tests can't see the experience,
      so the agent must have driven the Playwright MCP server against a
      live dev server. Open the session transcript and grep for tool_use
      entries whose name starts with \`mcp__playwright__browser_\`.
      Required minimum for this turn:
        * at least one \`browser_navigate\`
        * at least one \`browser_take_screenshot\`
        * at least one \`browser_console_messages\` check
      If those calls are absent from the transcript, fail this check
      with "Manual MCP browser pass missing — no
      mcp__playwright__browser_* tool calls found in transcript."
      If they're present, briefly note what surfaces were verified.

4. Report in exactly one of these two formats — no preamble, no sign-off:

   APPROVED — <one-line summary of what shipped, including Playwright
   pass count>

   ISSUES
   - <issue 1, file:line where applicable>
   - <issue 2>
   - ...

If the transcript can't be located, say so on its own line and base the
review on the diff plus Playwright run alone.
EOF
)

# Spawn Sonnet reviewer using the user's existing auth. Cap runtime via
# the settings.json hook timeout so a stuck reviewer can't wedge Stop.
export CLAUDE_REVIEW_HOOK_RUNNING=1
REVIEW_OUTPUT=$(claude -p --model sonnet "$REVIEW_PROMPT" 2>&1) || REVIEW_OUTPUT="[reviewer failed: $REVIEW_OUTPUT]"

# Append every review to today's log for visibility.
LOG_DIR="$STATE_DIR/review-log"
LOG_FILE="$LOG_DIR/$(date -u +%Y-%m-%d).md"
mkdir -p "$LOG_DIR"
{
  printf '\n## %s — review-on-stop — session: %s\n\n' "$(date -u +%H:%M:%SZ)" "$SESSION_ID"
  printf '%s\n' "$REVIEW_OUTPUT"
} >> "$LOG_FILE"

# Mirror non-APPROVED verdicts to a pushbacks-only daily file for easy skim.
if ! printf '%s' "$REVIEW_OUTPUT" | grep -q '^APPROVED'; then
  PUSHBACK_FILE="$LOG_DIR/pushbacks-$(date -u +%Y-%m-%d).md"
  {
    printf '\n## %s — review-on-stop — session: %s\n\n' "$(date -u +%H:%M:%SZ)" "$SESSION_ID"
    printf '%s\n' "$REVIEW_OUTPUT"
  } >> "$PUSHBACK_FILE"
fi

# Surface the review back to the parent session as a JSON system message.
# Use node to JSON-escape correctly (handles newlines, quotes, etc.).
# Only persist the hash AFTER the review is successfully emitted — otherwise
# a failed emit would lose the review forever (next Stop sees the cached
# hash, skips re-running, and the user never sees the feedback).
if REVIEW_OUTPUT="$REVIEW_OUTPUT" node -e 'process.stdout.write(JSON.stringify({systemMessage: "Sonnet post-work review:\n\n" + (process.env.REVIEW_OUTPUT||"")}))'; then
  printf '%s' "$CURRENT_HASH" > "$STATE_FILE"
fi
