#!/usr/bin/env bash
# Re-deploy the Spelling Games backend after editing Code.gs.
# Usage: ./deploy.sh "optional description"
#
# appsscript.json MUST say "access": "ANYONE_ANONYMOUS" (not "ANYONE") — every
# `clasp deploy` re-derives the deployment's actual access tier from this file,
# and "ANYONE" silently requires a Google sign-in for every caller, which would
# lock every pupil out instantly. See feedback_apps_script_deploy_anyone_anonymous
# in Claude's memory for how this was diagnosed (2026-09-08).

set -e
cd "$(dirname "$0")"

DEPLOYMENT_ID="AKfycbwP3s1LdhCV3FZCYwY8QPtGZ2xeJgY8ZlEzRY44Igw2Bvr_nGUJtx7uB7JOEIXwXsPb"
DESC="${1:-Deploy $(date '+%d %b %Y %H:%M')}"
BASE_URL="https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec"

grep -q '"access": "ANYONE_ANONYMOUS"' appsscript.json || {
  echo "✗ appsscript.json does not say ANYONE_ANONYMOUS — refusing to deploy (would lock out every pupil). Fix it first."
  exit 1
}

echo "→ Pushing to HEAD..."
clasp push --force

echo "→ Creating version snapshot..."
VERSION=$(clasp version "$DESC" | grep -o '[0-9]\+$')
echo "  Created version $VERSION"

echo "→ Updating live deployment to version $VERSION..."
clasp deploy -V "$VERSION" -d "$DESC" -i "$DEPLOYMENT_ID"

echo "✓ Done. Live deployment is now at version $VERSION."
echo "  Web app URL: $BASE_URL"

echo ""
echo "→ Verifying deployment is publicly reachable (no sign-in wall)..."
sleep 3
RESPONSE=$(curl -sL "${BASE_URL}?action=roster&v=verify$RANDOM" 2>/dev/null)
if echo "$RESPONSE" | grep -q "accounts.google.com"; then
  echo "  ⚠️  BROKEN — redirecting to Google sign-in, not serving JSON. Every pupil is locked out right now."
  echo "      Fix: confirm appsscript.json says ANYONE_ANONYMOUS, then re-run this script."
elif echo "$RESPONSE" | grep -q '"roster"'; then
  echo "  ✓ Live and serving JSON correctly."
else
  echo "  ⚠️  Unexpected response — check manually: ${BASE_URL}?action=roster"
fi
