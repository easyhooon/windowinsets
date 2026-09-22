import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25+ Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-s25/specs/",
  retrievedAt: "2025-01-14",
};

const probe: Source = {
  kind: "measured",
  label: "InsetsProbe on SM-S936N (Korea)",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-plus/main-threeButton.json",
  retrievedAt: "2025-01-14",
};

const probeGesture: Source = {
  kind: "measured",
  label: "InsetsProbe on SM-S936N (Korea)",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-plus/main-gesture.json",
  retrievedAt: "2026-09-22",
};

export const galaxyS25Plus: Device = {
  slug: "galaxy-s25-plus",
  name: "Galaxy S25+",
  brand: "Samsung",
  series: "Galaxy S25",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1440, height: 3120 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      ppi: 0,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
      cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
      insets: {
        gesture: {
          systemBars: { top: 33.78, right: 0, bottom: 14.93, left: 0 },
          systemBarsPx: { top: 95, right: 0, bottom: 42, left: 0 },
          displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 183.11, yDp: 0, widthDp: 18.13, heightDp: 33.42, rightDp: 182.76, bottomDp: 798.58, xPx: 515, yPx: 0, widthPx: 51, heightPx: 94, rightPx: 514, bottomPx: 2246 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [probeGesture],
        },
        threeButton: {
          systemBars: { top: 33.78, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 95, right: 0, bottom: 135, left: 0 },
          displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 183.11, yDp: 0, widthDp: 18.13, heightDp: 33.42, rightDp: 182.76, bottomDp: 798.58, xPx: 515, yPx: 0, widthPx: 51, heightPx: 94, rightPx: 514, bottomPx: 2246 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [probe],
        },
      },
      sources: [samsungSpecs, probe, probeGesture],
    },
  ],
  sources: [samsungSpecs, probe, probeGesture],
};
