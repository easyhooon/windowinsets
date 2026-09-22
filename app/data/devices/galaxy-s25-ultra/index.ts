import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Ultra Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/specs/",
  retrievedAt: "2025-01-14",
};

const rtlMeasured: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 8.5, Android 16",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-ultra/main-threeButton.json",
  retrievedAt: "2026-09-22",
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
      resolutionPx: { width: 1080, height: 2340 },
      ppi: 450,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: {
        topLeft: 14.93,
        topRight: 14.93,
        bottomRight: 14.93,
        bottomLeft: 14.93,
      },
      insets: {
        gesture: {
          systemBars: { top: 34.13, right: 0, bottom: 14.93, left: 0 },
          displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [rtlMeasured],
        },
        threeButton: {
          systemBars: { top: 34.13, right: 0, bottom: 48, left: 0 },
          displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [rtlMeasured],
        },
      },
      sources: [samsungSpecs, rtlMeasured],
    },
  ],
  sources: [samsungSpecs, rtlMeasured],
};
