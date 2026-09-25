import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S21 Ultra display specifications",
  url: "https://www.samsung.com/cz/support/mobile-devices/srovnani-modelu-smartphonu-galaxy-s21-ultra-5g-s21-5g-a-note10/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.8-inch display and 3200×1440 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S21 Ultra (SM-G998B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s21-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => mode === "gesture"
  ? {
  systemBars: { top: 26.67, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 181.68889, yDp: 0.00000, widthDp: 20.62222, heightDp: 26.66667, rightDp: 181.68889, bottomDp: 826.66667, xPx: 511, yPx: 0, widthPx: 58, heightPx: 75, rightPx: 511, bottomPx: 2325 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G998B, build UP1A.231005.007.G998BXXUCGXGC. Portrait rotation 0, 1080×2400 px active window, 450 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The 1080×2400 px active window is FHD+ on the 1440×3200 physical panel." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.67, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 181.68889, yDp: 0.00000, widthDp: 20.62222, heightDp: 26.66667, rightDp: 181.68889, bottomDp: 826.66667, xPx: 511, yPx: 0, widthPx: 58, heightPx: 75, rightPx: 511, bottomPx: 2325 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G998B, build UP1A.231005.007.G998BXXUCGXGC. Portrait rotation 0, 1080×2400 px active window, 450 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The 1080×2400 px active window is FHD+ on the 1440×3200 physical panel." },
  sources: [captureSource("threeButton")],
};

export const galaxyS21Ultra: Device = {
  slug: "galaxy-s21-ultra",
  name: "Galaxy S21 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3200 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 516,
    logicalSizeDp: { width: 384.00, height: 853.33 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
