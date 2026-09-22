---
name: samsung-rtl-insets
description: "Continue Samsung Remote Test Lab inset collection: choose the next covered Galaxy Fold, Flip, or S model, automate reservation and visible WebClient controls, hand off authentication or unreliable lock-screen steps, then validate and register InsetsProbe evidence."
---

# Samsung RTL Insets

Run this workflow from the WindowInsets repository. The authoritative project
rules are `AGENTS.md`, `docs/RTL_COVERAGE.md`, `docs/MEASUREMENT_WORKFLOW.md`, and
`tools/insets-probe/README.md`; read their current versions before acting.

## 1. Establish the queue

Inspect `measurements/`, `app/data/devices.ts`, and the skin catalog before opening
RTL. Select one target at a time in this order:

1. Galaxy Z Fold, newest first.
2. Galaxy Z Flip, newest first.
3. Galaxy S, newest first; within a generation use Ultra, Plus, base, then other variants.

Put a known wrong or suspect published measurement ahead of collecting any new
model, then prefer an incomplete measured entry over an older untouched preview.
Include only models covered by the repository's current release policy and
registered official skin. Keep TriFold outside the queue until its separate product
decision changes. Missing measurements remain pending.

Completion criterion: name the target, the exact missing screen/navigation-mode
captures, and why no higher-priority eligible target is ahead of it.

## 2. Reserve with Computer Use

Use the `computer-use` skill with the user's existing Chrome session. Re-read the
Chrome accessibility tree after every page transition; never reuse stale element
indexes.

Navigate through Samsung RTL's Device List, open the correct series, and confirm
the exact model name and current availability. A visible catalog is not proof of an
authenticated reservation session: opening the model must reach its reservation
options without a sign-in notice.

### Authentication handoff

Authentication is always manual. If Samsung shows Sign in, credentials, QR sign-in,
CAPTCHA, two-factor authentication, or account recovery:

1. Navigate only as far as the Samsung sign-in screen.
2. Tell the user the exact blocker and ask them to complete authentication in Chrome.
3. Do not click Next, choose a saved credential, enter account data, solve CAPTCHA,
   or approve a verification prompt.
4. After the user reports completion, fetch fresh Chrome state and verify reservation
   access by opening the target model again.

Treat `Please sign in if you want to use the Remote Test Lab service.` as an expired
or incomplete RTL session even if the device list remains visible.

For every available target, reserve exactly 30 minutes / 2 credits. This is a
throughput invariant: Samsung provides 20 credits per day and charges 1 credit per
15 minutes, so the minimum reservation supports up to 10 distinct devices per daily
allocation and minimizes the calendar time needed to cover the post-2020 queue.
Prepare the APK and capture checklist before reserving. Do not extend or renew a
session; preserve completed evidence and requeue unfinished captures for another
30-minute slot. Confirm the dialog still names the intended model and duration, then
start the reservation. The user's request to reserve the named queue authorizes this
ordinary reservation; unexpected paid options, terms, permissions, or a target
change require a fresh user decision.

Treat the header credit count as remaining allocation only after the latest
reservation has closed and Usage History has refreshed. A live reservation can
leave credits visible until the session ends. Before booking, verify the completed
rows in **Usage History** and sum their credits; stop when the daily 20-credit total
has been reached.

If RTL returns 403, first retry after a short interval, then re-enter through the RTL
landing page or request a fresh manual login as described in
`docs/MEASUREMENT_WORKFLOW.md`. Preserve the existing tab and reservation whenever
possible because closing the WebClient can restart the device and waste time.

Completion criterion: the 30-minute reservation exists for the intended target, or
the user has received the exact access blocker and the single action needed to resume.

## 3. Operate or hand off the live device

Inspect the live WebClient with Computer Use. If its screenshot exposes the device,
continue by coordinates when accessibility elements are absent, taking a fresh
screenshot after every device action. If the popup is invisible, cannot receive
input, or a device control is ambiguous, keep the reservation open and hand that
step to the user.

### Build and install Probe

1. Build before spending reservation time:
   `cd tools/insets-probe && ./gradlew :app:testDebugUnitTest :app:assembleDebug`.
   Record the APK checksum when traceability matters.
2. Open WebClient **Applications** and click its install/upload icon.
3. In the macOS file chooser press **Cmd+Shift+G**, paste the absolute path to
   `tools/insets-probe/app/build/outputs/apk/debug/app-debug.apk`, and choose Open.
4. Wait for `InsetsProbe info.windowinsets.probe` to appear. Select the application
   row itself, then click the Start/play control.
5. Do not enable Remote Debug Bridge or grant Chrome access to other apps/services
   unless the user explicitly authorizes that permission. The visible WebClient
   workflow does not require RDB.

### Wake, unlock and normalize

- Set language to English and restore default Display size, Font size, and Screen
  resolution before the first capture.
- If the rendered screen is black, use the physical side-button hitbox drawn on the
  device. Rotation and folded front/rear views move the controls and can reverse
  their apparent order, so identify the short power/fingerprint button from a fresh
  screenshot instead of assuming that it is always above or below the volume rocker.
- Keep browser-viewport coordinates and macOS Computer Use coordinates separate;
  Chrome bars and RTL full-screen transitions change their scale and origin. A
  single deliberate power click may wake or sleep the device, so re-read the same
  coordinate space after every click.
- Lock-screen swipes and authentication are a manual fallback. If one precise
  attempt is unreliable, ask the user to wake/unlock the already-open device and
  resume after they confirm. Never guess a PIN or repeatedly toggle power.
- For a Flip cover session, set **Settings > Cover screen > Cover screen timeout**
  to **30 seconds** before folding. The default 10-second timeout can turn the
  screen off between screenshot and gesture and falsely look like an input failure.
- Automate a cover gesture only from a fresh screenshot in one coordinate space:
  wake with one power-button click, wait for the visible cover, then drag through
  the center of the live display. Use a horizontal right-to-left drag to move from
  the clock/Now Brief page to favorite apps; do not use an upward swipe for that
  page change. Verify the result before another action. If one calibrated attempt
  fails, hand off the unlock/gesture instead of varying coordinates repeatedly.
- When a real cover long press is required, prefer browser CUA with a stationary
  drag path (roughly 45 repeated points followed by a 1 px move) over a macOS drag
  duration. RTL may translate the latter into a short tap and open the app beneath
  the pointer. Re-read the cover immediately and accept only the visible edit state
  or **Open phone to continue** prompt.

### Capture every required state

1. Start with 3-button navigation. Confirm the active window shown by Probe before
   choosing a label.
2. For foldables, use the WebClient folding control on the right settings bar.
   Open its menu and choose the explicit Folded, Unfolded or Flex state by tooltip;
   do not infer the state from icon shape alone. Wait for the chassis and active
   window size to settle.
3. For a Galaxy Z Flip cover capture, complete the **FlexWindow launch** branch
   before selecting a label:
   - The cover is a separate FlexWindow surface; folding can replace the inner app
     with cover home instead of moving the activity. Starting an app from
     WebClient **Applications** can still target the hidden inner display.
   - Install InsetsProbe 1.2.0 or later. On the unfolded phone open **Settings >
     Cover screen > Widgets** and enable the **InsetsProbe** widget. This uses
     Samsung's documented `sub_screen` AppWidget metadata and launches Probe with
     `ActivityOptions.launchDisplayId = 1`.
   - Fold the device, wake and unlock the cover, swipe horizontally to the
     InsetsProbe widget, and tap **Open cover probe**. The widget preselects Cover.
     Accept a capture only when the status line reports `display 1` and the active
     window matches the official cover dimensions. Flip8 must report 948 x 1048 px.
     Probe blocks export when the widget launch falls back to another display.
   - If the widget is absent on that software build, use the device-side fallback:
     **Good Lock > MultiStar > I ♡ Galaxy Foldable > Cover launcher widget**, add
     InsetsProbe, then launch it from the cover app tray. Installing Good Lock or
     MultiStar is a separate software-install step and requires the applicable user
     approval. The built-in favorite-app picker is a Samsung compatibility list;
     there is no documented manifest flag that enrolls an arbitrary Activity.
   - Starting Probe from WebClient **Applications** while folded is only a negative
     diagnostic: on Flip8 it can start on the hidden inner display and leave the
     cover black. Never treat that as a cover launch. If neither widget nor
     MultiStar can open Probe on display 1, document the compatibility blocker and
     requeue the device; inner-display values are not cover evidence.
4. Select Probe's radio circle matching the physically active display. Cover/Main
   is a manual label and never switches hardware.
5. Tap **Measure** and require the toast filename to match the intended combination,
   for example `cover-threeButton.json`. A different filename is a rejected
   attempt, not evidence.
6. For a book fold, capture the folded cover, switch to Unfolded, dismiss any
   one-time multi-window tutorial, choose Main, and capture the inner display.
7. Tap **Display / navigation settings**. In Settings > Display, scroll to
   **Navigation bar**, open it and select **Swipe gestures**. Return to Probe with
   the left-edge back gesture twice. Confirm that Probe reports gesture mode.
8. Repeat each physical display in gesture mode and require the matching
   `*-gesture.json` toast.
9. Record the visible active-window resolution and hinge/folding-feature state for
   each capture. A hinge angle can be wrong on RTL; screen classification requires
   the actual switched state plus resolution evidence.

### Export through File Browser

1. Open WebClient **File Browser** and navigate:
   `Android > data > info.windowinsets.probe > files`.
2. Confirm the complete filename set. Hover or select each row to reveal its
   download icon, then download files one at a time.
3. RTL may name every browser download `content`, `content (1)`, and so on.
   Classify them only from JSON fields: `screen`, `navigation.mode`,
   `display.currentWindowPx`, model and `capturedAt`.

When automation cannot complete the live-device portion, ask the user to report the
downloaded filenames and active display/resolution. State the exact inaccessible
control and keep the reservation tab open.

Completion criterion: every requested raw JSON file and its observed display state
are available, or the remaining human step is explicit.

## 4. Validate evidence before registration

Raw files under `measurements/` are immutable evidence. Copy downloads under explicit
`<screen>-<threeButton|gesture>.json` names only after checking them; never repair or
normalize the JSON by hand.

Check every file for:

- target model/build and a fresh capture timestamp;
- schema/capture context, full-screen and settled window state;
- actual `navigation.mode`, not the requested mode;
- window pixel dimensions and density;
- foldable hinge/folding-feature evidence and consistency with the claimed screen;
- locale-dependent values and any mismatch requiring recapture.

Compare dimensions with official skin rectangles only to classify the active screen.
Artwork coordinates are not inset measurements. A null hinge angle does not prove
Main, rotation does not switch displays, and duplicate dimensions from two labels do
not establish two screens. Preserve mismatched captures and document why they are not
registered instead of rewriting them.

Completion criterion: every downloaded file is either accepted with a defensible
screen/nav classification or retained as rejected evidence with a stated reason.

## 5. Register and verify

Add accepted raw evidence under `measurements/<device-slug>/`. If canonical files
already contain historical evidence, preserve them and add a dated recapture
directory rather than overwriting them. Update the existing
device module or create one following a comparable bar/book/flip entry, then register
it through `verifiedEntries` without replacing skin-only screens. Record RTL catalog
availability separately from measurements; mark the catalog complete only after an
unfiltered inventory of every series and region has actually been checked.

Update the measurement and RTL coverage docs with the capture date, model identifier,
screen classification, navigation modes, and any limitations. Run at least:

```bash
pnpm typecheck
node --test tests/rendering.test.mjs
pnpm build
```

Review desktop and mobile output for the changed device. Report accepted captures,
pending screens/modes, validation results, and the next queue item.

Completion criterion: raw evidence is traceable, registered values come only from
accepted captures, documentation agrees with code, and all relevant checks pass.
