#!/usr/bin/env bash
# UserPromptSubmit hook: snapshot the current code-file diff hash so the
# Stop hook can tell whether *this turn* actually produced code changes
# (vs. pre-existing untracked/modified files in the working tree).
set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$REPO_ROOT"

STATE_DIR="$REPO_ROOT/.claude"
BASELINE_FILE="$STATE_DIR/.turn-baseline-hash"
mkdir -p "$STATE_DIR"

# Must match the regex in review-on-stop.sh and review-on-write.sh.
CODE_RE='\.(ts|tsx|js|jsx|mjs|cjs|vue|svelte|astro|html|css|scss|sass|less|py|go|rs|rb|php|java|kt|swift|cpp|cc|c|h|hpp|lua|sh|sql)$'

TRACKED=$(git diff --name-only HEAD 2>/dev/null | grep -E "$CODE_RE" || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | grep -E "$CODE_RE" || true)

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
printf '%s' "$DIFF_CONTENT" | sha1sum | cut -d' ' -f1 > "$BASELINE_FILE"
exit 0
