# WindowInsets Measurement Workflow & Status

**Last Updated**: 2026-09-22

## Overview

windowinsets.info is a reference site for Android window insets, display cutouts, corner radii and foldable hinge states across Samsung Galaxy devices. Every value is labeled **official** (published by Samsung/Google), **measured** (captured with InsetsProbe on RTL or a real device, raw JSON committed), or **community** (unverified).

**Current Status**: Galaxy S25 Ultra, Galaxy Z Fold8, Galaxy Z Flip8 measured (main screen, both gesture + 3-button navigation). Galaxy S25, Fold6, Fold7, Flip6 still pending.

## RTL Credits & Cost

Confirmed directly from Samsung's official RTL FAQ (developer.samsung.com/remotetestlab/docs/2/faq):

- **"Is there a charge for using the Remote Test Lab service?"** → *"It's free of charge for Samsung Developer members."*
- **"What is the Credit?"** → *"The Credit is needed to reserve a remote device on the Remote Test Lab (1 Credit = 15 min.)"*
- **"How can I get the Credit?"** → *"You can get 20 Credits once a day by signing in the Remote Test Lab web site."*

**No paid credit purchase option exists.** RTL is free for Samsung Developer members with a fixed **20 credits/day (= 5 hours), resetting once every 24 hours by signing in.** There is no way to buy more the same day.

**Pacing**: a full manual capture (main screen, 3-button + gesture) costs ~2 credits (30 min reservation) in practice. At that rate, **up to ~10 devices per day** can be measured within the free daily allowance. Plan device order accordingly — measure the highest-priority/newest devices first each day.

Other notes:
- Closing/losing the RTL WebClient session triggers a full device restart (~1–2 min) before it can be reserved again — avoid closing mid-task.
- The WebClient opens in a new browser window that browser-automation tools (Claude in Chrome, etc.) cannot see or control, regardless of who clicks "Start" — it's outside the extension's tracked tab group and doesn't go through `window.open()` in an interceptable way. The physical device session is inherently a human-operated step; automation can drive the reservation/list pages but not the live device view itself.

## Two Confirmed Platform Limitations (Not Bugs)

These looked like automation bugs at first but are real Android/Samsung platform behavior, confirmed by re-testing after fixing the actual code bugs:

1. **Cover screen can't be captured separately from Main.** InsetsProbe's "Cover/Main" radio buttons are just a label the person taking the measurement picks — RTL's remote view only ever exposes ONE active display (whichever one is currently shown), so a "cover" capture and a "main" capture taken back-to-back on the same RTL session return byte-identical `display`/`insets` data. Confirmed on both Fold8 and Flip8: `cover-threeButton.json` and `main-threeButton.json` had identical `widthPx`/`heightPx`/`insets`, just different `"screen"` label strings. **Cover-screen data can only come from someone with a physically folded real unit**, not RTL. All current foldable device entries leave `screens[cover]` as `null`/pending for this reason (see comment in `galaxy-z-fold8.ts`).

2. **`Settings.Secure.putInt(navigation_mode, ...)` is silently ignored on real Samsung hardware.** This was suspected from the start (there was already a code comment about it) and got compounded by a real bug (see below), but even after fixing the bug, a fresh timestamped re-test on Fold8 still came back `"navigation.mode": "threeButton"` after requesting gesture mode programmatically. **There is no way to switch navigation mode from InsetsProbe on real Samsung hardware.** Gesture-mode captures require a human to manually switch it via **Settings → Display → Navigation bar → Swipe gestures**, then tap the individual **"Measure"** button (not "Measure All") once.

## Fixed Bugs (for real, unlike #2 above)

### Bug 1: `measureAll()` never actually changed nav mode

The nav-mode RadioGroup's `onCheckedChangeListener` guarded `setNavMode()` behind `!measureAllInProgress` — which is `false` for the *entire* automated run, so the guard silently skipped every `setNavMode()` call during Measure All. Combined with limitation #2 above, this meant every "gesture" capture actually stayed in whatever mode was already active, and since `export()` names files from the *actually captured* mode (not the requested one), both mode-passes for a screen collided on the same filename and silently overwrote each other — which is why early runs produced only 2 files instead of 4.

**Fix**: call `setNavMode()` explicitly in the automation loop instead of relying on the guarded listener.

### Bug 2: Fixed-delay timing instead of a real completion signal

Originally used a guessed fixed delay (300ms, later 600ms) before exporting. Per review feedback ("isn't there a callback for this?") — yes: `ViewCompat.setOnApplyWindowInsetsListener` already fires on every real insets change. Reworked `measureAll()` to arm a `pendingModeCheck` hook invoked from that listener, so it reacts the instant `Probe.modeFromInsets(latestInsets)` matches the requested mode, with a 3-second timeout `Runnable` (properly cancelled via `removeCallbacks` once confirmed) as a safety net for limitation #2.

### Bug 3: FoldPreview's 3D fold animation sometimes rendered flat

The CSS `rotateY`/`rotateX` transform was verified correct via devtools (`getComputedStyle`), but screenshots after a slider interaction sometimes still showed the pre-interaction flat frame — a Chromium compositor-layer-promotion quirk with CSS 3D transforms that update after first paint. **Fix**: added `will-change: transform` to the rotating panels, forcing them onto their own compositor layer so updates are reliably repainted.

### Bug 4: InsetsDiagram SVG letterboxed the phone shape smaller than it should be

The `<svg>` had `className="w-full max-w-lg"` (fills container width) **and** `style={{maxHeight: 420}}` independently — when the resulting box's aspect ratio didn't match the `viewBox`'s real device ratio, the content got centered/shrunk (letterboxed) inside a mismatched box, making the phone look artificially small with lots of surrounding whitespace. **Fix**: size the SVG by height with `width: "auto"`, so the element's own box matches the content's true aspect ratio instead of stretching to fill available width.

## Complete Measurement Workflow

### Step 1: Reserve Device on Samsung RTL

1. Go to [developer.samsung.com/remote-test-lab](https://developer.samsung.com/remote-test-lab)
2. Click "Get Started" → log in with Samsung Developer account
3. Browse devices, select target
4. Click device → set duration (**30 min / 2 credits is enough** — don't over-reserve)
5. Click "Start" in the reservation dialog (a human must watch/operate the resulting WebClient window — see limitations above)

### Step 2: Install InsetsProbe APK

1. Build APK from `tools/insets-probe`: `./gradlew assembleDebug` → `app/build/outputs/apk/debug/app-debug.apk`
2. Upload APK to RTL, tap "Install", wait for completion

### Step 3: Capture Measurements

Given limitation #2, **"Measure All" only reliably captures 3-button mode** (both its "cover" and "main" passes will be identical main-screen 3-button data, per limitation #1 — only one of them is worth keeping).

Practical sequence per device:
1. Open InsetsProbe, tap **"Measure"** once (default 3-button state) → 1 file
2. Manually switch **Settings → Display → Navigation bar → Swipe gestures**
3. Return to InsetsProbe, tap **"Measure"** once again → 1 file (gesture)
4. That's 2 files per device (main screen only, both nav modes) — cover screen stays pending

### Step 4: Export & Commit Data

1. Files download via the RTL WebClient's file transfer (browser downloads, e.g. to `~/Downloads/content`, `content (1)`, etc. — same filename repeated, browser auto-numbers them)
2. Save to `measurements/<device-slug>/main-<threeButton|gesture>.json`
3. Create `app/data/devices/<slug>.ts` implementing `Device` (see an existing foldable/bar example)
4. Register in `app/data/devices.ts` (newest release year first)
5. `pnpm typecheck && pnpm build` to verify, then commit and push

## Device Status & Progress

| Device | Model | Screens | 3-Button | Gesture | Status |
| --- | --- | --- | --- | --- | --- |
| Galaxy Z Fold8 | SM-F971N | Main only (cover: RTL can't capture it separately) | ✓ | ✓ | Complete |
| Galaxy Z Flip8 | SM-F776B | Main only | ✓ | ✓ | Complete |
| Galaxy S25 Ultra | SM-S938N | Main | ✓ | ✓ | Complete |
| Galaxy S25 | SM-S931N | Main | Pending | Pending | Queued |
| Galaxy Z Fold7 | TBD | Main | Pending | Pending | Queued |
| Galaxy Z Fold6 | TBD | Main | Pending | Pending | Queued |
| Galaxy Z Flip6 | TBD | Main | Pending | Pending | Queued |

**Measurement Conditions** (all captures): Portrait, full screen, default Display/Font size, One UI + Android version recorded per capture, dp = px ÷ (densityDpi ÷ 160) rounded to 2 decimals.

## InsetsProbe App: Architecture

**Location**: `tools/insets-probe/`

- **WindowInsets Reader / DisplayCutout Parser / RoundedCorner Support / FoldingFeature Tracking** — see `Probe.kt`. Also captures `displayCutout.boundingRects` (the cutout's real x/y/width/height, not just how far it intrudes) — used by the website to draw the actual punch-hole position (see below).
- **Navigation Mode Toggle**: UI-only convenience; does **not** reliably change the real system nav mode on Samsung hardware (limitation #2).
- **Measure All**: now uses `Probe.modeFromInsets()` (public) + the real `OnApplyWindowInsetsListener` callback for completion detection, not a fixed delay. See `MainActivity.kt`.

## Data Flow: Device → JSON → TypeScript → Website

1. **InsetsProbe** exports raw JSON (schemaVersion 1) with device/display/navigation/insets/displayCutout/roundedCorners/hinge.
2. **Raw JSON committed** to `measurements/<device-slug>/<screen>-<navMode>.json` — source of truth, never hand-edited.
3. **TypeScript device file** (`app/data/devices/<slug>.ts`) implements `Device` (see `app/data/types.ts`): dp-converted insets per nav mode, `cornerRadiiDp`, optional `cutoutShape` (real punch-hole position, when the raw capture has `boundingRects`), sources with GitHub links.
4. **Website**: React Router, statically prerendered. Device pages show:
   - `InsetsDiagram` — flat 2D diagram with dimension lines/arrows, per-edge inset chips, corner-radius chips, the real cutout shape at its measured position, and schematic (unmeasured) speaker/button marks for visual recognizability.
   - `FoldPreview` — 3D CSS-transform hinge animation (foldables only) driven by the same hinge-angle convention as Android's `FoldingFeature` (0°=closed, 180°=flat). `axis="vertical"` for book-style folds (Z Fold), `axis="horizontal"` for flip-style (Z Flip). Inset value labels live inside the rotating panels so they stay visible and correctly foreshortened throughout the animation.
   - `Metrics` panel — one value per row (Dimensions / Safe Area Insets / Display Cutout / Corner Radii / Measured On), not cramped multi-value lines.

## SEO / Sharing

`app/lib/seo.ts` provides a shared `pageMeta()` helper used by all 4 routes: full OG + Twitter Card tags (title, description, type, site_name, image + dimensions/alt, canonical), following safearea.info's pattern. **`og-default.png` (1200×630) itself is not generated yet** — deferred until image-generation tooling is available (planned for when Codex quota is back). The favicon is also still the default `public/favicon.ico`.

## Build Verification

`vite.config.ts` defines `__BUILD_COMMIT__` from `git rev-parse --short HEAD` at build time. It's exposed only as a `data-build-commit` attribute on the root `<div>` in `shell.tsx` — **not shown in the UI** — inspect via view-source/devtools to confirm you're not looking at a stale cached page after a deploy.

## Best Practices / Data Quality Checklist

- Never estimate a value — leave `null`/pending until actually measured.
- `logicalSizeDp × densityDpi` should be internally consistent with `resolutionPx` (`dp = px ÷ (densityDpi ÷ 160)`).
- Insets need all 4 sides (even if 0); `formFactor` is `"bar" | "foldable-book" | "foldable-flip"` (not `"phone"`).
- `cornerRadiiDp`: all four corners or omit (`null`) entirely.
- Source tier: `official` only for published specs; `measured` for RTL/device captures; `community` for unreproduced submissions.
- Run `pnpm typecheck && pnpm build` before committing device data changes — the build's prerender step will fail loudly on a malformed `Device`.

## Codex Migration Notes

### Why Claude in Chrome was used here

RTL's device list/reservation pages are ordinary web pages (browser automation handles them fine: navigate, click, form-fill, screenshot). The **live device view is a separate, human-operated step** no browser-automation tool here could see or control — confirmed by intercepting `window.open` (nothing captured) and by testing whether *my own* click on Start produced a controllable popup (it didn't either — the popup mechanism itself is outside the tracked tab group regardless of who triggers it, likely a dynamically-created `<a target="_blank">` rather than a `window.open()` call).

### Codex Equivalents

| Capability | Claude in Chrome | Codex Equivalent |
| --- | --- | --- |
| Browser automation (navigate/click/form-fill) | `computer()`, `navigate()`, `form_input()` | Similar Codex browser tools — works fine for RTL's list/reservation pages |
| Live device view | **Not controllable by either** | Same limitation applies — a human must operate the actual phone screen |
| File retrieval | Browser downloads (numbered duplicates: `content`, `content (1)`, ...) | Same pattern — read files the human downloads and forwards |

### File Paths to Reference

- `tools/insets-probe/app/src/main/java/info/windowinsets/probe/{MainActivity,Probe}.kt` — capture + automation logic
- `app/data/types.ts` — `Device`, `Screen`, `InsetsMeasurement`, `CutoutShape`, `FormFactor`
- `app/data/devices/galaxy-z-fold8.ts` — most complete example (foldable, both nav modes, cutout shape, pending-cover comment)
- `app/components/{InsetsDiagram,FoldPreview}.tsx` — the two visualization components
- `app/lib/seo.ts` — shared OG/Twitter meta helper
- `app/data/devices.ts` — device registry, newest-first

### Recommendations

1. Keep RTL's list/reservation-page automation in whatever agent is driving it — the pages themselves are ordinary web automation targets. Don't try to make the live device view unattended; it structurally requires a human.
2. Preserve the "measure 3-button, manually flip Settings, measure gesture again" 2-step pattern per device — Measure All's automation value is now just the screen-radio convenience, not nav-mode switching (which doesn't work on real hardware regardless of code).
3. Budget ~2 credits (30 min) per device; ~10 devices/day is the real ceiling under the free 20-credit daily allowance.
4. When adding a device, always run `pnpm typecheck && pnpm build` — malformed `Device` objects fail the prerender step loudly, which is the fastest signal something's wrong before it reaches production.
