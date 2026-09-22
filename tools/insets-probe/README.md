# InsetsProbe

Dumps everything [windowinsets.info](https://windowinsets.info) needs for one screen and one navigation mode, as JSON.

## What it records

- Device: manufacturer, model, Android version, One UI version (`SEM_PLATFORM_INT`), build id
- Display: pixel size, `densityDpi` vs the device's default density, font scale, window size in dp
- Navigation mode (gesture / 3-button / 2-button)
- `WindowInsets`: status bars, navigation bars, system bars, display cutout, caption bar, system gestures, mandatory system gestures, tappable element — in px and dp, with and without visibility
- `DisplayCutout`: safe insets, bounding rects, waterfall insets
- `RoundedCorner` for all four corners (from window insets and from `Display`)
- Foldables: `FoldingFeature` (state, orientation, occlusion, bounds) and the hinge angle sensor

## How to measure

1. Build and install: `./gradlew :app:installDebug` (needs `sdk.dir` in `local.properties`), or install the APK on Samsung Remote Test Lab.
2. Set the device to its **default** Display size, Font size and, on Samsung, **Screen resolution** (HD+/FHD+/WQHD+). Screen resolution changes the pixel size and Display size changes `densityDpi`, so both change the dp values. The JSON records `widthPx`/`heightPx`, `densityDpi` and `defaultDensityDpi` so a non-default setting is visible.
3. Choose the navigation mode you are recording (Settings → Display → Navigation bar).
4. Hold the device in **portrait**, app in full screen (not split-screen / pop-up).
5. Foldables: pick **Cover** or **Main** in the app to match the screen you are on.
6. Tap **Copy JSON**. The file is also saved to the app's external files dir and logged under the `InsetsProbe` tag:

   ```bash
   adb logcat -s InsetsProbe
   adb pull /sdcard/Android/data/info.windowinsets.probe/files/
   ```

7. Save it as `measurements/<device-slug>/<screen>-<navMode>.json` at the repo root.

Repeat for every screen × navigation mode. Do not edit the JSON by hand.

## Automation

```bash
adb shell am start -n info.windowinsets.probe/.MainActivity --es screen main --ez export true
adb pull /sdcard/Android/data/info.windowinsets.probe/files/
```

`--es screen` accepts `cover` or `main` (default `phone`); `--ez export true` saves the JSON one second after launch. See [sample-output](sample-output) for a real capture.
