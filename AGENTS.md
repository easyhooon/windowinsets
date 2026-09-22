# WindowInsets — Codex project guide

## Product goal

Build the Android equivalent of https://safearea.info: preserve its information
architecture, responsive behavior, diagram proportions, and direct manipulation.
Use Samsung device artwork rather than invented handset silhouettes. Improve the
existing device set before collecting more data or adding unrelated features.

Coverage decision (2026-09-22): all Samsung Galaxy models with official skins are
in scope when released in 2020 or later, regardless of discontinuation or flagship
status. This supersedes the earlier no-cutoff decision. Follow
the priority order in README: current S/Fold/Flip quality → Tab → Note and A.
Keep pre-2020 artwork archived but exclude it from public devices/routes. Check
new imports against `docs/DEVICE_COVERAGE.md`. TriFold remains a separate support/animation
decision, even when its skin is available. Artwork-only entries stay previews;
missing measurements must not be invented.

## Start here

- `docs/REFERENCE_PARITY.md`: observed reference behavior, implementation and QA.
- `docs/MEASUREMENT_WORKFLOW.md`: capture process, known RTL issues, corrections.
- `docs/DESIGN_HANDOFF.md`: original Claude visual backlog; see current status first.
- React Router framework mode, React, TypeScript, three.js; pnpm; static prerender.
- `pnpm dev`, `pnpm typecheck`, `pnpm build`, `node --test tests/rendering.test.mjs`.

## Non-negotiable data boundaries

- Raw files in `measurements/` are immutable evidence. Missing measurements stay
  null/pending. Skin pixel coordinates are artwork metadata, not measured insets.
- Fold8's legacy `main-*.json` captures are 1248×1972, matching the official COVER
  skin. The website classifies them as cover from this evidence; the original
  labels/files remain unchanged. Inner measurements are pending. Never rotate or
  stretch those cover values onto the inner display.
- Skin foregrounds depict physical cameras; DisplayCutout bounds describe an OS
  exclusion rectangle. Do not replace the artwork's camera with the bounds.
- View rotation rotates the recorded diagram; it does not invent landscape
  WindowInsets. Describe this in measurement conditions.

## Rendering and assets

- `app/components/DeviceView.tsx` owns view state and controls.
- `DiagramViewport.tsx` owns fit, pan, pinch, keyboard zoom and view rotation.
- `InsetsDiagram.tsx` uses SVG for flat displays; `FoldRenderer3D.tsx` uses a
  textured display plus a lit, closed chassis. `foldGeometry.ts` owns hinge math.
- `app/data/skins.ts` contains official asset rectangles. `public/skins/` keeps
  original Samsung images and emulator layout files with provenance. Body clips
  are illustrative, display rectangles come directly from the layout.
- Check desktop and mobile, Fold/Flip/bar, dp/px, closed/partial/open, controls,
  and no-data screens. Do not rely on a successful TypeScript build as visual QA.
- Keep motion reduced when requested by the OS; dispose GPU resources on unmount.

## Working conventions

- Write commit subjects and bodies in English using Conventional Commits.
  This repository rule overrides any global skill that requests Korean messages.
- Codex attribution is allowed. Include
  `Co-authored-by: Codex <codex@openai.com>` in Codex-assisted commits while
  preserving the configured human author identity.
- Split commits by coherent work. Rewrite published history only when explicitly
  requested, and use an explicit `--force-with-lease` to protect remote changes.
- Check the session service tier once; use Standard, never enable Fast unasked.
- Batch independent reads and representative validation. Avoid speculative guards.
- Korean frontend references in work artifacts use `프론트`.
- Documentation-only changes go directly to the requested branch rather than PR.
- No new device reservations or measurement claims without actual captures.
