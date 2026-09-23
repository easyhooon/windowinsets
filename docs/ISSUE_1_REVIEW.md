# Issue 1: annotation readability and combination verification

2026-09-23. The follow-up replaces folded texture rulers with projected SVG
annotations. The previously outstanding hinge-leader congestion is addressed.
PR #5 links `Closes #1`; closure happens when the PR is merged.

## What changed

The original rulers used offsets from the display, so they crossed Samsung's
physical frame. Four isolated `9.9` values did not identify their radius intervals.
The flat SVG now uses official artwork bounds, outside dimension lanes, `R` labels,
corner construction brackets, extension guides and open arrowheads.

For folded views, only artwork, regions and their internal labels are textures.
External rulers are SVG projected from the same `bendPoint` / `rigidPanelPoint`
geometry and camera as the device. Their guides attach to the measured display
coordinates while their dimension lines and constant-size labels remain flat.
Measurement kinds occupy separate parallel lanes; short intervals keep their
endpoints, with their values immediately beside the arrows. There are no long
badge-to-ruler diagonal leaders crossing the hinge.

The outer display is annotated during the cover reveal (below the illustrative
60° view threshold), then the inner display. Metrics switch at that same rendered angle, rather than
waiting for the animation to finish. Only each screen's own recorded
measurements are used. These are captured flat-display dimensions, not new inset
measurements made at each hinge angle; perspective changes drawn lengths.

Automatic fit includes the projected chassis, artwork, dimension lines and badge
bounds. It converges before rendering each frame, including the nearly edge-on
Flip cover at 48°. Rotation and resize preserve the final annotation fit. Manual
zoom/pan remain manual, and `0` restores Fit. A touch regression found during this
review was also fixed: two simultaneous pointer movements now use the gesture's
starting distance and scale, so doubling finger separation doubles zoom.

Ruler values support pointer, Enter and Space copying. The native Samsung camera
artwork remains visible; an Android exclusion rectangle does not replace lenses.

## Historical findings: explicit disposition

| Finding from issue 1 | Disposition | Evidence |
| --- | --- | --- |
| Exact px preservation | Resolved | Node tests compare published geometry with immutable captures; browser checks distinguish S25 Ultra's 96 px inset and 1080×2340 captured window from 1440×3120 panel resolution. |
| Mobile Fold/Flip framing | Resolved | Fit includes the currently projected screen/chassis and rulers; the closed view has its own fit, followed through animation. |
| Mobile label clipping | Resolved | DOM bounds assertions cover the navigation/unit/pose/rotation matrix and every integer hinge setting, including the reproduced Flip 48° case. |
| Capture orientation semantics | Resolved | Source `captureOrientation` and `captureRotation` remain authoritative; view rotation is explicitly not a new landscape capture. Raw-evidence tests cover Fold7/Fold8 inner and cover separately. |
| PPI and resolution semantics | Resolved | Physical Density, Android Density, Resolution and Captured Window are separate fields; unsourced physical PPI stays pending. This does not claim new hardware-spec sourcing. |
| Reserved Regions completeness | Resolved | Cutout width/height, x/y and four edge distances are available; positive intervals have rulers. OS bounds are distinguished from physical lenses. |
| Hinge transition synchronization | Resolved | Metrics and projected dimensions use the same rendered-angle surface threshold; animation-frame and all-integer-angle tests compare the selected screen. |
| Mobile control readability | Resolved | Two-column, three-row fold controls show full values at 390 px; committed full-page screenshots cover the three poses. |
| Closed-cover direct manipulation | Resolved | Projected SVG values are semantic buttons; pointer/keyboard clipboard tests read back the displayed values. |
| Visual regression coverage | Resolved | Bar/Fold/Flip, two viewport sizes, units, navigation, rotations and poses are exercised; coordinate assertions supplement inspected screenshot baselines. |

## New differences found and fixed

| Severity and reproduction | Defect | Correction |
| --- | --- | --- |
| P1, Fold8 cover, desktop/390 px, 3-button/dp, Closed | Frame obscured rulers; four `9.9` chips had no visible radius meaning. | Exterior lanes, `R` prefixes and construction brackets. |
| P2, Fold/Flip, desktop/390 px, dp/px, partial fold | Texture labels and diagonal leaders bent through the hinge. | Projected SVG rulers with parallel lanes and nearby badges. |
| P2, Flip8, 390 px, 3-button/dp, 48° | A newly displaced cutout badge exceeded the initial fit bounds. | Fit converges after lane changes within the same frame. |
| P2, Fold/Flip, desktop/390 px, two-finger gesture | Batched pointer events lost part of the pinch scale change. | Calculate from the gesture's starting separation and zoom. |
| P2, Fold/Flip, both viewports, 60° to the opening endpoint | Metrics retained the cover after inner annotations appeared. | Share the rendered-angle surface threshold, including slider poses. |

## Camera geometry

`DisplayCutout` bounds provide width, height and distances from display edges.
Android can report multiple physical lenses as one exclusion region. The probe
also collects API 31+ `cutoutPath`, when supplied by the OS, including coordinate
space, fill type and approximation tolerance. Existing immutable captures have
not been retroactively populated. Individual lens diameters/spacing and missing
path captures remain explicitly unmeasured in the site, README and methodology.

## Integration

This branch was based on `fc3ae6a`, retaining the exact-pixel exports, current
capture catalogue and eased fold animation already in main. DP geometry divides
source pixels before formatting, avoiding asymmetric distances from intermediate
rounding. No raw measurement JSON or device catalogue was edited in this PR.
Unrelated local analytics, merge conflicts and Flip7 collection work were excluded.

## Reproducible checks

The primary layout matrix covers Fold2, Fold7, Fold8 and Flip8, both navigation
modes, dp/px, Closed/90°/Open and all four view rotations. Bar coverage includes
S25+ and S25 Ultra, both navigation modes, both units and all four rotations.
Each runs at desktop 1440×900 and mobile 390×844. The matrix first verifies the selected device matches its clean URL, then
asserts actual badge bounds are inside the viewport and do not overlap, rather
than accepting only a successful build or screenshot refresh.

A separate sweep exercises all 181 integer hinge settings on all four foldables,
plus region/layer/frame/dimension toggles. Transition tests cover intermediate
animation frames, pose changes, reduced motion, explicit zoom/pan, Fit
recovery and an artwork-only Fold6 with pending data. Browser-injected two-finger
touch input checks pinch scaling; clipboard contents are checked after keyboard
and pointer copying. These are automated desktop browser engines at two viewport
sizes, not a claim of testing every physical phone or OS touch driver.

The test configurations use installed Google Chrome plus Playwright Firefox and
WebKit runtimes. The cross-browser configuration builds and serves a fixed
production bundle, avoiding development-server reloads during frame sampling.
Set `PLAYWRIGHT_BASE_URL` to reuse an already running static server.
The static test server preserves clean device URLs and serves each prerendered
HTML file, matching production routing without HMR.

```sh
pnpm typecheck
pnpm build
node --test tests/rendering.test.mjs tests/annotations.test.mjs tests/device-export.test.mjs
pnpm exec playwright test
pnpm exec playwright install firefox webkit
pnpm exec playwright test --config playwright.matrix.config.ts
```

Type checking and the production build passed. The 28 Node tests passed.
The 62 Chrome behavior/screenshot tests passed against the static production
build, including the committed screenshot baselines. All 60 cross-browser matrix
tests passed (Chrome, Firefox and WebKit × desktop/mobile): 1,344 primary
navigation/unit/pose/rotation combinations and 4,344 integer-angle settings.
There were no failures or skipped tests in these final runs. The earlier
production-preview attempts served the wrong route HTML or redirected clean URLs;
those test-server artifacts were diagnosed separately and are not counted as passes.

## Review images

- [Flip8 at 90°, desktop](https://github.com/easyhooon/windowinsets/blob/codex/fix-inset-annotation-readability/tests/visual/__screenshots__/desktop/galaxy-z-flip8-partially-folded.png)
- [Flip8 at 90°, mobile](https://github.com/easyhooon/windowinsets/blob/codex/fix-inset-annotation-readability/tests/visual/__screenshots__/mobile/galaxy-z-flip8-partially-folded.png)
- [Fold8 cover, desktop](https://github.com/easyhooon/windowinsets/blob/codex/fix-inset-annotation-readability/tests/visual/__screenshots__/desktop/galaxy-z-fold8-closed.png)
- [Fold8 cover, mobile](https://github.com/easyhooon/windowinsets/blob/codex/fix-inset-annotation-readability/tests/visual/__screenshots__/mobile/galaxy-z-fold8-closed.png)
