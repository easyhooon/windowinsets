# WindowInsets Measurement Workflow & Status

**Last Updated**: 2026-09-22

## Overview

windowinsets.info is a reference site for Android window insets, display cutouts, corner radii and foldable hinge states across Samsung Galaxy devices. Every value is labeled **official** (published by Samsung/Google), **measured** (captured with InsetsProbe on RTL or a real device, raw JSON committed), or **community** (unverified).

**Current Status**: Galaxy S25 Ultra measured (both gesture + 3-button navigation). Fold8, Flip6, S25 awaiting measurement via Samsung Remote Test Lab (RTL).

**Efficiency Problem Solved**: Manual RTL measurement was projected to take 1 month for all Galaxy models. Solution: Built "Measure All" button into InsetsProbe to automate sequential capture of all screen/navigation combinations in one click, reducing per-device time from ~20 min to ~2 min.

## Complete Measurement Workflow

### Step 1: Reserve Device on Samsung RTL

1. Go to [developer.samsung.com/remote-test-lab](https://developer.samsung.com/remote-test-lab)
2. Click "Get Started" → log in with Samsung Developer account
3. Browse devices, select target (e.g., Galaxy Z Fold8 SM-F971N_KR1)
4. Click device → set duration (23 min sufficient for 4 captures)
5. Click "Start" in the reservation dialog

### Step 2: Install InsetsProbe APK

1. Build APK from `tools/insets-probe` (Android Studio or `./gradlew assembleDebug`)
2. Once session starts, upload APK to RTL
3. Tap "Install" on the device control panel
4. Wait for installation to complete

### Step 3: Run "Measure All" Button

1. Open InsetsProbe app on device
2. App shows two RadioGroups: Screen (Phone/Cover/Main) and Navigation (3-Button/Gesture)
3. Click "Measure All" button
4. App automatically captures 4 JSON files sequentially:
   - cover-threeButton.json
   - cover-gesture.json
   - main-threeButton.json
   - main-gesture.json
5. Each file is saved to app-specific external storage, with 1000ms delays between switches

### Step 4: Export & Commit Data

1. Use RTL file browser or adb to access `/data/data/info.windowinsets.probe/files/`
2. Download all 4 JSON files to `measurements/<device-slug>/`
3. Create device TypeScript file at `app/data/devices/<slug>.ts` implementing `Device` interface
4. Register device in `app/data/devices.ts`
5. Commit and push to GitHub

## Device Status & Progress

| Device | Model | Screens | 3-Button | Gesture | Status | Files |
| --- | --- | --- | --- | --- | --- | --- |
| Galaxy S25 Ultra | SM-S938N | Main | ✓ | ✓ | Complete | [main-threeButton.json](https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-ultra/main-threeButton.json), [main-gesture.json](https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-ultra/main-gesture.json) |
| Galaxy Z Fold8 | SM-F971N | Cover + Main | Pending | Pending | Next | — |
| Galaxy Z Flip6 | SM-F731N | Cover + Main | Pending | Pending | Queued | — |
| Galaxy S25 | SM-S931N | Main | Pending | Pending | Queued | — |
| Galaxy Z Fold7 | TBD | Cover + Main | Pending | Pending | Optional | — |

**Measurement Conditions** (all captures):
- Portrait orientation, full screen
- Default Display size, Font size, Screen resolution
- One UI 8.5, Android 16
- Density: 450 dpi (S25 Ultra)
- Computed dp = px ÷ (densityDpi ÷ 160), rounded to 2 decimals

## InsetsProbe App: Architecture & Automation

**Location**: `tools/insets-probe/` (monorepo)

### Key Features

- **WindowInsets Reader**: Captures all system inset types using Android Window Insets API
- **DisplayCutout Parser**: Records safe insets, bounding rectangles, waterfall insets
- **RoundedCorner Support**: All four corner radii with density-independent conversion
- **FoldingFeature Tracking**: Foldable state, orientation, occlusion bounds + hinge angle sensor
- **Navigation Mode Toggle**: RadioGroup switch between 3-Button (mode=0) and Gesture (mode=2)
- **JSON Export**: Raw output (never hand-edited) with metadata: device model, Android version, One UI version, densityDpi, defaultDensityDpi, fontScale

### "Measure All" Button (NEW)

Implemented in `MainActivity.kt:132-158`:

```kotlin
private fun measureAll() {
    measureAllInProgress = true
    val screens = listOf(ID_COVER, ID_MAIN)
    val modes = listOf(ID_THREEBUTTON, ID_GESTURE)
    var delay = 0L

    for (screenId in screens) {
        for (modeId in modes) {
            root.postDelayed({
                screenGroup.check(screenId)
                navModeGroup.check(modeId)
                root.postDelayed({
                    val file = export()
                    if (file != null) Log.i(TAG, "Saved: ${file.name}")
                }, 300)
            }, delay)
            delay += 1000
        }
    }

    root.postDelayed({
        measureAllInProgress = false
        Toast.makeText(this, "Saved 4 measurement files", Toast.LENGTH_LONG).show()
    }, delay + 500)
}
```

**Automation Logic**:
1. Loops through screens (Cover, Main) and modes (3-Button, Gesture)
2. Sequential delays: 1000ms between each switch
3. Each switch waits 300ms for insets to stabilize before export
4. Files saved as `<screen>-<mode>.json` (e.g., `cover-threeButton.json`)
5. `measureAllInProgress` flag prevents manual nav mode changes during automation

### Navigation Mode Switching

```kotlin
private fun setNavMode(mode: Int) {
    runCatching {
        Settings.Secure.putInt(contentResolver, "navigation_mode", mode)
        Log.i(TAG, "Set navigation_mode to $mode")
    }.onFailure { Log.e(TAG, "Failed to set navigation_mode", it) }
}
```

Mode values:
- `0` = 3-Button (back, home, recents)
- `2` = Gesture (system gestures with side swipe zones)

## Data Flow: Device → JSON → TypeScript → Website

### Stage 1: InsetsProbe Exports JSON

InsetsProbe collects via Android Window Insets API and exports raw JSON with all metadata.

### Stage 2: Raw JSON Committed

Files saved to GitHub at `measurements/<device-slug>/<screen>-<navMode>.json`:
- Raw, unedited JSON (source of truth)
- Linked from TypeScript device files for traceability
- File name format: `main-gesture.json`, `cover-threeButton.json`

### Stage 3: TypeScript Device Definition

Example: `app/data/devices/galaxy-s25-ultra.ts`

Device data structure with:
- Slug, name, release year, form factor
- Display specs: size, resolution, density
- Insets per navigation mode with source attribution
- dp conversions from raw px values

**Key Conversions**:
- px → dp: `dp = px ÷ (densityDpi ÷ 160)`
- Example: 153px at 450dpi = 153 ÷ 2.8125 = 34.13 dp
- Always round to 2 decimals

### Stage 4: Website Display

- React Router statically prerendered to HTML
- Device pages at `/<slug>` show insets with source tier badges
- Methodology page at `/methodology` explains measurement conditions
- All values link to their raw JSON source in GitHub

## Best Practices & Optimization

### Workflow Optimization

**Before** (Manual, ~20 min per foldable device):
1. Manually navigate Settings to toggle navigation mode
2. Capture each screen individually with "Measure" button
3. Export 4 times (copy/paste via UI)
4. Manual file renaming and transfer

**After** ("Measure All" automation, ~2 min per device):
1. One click captures all 4 combinations sequentially
2. Automatic file naming with standardized format
3. Batch export to app-specific external storage
4. Single ADB pull for all files at once

**Result**: ~90% time savings; enables scaling to 10+ Galaxy models in reasonable timeframe.

### Common Pitfalls

- **Display Size/Font Size Mismatch**: Always measure at default settings. Non-default sizes change densityDpi and pixel-to-dp conversions. Capture verifies defaultDensityDpi vs actual densityDpi.
- **Navigation Mode Confusion**: InsetsProbe shows both modes, but navigation bar height changes (gesture = 14.93 dp, 3-button = 48 dp). Both measurements required.
- **FoldingFeature Timing**: Hinge angle sensor and FoldingFeature discovery takes ~300ms after screen switch. App delays 300ms before export.
- **Decimals**: All dp values rounded to 2 decimals. Don't estimate or round further.
- **Never Hand-Edit JSON**: Raw files are source of truth. Metadata must match capture conditions.

### Data Quality Checks Before Commit

1. **Verify Density Conversion**: Ensure logicalSizeDp times densityDpi equals 160 times logicalSizePixels width.
2. **Insets Must Have All 4 Sides**: systemBars and displayCutout need top, right, bottom, left (even if 0).
3. **formFactor Type**: Must be "bar", "foldable-book", or "foldable-flip" (not "phone").
4. **CornerRadiiDp Complete**: All four corners or omit entirely (don't use null).
5. **Source Tier Accuracy**: "official" only for published specs; "measured" for RTL/device captures; "community" for unverified.

## Codex Migration Notes

### Current Setup: Claude in Chrome

Currently using **Claude in Chrome** to automate RTL interactions:
- Open RTL web portal → navigate device list → select device → set duration → click Start
- Retrieve device files via browser file explorer
- Login and session management via Chrome's native auth

**Why Claude in Chrome works here**:
- RTL portal is web-based; requires real browser context
- Complex UI interactions (dropdowns, dialogs, file uploads)
- Session state needs to persist across multiple steps
- User approval gates (can ask user to login manually if needed)

### Codex Equivalents

| Capability | Claude in Chrome | Codex Equivalent | Note |
| --- | --- | --- | --- |
| Browser automation | `computer()`, `navigate()`, `click()` | Similar Codex browser tools | Direct web interaction |
| Screenshots | `computer(action:"screenshot")` | Codex screenshot tools | Visual verification |
| Form filling | `form_input()`, `type()` | Codex form handling | RTL device selection |
| File operations | Browser download/file manager | Codex file handling | Extract JSON from downloads |
| Session persistence | Native Chrome auth | Codex session management | Login once per session |
| User gate | Can request user action | Codex user confirmation tools | "Please log in, then ask me to continue" |

### Automation Patterns to Preserve

1. **RTL Session Lifecycle**:
   - Open developer.samsung.com/remote-test-lab
   - Navigate to Reservations or Devices
   - Select target device (filter by model, location)
   - Set duration (23 min for 4 captures)
   - Click Start; wait for connection
   - Extract files from device storage

2. **InsetsProbe "Measure All" Workflow**:
   - Upload compiled APK to RTL device
   - Open app; wait for insets to settle
   - Click "Measure All" button
   - Wait ~5 seconds for all 4 captures to complete
   - Retrieve 4 JSON files via ADB or file manager

3. **Batch Commit Pattern**:
   - Move JSON files to `measurements/<device-slug>/` (4 files)
   - Create `app/data/devices/<slug>.ts` device file
   - Register in `app/data/devices.ts`
   - Run `pnpm typecheck` to verify types
   - Commit with message: "Add <Device Name>: all screens & nav modes measured"

### File Paths to Reference

**Core measurement logic**:
- `tools/insets-probe/app/src/main/java/.../MainActivity.kt` — Measure All automation
- `app/data/devices/galaxy-s25-ultra.ts` — Device data structure example
- `app/data/types.ts` — Device, InsetsMeasurement, FormFactor types
- `measurements/galaxy-s25-ultra/` — Raw JSON sources (truth)

**Website generation**:
- `app/routes/home.tsx` — Device list page
- `app/routes/[slug].tsx` — Individual device page with insets display
- `app/routes/methodology.tsx` — Measurement conditions & transparency
- `app/data/devices.ts` — Device registry (auto-generates routes)

### Codex Development Recommendations

1. **Keep RTL automation in Claude Code** (or Codex equivalent) rather than hard-coded scripts. RTL UI changes frequently; browser automation handles it gracefully.
2. **Preserve "Measure All" button** in InsetsProbe. This is the efficiency multiplier.
3. **Store device list in code** (devices.ts), not a database. Static site generation means all data is known at build time.
4. **Commit measurements as JSON + TypeScript**. Dual format: raw JSON for verification, TypeScript for type safety and site display.
5. **Document measurement conditions** prominently (methodology.tsx). Insets are conditional; missing conditions leads to incorrect usage.

---

**Note on measureAll() Refactoring**: The current implementation uses nested `postDelayed` callbacks, which could be refactored to use coroutines for cleaner code. This is a non-critical optimization for future work.
