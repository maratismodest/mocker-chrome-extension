#!/usr/bin/env bash
# Renders Chrome Web Store screenshots (1280×800) from the real popup build.
# Usage: ./store-assets/generate.sh   (from the repo root)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/store-assets"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-4791}"

(cd "$ROOT" && npm run build >/dev/null)

STAGE="$(mktemp -d)"
trap 'kill $SERVER 2>/dev/null; rm -rf "$STAGE"' EXIT
cp -R "$ROOT/dist/." "$STAGE/"
cp "$OUT/src/"* "$STAGE/"
# Load the storage stub before the popup bundle
sed 's#<head>#<head><script src="/chrome-stub.js"></script>#' "$ROOT/dist/index.html" > "$STAGE/popup.html"

python3 -m http.server "$PORT" --directory "$STAGE" >/dev/null 2>&1 &
SERVER=$!
sleep 1

for f in "$STAGE"/screenshot-*.html; do
    name="$(basename "$f" .html)"
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --window-size=1280,800 --virtual-time-budget=3000 --user-data-dir="$STAGE/profile" \
        --screenshot="$OUT/$name.png" "http://localhost:$PORT/$name.html" >/dev/null 2>&1
    echo "$OUT/$name.png"
done
