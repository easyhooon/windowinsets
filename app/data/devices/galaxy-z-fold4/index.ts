import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold4 specifications",
  url: "https://news.samsung.com/us/samsung-galaxy-z-flip4-galaxy-z-fold4-unpacked-2022-most-versatile-smartphones/",
  retrievedAt: "2026-09-23",
};
const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-23",
};
const captureBase = "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold4";
const source = (screen: "cover" | "main", mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold4 ${screen}, ${mode} (SM-F936B)`,
  url: `${captureBase}/${screen}-${mode}.json`,
  retrievedAt: "2026-09-23",
});
const coverGesture = source("cover", "gesture");
const coverThreeButton = source("cover", "threeButton");
const mainGesture = source("main", "gesture");
const mainThreeButton = source("main", "threeButton");

const coverCondition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL, physically folded, portrait (rotation 0). Active window 904×2316 px with a 68×87 px cutout at x=418. A rotated first gesture attempt is retained as rejected evidence.",
};
const mainCondition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL, physically unfolded, portrait (rotation 0). Active window 1812×2176 px with a vertical FLAT folding feature at x=906. Taskbar was turned off for both accepted captures. The first gesture attempt with taskbar (168 px bottom) and a rotated 3-button attempt are retained as rejected evidence.",
};
const coverCutout = {
  xDp: 159.24,
  yDp: 0,
  widthDp: 25.9,
  heightDp: 33.14,
  rightDp: 159.24,
  bottomDp: 849.15,
  xPx: 418,
  yPx: 0,
  widthPx: 68,
  heightPx: 87,
  rightPx: 418,
  bottomPx: 2229,
};

export const galaxyZFold4: Device = {
  slug: "galaxy-z-fold4",
  name: "Galaxy Z Fold4",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2022,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 6.2,
      resolutionPx: { width: 904, height: 2316 },
      logicalSizePx: { width: 904, height: 2316 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 403,
      logicalSizeDp: { width: 344.38, height: 882.29 },
      densityDpi: 420,
      cornerRadiiDp: null,
      cornerRadiiPx: null,
      insets: {
        gesture: {
          systemBars: { top: 33.14, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 87, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 33.14, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 87, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 33.14, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 87, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 33.14, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 87, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverThreeButton],
        },
      },
      sources: [samsungSpecs, samsungSkinPage, coverThreeButton, coverGesture],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 7.6,
      resolutionPx: { width: 1812, height: 2176 },
      logicalSizePx: { width: 1812, height: 2176 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 377,
      logicalSizeDp: { width: 690.29, height: 828.95 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 20.19, topRight: 20.19, bottomRight: 20.19, bottomLeft: 20.19 },
      cornerRadiiPx: { topLeft: 53, topRight: 53, bottomRight: 53, bottomLeft: 53 },
      insets: {
        gesture: {
          systemBars: { top: 31.24, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 82, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 31.24, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 82, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainThreeButton],
        },
      },
      sources: [samsungSpecs, samsungSkinPage, mainThreeButton, mainGesture],
    },
  ],
  sources: [samsungSpecs, samsungSkinPage, coverThreeButton, coverGesture, mainThreeButton, mainGesture],
};
