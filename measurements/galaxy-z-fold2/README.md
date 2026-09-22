# Galaxy Z Fold2 physical-device captures

Device: SM-F916N, Android 13, One UI 5.1.1, build F916NKSS4KXH1.
Collected from the owner's USB-connected device on 2026-09-22 using InsetsProbe
1.1.1–1.1.2. These are **physical-device captures**, not evidence of RTL availability.

`main-threeButton.json` was captured while fully open. The active full-screen
window is 1768×2208 px, matching the official inner skin, at 480 dpi (3×).
The logical full-window size is 589.33×736 dp. Font scale is **0.8**, a user setting
that was preserved and is disclosed in the website's measurement conditions.
The angle sensor is unavailable, but WindowManager reports a vertical FLAT hinge.

Android 13 resource metrics return 1768×1976, excluding 88 px status and 144 px
navigation bars. Probe 1.1.1 records these separately in `appMetricsPx` and uses
current-window metrics for `widthPx`/`heightPx`. Do not subtract the bars twice.
The device property `ro.build.version.oneui` is 50101 (5.1.1); the former
SEM_PLATFORM_INT conversion incorrectly rendered 140500 as 5.5.

## Cover and display transition

After the owner physically closed and unlocked the device, Android returned to
the launcher. Bringing the existing Probe task to the foreground (without a
force-stop) updated its active window to 960×2658 and cleared the FLAT feature.
The manual Main label remained selected until Cover was chosen. This confirms
fresh window/folding-feature updates after closing, but not seamless app
continuation on the cover or a complete close-and-reopen round trip.

`cover-threeButton.json` records that cover configuration at 480 dpi: 320×886 dp,
31 dp status/system-bar top and 48 dp bottom. DisplayCutout top is 30.67 dp.
No rounded-corner measurements or hinge angle were exposed on this screen.

`adb shell wm size` reported physical size **816×2260** and override size
**960×2658**. With the owner's permission, `wm size reset` was attempted;
immediate and settled checks still reported the same override, and the fresh
capture remained 960×2658. The original override was explicitly restored and
verified. Its origin is unknown; do not claim it was manually set by the owner
or that the captured resolution is the factory default. Physical panel pixels
and the captured app-coordinate space are separate observations.

All captures preserve font scale 0.8. Both displays now have three-button and gesture captures.
PPI and diagonal are unsourced in the website entry and stay pending.

## Reopening and correction to the reset investigation

On reopening, the physical panel was 1768×2208 but the OS still forced the app to
960×2658. The earlier attempt to restore the cover's reported override with
`wm size 960x2658` also constrained the inner display. Therefore, the earlier
claim that this command restored the original folding behavior was incorrect.
With the device open, `wm size reset` removed the override. Without restarting
Probe, its root/current window changed to 1768×2208 and the vertical FLAT feature
moved to x=884. `main-threeButton-reopened.json` records the subsequent explicit
Main/Measure capture; its dimensions and insets match the original inner capture.
This verifies live window updates after reset and FLAT detection after reopening;
it does not establish a clean automatic resolution round trip without intervention.
Do not restore a cover-reported override globally. A future close/reopen check
should inspect both the physical panel and app window before changing settings.
The original cover JSON remains evidence of the earlier observed configuration.

## Inner gesture capture

`main-gesture.json` was captured with Probe 1.1.2 after selecting Swipe gestures
in Samsung Settings, with gesture hints and the persistent taskbar visible.
Its full window remains 1768×2208; system-bar insets are top 29.33 and bottom 48 dp.
The bottom value includes the tappable taskbar, so the old 1.1.1 heuristic incorrectly
classified this configuration as three-button navigation. The OS config is gestural
and left/right system gesture regions are each 30 dp; 1.1.2 combines that evidence.
The raw `modeFromInsets` disagreement is retained for audit, not overwritten.

## Cover gesture capture

After closing again, the OS automatically returned to physical 816×2260 with an
app override of 960×2658, without another size command. Probe resumed from the
launcher into that window with no folding features. `cover-gesture.json` records
Probe 1.1.2, gesture hints enabled, top 31 dp and bottom 15 dp. The absence of an
inner taskbar here explains why the bottom inset differs from the inner capture.
The device was left in swipe-gesture navigation after these measurements.

## Final automatic round trip

The owner reopened the device once more after the cover gesture capture. Without
restarting Probe or issuing another size command, `wm size` reported physical
1768×2208 with no override. Probe's existing activity updated its root/current
window to 1768×2208, restored the FLAT hinge at x=884, and reported top 29.33 /
bottom 48 dp in gesture mode. The manual Cover label remained selected, as
designed; selecting Main and Measure saved `main-gesture-reopened.json`. Its
window dimensions and complete insets match `main-gesture.json`. This final
close/resume/reopen sequence confirms correct live display updates after removal
of the global override. Cover continuation still requires bringing the app back
from the launcher on this device configuration.
