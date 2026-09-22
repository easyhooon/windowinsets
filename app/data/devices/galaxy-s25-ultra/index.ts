import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Ultra Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/specs/",
  retrievedAt: "2025-01-14",
};

const rtlThreeButton: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 8.5, Android 16",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-ultra/main-threeButton.json",
  retrievedAt: "2026-09-22",
};

const rtlGesture: Source = {
  ...rtlThreeButton,
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-ultra/main-gesture.json",
};

export const galaxyS25Ultra: Device = {
  slug: "galaxy-s25-ultra",
  name: "Galaxy S25 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.9,
      resolutionPx: { width: 1440, height: 3120 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      ppi: 0,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: {
        topLeft: 14.93,
        topRight: 14.93,
        bottomRight: 14.93,
        bottomLeft: 14.93,
      },
      cornerRadiiPx: { topLeft: 42, topRight: 42, bottomRight: 42, bottomLeft: 42 },
      insets: {
        gesture: {
          systemBars: { top: 34.13, right: 0, bottom: 14.93, left: 0 },
          systemBarsPx: { top: 96, right: 0, bottom: 42, left: 0 },
          displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13, rightDp: 182.76, bottomDp: 797.87, xPx: 514, yPx: 0, widthPx: 52, heightPx: 96, rightPx: 514, bottomPx: 2244 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [rtlGesture],
        },
        threeButton: {
          systemBars: { top: 34.13, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 96, right: 0, bottom: 135, left: 0 },
          displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13, rightDp: 182.76, bottomDp: 797.87, xPx: 514, yPx: 0, widthPx: 52, heightPx: 96, rightPx: 514, bottomPx: 2244 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [rtlThreeButton],
        },
      },
      sources: [samsungSpecs, rtlThreeButton, rtlGesture],
    },
  ],
  sources: [samsungSpecs, rtlThreeButton, rtlGesture],
};
