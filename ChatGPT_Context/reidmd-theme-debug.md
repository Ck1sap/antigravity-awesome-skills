# ReidMD Theme Debug Runbook

## Current Stabilization Mode
- Product page runs Dawn-like baseline (no custom product CSS/JS active)
- Homepage cinematic CSS loads on index only

## Guardrails
1. Never load homepage CSS on product pages.
2. Never enable custom product gallery JS while product UX is being stabilized.
3. Product template block order must remain:
   title → price → variant picker → quantity → buy buttons → description

## If product breaks again
1. Check layout/theme.liquid for accidental custom includes.
2. Confirm product.json still matches baseline.
3. Confirm custom product JS is not referenced anywhere.
4. Test:
   - /
   - /products/reidmd-care-package

## Update 2026-02-06 07:09
- Hard stabilization applied
- Files changed: assets/reidmd-cinematic.css, assets/reidmd-product-reset.css, assets/reidmd-product-desc-gallery.js, templates/product.json, layout/theme.liquid
- Product custom gallery JS disabled


## Update 2026-02-06 07:11
- Hard stabilization applied
- Files changed: assets/reidmd-cinematic.css, assets/reidmd-product-reset.css, assets/reidmd-product-desc-gallery.js, templates/product.json, layout/theme.liquid
- Product custom gallery JS disabled

Restored Dawn core foundation files; disabled all custom product overrides; homepage cinematic remains index-only.

## Update 2026-02-06 08:16
- What changed: assets/reidmd-product-stabilize.css, layout/theme.liquid, templates/product.json; include cleanup
- Why: stuck hidden states + stale includes + safe product settings
- QA checklist:
  1. Title visible and horizontal
  2. Price visible
  3. Description visible
  4. Quantity controls normal size
  5. Add to cart + PayPal in normal flow
  6. Homepage cinematic unchanged

## Update 2026-02-06 (v3 polish pass)
- Added `assets/reidmd-home-polish.css` (index-only UI polish layer).
- Upgraded `assets/reidmd-product-stabilize.css` to v3:
  - Restored `.visually-hidden` utility on product page.
  - Rebuilt quantity control visuals with deterministic +/- rendering.
  - Kept product layout/media stabilization.
- Confirmed conditional includes in `layout/theme.liquid`:
  - index => cinematic + home-polish
  - product => product-stabilize only
- Product settings pinned to safe Dawn-compatible values in `templates/product.json`.

## Update 2026-02-06 (atomic v4 reset)
- Rewrote `reidmd-cinematic.css` (index-only full-bleed hero + overlay content).
- Rewrote `reidmd-product-stabilize.css` (product-only, deterministic qty controls, readable product UI).
- Head includes now strictly scoped:
  - index => reidmd-cinematic.css
  - product => reidmd-product-stabilize.css
- Product template main settings pinned to safe values.
- No Dawn core foundation files were edited in this pass.

## Update 2026-02-06 (v5 syntax-safe stabilization)
- Rewrote `reidmd-cinematic.css` with syntax-safe index-only hero polish.
- Rewrote `reidmd-product-stabilize.css` with deterministic +/- quantity controls and hidden helper text.
- Confirmed strict conditional includes in `layout/theme.liquid`.
- No Dawn core files edited in this pass.

## Update 2026-02-06 (v5 reference-match)
- Rewrote `reidmd-cinematic.css` to conservative index-only skin with Dawn banner structure intact (no absolute media positioning).
- Rewrote `reidmd-product-stabilize.css` to preserve Dawn functionality and match Residency neon style.
- Removed pseudo +/- hacks; restored native quantity icons and hidden helper text behavior.
- Confirmed conditional includes:
  - index => reidmd-cinematic.css
  - product => reidmd-product-stabilize.css
- Kept Dawn core files untouched.

## Session Memory 2026-02-06 09:39
Summary: v5 center-lock fix + quantity polish
Root cause:
1) .main-product .page-width selector mismatch (no guaranteed .main-product wrapper in Dawn output)
2) .page-width normalization drift in base.css causing inconsistent centering
Files changed:
- assets/base.css
- assets/reidmd-product-stabilize.css
- layout/theme.liquid
- docs/reidmd-theme-debug.md

Current source of truth:
- Homepage style source: reidmd-cinematic.css only
- Product style source: reidmd-product-stabilize.css only
- Product centering dependency: base.css .page-width + product v5 container rules

QA checklist:
[ ] 1. /products/reidmd-care-package is centered on full-screen desktop.
[ ] 2. Product media left + info right in balanced columns.
[ ] 3. Quantity shows proper +/- buttons, no native spinner arrows.
[ ] 4. Skip link is not visibly stuck at top unless focused.
[ ] 5. Homepage visual remains unchanged from current preferred look.

## Session Memory 2026-02-06 10:06
Goal: Homepage polish only, preserve product stability
Root cause: n/a - polish pass
Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] 1. / loads with approved look (no layout drift).
[ ] 2. Hero remains centered/readable on desktop and mobile.
[ ] 3. Product page /products/reidmd-care-package remains centered on widescreen.
[ ] 4. Product media left + info right balanced columns still intact.
[ ] 5. Quantity control still shows clean +/- and no native spinner.
[ ] 6. Skip link hidden unless focused.
[ ] 7. No edits outside allowlist.

Result: READY_TO_PUSH

## Session Memory 2026-02-06 (homepage polish only v1)
Goal:
- Improve homepage visual polish only.
- Preserve product page baseline and centering fixes.

Root cause:
- Prior homepage regressions were caused by structural hero overrides in `assets/reidmd-cinematic.css` (position/layout-level changes), not color/skin styles.

Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

Guardrails:
- No edits to product css/js/liquid.
- No Dawn structural rewrites.
- No inline style injection in liquid.

QA checklist:
[ ] 1. Homepage keeps approved composition (hero image + centered glass CTA card).
[ ] 2. No stray bullets in homepage product grid.
[ ] 3. Product page `/products/reidmd-care-package` remains centered and unchanged.
[ ] 4. Quantity control still shows clean +/- and no native spinner.
[ ] 5. Skip link behavior on product unchanged (hidden unless focused).

Result:
- READY_TO_PUSH or NOT_READY after verification.

## Session Memory 2026-02-06 10:44 (homepage polish only v2)
Goal:
- Homepage polish only, preserve approved identity.

Root cause:
- n/a - polish pass.

Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] 1. Homepage keeps approved look (no layout drift).
[ ] 2. Hero remains centered/readable desktop + mobile.
[ ] 3. Product page /products/reidmd-care-package still centered widescreen.
[ ] 4. Product media left + info right remains intact.
[ ] 5. Quantity control still clean +/- and no native spinner.
[ ] 6. No changes outside allowlist.

Result:
- READY_TO_PUSH or NOT_READY after verification.

## Session Memory 2026-02-06 11:09 (product hard-centering v6)
Goal:
- Product hard-centering only, homepage untouched.

Root cause:
- Wrapper selector mismatch / centering not enforced at all Dawn wrapper levels.

Files edited:
- assets/reidmd-product-stabilize.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] Product page centered on full-screen desktop
[ ] Media left/info right balanced columns
[ ] Quantity +/- visible, no native spinner
[ ] Skip link hidden unless focused
[ ] Homepage unchanged

Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-06 11:17 (glow restore v6.1)
Goal:
- Restore glow only.

Root cause:
- Stabilization pass removed prior shadow/border skin.

Files edited:
- assets/reidmd-product-stabilize.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] 1. Product page remains centered on widescreen desktop.
[ ] 2. Media left/info right layout unchanged.
[ ] 3. Quantity +/- still visible; no native spinner arrows.
[ ] 4. Visible glow restored around product shell/panels/buttons.
[ ] 5. Homepage unchanged.

Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-06 11:39 (homepage glow restore v3)
Goal:
- Restore homepage glow only.

Root cause:
- Prior homepage pass reduced/removed luminous shadow layers on hero/CTA/cards.

Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] Homepage glow restored (hero overlay/card/buttons visibly luminous)
[ ] Homepage layout unchanged (same sizing/positioning)
[ ] Product page unchanged (still centered)
[ ] Quantity +/- unchanged and clean
[ ] No edits outside allowlist

Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-06 11:50 (homepage hero lock + glow restore)
Goal:
- Homepage only: fix split hero layout + restore glow while preserving approved style.

Root cause:
- Hero media/content fell back to non-overlay (stack/split behavior), causing image left + text block detached.
- Prior glow intensity reduced on homepage-only layer.

Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] 1. Homepage hero image is full-bleed and centered (not left-stuck).
[ ] 2. CTA panel sits over hero image near lower center.
[ ] 3. Glow visible around CTA panel and subtle hero vignette.
[ ] 4. Product page unchanged.
[ ] 5. No files changed outside allowlist.

Result:
- READY_TO_PUSH or NOT_READY after verification.

## Session Memory 2026-02-06 12:01 (homepage hero text removed)
Goal:
- Remove homepage hero overlay text only; keep image/glow/layout.

Root cause:
- Hero copy came from homepage banner content blocks/settings.

Files edited:
- templates/index.json
- docs/reidmd-theme-debug.md

QA checklist:
[ ] 1. Homepage hero image still appears.
[ ] 2. Hero glow/visual style unchanged.
[ ] 3. No “REIDMD // ENGINEERED NIGHT” text visible.
[ ] 4. Product page remains unchanged.

Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-07 06:14 (homepage ghost overlay removal + glow retention)
Goal:
- Homepage ghost overlay removal + glow retention.

Root cause:
- Empty banner blocks in index.json + styled .banner__box in cinematic CSS.

Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

QA checklist:
[ ] 1. Homepage hero has NO empty glowing bar.
[ ] 2. Homepage still has visible glow around hero media.
[ ] 3. Homepage image remains centered and visually unchanged otherwise.
[ ] 4. Product page (/products/reidmd-care-package) unchanged.
[ ] 5. No files changed outside allowlist.

Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-07 06:34 (homepage PRYDA-style glass glow refresh)
Goal:
- Homepage PRYDA-style glass glow refresh (homepage only).

Root cause:
- Conflicting/stacked homepage CSS + ghost empty banner content state.

Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md

QA checklist:
1. Homepage hero centered and full-bleed inside rounded glass shell.
2. No empty glowing bar appears when hero has no text blocks.
3. Glow visible around hero and product cards.
4. /products/reidmd-care-package unchanged (still centered, qty +/- intact).
5. No edits outside allowlist.

Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-07 (homepage cinematic lock v7)
Goal:
- Homepage only: stable PRYDA-inspired glass/glow look without ghost overlays.
Root cause:
- Conflicting homepage CSS passes + empty banner block overlays causing inconsistent render.
Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md
QA checklist:
[ ] 1. Homepage hero centered, rounded, and glowing.
[ ] 2. No empty glowing bar on hero.
[ ] 3. Homepage cards have subtle glass glow.
[ ] 4. Product page /products/reidmd-care-package unchanged.
[ ] 5. No edits outside allowlist.
Result:
- READY_TO_PUSH or NOT_READY

## Session Memory 2026-02-07 (homepage cinematic lock v8)
Goal:
- Homepage only: stable PRYDA-inspired glass/glow look, no hero text, no ghost bar.
Root cause:
- Prior cinematic CSS had syntax errors + conflicting passes; browser dropped rules.
Files edited:
- assets/reidmd-cinematic.css
- docs/reidmd-theme-debug.md
QA checklist:
[ ] 1. Homepage hero centered, rounded, glowing.
[ ] 2. No empty glowing bar on hero.
[ ] 3. Featured product card has subtle glass glow.
[ ] 4. Product page unchanged.
Result:
- READY_TO_PUSH or NOT_READY
