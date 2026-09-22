import type { Device, Source } from "../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Ultra Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/specs/",
  retrievedAt: "2025-01-14",
};

export const galaxyS25Ultra: Device = {
  slug: "galaxy-s25-ultra",
  name: "Galaxy S25 Ultra",
  brand: "Samsung",
  series: "Galaxy S25",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.9,
      resolutionPx: { width: 1440, height: 3120 },
      ppi: 486,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [samsungSpecs],
    },
  ],
  sources: [samsungSpecs],
};
