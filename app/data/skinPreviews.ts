import catalog from "./skinCatalog.json";
import type { Device, FormFactor, Screen, Source } from "./types";

const source: Source = {
  kind: "official",
  label: "Samsung Galaxy Emulator Skin (artwork only)",
  url: "https://developer.samsung.com/galaxy-emulator-skin",
  retrievedAt: "2026-09-22",
  note: "Skin layout describes artwork pixels, not device measurements or product specifications.",
};

/** Imported artwork is browsable before RTL captures arrive. No specs are inferred. */
export const skinPreviews: Device[] = catalog.map(entry => ({
  slug: entry.slug, name: entry.name, brand: "Samsung", series: entry.series,
  formFactor: entry.formFactor as FormFactor, releaseYear: null,
  screens: entry.screens.map(id => ({
    id: id as Screen["id"], label: id === "cover" ? "Cover" : "Main",
    diagonalInch: 0, resolutionPx: { width: 0, height: 0 }, ppi: 0,
    logicalSizeDp: null, densityDpi: null, cornerRadiiDp: null,
    insets: { gesture: null, threeButton: null }, sources: [source],
  })),
  sources: [source],
}));
