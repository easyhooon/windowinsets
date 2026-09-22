# windowinsets.info

Window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy devices — with a source for every number.

## Inspired by safearea.info

This project exists because of [safearea.info](https://safearea.info). Seeing how clearly it lays out safe areas, reserved regions and the iPhone Duo fold animation for iOS made us wish the Android side had something just as useful — so we set out to build one, starting with Galaxy. Huge shout-out and thank you to its creator for the inspiration. 🙌

If you work on iOS, go check it out. If you work on Android, come help us fill in the devices.

## How we measure

The full write-up lives on the site at [/methodology](https://windowinsets.info/methodology) (source: [`app/routes/methodology.tsx`](app/routes/methodology.tsx)). In short:

- **Three source tiers.** Every value is `official` (published by Samsung/Google), `measured` (captured with InsetsProbe on a real device or Samsung Remote Test Lab, raw JSON committed here) or `community` (not yet reproduced). Each source shows the date it was checked.
- **Insets are measured, not published.** Samsung documents resolution and density, but not status/navigation bar heights, cutouts or corner radii, so we read them from Android itself with [InsetsProbe](tools/insets-probe).
- **Conditions are part of the data.** Portrait, full screen, default Display size / Font size / Screen resolution, one navigation mode (gesture or 3-button) per capture, and the One UI + Android version are all recorded. A value is only valid for those conditions.
- **Never estimated.** Nothing is interpolated from another device or derived from resolution alone. Unverified values are `null` and shown as **pending**.
- **Known limits.** One UI updates can change values; landscape and multi-window are not covered yet; a real app may see different insets if it adds its own padding or window flags.

Found a mistake or have a capture that disagrees with ours? Open an issue or pull request with your InsetsProbe JSON — a reproduction is as valuable as a new device.

## Measuring a device

Manufacturers don't publish insets, so we measure them with [InsetsProbe](tools/insets-probe) — a tiny Android app that dumps `WindowInsets`, `DisplayCutout`, `RoundedCorner`, `FoldingFeature` and the hinge angle as JSON. It works on a real device or on [Samsung Remote Test Lab](https://developer.samsung.com/remote-test-lab). See [tools/insets-probe/README.md](tools/insets-probe/README.md).

Put raw captures in `measurements/<device-slug>/<screen>-<navMode>.json` and reference them from the device's `Source` so anyone can re-check them.

## Stack

React Router (framework mode) with build-time prerendering (`ssr: false` + `prerender`), Tailwind CSS. Output is a static site.

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck
pnpm build      # prerendered HTML in build/client
```

## Adding a device

1. Create `app/data/devices/<slug>.ts` implementing `Device` (see `app/data/types.ts`).
2. Register it in `app/data/devices.ts`. Routes, sitemap and prerendering pick it up automatically.
