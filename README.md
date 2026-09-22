# windowinsets.info

Window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy devices — an Android counterpart to [safearea.info](https://safearea.info).

## Data policy

- Every value carries a `Source` (`official` / `measured` / `community`) and the date it was checked.
- Inset values are only valid for the One UI / Android version and navigation mode (gesture / 3-button) they were measured on.
- Unverified values are `null` and shown as **pending**. Never estimate or derive a number without a source.

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
