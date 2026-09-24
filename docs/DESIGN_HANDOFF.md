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


## 공통 UI 설계 원칙 — 2026-09-24

> **대칭되는 부분의 길이가 같다면 하나만 표시하고, 다르다면 각각 표시한다.**

이 원칙은 특정 기종의 예외 처리가 아니라 전체 프론트 UI의 설계 기준이다.
일반 화면, 폴더블 커버·내부 화면, 태블릿, SVG·WebGL 대체 렌더링과
모든 화면 크기에 동일하게 적용한다. 아래의 과거 시각 개선 목록보다 우선한다.

- 같은 종류의 대칭 치수를 비교한다. 좌우·상하 인셋, 컷아웃의 양쪽 거리,
  모서리 반경이 해당한다. 서로 다른 의미의 치수는 숫자가 같다는 이유만으로
  합치지 않는다.
- 같고 다름은 반올림한 표시 문자열이 아닌 원본 측정값으로 판단한다.
  같은 값의 대표 표기에는 어느 위치들에 적용되는지 확인할 수 있는 문맥을 남긴다.
- 값이 다르면 양쪽 정보를 모두 제공한다. 화면을 단순하게 보이게 만들기 위해
  비대칭 치수를 숨기거나, 임의의 대표값으로 바꾸거나, 평균을 내지 않는다.
- 동일한 정보를 화면 안팎에 반복하지 않는다. 도면에는 필요한 치수와 관계를
  보여주고, Metrics에는 전체 방향별 값을 유지한다. 도면의 중복 제거가
  측정 데이터나 JSON 내보내기 내용을 바꾸어서는 안 된다.
- 가독성은 공통 정보 구조와 배치 규칙으로 해결한다. 특정 기종의 좌표 조정이나
  수치 숨김을 해결책으로 삼지 않는다. 도면·범례·컨트롤은 실제 공간을 나눠 쓰고,
  서로를 가리거나 불필요한 고정 여백 때문에 기기를 과도하게 축소하지 않는다.

**검수 기준:** 대칭 값이 같은 입력과 다른 입력을 모두 확인한다. 같은 경우는
대표 표기 하나만 남고, 다른 경우는 각 값이 모두 보존되어야 한다. 값이 표시상
같게 반올림되더라도 원본이 다르면 별도로 제공한다. 이 검증을 공통 치수 모델과
레이아웃에 적용하며, 스크린샷 한두 장이 깔끔해진 것만으로 완료를 판단하지 않는다.

구현 및 레퍼런스와의 의도적인 차이는
[REFERENCE_PARITY.md](REFERENCE_PARITY.md#shared-ui-and-symmetry-rules--2026-09-24)에 기록한다.

---

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
