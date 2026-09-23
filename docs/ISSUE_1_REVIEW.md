# Issue 1: annotation readability review

2026-09-23. This PR addresses the user's highest-priority readability request and
links issue 1 for closure on merge, as requested. It does not claim pixel-perfect
reference parity at every intermediate hinge angle.

## Confirmed defect and correction

Dimension rulers used fixed offsets from the display instead of the Samsung skin
body. On Fold8's cover they crossed the frame, and four isolated `9.9` chips did
not explain what was measured. SVG and WebGL now share body-relative ruler lanes:
whole display size, insets, cutout bounds/distances and corner radii. Radius badges
say `R 9.9` and include construction brackets, extension guides and interval arrows.
Short intervals keep their actual length; displaced badges have leaders and
collision avoidance. Canvas texture margins and the camera leave room for them.
Rotated capture artwork uses rotated body bounds when positioning rulers. Closed
cover rulers include the larger folded chassis silhouette as well as its artwork.
WebGL label sizing follows the actual fitted zoom, avoiding enlarged/clipped
mobile badges when the closed fit differs from the toolbar zoom.

Additional fixes include independent SVG corner arcs, keyboard/click copying of
SVG rulers, instance-scoped clip IDs, bottom-band labels placed away from camera
cutouts, and mobile controls with enough rows for complete pose labels. Flat SVG
fit measures the actual badges, including their zoom-compensated size.

## Integration with current main

The original local checkout preceded the exact-pixel data, JSON exports and
frame-synchronized fold-fit changes now in main. This PR was integrated separately
on `fc3ae6a` to preserve those changes. It uses the existing exact pixel fields;
there is no second capture catalogue and no raw measurement or device-data edits.
DP geometry derives from those fields without rounding until display, preventing
asymmetric cutout distances caused by subtracting rounded DP values. Cutout rulers
also use the existing exact-pixel formatter.

The current main's eased WebGL fold transition, reduced-motion handling,
frame-synchronized fit, measured data and export workflow remain in place.
Unrelated local analytics and Flip7 capture work are excluded.

## Validation and limits

- Typecheck and production static prerender build.
- Node rendering, device-export and annotation regression tests.
- Chrome desktop/mobile review of representative bar, book-fold and flip screens.
- Existing mobile fold-transition tests, including manual zoom and reduced motion.

Geometry tests check that ruler intervals match their lengths and clear official
skin bodies. A regression test covers packing short labels in small textures;
a float-boundary loop was fixed with an explicit positive gap.

Perspective can still crowd leaders near a partially folded hinge. This remains a
visual limitation, and the full cross-browser, touch-hardware and arbitrary-angle
matrix is not claimed. Screenshot baselines are refreshed for the exterior ruler arrangement; representative
desktop/mobile screenshots were inspected directly, not just accepted by a build.
