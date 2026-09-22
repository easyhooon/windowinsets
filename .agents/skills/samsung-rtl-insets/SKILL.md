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

For an available target, select 30 minutes / 2 credits unless the user requests a
different duration. Confirm the dialog still names the intended model and duration,
then start the reservation. The user's request to reserve the named queue authorizes
this ordinary reservation; unexpected paid options, terms, permissions, or a target
change require a fresh user decision.

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
- If the rendered screen is black, use the physical buttons drawn on the device's
  right bezel. The upper control is volume; the lower control is power/wake.
- A click on the lower side button may wake or sleep the device. Re-read the
  screenshot after every click.
- Lock-screen swipes and authentication are a manual fallback. If one precise
  attempt is unreliable, ask the user to wake/unlock the already-open device and
  resume after they confirm. Never guess a PIN or repeatedly toggle power.

### Capture every required state

1. Start with 3-button navigation. Confirm the active window shown by Probe before
   choosing a label.
2. For foldables, use the WebClient folding control on the right settings bar.
   Open its menu and choose the explicit Folded, Unfolded or Flex state by tooltip;
   do not infer the state from icon shape alone. Wait for the chassis and active
   window size to settle.
3. Select Probe's radio circle matching the physically active display. Cover/Main
   is a manual label and never switches hardware.
4. Tap **Measure** and require the toast filename to match the intended combination,
   for example `cover-threeButton.json`. A different filename is a rejected
   attempt, not evidence.
5. For a book fold, capture the folded cover, switch to Unfolded, dismiss any
   one-time multi-window tutorial, choose Main, and capture the inner display.
6. Tap **Display / navigation settings**. In Settings > Display, scroll to
   **Navigation bar**, open it and select **Swipe gestures**. Return to Probe with
   the left-edge back gesture twice. Confirm that Probe reports gesture mode.
7. Repeat each physical display in gesture mode and require the matching
   `*-gesture.json` toast.
8. Record the visible active-window resolution and hinge/folding-feature state for
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
