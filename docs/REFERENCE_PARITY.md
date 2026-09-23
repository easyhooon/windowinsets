# safearea.info parity — 2026-09-22

## Binding development direction

WindowInsets is a faithful Android clone of safearea.info. “Clone” means the live
reference supplies the default answer for visual and interaction decisions; it does
not mean taking selected ideas and redesigning them into a different dashboard.
The product should feel like the same tool operating on Android measurements and
Samsung hardware.

Use this decision order for every frontend change:

1. Reproduce the reference information architecture, component placement, visual
   proportions, typography, spacing, responsive behavior and interaction model.
2. Substitute Android concepts only where the underlying platform meaning differs.
   Keep the reference hierarchy and presentation around that substitution.
3. Preserve measurement truth. A missing Android value remains pending, and a view
   rotation remains a view transform rather than a claimed landscape capture.
4. Add an Android-only control only when the dataset cannot be represented without
   it, such as navigation mode, outer/inner display or hinge state. Place it in the
   closest reference control group without reorganizing the primary experience.
5. Treat independent enhancements as a separate proposal after parity is reached.
   They require an explicit product decision and must not silently replace the clone
   baseline.

Reference parity takes priority over subjective polish. A new summary card, metric
visualization, section order, label, breakpoint or interaction is acceptable only
when it has a reference analogue or is a documented Android substitution. In
particular, enlarging values or rearranging Top/Right/Bottom/Left into a custom
directional dashboard is not parity when safearea.info presents those values as
metric rows.

Semantic parity is as important as appearance. A section titled **Safe Area Insets**
must show the effective safe-area values, not raw `systemBars`. Android-only raw
values such as System Bars and Display Cutout belong in a reference-shaped detail or
reserved-region presentation, with their relationship to the safe area made clear.

## Parity workflow and completion gate

Before changing a reference-facing surface, inspect the current live safearea.info
page at representative desktop and mobile sizes and record any behavior not already
captured below. Implement against that observation, then compare the reference and
local page side by side at the same viewport.

A parity change is complete only when all of the following are true:

- Desktop and mobile preserve the same hierarchy, control grouping, major spacing
  relationships and responsive transitions as the reference.
- Diagram sizing, label styling, pan/zoom/rotation and direct manipulation match the
  reference behavior for equivalent states.
- Fold and Flip views remain visually stable when closed, partially folded and open;
  hinge motion introduces no clipping, mirrored text, detached artwork or layout
  jump.
- A bar phone, Fold and Flip are checked with measured data, pending data and both
  Android navigation modes where available.
- Every visible difference is either fixed or listed under **Remaining differences**
  with its Android/data rationale. A passing typecheck or build alone is not visual
  parity evidence.

## Target and evidence

The product is a faithful Android clone of [safearea.info](https://safearea.info/),
not a differently designed metrics dashboard. Inspected the live page at 1440×1000
and its mobile presentation. Tested the closed and partially folded views, view
settings and four orientation choices. Samsung artwork was supplied by the owner
from https://developer.samsung.com/galaxy-emulator-skin.

## Observed behavior and implementation

| Surface | Reference | Current implementation |
| --- | --- | --- |
| Desktop layout | Device list, Metrics, large canvas; controls in header | Same three columns, independent scrolling and draggable/keyboard width handles |
| Mobile | Model selector, collapsible Metrics, bottom controls | Implemented, checked at 390×844 |
| Device navigation | Searchable grouped list with selected model | Android family tabs (All/Z/S/Tab/Note/A), collapsible series groups, cross-family search, active model on home and detail routes |
| Viewport | Scroll/drag pan, pinch zoom, +/−, 0 fit | Pointer pan/touch pinch, native wheel pan/Ctrl-wheel zoom, bounded 25–500% zoom, ResizeObserver fit |
| Orientation | Portrait, left/right landscape, upside down | All four view rotations; recorded Android insets are not relabeled as landscape captures |
| Fold | Closed/partial/open, arbitrary hinge | Presets and slider, eased three.js hinge, rigid outer panels, closed solid shell, reduced-motion support |
| Layers | Safe area/insets/reserved/corners | Independent legend toggles; Android cutout bounding region replaces iOS reserved regions |
| Settings | Frame, regions, dimensions, units | All switches plus Android dp/px and navigation mode |
| Measurements | Labels and clickable metrics | Whole metric rows and 2D/3D labels copy values; exact captured px is kept separately from rounded dp |
| Display metadata | Logical size, panel resolution, physical density and scale | Android adds Captured Window and Android Density so active WindowMetrics are not mislabeled as native panel resolution or physical PPI |
| Reserved regions | Size and four directional offsets | Android cutout bounds expose Size plus Left/Top/Right/Bottom distances in the same hierarchy |
| Data export | No observed per-device JSON download | Intentional Android-service divergence: a compact Export JSON action in the Metrics header downloads the complete versioned evidence payload |
| Artwork | Per-device frames | Official Fold8 main/cover, Flip8 main/cover and 28 S20–S26 variants aligned by original layout coordinates |

## Proportions and measurement correction

A display is mapped using its own logical width/height, preserving the ratio of
every inset to the screen. Official artwork is aligned using its display rectangle,
not its larger decorative background rectangle. The 3D plane includes annotation
margins in its aspect calculation; the solid chassis excludes those margins.

The legacy Fold8 main capture has `widthPx: 1248`, `heightPx: 1972`. Both navigation
captures match the COVER layout exactly. The official main layout is 2448×1848.
The previous renderer rotated 1248×1972 and treated it as the unfolded display;
that was a data classification error, not an orientation correction. The dated
recapture now supplies separate 1248×1972 cover and 2448×1848 landscape inner
measurements in both navigation modes. No legacy raw JSON was changed. Skin
dimensions never produce dp metrics/insets.

## Exact units and Android substitutions — 2026-09-23

Captured px and rounded dp are separate evidence. The px view uses raw
`currentWindowPx`, system-bar px, display-cutout px, rounded-corner px and cutout
bounds; it never multiplies rounded dp back by Android density. If any required raw
px field is absent, px mode is unavailable and the missing value stays pending.

`Resolution` means sourced physical panel resolution. `Captured Window` means the
active app/window extent recorded by InsetsProbe and can differ because of display
mode or a user/device override. `Physical Density` is reserved for sourced panel
PPI; `Android Density` and `Scale` report the logical density used for dp. These
extra rows are Android-specific substitutions needed to avoid presenting unlike
measurements as if they were the same safearea.info metric.

Fold/Flip routes fit the selected cover or inner display without clipping. While
Fit mode is active, the Zoom control keeps the open-display fit as its stable base
and a separate automatic scale interpolates the closed/open fits using the actual
rendered hinge angle. This follows the stable Zoom control observed on safearea.info
iPhone Duo in issue #2; Samsung endpoint normalization remains device-specific.
Explicit user zoom or pan leaves Fit mode, preserving the effective scale and pan
through pose changes. Fit to canvas restores automatic fit. Reduced motion applies
the hinge and scale endpoints together. `fit-transition.spec.ts` samples both the
rendered angle and CSS scale every animation frame on desktop and mobile.

## Verification

- `node --test tests/rendering.test.mjs`: 17 deterministic checks covering every
  animation degree, endpoints, exact raw px/dp/cutout evidence, safe-area px math,
  physical offset, closed chassis and official asset rectangles.
- Browser-driven Playwright/AX checks: desktop and 390px mobile layouts, device
  navigation, Metrics disclosure, dp/px settings, orientation, pose, keyboard +/0,
  official artwork loading and console errors. Metric rows report “Copied”; the
  WebGL cover-label test also reads back the exact displayed clipboard value.
- `pnpm test:visual` is the committed Chrome screenshot and interaction regression
  floor: 40 tests and 64 approved images cover desktop and 390px mobile, per-device
  JSON downloads, S25 Ultra
  navigation/unit/orientation combinations, Fold/Flip poses, exact px, real hinge
  interpolation, reduced motion, fit/manual zoom/pan behavior, keyboard Fit recovery
  and cover-label copy.
  Real two-finger touch gestures still need device testing; desktop synthetic wheel
  and keyboard checks do not prove hardware touch behavior.
- 2026-09-23 parity pass: Chrome checks at 1512×716 and 390×844 covered Fold8
  0°/90°/180°, Flip8 cover/90°/open, measured Fold7 0°/90°/180°, S25 Ultra exact px,
  gesture/3-button switching, 2×2 mobile legend, readable controls, full metric-row
  keyboard copy, automatic target-screen fit and stable manual zoom across Fold8's
  animated endpoint.
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

- **Device family tabs and collapsible groups** are an intentional navigation
  divergence. The Android catalogue has substantially more form factors and
  models than the reference. The dedicated A tab avoids a long scroll to its
  entries; groups begin with the active model's series open, can be toggled
  independently, and search shows matches across all families.
- **Export JSON** is an intentional product divergence from the observed
  safearea.info UI. Android consumers need exact probe dp/px, navigation-mode,
  display and provenance data outside the visual tool. The action stays secondary
  in the Metrics header on desktop and mobile so it does not reorganize the
  reference-shaped canvas controls. Its v1 contract and derivation boundaries are
  documented in `JSON_EXPORT.md`.
- Fold8/Flip8 cover and inner displays share one WebGL scene through folding.
  The cover uses the rigid rear-panel transform; applying the inner cylindrical
  bend to its annotation margins previously pulled it inside the opaque chassis.
  This caused Fold8's half-hidden cover and Flip8's stray band at 90°. Both were
  checked after the fix in Chrome. Samsung's 2D emulator skin and layout provide
  front artwork, a screen rectangle and button positions, but no side mesh. The
  unfolded panel depth-to-width ratio now uses published Fold8, Fold7 and Flip8
  physical dimensions (see README). Hinge curvature and the folded gap are still
  illustrative; the rendering is not a CAD-accurate side profile. See
  [Samsung's emulator skin guide](https://developer.samsung.com/galaxy-emulator-skin/guide.html).
- The S-series import adds 26 skins and 25 artwork-only catalogue entries. Existing
  S25-series specification/measurement entries take priority over skin previews.
  Unknown specifications and insets remain pending; skin pixels are not dp data.
- Downloaded Tab/Z/Note/A skins are registered: 123 archived models,
  115 public models after the 2020 release-year cutoff (see `DEVICE_COVERAGE.md`),
  with separate static main/cover previews where supplied. Fold/Flip models
  with a main skin have hinge animation; TriFold is excluded pending a separate
  decision. No measurements are borrowed across models.
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

## Fold2 animation verification (2026-09-22)

Enabled the shared book-fold renderer for the measured Galaxy Z Fold2 entry.
Pose presets and the 0–180° hinge slider now accompany Outer/Inner selection.
Display textures render only their front faces, and the inner annotation plane
is hidden when fully closed, preventing reversed cover labels at partial angles
and inner measurement margins leaking around the closed cover.

Verified in local Chrome through browser Playwright controls and screenshots:
Fold2 closed, 90°, open, hinge slider to 0°, plus closed/90° at 390×844.
Flip8 90° remains visually intact with the shared material change.
Typecheck, all 9 rendering tests, and static build pass. The browser logged an
existing hydration warning for an injected `cz-shortcut-listen` body attribute.
These pose angles are illustrative controls, not newly captured hinge measurements.

## Independent readability re-check (2026-09-23)

The earlier typography changes did **not** establish annotation readability:
Fold8's WebGL rulers still intersected the official frame, and radius chips had
no dimension construction. See [the issue 1 re-check](ISSUE_1_REVIEW.md) for the
confirmed defects, current fixes, historical dispositions and explicit validation
scope. Flat SVG and folded overlays share measured interval geometry;
SVG fit includes numeric badges rather than only the original box. The current
main frame-synchronized WebGL fold transition is preserved.

### Issue 1 follow-up: folding annotations

External WebGL texture rulers have been replaced by screen-space SVG rulers whose
attachment points use the device's current hinge transform and camera projection.
The labels and arrows remain flat and outside the projected body. Desktop Fit
includes these annotations. On narrow mobile viewports, a closed cover fits
the device body with breathing room; stacked cutout labels would otherwise
reduce the phone to a thumbnail. Some exterior labels require dragging the
canvas. Partially folded and open poses fit the projected rulers. Short measurements use adjacent badges rather
than diagonal leaders through the hinge. See `ISSUE_1_REVIEW.md` for the explicit
navigation/unit/pose/rotation matrix, integer-angle sweep and browser coverage.

The closed mobile view now uses more of the viewport for the official device skin.
Top corner-radius badges take the lane nearest the body; the display-width and
cutout lanes sit farther out and can pass behind the collapsed Metrics header,
as on the reference mobile view. Dragging the canvas reveals these measurements;
the metrics panel retains their numeric values. This is a visibility tradeoff of
the narrow viewport, not a missing measurement.
