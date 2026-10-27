# ALLOWLIST - what may live in this public lane

Anything below is approved for public eyes. Anything NOT on this list stays in the
private `taylordwraps` lane.

- index.html, styles.css, app.js - the showcase site (public-safe copy, no client data)
- assets/ - placeholder/demo imagery (AI-generated, not client photography)
- fonts/ - display fonts (Anton, Archivo, JetBrains Mono - Google Fonts licensed)
- asset-manifest.json + fetch_assets.py - SHA-256 provenance chain for the above
- .github/workflows/deploy.yml - the Pages pipeline
- README.md - this lane's description

## Never publish here

- Client personal data (Taylor's personal Facebook, contact details beyond business
  public listings, customer names)
- PROJECT_BRIEF.md, private notes, proposals, or pricing
- Any commerce/payment logic (standing rule: commerce pushes off to external portals)
