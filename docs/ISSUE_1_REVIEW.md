## Integrated release validation (2026-09-24)

This supersedes the incomplete shared-UI run below. A stable production build
passed 107 of 112 Chrome cases; the five failures exposed prerendered model-name
hydration mismatches (three cases) and the obsolete transparent-canvas backup
expectation (two cases). The shell now uses route params for initial selection,
and real WebGL context loss exercises the explicit SVG fallback.

After those corrections, all 16 focused desktop/mobile cases passed against an
isolated production build, including the new JavaScript-disabled initial-HTML
checks. All 39 Node tests, typecheck, production build and diff whitespace checks
passed. The full 112-case run was not repeated after these targeted fixes.
Updated screenshot baselines and both 143-frame README GIFs were visually inspected.
Concurrent device-catalogue imports are outside this revision.

## Shared UI follow-up (2026-09-24)

The user's request is a shared UI improvement, not device-by-device annotation
patches. The earlier non-overlap verdict did not cover information hierarchy,
redundancy, canvas allocation or consistency between renderers.

The final rule is: **equal symmetric lengths appear once; unequal lengths all
remain**. It covers opposing insets, opposing cutout offsets and corner radii.
The preliminary blanket removal of cutout offsets was rejected and superseded.
A shared annotation renderer/layout serves flat, folding and fallback views.
See `REFERENCE_PARITY.md` for the policy and intentional differences.

The workspace uses real layout space for the diagram, legend and controls;
Fit no longer guesses mobile/footer reserves. The bottom toolbar sizes to its
content, Metrics has a clear heading and secondary export action, its mobile
disclosure preserves the canvas size, and pending artwork has one status area.
These changes apply through common components rather than per-device branches.

### Follow-up validation scope

- `pnpm typecheck`, `pnpm build`, and all 37 Node tests passed for the shared-UI
  revision before concurrent fold-geometry work entered the workspace.
- The final static-build browser run recorded 93 passes and 11 failures; it is
  **not** an all-pass result. Earlier overlay-reserve assertions were replaced
  with actual canvas bounds. Disabled, unmeasured layers are checked for absent
  rulers instead of being clicked.
- A separate final integer-angle run passed all eight desktop/mobile tests
  (four foldable fixtures, every angle from 0° through 180°).
- A Fit recovery test sampled zoom before iterative fitting settled. Its
  stability wait was corrected, but its repeat run could not complete after
  another build removed the shared static output; remaining pages returned
  `Not found`. Repeat the complete browser suite against an isolated stable build
  after the concurrent work is integrated.
- Concurrent changes to `foldGeometry.ts`, `FoldRenderer3D.tsx` and rendering
  tests are preserved. The passing build and Node results above do not validate
  that newer geometry revision. Screenshot baselines were visually inspected
  for the shared-UI build; they may need regeneration for the newer geometry.

The report below is historical evidence, not a fresh independent Astra audit.

# Issue 1: annotation readability and combination verification

## Correction after the merged release (2026-09-23)

The prior "Mobile Fold/Flip framing: Resolved" and visual-regression claims were
too strong. The merged Fold8 mobile screenshot could show only SVG rulers while
the WebGL device was absent; desktop showed a very small device. The previous
matrix asserted ruler badge geometry but did not assert that **the composed
page actually painted a device**, and used desktop-browser mobile viewports at
device scale factor 1. Passing it was not proof of safearea.info visual parity.

The follow-up reduces unused transparent margins in the 3D textures, makes
closed-cover mobile Fit use the device body rather than distant exterior badges;
partially folded/open poses fit the projected rulers. Some closed-cover labels
extend beyond the initial mobile viewport and remain reachable by drag. A flat
copy of the cover/open texture sits behind the WebGL canvas at planar endpoints
only, avoiding a doubled phone at intermediate angles. A context
construction failure or loss switches to the existing SVG diagram. The new
mobile test samples pixels from the rendered screenshot at 390 px / DPR 3,
including a transparent WebGL surface and a blocked WebGL context. This checks
for a substantial visible safe-area width rather than the presence of labels.
It is still browser emulation, not a claim of a verified physical Samsung phone.
Fold8, Fold7 and Flip8 now scale unfolded panel depth from Samsung's published
body dimensions; the skin supplies no hinge cross-section, so folded and
intermediate side shapes remain illustrative. See the README for sources.
The live site's deployment and a physical-device check must be evaluated
separately after this correction is merged.

The merged follow-up was verified on the live site with a 390 px / DPR 3 Chrome
capture. A further visual comparison with safearea.info found that its closed
mobile device occupies more of the canvas. The subsequent framing adjustment
enlarges the Fold/Flip body and gives top corner-radius labels the nearest
exterior lane. The reference mobile view also masks some more distant labels
under its collapsed Metrics header; those values remain available in Metrics
and can be exposed on the canvas by dragging. This comparison is browser
emulation and does not establish physical-device parity.

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
