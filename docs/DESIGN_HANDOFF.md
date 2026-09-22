# Design Handoff — Visual Polish Backlog

> **Codex status, 2026-09-22:** Product direction is full safearea.info parity for
> the current Android devices. See [REFERENCE_PARITY.md](REFERENCE_PARITY.md).
> Coverage priorities are recorded in [README.md](../README.md#device-coverage-and-priorities):
> current S/Fold/Flip quality → Tab → Note/A; all officially skinned models are in
> scope from release year 2020 onward. Older artwork stays archived; see
> [DEVICE_COVERAGE.md](DEVICE_COVERAGE.md). TriFold requires a separate decision.
> Official Samsung skins are now provided for Fold8/Flip8 and 28 S-series models; lit solid
> fold geometry, content-sized corner badges, responsive layout and SVG toolbar
> icons are implemented. OG artwork and favicon were replaced with the generated
> Android inset illustration and matching corner mark; see
> [brand assets](../design/brand/README.md). The historical notes below
> describe the pre-migration state. The former Fold8 rotation workaround was
> incorrect: its capture matches the official cover display, not the inner display.


**Purpose**: items below are things Claude (writing/maintaining this codebase) can build and wire up functionally, but can't take further without actual design work — new artwork, per-device skin assets, or a real pass on visual hierarchy/material feel. Compiled for handoff to a design-focused agent/person. Reference site throughout: **safearea.info**.

All of these are visual/asset polish only — no functional bugs are being tracked here.

---

## 1. OG share image + favicon look like placeholder shapes

- Files: `public/og-source.svg` (→ `og-default.png`, 1200×630), `public/favicon.svg` (→ `favicon-32.png`, `apple-touch-icon.png`)
- Currently hand-authored with basic primitives (rounded rects, circles, straight lines) via `rsvg-convert` — functional but reads as a placeholder, not a brand asset.
- **Ask**: a real illustrated/branded OG image and icon — something with actual visual identity, not a literal shrunk copy of the safe-area diagram's shapes.

## 2. three.js device animation — no per-device skin, thickness feels crude

- File: `app/components/FoldRenderer3D.tsx`
- This is the single most visible, most "should feel delightful" surface on the site (the folding animation), and right now it's the biggest gap versus safearea.info's own renderer:
  - **No per-device skin/material** — every device (Fold8, Flip8, future Fold6/7/Flip6) renders as the same flat plane with a single solid dark bezel color (`#334155`). No brand color, no camera-bump detail, no distinguishing "this looks like a Fold vs a Flip vs an S-series" visual identity. Real per-model skin textures (color, material, camera module shape) would need actual reference images per device — this is an asset problem, not a code problem.
  - **Thickness is a crude approximation** — implemented as a second dark "shell" mesh offset behind the front face along its surface normals (a cheap fake-depth trick), which reads OK at the hinge crease in Half-open but doesn't look like real glass/metal/frame construction the way safearea.info's renders do.
  - **No lighting/material response** — flat `MeshBasicMaterial` throughout (unlit), so there's no shading, specular highlight, or ambient occlusion cue that would sell the sense of a physical object.
- **Ask**: reference safearea.info's actual per-device rendering (skin colors/materials per model, lighting setup, camera module rendering) and either (a) supply real per-device skin assets/textures Claude can wire into the existing three.js scene, or (b) take over the renderer's material/lighting setup directly.

## 3. Numeric badges overflow their circular background

- Files: `app/components/InsetsDiagram.tsx` (corner-radius chips, ~line 279-298), `app/components/FoldRenderer3D.tsx` (`dot()` helper in `drawDiagram`, ~line 194-206)
- Corner-radius values are drawn as text centered inside a **fixed-radius circle** (`r={9}` in SVG / `rad = 9*px` in canvas). Values like `"40.18"` (5 characters) don't fit inside an 18px-diameter circle at the current font size — text visibly overflows/gets clipped past the circle's edge.
- Other chips elsewhere in the same files (the width/height dimension chips, inset value chips) already size their background to the text (`chipW = Math.max(20, label.length * 7 + 8)` in `DimensionLine`) — the corner-radius badges are the one spot that didn't get this treatment.
- **Ask**: reference how safearea.info sizes/shapes its own corner-radius badges (likely a pill/rounded-rect sized to content, not a fixed circle) and either supply the intended look for Claude to implement, or restyle these directly.

---

## Lower-priority tone/polish notes (secondary to the three above)

- **Decorative case chrome** (speaker grille + volume/power button marks in `InsetsDiagram.tsx`) — plain gray rectangles, reads as a sketch rather than a refined illustration.
- **Diagram fill palette** (`SAFE_FILL` green / `INSET_FILL` orange) — functional but straight off Tailwind's default palette; safearea.info's tones read calmer/more muted.
- **Toolbar typography & icons** — using raw Unicode glyphs (`▾`, `⚙`) instead of a proper icon set; font weight/spacing is a first pass, not a tuned system.

---

*Compiled 2026-09-22. Everything above is scoped to visual/asset polish — functional behavior (measurements, toolbar controls, zoom, rotation-correct fold silhouette, etc.) is already working and out of scope for this handoff.*
