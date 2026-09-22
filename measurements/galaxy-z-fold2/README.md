# Galaxy Z Fold2 physical-device captures

Device: SM-F916N, Android 13, One UI 5.1.1, build F916NKSS4KXH1.
Collected from the owner's USB-connected device on 2026-09-22 using InsetsProbe
1.1.1. These are **physical-device captures**, not evidence of RTL availability.

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

Cover, gesture and live folding-transition verification remain pending until
corresponding captures are collected. Do not infer those values from this file.
PPI and diagonal are unsourced in the website entry and stay pending.
