#!/usr/bin/env python3
"""Bootstrap binary assets from the signed manifest. Idempotent: skips files
already present with a matching SHA-256. Fails loudly on any mismatch."""
import json, sys, urllib.request, hashlib, os, time

MANIFEST = "asset-manifest.json"
entries = json.load(open(MANIFEST))
fails = []
for e in entries:
    path = e["path"]
    if os.path.exists(path):
        h = hashlib.sha256(open(path, "rb").read()).hexdigest()
        if h == e["sha256"]:
            print(f"SKIP  {path} (already present, sha ok)")
            continue
    ok = False
    for attempt in (1, 2, 3):
        try:
            req = urllib.request.Request(e["url"], headers={"User-Agent": "taylordwraps-ci/1.0"})
            data = urllib.request.urlopen(req, timeout=60).read()
            h = hashlib.sha256(data).hexdigest()
            if h != e["sha256"]:
                raise ValueError(f"sha mismatch for {path}")
            os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
            open(path, "wb").write(data)
            print(f"FETCH {path} {len(data)} bytes sha ok")
            ok = True
            break
        except Exception as ex:
            print(f"  attempt {attempt} failed: {ex}", file=sys.stderr)
            time.sleep(2)
    if not ok:
        fails.append(path)
if fails:
    print("FAILED:", fails, file=sys.stderr)
    sys.exit(1)
print("all assets verified")
