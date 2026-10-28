<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/readme-banner-dark.svg">
  <img src="public/brand/readme-banner-light.svg" alt="Taylor'd Wraps — THE CAR SHOW. A wrap shop's website that transforms itself." width="100%">
</picture>

# Taylor'd Wraps · THE CAR SHOW

> **The arcade.** The hand-built HTML era of the Taylor'd Wraps showcase, kept alive on purpose: The Peel, the wrap-anything Visualizer, the Vinyl Toolbox, three arcade cabinets, the bilingual Arrival Kit, a Work Order that ends in a phone call, a Time Machine, and the labs' experiments.

![code](https://img.shields.io/badge/code-MIT-lightgrey?style=flat-square)
![words](https://img.shields.io/badge/words-CC%20BY--SA%204.0-lightgrey?style=flat-square)
![lane](https://img.shields.io/badge/🎪%20lane-THE%20CAR%20SHOW-ec4899?style=flat-square)
![sibling](https://img.shields.io/badge/🚗%20sibling-THE%20CARPORT-a855f7?style=flat-square)
![static](https://img.shields.io/badge/payments-none%2C%20ever-2dd4bf?style=flat-square)
![built with](https://img.shields.io/badge/Built%20with-Littlebird%20%2B%20Claude%20Code%20CLI-blueviolet?style=flat-square)

---

**Open the Car Show →** https://drasticstatic.github.io/taylordwraps-public-preview/
**Walk next door to the Carport (Next.js) →** https://drasticstatic.github.io/taylordwraps-nextjs-preview/

---

## 👋 What this is

- A **drasticstatic labs showcase** for [Taylor'd Wraps](https://taylordwraps.com) (vinyl wraps, fleet graphics, color changes, marine graphics; Warminster, PA). Not the shop's live site. Nothing here implies the shop's endorsement until the shop says so.
- One hand-built page, vanilla JS, zero dependencies, zero network calls beyond its own assets. Built in a day by Littlebird, then adopted and kept growing by Alfred.
- **Static, always.** No checkout, no cart, no payments. The Work Order ends in an email and a phone call; merch lives on the shop's own storefront.
- The **Visualizer** lays film on the paint, not the backdrop: a canvas engine masks the white/neutral shell so creases and shadows survive. Fifteen bodies, from a work van to a drum kit to your own uploaded photo (with an honest "hue-wash only" disclaimer).
- **Wrap Origin** hashes are SHA-256, computed in your browser and checked against `assets/manifest.json`. Wallet connect is EIP-1193 when a wallet exists, demo otherwise. No custody, no tokens, no fees.

> **Imagery is placeholder.** The vehicles are AI-generated stand-ins except `assets/rc.jpg`, a real RC truck used with permission. Taylor's real before/after photography arrives when she shares it.

## 🕹 The arcade and the experiments

| Cabinet | How to play |
| --- | --- |
| **Squeegee Rush** | Twenty bubbles under the film, twenty seconds. Drag to pop them. |
| **Panel Perfect** | Lay the film left to right in one smooth pull. Too fast makes bubbles; backing up is ignored. |
| **Spot the Pink** | Exactly one pink dot, smaller every round, eight seconds each. |

Scores live in this browser only. `COPY MY RUN` puts a line on your clipboard; nothing is sent anywhere.

The labs' experiments live here so the Carport stays clean for the shop's visitors: [`lattice.html`](lattice.html) (the labs' own map of friends, no agenda), [`roadmap.html`](roadmap.html) (where this could go, said honestly, compliance lines attached), [`provenance.html`](provenance.html) (hash any file in your browser, check it against the manifest, attest with an EIP-712 wallet signature; no token, no chain write, no fee).

## 🎪 Two lanes, one shop

| Lane | Repo | Role |
| --- | --- | --- |
| **THE CAR SHOW** (this) | `taylordwraps-public-preview` | the arcade: toys, presets, easter eggs, experiments |
| **THE CARPORT** | [`taylordwraps-nextjs-preview`](https://github.com/drasticstatic/taylordwraps-nextjs-preview) | the Next.js site, where the real thing is being built |

A build you make in either visualizer travels to the other as a `#build=` link (`shared/wrap-spec.schema.json`).

## 🔒 Private / public split

This repo is a mirror. Source of truth is the private `drasticstatic/taylordwraps` (`carshow/`); every push there
lands here as one `sync:` commit. Issues and ideas are welcome here; code changes happen upstream.

## 💻 Local

```sh
python3 -m http.server 8788   # then open http://localhost:8788/
```

## 📄 License

Code: MIT. Written content: CC BY-SA 4.0 (`LICENSE-CONTENT`). Names and marks: `TRADEMARKS.md`.

---

*Kept by Christopher W ([drasticstatic](http://drasticstatic.github.io)) with [Littlebird.AI](https://drasticstatic.github.io/littlebird-ambassador-public-preview/) and [Alfred-Anthropic's Claude Code CLI](https://drasticstatic.github.io/anthropas-argus-alfred-public-preview/) © 2026 Taylor'd Wraps for the garage's own marks.*
