#!/usr/bin/env bash
# sync-github.sh
# Pushes the latest Manus checkpoint commit to 1LORDVADER/ZAPPAY on GitHub.
# Called automatically after every webdev_save_checkpoint.

set -euo pipefail

# Verify GitHub CLI auth before attempting push
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/ensure-gh-auth.sh"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="github"
BRANCH="main"

cd "$REPO_DIR"

# Ensure the github remote exists
if ! git remote get-url "$REMOTE" &>/dev/null; then
  echo "[sync-github] Adding remote '$REMOTE'..."
  git remote add "$REMOTE" https://github.com/1LORDVADER/ZAPPAY.git
fi

echo "[sync-github] Pushing to $REMOTE/$BRANCH..."
git push "$REMOTE" "$BRANCH" --force-with-lease 2>&1 || {
  echo "[sync-github] force-with-lease failed (remote diverged), retrying with --force..."
  git push "$REMOTE" "$BRANCH" --force 2>&1
}

echo "[sync-github] ✓ GitHub sync complete — $(git rev-parse --short HEAD)"
