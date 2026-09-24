# Samsung Galaxy Emulator Skins

Source: https://developer.samsung.com/galaxy-emulator-skin
Provided by the project owner from official downloads on 2026-09-22.
Original PNGs and layout files are preserved. Artwork belongs to Samsung.
The app clips the decorative background in the renderer. Screen rectangles come
from each layout file; body clipping rectangles are illustration coordinates.
These assets provide appearance only, not One UI behavior or measured insets.

## S-series import, 2026-09-22

All 28 supplied S-series models are available: S20 (base/Plus/Ultra/FE),
S21 (base/Plus/Ultra/FE), S22 (base/Plus/Ultra), S23 (base/Plus/Ultra/FE),
S24 (base/Plus/Ultra/FE), S25 (base/Plus/Ultra/Edge/FE), and
S26 (base/Plus/Ultra/FE). Each model uses the color selected in its original layout.
Previously imported S25+ and S25 Ultra are preserved; 26 new skins were copied.

`scripts/import-samsung-skins.py /path/to/downloads` imports the ZIPs without
modifying Downloads or recompressing images. Per-model `source.json` records the
archive and original image names for this batch. The importer handles the S21
Ultra foreground filename's casing mismatch. Existing entries are not replaced.

Artwork-only catalogue entries have no inferred release dates, resolution,
density, dp sizes, corner radii or insets. The layout display rectangle controls
preview proportions only. Body crop radii describe illustration clipping, not
Android RoundedCorner measurements.

## Remaining downloads registered, 2026-09-22

Added 51 screen assets for the remaining Tab and Fold/Flip downloads. The full
archive contains 73 models: 28 S, 30 Tab, 8 Fold and 7 Flip. Public coverage
starts at release year 2020, with a Fold/Flip exception: 71 models (28 S, 28 Tab,
8 Fold, 7 Flip). Tab S4 and Tab S6 remain archived; the original Fold is public
through `app/data/coverage.ts`. See `docs/DEVICE_COVERAGE.md` for release sources. TriFold remains
excluded pending the separate product decision. No Note/A phone ZIPs were found.

Folded/Cover folders map to `cover`; Unfolded/Main folders map to `main`. Some older
Flip ZIPs supply only the main display; no cover artwork is invented. Tab S4 10.5
has no foreground mask and renders without one. Tab S6's layout names a missing
Black background; the supplied Grey image is used and recorded in `source.json`.
Original layout files are retained, including that filename discrepancy.

Registration provides static previews. New animation work and RTL measurements
are separate. Body crops are illustrative and can be refined per device without
changing the authoritative layout display rectangles.
