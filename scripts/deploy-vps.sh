#!/usr/bin/env bash
# Build the site and copy it to the server that hosts it.
# The destination is read from deploy.local (kept out of git), for example:
#   TARGET=user@host:/var/www/thinkstead/site
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f deploy.local ] || { echo "Create deploy.local with TARGET=user@host:/path/to/site" >&2; exit 1; }
# shellcheck disable=SC1091
source ./deploy.local
: "${TARGET:?deploy.local must set TARGET}"
npm run build
rsync -az --delete dist/ "$TARGET/"
echo "Published $(git rev-parse --short HEAD) to the server."
