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

const coverCaptureBase = "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip8/recapture-2026-09-23";

const coverThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Flip8 FlexWindow, 3-button (SM-F776B)",
  url: `${coverCaptureBase}/cover-threeButton.json`,
  retrievedAt: "2026-09-23",
};

const coverGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Flip8 FlexWindow, gestures (SM-F776B)",
  url: `${coverCaptureBase}/cover-gesture.json`,
  retrievedAt: "2026-09-23",
};

const coverCondition = {
  oneUi: "9.0",
  android: "17",
  note: "Samsung RTL, physically folded, portrait. InsetsProbe was launched on FlexWindow display 1 through its cover AppWidget; active window 948×1048 px matches the official cover layout. RTL reported a 180° hinge angle with no folding feature, so classification relies on display ID and active-window evidence rather than the hinge sensor.",
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
      resolutionPx: { width: 948, height: 1048 }, ppi: 0,
      logicalSizePx: { width: 948, height: 1048 }, captureOrientation: "portrait", captureRotation: 0,
      logicalSizeDp: { width: 399.16, height: 441.26 }, densityDpi: 380,
      cornerRadiiDp: { topLeft: 5.05, topRight: 5.05, bottomRight: 40.84, bottomLeft: 40.84 },
      cornerRadiiPx: { topLeft: 12, topRight: 12, bottomRight: 97, bottomLeft: 97 },
      insets: {
        gesture: {
          systemBars: { top: 0, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 0, right: 0, bottom: 114, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 88, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 209, left: 0 },
          cutoutShape: { xDp: 180.21, yDp: 353.26, widthDp: 218.95, heightDp: 88, rightDp: 0, bottomDp: 0, xPx: 428, yPx: 839, widthPx: 520, heightPx: 209, rightPx: 0, bottomPx: 0 },
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 0, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 0, right: 0, bottom: 114, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 88, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 209, left: 0 },
          cutoutShape: { xDp: 180.21, yDp: 353.26, widthDp: 218.95, heightDp: 88, rightDp: 0, bottomDp: 0, xPx: 428, yPx: 839, widthPx: 520, heightPx: 209, rightPx: 0, bottomPx: 0 },
          condition: coverCondition,
          sources: [coverThreeButton],
        },
      },
      sources: [coverThreeButton, coverGesture],
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
  sources: [coverThreeButton, coverGesture, rtlThreeButton, rtlGesture],
};
