# Galaxy Z Flip FlexWindow app compatibility

**Checked:** 2026-09-22
**Immediate target:** Galaxy Z Flip8, One UI 9 / Android 17 in Samsung Remote Test Lab
([Samsung Flip8 product information](https://www.samsung.com/sa_en/business/smartphones/galaxy-z/galaxy-z-flip8-sm-f776bzwomea/))

## Actionable conclusion

InsetsProbe must run as a full activity on the physical cover display before a
Flip cover capture is valid. Starting the APK from RTL's **Applications** panel
does not establish that condition: it can start the activity on the hidden main
display while the phone is folded.

For Galaxy Z Flip8 there are three distinct mechanisms:

| Mechanism | What it can run | Use for InsetsProbe |
| --- | --- | --- |
| One UI 9 **Favorite apps** / Apps widget | Only apps Samsung classifies as compatible | Try once. Absence from its picker is expected and is not evidence that the APK failed to install. |
| Good Lock **MultiStar Launcher Widget** | Additional installed full applications | Device-side fallback if the packaged InsetsProbe widget is absent or blocked. |
| InsetsProbe **FlexWindow widget** | The app's own `AppWidgetProvider`; it launches the probe activity on the cover display | Primary deterministic path in InsetsProbe 1.2.0. |

Samsung's Flip8 guide says the built-in Favorite apps widget accepts only
compatible apps. It does not publish a developer manifest flag or approval
criterion that makes an arbitrary activity enter that list
([Samsung US: Flip8 cover screen](https://www.samsung.com/us/support/answer/ANS10013200/)).
Samsung Japan's current Galaxy Z Flip guidance is more explicit: One UI 9 can
run some apps directly, but additional apps still require Good Lock/MultiStar
([Samsung Japan: cover-screen apps](https://www.samsung.com/jp/support/mobile-devices/coverdisplay-goodlock/)).

Therefore, adding an undocumented `meta-data` flag to `MainActivity` is not a
sound compatibility fix. InsetsProbe 1.2.0 implements Samsung's documented
FlexWindow widget path. Use that packaged widget first, and use MultiStar only
when the device does not expose or cannot launch the widget.

## Fastest Flip8 RTL procedure

1. Install InsetsProbe through RTL **Applications > Install App**. RTL officially
   supports installing and starting APKs this way
   ([Samsung RTL: Tests on devices](https://developer.samsung.com/remotetestlab/doc/tests-on-devices)).
2. Open **Settings > Cover screen > Widgets** and enable **InsetsProbe**. Fold
   and unlock the phone, swipe left to the widget, and tap **Open cover probe**.
3. If the InsetsProbe widget is absent or cannot launch the activity on display
   1, try the One UI 9 Favorite apps picker once: **Cover screen > Widgets >
   Apps > Select apps**. If InsetsProbe is absent, do not keep searching that
   picker; it exposes compatible apps only.
4. As the remaining fallback, install **Good Lock** from Galaxy Store, then open
   **Life Up > MultiStar > I ♡ Galaxy Foldable > Launcher Widget**. Select
   InsetsProbe and enable the launcher widget. Samsung documents this as the way
   to launch full applications on the FlexWindow
   ([Samsung Developer: Good Lock and different screen sizes](https://developer.samsung.com/sdp/blog/en/2024/01/09/best-practices-of-app-development-for-various-screen-sizespowered-by-good-lock)).
   The current Galaxy Store listing says MultiStar 10.4 supports One UI 8 and
   later and includes the cover Launcher Widget, so One UI 9 is within its stated
   version range
   ([Galaxy Store: MultiStar](https://galaxystore.samsung.com/detail/com.samsung.android.multistar?langCd=es)).
5. On current One UI 9, follow the layout actually shown by MultiStar:
   - If it shows a full-screen app list, select InsetsProbe, tap **Done**, fold
     the phone, unlock the cover, then swipe **up** to the launcher.
   - If it shows a cover preview, select InsetsProbe, then enable
     **Settings > Cover screen > Widgets > MultiStar > Launcher**. Fold, unlock,
     and swipe **left** to that widget.

   Samsung documents both MultiStar layouts because the UI varies by model and
   software version
   ([Samsung Japan: Good Lock setup](https://www.samsung.com/jp/support/mobile-devices/coverdisplay-goodlock/)).
6. Launch InsetsProbe from the packaged widget or cover launcher, not from RTL's Applications
   panel. Before saving, verify that its active window is the official Flip8
   cover size, **948×1048 px**. A 1080×2520 window is the main display and must
   be rejected regardless of the selected `Cover` label.
7. Capture 3-button and gesture navigation separately. Preserve any failed or
   mismatched JSON only as diagnostic evidence; do not register it as cover data.

### When this procedure is blocked

Good Lock and Labs are user-side compatibility mechanisms, not a guarantee.
Samsung warns that availability varies by carrier, software version, and device,
that some apps are not optimized for the cover screen, and that apps enabled by
Labs or Good Lock might not work as expected
([Samsung Philippines: Flip5 cover-screen apps](https://www.samsung.com/ph/support/mobile-devices/explore-new-cover-screen-widgets-on-the-galaxy-z-flip5/)).

If Galaxy Store, Good Lock, or MultiStar is unavailable on an RTL image, record
the exact missing component and stop the reservation. That is an environment or
Samsung-compatibility blocker, not evidence that changing ordinary Android
launcher metadata will fix the APK.

## Developer-controlled widget fallback

Samsung documents a first-party way for an app to expose its own widget on the
FlexWindow. This is separate from making a full activity appear in One UI's
native Favorite apps picker.

The app must:

1. Implement an `AppWidgetProvider` receiver and normal Android widget metadata.
2. Add Samsung widget metadata to the receiver:

   ```xml
   <meta-data
       android:name="com.samsung.android.appwidget.provider"
       android:resource="@xml/samsung_flexwindow_widget" />
   ```

3. Declare the widget as a sub-display widget:

   ```xml
   <samsung-appwidget-provider display="sub_screen" />
   ```

4. Use a keyguard widget definition sized for FlexWindow. Samsung's dedicated
   page lists `minWidth="352dp"`, `minHeight="339dp"`,
   `resizeMode="horizontal|vertical"`, and `widgetCategory="keyguard"`.
5. Launch the probe activity from the widget's `PendingIntent` with
   `ActivityOptions.launchDisplayId = 1`; Samsung's example identifies display
   0 as main and display 1 as cover.

The receiver metadata, sub-screen declaration, dimensions, and launch-display
example are all in
[Samsung Developer: Flex Window](https://developer.samsung.com/galaxy-z/flex_window.html).
Android's API contract also says a launch display ID is honored only when the
device supports activities on secondary displays, and otherwise may be ignored
([Android `ActivityOptionsCompat.setLaunchDisplayId`](https://developer.android.com/reference/androidx/core/app/ActivityOptionsCompat#setLaunchDisplayId(int))).

This fallback should present a single button such as **Open InsetsProbe**. The
widget itself is not the measurement surface; its only job is to start
`MainActivity` on the cover display. The activity must still verify its actual
window dimensions before export.

Do not make `MainActivity` guess display ID 1 and relaunch itself from the main
screen. Android permits activity launches only on public displays or displays
where the app already has an activity, can reject a private or invalid display,
and can ignore the request when secondary-display activities are unsupported.
Samsung documents display ID 1 specifically in the FlexWindow widget
`PendingIntent` flow, so that is the supported context for this fallback.

## Current InsetsProbe assessment

The current APK already has the normal requirements for MultiStar discovery:
an exported activity with `MAIN` and `LAUNCHER` intent filters. It does not lock
orientation or aspect ratio, and it already handles the important screen-size
configuration changes. Since the app targets API 36, Android's default is already
`resizeableActivity="true"`; spelling that property out would document the intent
but is unlikely to change Samsung's native compatibility classification
([Android: adaptive do's and don'ts](https://developer.android.com/develop/adaptive-apps/guides/adaptive-dos-and-donts)).
Android recommends layouts that tolerate fold/unfold and window-size changes,
and documents those changes as normal activity configuration transitions
([Android: configuration and continuity](https://developer.android.com/guide/topics/large-screens/configuration-and-continuity)).

InsetsProbe 1.2.0 implements the developer-controlled fallback completely: it has
an `AppWidgetProvider`, standard keyguard widget metadata, Samsung `sub_screen`
metadata, widget resources, and a `PendingIntent` targeting display ID 1. A widget
launch preselects Cover and records `screenLabelSource: flexWindowWidget`. Export
is rejected unless the activity owns display 1, its root is settled, and its
current window bounds equal that display's maximum window bounds.

The guard is intentionally not hardcoded to Flip8 pixels so the widget remains
usable on later Flip models. The operator must still confirm the model-specific
official size shown by the status line; for Flip8 both Active window and Full
display must read **948×1048 px** before export.

## Known limits and unresolved questions

- Samsung's native Flip8 Favorite apps picker is explicitly compatibility-
  filtered, but Samsung does not publish its allowlist criteria or an opt-in
  manifest contract. Treat membership as device-software policy.
- Samsung calls MultiStar a way to launch full applications, and its Flip7 guide
  calls it a way to run "any app," but the current Flip8 material still warns
  that some applications may not be supported or optimized. A sideloaded APK
  with a launcher activity is therefore a strong candidate, not a guarantee
  ([Samsung US: Flip7 FlexWindow](https://www.samsung.com/us/support/answer/ANS10006881/)).
- The Samsung developer widget specification is written around Flip5. Samsung's
  current Flip8 consumer documentation confirms FlexWindow widgets and apps, but
  does not explicitly re-version that developer contract for One UI 9. The
  widget fallback must be validated on the actual Flip8 RTL firmware before it
  is relied on for measurements.
- Samsung's developer page and codelab both specify `minWidth="352dp"` and
  `minHeight="339dp"`. These are widget sizing hints rather than Flip8 panel
  pixels, so keep the layout responsive and validate its actual window on-device.
- Android display IDs are runtime identifiers in the general platform API.
  Samsung's sample uses cover display ID 1, but the probe must still validate
  the resulting window size; a successful activity start alone is insufficient.

## Decision for this project

Use the packaged InsetsProbe FlexWindow widget first because it is the documented,
deterministic APK-side route in version 1.2.0. Use MultiStar only if the device
does not expose or cannot launch that widget. In either route, accept a Flip8
cover capture only after InsetsProbe itself visibly occupies a **948×1048 px**
active window whose bounds equal the full display bounds.
