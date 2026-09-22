# Brand assets — 2026-09-22

The OG illustration was generated with Codex's built-in image generation tool.
`og-android-source.png` is the original output. The production asset is
`public/og-android-v2.png` (1200×630 PNG); `og-default.png` is a compatibility copy.
Only resizing/format packaging was performed after generation, with macOS sips.
The illustrated device is conceptual brand artwork, not a measured CAD model.

The four-corner mark from the illustration was reproduced as a native SVG for
small-size clarity: `public/favicon-v2.svg`. PNGs are generated with rsvg-convert
at 32px and 180px. The legacy icon filenames and ICO are also updated. New metadata
uses versioned asset URLs; third-party preview caches may still require refreshing
after deployment. The original `public/og-source.svg` is retired and must not be
used to regenerate the current OG image.

## Reproduce production sizes

```sh
sips -z 630 1200 design/brand/og-android-source.png --out public/og-android-v2.png
rsvg-convert -w 32 -h 32 public/favicon-v2.svg -o public/favicon-v2-32.png
rsvg-convert -w 180 -h 180 public/favicon-v2.svg -o public/apple-touch-icon-v2.png
```

## Final generation prompt

Use case: ads-marketing. Create a finished premium Open Graph social sharing image for the real developer reference website windowinsets.info, the Android window insets and safe area atlas. Wide 1200x630 composition, ~1.905:1 aspect ratio. This is the final graphic with typography, not a screenshot or browser mockup. Elegant editorial product illustration with off-white warm paper background, extremely subtle fine engineering dotted grid. Left 48%: precise large bold dark graphite modern grotesk typography, text exactly on two lines: 'Window Insets' / 'for Android.' Smaller domain 'windowinsets.info' below with generous breathing room. Above headline a tiny mint geometric inset/corner-bracket emblem, no Android mascot or third party logos. Right 52%: beautifully art-directed realistic 3D studio render of an open graphite book-style folding Android phone, gentle three-quarter perspective, tangible satin metal edge and hinge, soft ambient shadows. The screens are a translucent mint safe region bounded by narrow warm apricot inset bands with restrained lilac cutout highlight near a tiny camera. A second thin translucent glass measurement plane floats slightly above one display, aligned in the same perspective, suggesting layered window insets. Fine sparse dark technical guide lines outside the device, no invented numerical measurements. Keep the phone and headline visually separated, comfortable 65px outer margins, everything inside frame. Quiet, precise, tactile, bright, editorial, striking at small sharing-preview size. Restrained mint/apricot/lilac from the actual service's legend. Typography must be flawless, large and clearly legible. Only the three exact text strings requested, no extra slogan, no tiny labels, no verification claims, no watermark, no heavy neon, no busy charts, no generic app icon collage. Background opaque.
