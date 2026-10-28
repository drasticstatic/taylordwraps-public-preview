#!/bin/sh
# Assemble THE CAR SHOW's published site into <dir> (default: site/).
# One source for both the public deploy (deploy.yml) and the private repo's guardrails, so what gets
# checked is exactly what gets published. Follow with: node scripts/check-site.mjs <dir>
set -eu
out="${1:-site}"
case "$out" in /*) ;; *) out="$PWD/$out" ;; esac
cd "$(dirname "$0")/.."

mkdir -p "$out"
cp -- *.html *.css *.js "$out"/
for d in assets fonts archive shared; do
  if [ -d "$d" ]; then cp -R "$d" "$out"/; fi
done
touch "$out/.nojekyll"
test -f "$out/404.html"
echo "assembled $(find "$out" -type f | wc -l | tr -d ' ') files into $out"
