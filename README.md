# windowinsets.info

Window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy devices — with a source for every number.

## Inspired by safearea.info

This project exists because of [safearea.info](https://safearea.info). Seeing how clearly it lays out safe areas, reserved regions and the iPhone Duo fold animation for iOS made us wish the Android side had something just as useful — so we set out to build one, starting with Galaxy. Huge shout-out and thank you to its creator for the inspiration. 🙌

If you work on iOS, go check it out. If you work on Android, come help us fill in the devices.

## Data policy

- Every value carries a `Source` (`official` / `measured` / `community`) and the date it was checked.
- Inset values are only valid for the One UI / Android version and navigation mode (gesture / 3-button) they were measured on.
- Unverified values are `null` and shown as **pending**. Never estimate or derive a number without a source.

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
