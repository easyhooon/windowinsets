import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S22 Ultra display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-s/galaxy-s22-ultra-for-business-sm-s908-sm-s908blbdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.8-inch display and 3088×1440 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S22 Ultra (SM-S908U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s22-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 26.67, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL Vietnam/Hanoi, SM-S908U, build TP1A.220624.014.S908USQU4CWI2. Portrait rotation 0, 1080×2316 px active window, 450 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree. The FHD+ capture (1080×2316) is scaled from the 1440×3088 physical panel. Raw DisplayCutout bounding coordinates are inconsistent with the active window dimensions, so the cutout shape is not rendered; raw JSON is retained unchanged." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.67, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL Vietnam/Hanoi, SM-S908U, build TP1A.220624.014.S908USQU4CWI2. Portrait rotation 0, 1080×2316 px active window, 450 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree. The FHD+ capture (1080×2316) is scaled from the 1440×3088 physical panel. Raw DisplayCutout bounding coordinates are inconsistent with the active window dimensions, so the cutout shape is not rendered; raw JSON is retained unchanged." },
  sources: [captureSource("threeButton")],
};

export const galaxyS22Ultra: Device = {
  slug: "galaxy-s22-ultra",
  name: "Galaxy S22 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3088 },
    logicalSizePx: { width: 1080, height: 2316 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 501,
    logicalSizeDp: { width: 384.00, height: 823.47 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 2.84, topRight: 2.84, bottomRight: 2.84, bottomLeft: 2.84 },
    cornerRadiiPx: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
