# windowinsets.info

Window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy devices — with a source for every number.

Its interface is inspired by [safearea.info](https://safearea.info), adapted for measured Android data and Samsung foldables.

## How I measure

The full write-up lives on the site at [/methodology](https://windowinsets.info/methodology) (source: [`app/routes/methodology.tsx`](app/routes/methodology.tsx)). In short:

- **Three source tiers.** Every value is `official` (published by Samsung/Google), `measured` (captured with InsetsProbe on a real device or Samsung Remote Test Lab, raw JSON committed here) or `community` (not yet reproduced). Each source shows the date it was checked.
- **Insets are measured, not published.** Samsung documents resolution and density, but not status/navigation bar heights, cutouts or corner radii, so I read them from Android itself with [InsetsProbe](tools/insets-probe).
- **Conditions are part of the data.** Portrait, full screen, default Display size / Font size / Screen resolution, one navigation mode (gesture or 3-button) per capture, and the One UI + Android version are all recorded. A value is only valid for those conditions.
- **Never estimated.** Nothing is interpolated from another device or derived from resolution alone. Unverified values are `null` and shown as **pending**.
- **Known limits.** One UI updates can change values; landscape and multi-window are not covered yet; a real app may see different insets if it adds its own padding or window flags.

Found a mistake or have a capture that differs from mine? Open an issue or pull request with your InsetsProbe JSON — a reproduction is as valuable as a new device.

## Measuring a device

Manufacturers don't publish insets, so I measure them with [InsetsProbe](tools/insets-probe) — a tiny Android app that dumps `WindowInsets`, `DisplayCutout`, `RoundedCorner`, `FoldingFeature` and the hinge angle as JSON. It works on a real device or on [Samsung Remote Test Lab](https://developer.samsung.com/remote-test-lab). See [tools/insets-probe/README.md](tools/insets-probe/README.md).

Put raw captures in `measurements/<device-slug>/<screen>-<navMode>.json` and reference them from the device's `Source` so anyone can re-check them.

## Camera cutouts and cover-screen limits

Android can report cover-screen cutout bounds through
[`DisplayCutout.getBoundingRects()`](https://developer.android.com/reference/android/view/DisplayCutout#getBoundingRects()).
The site shows width, height and all four distances to the captured window edges.
For example, the [verified Flip8 cover capture](measurements/galaxy-z-flip8/recapture-2026-09-23/cover-threeButton.json)
has one rectangle at `(428, 839)` sized **520 × 209 px**, inside a 948 × 1048 px window.
This covers the OS exclusion area, not separate measurements of each camera lens.

Android reports at most one bounding region per display edge. Lens diameter,
lens-to-lens spacing and physical camera identification cannot be recovered from
that combined rectangle alone. Do not estimate them from Samsung skin pixels.

[`getCutoutPath()`](https://developer.android.com/reference/android/view/DisplayCutout#getCutoutPath())
(API 31+) can provide finer OS contour geometry. InsetsProbe 1.3.0+ now records it
when available, using display-space px and `Path.approximate(0.25f)`. Existing
captures did not record it, so contour dimensions remain **pending recapture**.
Even a returned path is not a guarantee of separate physical lens outlines.
Missing old fields mean not collected; a new null path means not returned, not
zero geometry. Run the probe on the actual full-screen cover display: selecting
its label or rotating an inner-screen capture cannot measure the cover.
See the [site methodology](https://windowinsets.info/methodology#camera-cutouts).

## Stack

React Router (framework mode) with build-time prerendering (`ssr: false` + `prerender`), Tailwind CSS. Output is a static site.

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck
pnpm build      # prerendered HTML in build/client
```

## Device coverage and priorities

Decision, 2026-09-22: support Samsung Galaxy models with available official skins,
released in **2020 or later**, including discontinued and non-flagship models.
This supersedes the earlier no-cutoff decision. See [release evidence and archive
policy](docs/DEVICE_COVERAGE.md).

1. Complete the current Galaxy S, Z Fold and Z Flip experience.
2. Add Galaxy Tab.
3. Add Galaxy Note and Galaxy A; neither series takes priority over the other yet.

Galaxy Z TriFold is an explicit exception: its support and animation scope require
a separate product decision. A downloaded skin does not automatically approve it.

An official skin permits an artwork preview, not a claim of verified inset data.
Devices without captures remain marked **Skin preview / pending** until measured.
This is the target coverage roadmap, not a claim that every model is implemented.

## Adding a device

1. To register downloaded skins, run `python3 scripts/import-samsung-skins.py /path/to/downloads`.
   The importer copies original artwork, registers main/cover screens in
   `app/data/skinCatalog.json`, and skips TriFold. Review each new model’s release
   year against the 2020 cutoff before publishing; record boundary/older models
   in `app/data/coverage.ts` with sources in `docs/DEVICE_COVERAGE.md`.
2. For RTL data, keep raw JSON in `measurements/<device-slug>/`, then create
   `app/data/devices/<slug>/index.ts` implementing `Device` (see `app/data/types.ts`).
3. Register that entry in `verifiedEntries` in `app/data/devices.ts` using the
   existing preview slug. Its screens override preview data; additional skin-only
   screens stay pending. Routes, sitemap and prerendering use the merged catalogue.

Current public catalogue: 70 models (28 S, 28 Tab, 7 Fold, 7 Flip). The skin
archive retains 73 models, including three pre-2020 models. New Fold/Flip
entries have static main/cover previews where supplied; animation is separately
enabled per device. Note/A phone skins were not present in the supplied downloads.

## Continuing development in Codex

Start with [AGENTS.md](AGENTS.md) and the current [reference parity notes](docs/REFERENCE_PARITY.md). Official Samsung artwork and its layout coordinates live in `public/skins/` and `app/data/skins.ts`. Run geometry/asset regressions with `node --test tests/rendering.test.mjs`.
