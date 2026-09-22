import type { Device, Source } from "../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-s25/specs/",
  retrievedAt: "2025-01-14",
};

export const galaxyS25: Device = {
  slug: "galaxy-s25",
  name: "Galaxy S25",
  brand: "Samsung",
  series: "Galaxy S25",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.2,
      resolutionPx: { width: 1080, height: 2340 },
      ppi: 426,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [samsungSpecs],
    },
  ],
  sources: [samsungSpecs],
};
