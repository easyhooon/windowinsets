import type { Device, Source } from "../types";

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
      resolutionPx: { width: 3120, height: 1440 },
      ppi: 496,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
      insets: {
        gesture: null,
        threeButton: {
          systemBars: { top: 33.78, right: 0, bottom: 48, left: 0 },
          displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [probe],
        },
      },
      sources: [samsungSpecs],
    },
  ],
  sources: [samsungSpecs],
};
