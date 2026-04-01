#!/usr/bin/env bash
# ensure-gh-auth.sh
# Verifies GitHub CLI is authenticated. If the token has expired or the
# sandbox was recycled, prints a clear message so the user can re-authenticate.
# This script is sourced by sync-github.sh before every push.

if ! gh auth status &>/dev/null; then
  echo "[sync-github] ⚠️  GitHub CLI is not authenticated."
  echo "[sync-github]    Run: gh auth login --hostname github.com --git-protocol https --web"
  echo "[sync-github]    Then re-run the sync script."
  exit 1
fi
