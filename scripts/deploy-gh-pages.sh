#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch, which GitHub Pages serves.
# Works from any machine with push access; no GitHub Actions needed.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE="$(git remote get-url origin)"
REV="$(git rev-parse --short HEAD)"
npm run build
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -a dist/. "$TMP/"
touch "$TMP/.nojekyll"   # serve files as they are, no Jekyll processing
git -C "$TMP" init -q -b gh-pages
git -C "$TMP" add -A
git -C "$TMP" -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" \
  commit -q -m "Build of $REV"
git -C "$TMP" push -q -f "$REMOTE" gh-pages
echo "Published $REV to gh-pages. GitHub Pages updates in about a minute."
