import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Flip6 Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-z-flip6/specs/",
  retrievedAt: "2025-01-14",
};

export const galaxyZFlip6: Device = {
  slug: "galaxy-z-flip6",
  name: "Galaxy Z Flip6",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: 2024,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2640 },
      ppi: 425,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [samsungSpecs],
    },
  ],
  sources: [samsungSpecs],
};
