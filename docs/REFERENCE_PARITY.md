# safearea.info parity — 2026-09-22

## Target and evidence

The product is the Android equivalent of [safearea.info](https://safearea.info/),
not a differently designed metrics dashboard. Inspected the live page at 1440×1000
and its mobile presentation. Tested the closed and partially folded views, view
settings and four orientation choices. Samsung artwork was supplied by the owner
from https://developer.samsung.com/galaxy-emulator-skin.

## Observed behavior and implementation

| Surface | Reference | Current implementation |
| --- | --- | --- |
| Desktop layout | Device list, Metrics, large canvas; controls in header | Same three columns, independent scrolling and draggable/keyboard width handles |
| Mobile | Model selector, collapsible Metrics, bottom controls | Implemented, checked at 390×844 |
| Device navigation | Searchable grouped list with selected model | Android series groups, search across groups, active model on home and detail routes |
| Viewport | Scroll/drag pan, pinch zoom, +/−, 0 fit | Pointer pan/touch pinch, native wheel pan/Ctrl-wheel zoom, bounded 25–500% zoom, ResizeObserver fit |
| Orientation | Portrait, left/right landscape, upside down | All four view rotations; recorded Android insets are not relabeled as landscape captures |
| Fold | Closed/partial/open, arbitrary hinge | Presets and slider, eased three.js hinge, rigid outer panels, closed solid shell, reduced-motion support |
| Layers | Safe area/insets/reserved/corners | Independent legend toggles; Android cutout bounding region replaces iOS reserved regions |
| Settings | Frame, regions, dimensions, units | All switches plus Android dp/px and navigation mode |
| Measurements | Labels and clickable metrics | Content-sized labels; metrics copy with result feedback; SVG numeric labels and 3D texture hit areas copy values |
| Artwork | Per-device frames | Official Fold8 main/cover, Flip8 main/cover and 28 S20–S26 variants aligned by original layout coordinates |

## Proportions and measurement correction

A display is mapped using its own logical width/height, preserving the ratio of
every inset to the screen. Official artwork is aligned using its display rectangle,
not its larger decorative background rectangle. The 3D plane includes annotation
margins in its aspect calculation; the solid chassis excludes those margins.

The legacy Fold8 main capture has `widthPx: 1248`, `heightPx: 1972`. Both navigation
captures match the COVER layout exactly. The official main layout is 2448×1848.
The previous renderer rotated 1248×1972 and treated it as the unfolded display;
that was a data classification error, not an orientation correction. The new
website associates those captures with cover based on the matching resolution.
No raw JSON was changed. The main view uses the official skin only and explicitly
shows pending measurements. Skin dimensions never produce dp metrics/insets.

## Verification

- `node --test tests/rendering.test.mjs`: finite/symmetric hinge positions across
  both axes and 0/1/45/90/135/179/180 degrees; physical offset preserved; all chassis
  edges belong to exactly two triangles; all asset display rectangles match layouts.
- Browser-driven Playwright/AX checks: desktop and 390px mobile layouts, device
  navigation, Metrics disclosure, dp/px settings, orientation, pose, keyboard +/0,
  official artwork loading and console errors. Metrics displayed “Copied” after
  clipboard write resolved; the automation clipboard reader did not expose the
  browser's system clipboard content, so exact pasted contents are not asserted.
- This is browser-driven QA, not a committed Playwright Test runner/CI suite.
  Real two-finger touch gestures need device testing; desktop synthetic wheel and
  keyboard checks do not prove hardware touch behavior.
- S-series batch: 26 imported image/mask pairs match their downloaded ZIP bytes.
  All 28 S-series routes are prerendered. Chrome visual checks cover S20, S23 Ultra,
  S26 Ultra and S26 FE at 390×844; mobile zoom was exercised from 63% to 50%, and
  S25 Ultra retained its measured 384×832 dp display and 34.13/48 dp system bars.
  S20's lower-resolution foreground mask now fills the layout rectangle exactly,
  removing letterboxed gaps; its curved outer chassis has a separate crop.
  Mobile controls use two grid rows so Zoom cannot shrink to an icon-width strip.
- Remaining-skin registration: catalogue uniqueness, all main/cover asset links
  and TriFold exclusion are covered by the fourth Node test. Chrome checks covered
  Tab S11 Ultra, mask-free Tab S4, Fold5 main/cover switching, and the natively
  landscape Tab Active4 Pro at 390×844. Registration uses static artwork; it does
  not assert animation completeness or measured device geometry for these models.

## Remaining differences

- Fold8/Flip8 cover and inner displays share one WebGL scene through folding.
  The cover uses the rigid rear-panel transform; applying the inner cylindrical
  bend to its annotation margins previously pulled it inside the opaque chassis.
  This caused Fold8's half-hidden cover and Flip8's stray band at 90°. Both were
  checked after the fix in Chrome. Back/side thickness remains illustrative,
  not a measured CAD model.
- The S-series import adds 26 skins and 25 artwork-only catalogue entries. Existing
  S25-series specification/measurement entries take priority over skin previews.
  Unknown specifications and insets remain pending; skin pixels are not dp data.
- Remaining downloaded Tab/Z skins are now registered: 73 archived models,
  70 public models after the 2020 release-year cutoff (see `DEVICE_COVERAGE.md`), with
  separate static main/cover previews where supplied. New models do not enable
  fold animation automatically. TriFold is excluded pending a separate decision;
  Note/A phone archives were not present. No measurements are borrowed across models.
- Native Android landscape insets require new captures. Current rotation is visual.
- OG/favicon have been replaced with generated Android inset artwork and a matching
  corner mark. Production assets and the exact generation prompt are documented in
  `design/brand/README.md`; sharing metadata uses versioned URLs. This describes local
  implementation, not deployment or third-party cache invalidation.

## Annotation typography (2026-09-22)

Observed on https://safearea.info/: interface text uses Mona Sans VF; SVG numeric
badges use 12px system monospace and a small rectangular background (18px high,
3px corner radius). Region labels use the same monospace stack with a colored
name badge and a separate value. The local implementation now uses that stack,
small rectangular badges, shared colors, and size compensation when zooming in
both SVG and WebGL. UI Mona Sans is served locally with its OFL license under
`public/fonts/`. Metrics use 14px text.

The cover/partial-fold geometry was visually verified before the typography pass.
Final typography screenshots were blocked by Browser Use `ERR_BLOCKED_BY_CLIENT`
on localhost; type/build validation is not a substitute for that remaining visual
check. No full pixel-parity claim is made.

## Per-device source directories

The eight explicit measured/specification entries live at
`app/data/devices/<slug>/index.ts`. Shared types, coverage rules and skin previews
remain in `app/data/`; the public routes and data values are unchanged by the move.
