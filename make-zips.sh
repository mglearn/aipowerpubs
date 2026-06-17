#!/usr/bin/env bash
# Regenerate the downloadable ZIP files in downloads/.
# Run this whenever you change any project files, so the website's
# download buttons serve the latest version.
#
# Usage:  bash make-zips.sh
#
# CC BY-SA 4.0 — Miguel Guhlin (mguhlin@tcea.org | mguhlin.org | https://go.mgpd.org/lftx2606)

set -e
cd "$(dirname "$0")"

PROJECTS=(newsletter-sheets kpi-dashboard publication-docs digest-markdown resource-directory)

mkdir -p downloads
rm -f downloads/*.zip

# One ZIP per project (extracts to a named folder)
for p in "${PROJECTS[@]}"; do
  zip -r -q "downloads/$p.zip" "$p" -x '*/.*'
  echo "built downloads/$p.zip"
done

# One ZIP with everything (the five projects + the menu + the guide)
zip -r -q downloads/all-examples.zip \
  "${PROJECTS[@]}" index.html guide.html START-HERE.md \
  -x '*/.*'
echo "built downloads/all-examples.zip"

echo "Done."
