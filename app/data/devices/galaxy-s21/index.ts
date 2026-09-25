import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S21 display specifications",
  url: "https://www.samsung.com/cz/support/mobile-devices/srovnani-modelu-smartphonu-galaxy-s21-ultra-5g-s21-5g-a-note10/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.2-inch display and 2400×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S21 (SM-G991B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s21/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => mode === "gesture"
  ? {
  systemBars: { top: 26.67, right: 0, bottom: 15, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: 45, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 170.00000, yDp: 0.00000, widthDp: 20.00000, heightDp: 26.66667, rightDp: 170.00000, bottomDp: 773.33333, xPx: 510, yPx: 0, widthPx: 60, heightPx: 80, rightPx: 510, bottomPx: 2320 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G991B, build UP1A.231005.007.G991BXXSEGYA2. Portrait rotation 0, 1080×2400 px active window, 480 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.67, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: 144, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 170.00000, yDp: 0.00000, widthDp: 20.00000, heightDp: 26.66667, rightDp: 170.00000, bottomDp: 773.33333, xPx: 510, yPx: 0, widthPx: 60, heightPx: 80, rightPx: 510, bottomPx: 2320 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G991B, build UP1A.231005.007.G991BXXSEGYA2. Portrait rotation 0, 1080×2400 px active window, 480 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
  sources: [captureSource("threeButton")],
};

export const galaxyS21: Device = {
  slug: "galaxy-s21",
  name: "Galaxy S21",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.2,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 424,
    logicalSizeDp: { width: 360.00, height: 800.00 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 30.00, topRight: 30.00, bottomRight: 30.00, bottomLeft: 30.00 },
    cornerRadiiPx: { topLeft: 90, topRight: 90, bottomRight: 90, bottomLeft: 90 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
