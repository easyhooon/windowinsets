import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold6 Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-z-fold6/specs/",
  retrievedAt: "2025-01-14",
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
      id: "main",
      label: "Main",
      diagonalInch: 7.6,
      resolutionPx: { width: 2160, height: 1856 },
      ppi: 374,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [samsungSpecs],
    },
  ],
  sources: [samsungSpecs],
};
