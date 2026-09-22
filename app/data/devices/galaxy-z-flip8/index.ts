import type { Device, Source } from "../../types";

const rtlThreeButton: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 9.0, Android 17",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip8/main-threeButton.json",
  retrievedAt: "2026-09-22",
};

const rtlGesture: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 9.0, Android 17",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip8/main-gesture.json",
  retrievedAt: "2026-09-22",
};

export const galaxyZFlip8: Device = {
  slug: "galaxy-z-flip8",
  name: "Galaxy Z Flip8",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  foldAnimation: true,
  releaseYear: 2026,
  screens: [
    {
      id: "cover", label: "Cover", diagonalInch: 0,
      resolutionPx: { width: 0, height: 0 }, ppi: 0,
      logicalSizePx: null, captureOrientation: null,
      logicalSizeDp: null, densityDpi: null, cornerRadiiDp: null, cornerRadiiPx: null,
      insets: { gesture: null, threeButton: null }, sources: [],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 5.7,
      resolutionPx: { width: 0, height: 0 },
      logicalSizePx: { width: 1080, height: 2520 },
      captureOrientation: "portrait",
      ppi: 0,
      logicalSizeDp: { width: 360, height: 840 },
      densityDpi: 480,
      cornerRadiiDp: { topLeft: 22, topRight: 22, bottomRight: 22, bottomLeft: 22 },
      cornerRadiiPx: { topLeft: 66, topRight: 66, bottomRight: 66, bottomLeft: 66 },
      insets: {
        gesture: {
          systemBars: { top: 36, right: 0, bottom: 15, left: 0 },
          systemBarsPx: { top: 108, right: 0, bottom: 45, left: 0 },
          displayCutout: { top: 36, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 108, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 169.67, yDp: 0, widthDp: 20.67, heightDp: 36, rightDp: 169.67, bottomDp: 804, xPx: 509, yPx: 0, widthPx: 62, heightPx: 108, rightPx: 509, bottomPx: 2412 },
          condition: { oneUi: "9.0", android: "17" },
          sources: [rtlGesture],
        },
        threeButton: {
          systemBars: { top: 36, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 108, right: 0, bottom: 144, left: 0 },
          displayCutout: { top: 36, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 108, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 169.67, yDp: 0, widthDp: 20.67, heightDp: 36, rightDp: 169.67, bottomDp: 804, xPx: 509, yPx: 0, widthPx: 62, heightPx: 108, rightPx: 509, bottomPx: 2412 },
          condition: { oneUi: "9.0", android: "17" },
          sources: [rtlThreeButton],
        },
      },
      sources: [rtlThreeButton, rtlGesture],
    },
  ],
  sources: [rtlThreeButton, rtlGesture],
};
