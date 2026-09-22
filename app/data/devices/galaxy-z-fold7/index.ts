import type { Device, Source } from "../../types";

const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-22",
};

export const galaxyZFold7: Device = {
  slug: "galaxy-z-fold7",
  name: "Galaxy Z Fold7",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2025,
  screens: [
    {
      id: "cover",
      label: "Cover",
      // Spec + inset values not verified yet.
      diagonalInch: 0,
      resolutionPx: { width: 0, height: 0 },
      ppi: 0,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 8.0,
      resolutionPx: { width: 1968, height: 2184 },
      ppi: 368,
      logicalSizeDp: null,
      densityDpi: null,
      cornerRadiiDp: null,
      insets: { gesture: null, threeButton: null },
      sources: [samsungSkinPage],
    },
  ],
  sources: [samsungSkinPage],
};
