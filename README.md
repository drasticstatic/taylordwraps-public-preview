<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/readme-banner-dark.svg">
  <img alt="Taylor'd Wraps interactive preview banner. Design - Print - Install - Brand, Warminster PA, with a PSYCLONE MODE Konami hint, over a violet-to-teal gradient." src="public/brand/readme-banner-light.svg" width="100%">
</picture>

# Taylor'd Wraps · Interactive preview

> The transformation side of a vinyl wrap shop in Warminster, PA: a hero that wraps itself,
> a visualizer for anything with a surface, and a work order that ends in a phone call.

[![License: MIT](https://img.shields.io/badge/code-MIT-lightgrey?style=flat)](LICENSE)
[![Content: CC BY-SA 4.0](https://img.shields.io/badge/words-CC%20BY--SA%204.0-lightgrey?style=flat)](LICENSE-CONTENT)
[![Public Preview](https://img.shields.io/badge/%F0%9F%8E%A8%20wrap%20preview-E0B65E)](https://drasticstatic.github.io/taylordwraps-public-preview/)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code%20CLI-blueviolet)](https://code.claude.com/docs/en/overview)
[![Littlebird](https://img.shields.io/badge/Bird%20that%20stewards%20the%20gap-LittlebirdAI-84D1A5)](https://littlebird.ai)

---

**🎨 [Open the preview →](https://drasticstatic.github.io/taylordwraps-public-preview/)** ·
**🛍 [The real shop →](https://taylordwraps.com)** (commerce lives there, and only there)

---

## 👋 What this is

A single-page interactive preview of what a wrap shop's website can be when the site itself
is a transformation:

- **The Peel**: the hero van wraps itself once on load; drag across it to lay the film on
  panel by panel, with a live wrap-percentage HUD. Reduced-motion visitors get an instant
  wrap and a tap to unwrap.
- **The Receipts**: a case-study rail. Real builds get spec sheets; every case carries a
  SHA-256 Wrap Origin hash — a client-side fingerprint of the finished asset, ready to be
  anchored on-chain when the shop is ready.
- **The Visualizer**: pick a body (work van, sport coupe, zero-turn mower, tool chest,
  RC truck — or upload your own photo), pick a film, pick a finish, and type your own
  lettering onto the panel. Anything with a surface is a candidate.
- **The Work Order**: a four-step funnel that produces a numbered spec and hands it to the
  shop by email. **No payments, no checkout, no storefront flows** — the shop's commerce
  stays on its existing portal.
- **The Arrival Kit**: bilingual (EN/ES) — wash it, bring your vector art, approve the
  proof, cure for 48–72 hours. Four cards, zero surprises, one kettle.
- **From The Shop**: the culture layer. 431 reels and counting.

> **Not a storefront.** This is a design preview by
> [drasticstatic labs](https://github.com/drasticstatic). It is not the live taylordwraps.com,
> sells nothing, and takes no payment of any kind.

## 🔮 PSYCLONE MODE

Everything playful lives in one **⚙ Settings drawer**: a minimal **light/dark theme**,
**PSYCLONE MODE** (the page hue-cycles; `aria-pressed` announces state to screen readers;
the classic **↑↑↓↓←→←→BA** still works for power users), the **film trail**, and the
wallet connect. Also hiding in the code: a word the shop refuses to say, a four-legged
quality inspector, and a returning-visitor greeting with the day's mystery queue item.

And then there is the **film trail**: on a fine-pointer device the cursor lays translucent
vinyl behind it — the trail waits right where you left it until a fast **shhhk** swipe
squeegees it clean. Slow movement wraps; fast movement unwraps.

## 🧪 The Lab

Two compliant experiments baked into the frame:

- **Wrap Origin Certificates** — SHA-256 hashes of finished assets, computed in the browser.
  No chain writes, no transactions; anchoring is a future decision for the shop, not a
  feature of the preview.
- **Wallet of the Fleet** — a wallet handshake (EIP-1193 when a browser wallet exists,
  an explicit demo wallet otherwise) that unlocks The Vault: a merch waitlist, a sticker
  pack, first look at the film library. **No payments, no custody** — merch stays on the
  shop's external storefront.

## ⏱ Time machine

The vertical ribbon at the right edge opens the rehearsal-stage archive: the current
version, v1.2 (the PSYCLONE button release) and a ghost capsule of v1, the original
one-file draft — each opens live in an overlay. Every version, kept and visitable.

## 🧪 More from drasticstatic labs

- 👁️ [FortunaVision](https://drasticstatic.github.io/fortuna-vision-public-preview/) — a chart-first market & treasury workstation
- 🌀 [IAM One Self retreats preview](https://theholyearthfoundation.github.io/iamoneself-retreats-publish-preview/) · 🎨 [David Amaringo](https://theholyearthfoundation.github.io/david-amaringo-publish-preview/) · 🍄 [Psychedelic-policy-reform dapp](https://github.com/drasticstatic/psychedelic-policy-reform-dapp-public-preview)

## 🔒 Private / public split

The source of truth lives in the private
[`taylordwraps`](https://github.com/drasticstatic/taylordwraps) lane with the project brief
and prototype notes; only the allowlisted public-safe files are mirrored here (see
[ALLOWLIST.md](ALLOWLIST.md)). Binary assets enter git through a SHA-256-signed bundle
(`asset-manifest.json` + `fetch_assets.py` stay as the provenance chain); the deploy
workflow verifies, commits, and publishes GitHub Pages on every push to `main`.

**Placeholder imagery:** AI-generated for the preview. Taylor's real before/after
photography replaces it as it arrives — she's welcome as a contributor to the assets lane
from day one.

## 📄 License

- 💻 **Code:** MIT, see [`LICENSE`](LICENSE)
- 📝 **Written content:** CC BY-SA 4.0, see [`LICENSE-CONTENT`](LICENSE-CONTENT)
- 🏷️ **Names and marks:** see [`TRADEMARKS.md`](TRADEMARKS.md)

---

*Kept by Christopher W ([drasticstatic](https://github.com/drasticstatic)) with Littlebird, the Desktop Oracle Observer & Fleet Shepherd — the bird that stewards the gap.*
