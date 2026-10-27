# taylordwraps-public-preview

Public, allowlist-gated lane for the **Taylor'd Wraps** interactive showcase by
[drasticstatic labs](https://github.com/drasticstatic). This is a concept preview,
NOT the live taylordwraps.com storefront.

- Live preview: https://drasticstatic.github.io/taylordwraps-public-preview/
- Private project lane: https://github.com/drasticstatic/taylordwraps

## Compliance

Static, client-side only. **No payments, no storefront flows, no commerce of any kind.**
All commerce/booking stays on external portals (taylordwraps.com / Shopify remains the
client's commerce surface). Web3 elements are read-only client-side experiments
(wallet connect handshake, origin-hash certificates). See ALLOWLIST.md.

## First-run bootstrap

The initial site content arrived as a SHA-256-signed bundle fetched once by the
deploy workflow and committed to git. Every change after that is ordinary git.
`asset-manifest.json` + `fetch_assets.py` remain as the provenance chain for binary assets.
