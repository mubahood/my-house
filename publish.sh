#!/usr/bin/env bash
# Publish the house site to GitHub Pages: https://mubahood.github.io/my-house/
# Copies the site (everything except originals/, this script and the README) to the gh-pages branch.
# Usage: ./publish.sh
set -euo pipefail

cd "$(dirname "$0")"
REMOTE=$(git remote get-url origin)
OUT=$(mktemp -d)
trap 'rm -rf "$OUT"' EXIT

rsync -a ./ "$OUT/" \
  --exclude .git --exclude .github --exclude originals --exclude README.md \
  --exclude publish.sh --exclude .gitignore --exclude .DS_Store --exclude _t.html
touch "$OUT/.nojekyll"
SIZE=$(du -sh "$OUT" | cut -f1)

cd "$OUT"
git init -q -b gh-pages
git add -A
git commit -q -m "Publish site from $(cd - >/dev/null && git rev-parse --short HEAD)"
git push -q -f "$REMOTE" gh-pages

echo "Published $SIZE. Live in a minute at https://mubahood.github.io/my-house/"
