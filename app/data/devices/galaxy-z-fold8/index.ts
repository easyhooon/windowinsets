import type { Device, Source } from "../../types";

const rtlThreeButton: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 9.0, Android 17",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold8/main-threeButton.json",
  retrievedAt: "2026-09-22",
};

const rtlGesture: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 9.0, Android 17",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold8/main-gesture.json",
  retrievedAt: "2026-09-22",
};

export const galaxyZFold8: Device = {
  slug: "galaxy-z-fold8",
  name: "Galaxy Z Fold8",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2026,
  screens: [
    {
      id: "cover",
      label: "Cover",
      // Not independently verified yet — RTL's remote view only exposes the main
      // display, so a cover-screen capture would just duplicate the main screen's
      // values under a different label. Left pending until measured on a physically
      // folded unit.
      diagonalInch: 0,
      resolutionPx: { width: 0, height: 0 },
      ppi: 0,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 5.6,
      resolutionPx: { width: 1248, height: 1972 },
      ppi: 420,
      logicalSizeDp: { width: 475.43, height: 751.24 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 9.9, topRight: 9.9, bottomRight: 9.9, bottomLeft: 9.9 },
      insets: {
        gesture: {
          systemBars: { top: 41.9, right: 0, bottom: 14.86, left: 0 },
          displayCutout: { top: 39.62, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 224.38, yDp: 0, widthDp: 26.67, heightDp: 39.62 },
          condition: { oneUi: "9.0", android: "17" },
          sources: [rtlGesture],
        },
        threeButton: {
          systemBars: { top: 41.9, right: 0, bottom: 48, left: 0 },
          displayCutout: { top: 39.62, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 224.38, yDp: 0, widthDp: 26.67, heightDp: 39.62 },
          condition: { oneUi: "9.0", android: "17" },
          sources: [rtlThreeButton],
        },
      },
      sources: [rtlThreeButton, rtlGesture],
    },
  ],
  sources: [rtlThreeButton, rtlGesture],
};
