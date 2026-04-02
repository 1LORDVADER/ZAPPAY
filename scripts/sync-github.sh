#!/bin/bash
# sync-github.sh — Push latest Manus checkpoint to 1LORDVADER/ZAPPAY
set -e
REPO_DIR="/home/ubuntu/zappay-redesigned"
GITHUB_REMOTE="https://github.com/1LORDVADER/ZAPPAY.git"
cd "$REPO_DIR"
if ! git remote get-url github &>/dev/null; then
  git remote add github "$GITHUB_REMOTE"
fi
if ! grep -q "github.com" ~/.netrc 2>/dev/null; then
  echo "[sync] WARNING: ~/.netrc missing GitHub credentials."
  exit 1
fi
echo "[sync] Pushing to github/main..."
git push github HEAD:main --force-with-lease 2>&1
echo "[sync] Done — $(git rev-parse --short HEAD) pushed to 1LORDVADER/ZAPPAY"
