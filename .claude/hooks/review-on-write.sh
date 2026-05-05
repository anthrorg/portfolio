#!/usr/bin/env bash
# PostToolUse(Write|Edit|MultiEdit) hook: quick senior-engineer review of the
# single file just written. Silent on APPROVED; injects additionalContext on
# ISSUES so the parent session sees the feedback on its next turn.
set -uo pipefail

# Re-entry guard: the spawned `claude -p` will itself emit Write/Edit calls,
# which would re-fire this hook and recurse. Bail when we're already inside.
if [ "${CLAUDE_REVIEW_HOOK_RUNNING:-0}" = "1" ]; then
  exit 0
fi

INPUT=$(cat)

# Parse tool_input.file_path without jq (Git Bash on Windows often lacks it).
FILE_PATH=$(printf '%s' "$INPUT" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const j=JSON.parse(d);process.stdout.write((j.tool_input&&j.tool_input.file_path)||"")}catch{}})' 2>/dev/null || true)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Skip non-code files. Same extensions the Stop hook reviews.
CODE_RE='\.(ts|tsx|js|jsx|mjs|cjs|vue|svelte|astro|html|css|scss|sass|less|py|go|rs|rb|php|java|kt|swift|cpp|cc|c|h|hpp|lua|sh|sql)$'
if ! printf '%s' "$FILE_PATH" | grep -Eq "$CODE_RE"; then
  exit 0
fi

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
OVERRIDES_FILE="$REPO_ROOT/.claude/review-overrides.md"
OVERRIDES_CONTENT=""
if [ -f "$OVERRIDES_FILE" ]; then
  OVERRIDES_CONTENT=$(cat "$OVERRIDES_FILE")
fi

REVIEW_PROMPT=$(cat <<EOF
You are a senior engineer doing a quick post-write review of a single file
that was just modified in a Claude Code session. Review THIS FILE ONLY — do
not audit the rest of the repo, do not run tests, do not read other files
unless strictly necessary to interpret a symbol in this one.

Focus on: best-practice violations, code smells, premature abstractions,
dead code, scope creep, half-finished pieces, obvious bugs, security issues.
Be terse. Skip nitpicks.

The repo maintains a list of intentional choices that have already been
evaluated and rejected as concerns. DO NOT re-flag anything covered here:

<overrides>
$OVERRIDES_CONTENT
</overrides>

If you would have flagged something but it's covered by an override, simply
omit it. If everything you'd raise is overridden, output APPROVED.

File: $FILE_PATH

Read the file with the Read tool, then output exactly one of:

APPROVED — <one-line summary of what's in the file>

ISSUES
- <issue 1, line:col where applicable>
- <issue 2>
- ...

No preamble, no sign-off, no extra commentary.
EOF
)

export CLAUDE_REVIEW_HOOK_RUNNING=1
REVIEW_OUTPUT=$(claude -p --model sonnet "$REVIEW_PROMPT" 2>&1) || REVIEW_OUTPUT="[reviewer failed: $REVIEW_OUTPUT]"

# Append every review (APPROVED or ISSUES) to today's log for visibility.
LOG_DIR="$REPO_ROOT/.claude/review-log"
LOG_FILE="$LOG_DIR/$(date -u +%Y-%m-%d).md"
mkdir -p "$LOG_DIR"
{
  printf '\n## %s — review-on-write — %s\n\n' "$(date -u +%H:%M:%SZ)" "$FILE_PATH"
  printf '%s\n' "$REVIEW_OUTPUT"
} >> "$LOG_FILE"

# Silence on approval — only surface issues back to the parent session.
if printf '%s' "$REVIEW_OUTPUT" | grep -q '^APPROVED'; then
  exit 0
fi

REVIEW_OUTPUT="$REVIEW_OUTPUT" FILE_PATH="$FILE_PATH" node -e 'process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:"Senior-engineer review of "+process.env.FILE_PATH+":\n\n"+(process.env.REVIEW_OUTPUT||"")}}))'
