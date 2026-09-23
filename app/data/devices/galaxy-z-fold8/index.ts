import type { Device, Source } from "../../types";

const captureBase = "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold8/recapture-2026-09-22";

const coverThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.1.2 on Samsung RTL Galaxy Z Fold8 cover, 3-button (SM-F971N)",
  url: `${captureBase}/cover-threeButton.json`,
  retrievedAt: "2026-09-22",
};

const coverGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.1.2 on Samsung RTL Galaxy Z Fold8 cover, gestures (SM-F971N)",
  url: `${captureBase}/cover-gesture.json`,
  retrievedAt: "2026-09-22",
};

const mainThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.1.2 on Samsung RTL Galaxy Z Fold8 inner display, 3-button (SM-F971N)",
  url: `${captureBase}/main-threeButton.json`,
  retrievedAt: "2026-09-22",
};

const mainGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.1.2 on Samsung RTL Galaxy Z Fold8 inner display, gestures (SM-F971N)",
  url: `${captureBase}/main-gesture.json`,
  retrievedAt: "2026-09-22",
};

const chassisSource: Source = {
  kind: "official", label: "Samsung Galaxy Z Fold8 specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-z-fold8/specs/",
  retrievedAt: "2026-09-23",
};

const coverCondition = {
  oneUi: "9.0",
  android: "17",
  note: "Samsung RTL, physically folded, portrait. Active window 1248×1972 px. RTL's hinge sensor reported 180° with no folding feature while closed, so display identity is verified from the active window and official cover layout rather than the angle reading.",
};

const mainCondition = {
  oneUi: "9.0",
  android: "17",
  note: "Samsung RTL, fully unfolded, landscape. Active window 2448×1848 px. WindowManager reported a vertical FLAT folding feature at the display midpoint.",
};

export const galaxyZFold8: Device = {
  slug: "galaxy-z-fold8",
  name: "Galaxy Z Fold8",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  foldAnimation: true,
  chassisMm: { unfoldedWidth: 161.4, unfoldedDepth: 4.5, foldedDepth: 9.7, source: chassisSource },
  releaseYear: 2026,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 0,
      resolutionPx: { width: 1248, height: 1972 },
      logicalSizePx: { width: 1248, height: 1972 },
      captureOrientation: "portrait",
      ppi: 0,
      logicalSizeDp: { width: 475.43, height: 751.24 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 9.9, topRight: 9.9, bottomRight: 9.9, bottomLeft: 9.9 },
      cornerRadiiPx: { topLeft: 26, topRight: 26, bottomRight: 26, bottomLeft: 26 },
      insets: {
        gesture: {
          systemBars: { top: 41.9, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 110, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 39.62, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 104, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 224.38, yDp: 0, widthDp: 26.67, heightDp: 39.62, rightDp: 224.38, bottomDp: 711.62, xPx: 589, yPx: 0, widthPx: 70, heightPx: 104, rightPx: 589, bottomPx: 1868 },
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 41.9, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 110, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 39.62, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 104, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 224.38, yDp: 0, widthDp: 26.67, heightDp: 39.62, rightDp: 224.38, bottomDp: 711.62, xPx: 589, yPx: 0, widthPx: 70, heightPx: 104, rightPx: 589, bottomPx: 1868 },
          condition: coverCondition,
          sources: [coverThreeButton],
        },
      },
      sources: [coverThreeButton, coverGesture],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 0,
      resolutionPx: { width: 2448, height: 1848 },
      logicalSizePx: { width: 2448, height: 1848 },
      captureOrientation: "landscape",
      ppi: 0,
      logicalSizeDp: { width: 932.57, height: 704 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 6.86, topRight: 6.86, bottomRight: 6.86, bottomLeft: 6.86 },
      cornerRadiiPx: { topLeft: 18, topRight: 18, bottomRight: 18, bottomLeft: 18 },
      insets: {
        gesture: {
          systemBars: { top: 40, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 105, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 40, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 105, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainThreeButton],
        },
      },
      sources: [mainThreeButton, mainGesture],
    },
  ],
  sources: [chassisSource, coverThreeButton, coverGesture, mainThreeButton, mainGesture],
};
