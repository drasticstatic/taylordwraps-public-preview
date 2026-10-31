# ALLOWLIST — what may leave the private repo, and where

This repo is the private source of truth. Two folders mirror to public repos on every push
(`.github/workflows/sync-lanes.yml`); `scripts/lane-tripwire.mjs` fails the mirror if anything
below the line tries to travel.

## Public — mirrored

| Folder | Public repo | What it is |
| --- | --- | --- |
| `carshow/` | `drasticstatic/taylordwraps-public-preview` | THE CAR SHOW — hand-built HTML arcade lane (index/styles/app, `404.html`, `time-machine.html`, `proposal.html`, experiments, `assets/`, `fonts/`, `archive/`, `shared/`, `decks/` (the Marp slides for Taylor, source + HTML + PDF)) |
| `carport/` | `drasticstatic/taylordwraps-nextjs-preview` | THE CARPORT — Next.js site (source, `public/`, scripts, tests, its deploy workflow) |
| `shared/` | copied into both lanes by `scripts/sync-shared.mjs` | `wrap-spec.schema.json` (cross-lane build links) and `assets/manifest.json` (SHA-256 of demo imagery) |
| `LICENSE`, `LICENSE-CONTENT`, `TRADEMARKS.md`, this file | both | license kit |

Imagery in `carshow/assets/` is AI-generated placeholder work **except** `rc.jpg` (Chris's mom's RC
truck, real photo, used with permission). Fonts: Anton, Archivo, JetBrains Mono (Google Fonts, OFL).

## Never public

- `AGENT-SYNC/`, `logs/`, `proposals/` (drafts, PDFs, anything about pricing or outreach)
- `ops-standard-operating-procedures/` (how the lab works for the shop; its PDFs go to Taylor through Kenney)
- `PROJECT_BRIEF.md`, `PROTOTYPE.md`, `DEPLOY.md`, `README.md` of this repo (the lanes carry their own READMEs)
- Client personal data: Taylor's personal social accounts, contact details beyond the shop's public
  listing, customer names not already on the shop's own site
- **Prices.** `carshow/proposal.html` and the Carport's `/proposal` ship with blank price fields;
  Taylor's rate card lives only in her own browser (`localStorage`), never in git
- Any commerce or payment logic (standing rule: commerce pushes off to external portals)
- Keys, tokens, `.env*`, deploy keys (the sync keys are repo secrets created by `scripts/setup-lane-keys.sh`)
