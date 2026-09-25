import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold6 Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-z-fold6/specs/",
  retrievedAt: "2025-01-14",
};

const captureBase = "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold6";
const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-23",
};
const coverThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold6 cover, 3-button (SM-F956U)",
  url: `${captureBase}/cover-threeButton.json`,
  retrievedAt: "2026-09-23",
};
const coverGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold6 cover, gestures (SM-F956U)",
  url: `${captureBase}/cover-gesture.json`,
  retrievedAt: "2026-09-23",
};
const mainGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold6 inner display, gestures (SM-F956U)",
  url: `${captureBase}/main-gesture.json`,
  retrievedAt: "2026-09-23",
};
const mainThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold6 inner display, 3-button (SM-F956U)",
  url: `${captureBase}/main-threeButton.json`,
  retrievedAt: "2026-09-23",
};

const coverCondition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL, physically folded, portrait. Active window 968×2376 px; RTL reported a stale 90° hinge angle without a folding feature.",
};
const mainGestureCondition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL, fully unfolded, portrait. Active window 1856×2160 px and a vertical FLAT folding feature. Gesture mode is supported by settings, configuration, side-gesture insets and a 39 px navigation inset, although Probe's modeFromInsets heuristic reported 3-button.",
};
const mainThreeButtonCondition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL, fully unfolded, portrait. Active window 1856×2160 px with a vertical FLAT folding feature. Recaptured after an earlier transient 1 px navigation-bar reading; system, navigation, tappable and gesture bottoms all agree at 126 px.",
};
const coverCutout = {
  xDp: 172.57,
  yDp: 0,
  widthDp: 23.62,
  heightDp: 36.19,
  rightDp: 172.57,
  bottomDp: 868.95,
  xPx: 453,
  yPx: 0,
  widthPx: 62,
  heightPx: 95,
  rightPx: 453,
  bottomPx: 2281,
};

export const galaxyZFold6: Device = {
  slug: "galaxy-z-fold6",
  name: "Galaxy Z Fold6",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2024,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 0,
      resolutionPx: { width: 968, height: 2376 },
      logicalSizePx: { width: 968, height: 2376 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 0,
      logicalSizeDp: { width: 368.76, height: 905.14 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 6.1, topRight: 6.1, bottomRight: 6.1, bottomLeft: 6.1 },
      cornerRadiiPx: { topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 },
      insets: {
        gesture: {
          systemBars: { top: 36.19, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 95, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 36.19, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 95, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 36.19, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 95, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 36.19, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 95, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverThreeButton],
        },
      },
      sources: [samsungSkinPage, coverThreeButton, coverGesture],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 7.6,
      resolutionPx: { width: 1856, height: 2160 },
      logicalSizePx: { width: 1856, height: 2160 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 374,
      logicalSizeDp: { width: 707.05, height: 822.86 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 4.95, topRight: 4.95, bottomRight: 4.95, bottomLeft: 4.95 },
      cornerRadiiPx: { topLeft: 13, topRight: 13, bottomRight: 13, bottomLeft: 13 },
      insets: {
        gesture: {
          systemBars: { top: 35.81, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainGestureCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 35.81, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainThreeButtonCondition,
          sources: [mainThreeButton],
        },
      },
      sources: [samsungSpecs, samsungSkinPage, mainGesture, mainThreeButton],
    },
  ],
  sources: [samsungSpecs, samsungSkinPage, coverThreeButton, coverGesture, mainGesture, mainThreeButton],
};
