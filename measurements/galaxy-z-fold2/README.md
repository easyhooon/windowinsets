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

Both captures preserve font scale 0.8. Gesture measurements and a reverse
cover-to-inner transition check remain pending. PPI and diagonal are unsourced
in the website entry and stay pending.
