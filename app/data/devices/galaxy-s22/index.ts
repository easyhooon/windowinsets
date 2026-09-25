import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S22 display specifications",
  url: "https://www.samsung.com/fr/business/smartphones/galaxy-s/galaxy-s22-sm-s901bzkdeuh/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.1-inch display and 2340×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S22 (SM-S901B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s22/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 27, right: 0, bottom: 15, left: 0 },
  systemBarsPx: { top: 81, right: 0, bottom: 45, left: 0 },
  displayCutout: { top: 27.00000, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 81, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 170.66667, yDp: 0.00000, widthDp: 18.66667, heightDp: 27.00000,
    rightDp: 170.66667, bottomDp: 753.00000,
    xPx: 512, yPx: 0, widthPx: 56, heightPx: 81, rightPx: 512, bottomPx: 2259,
  },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL Vietnam/Hanoi, SM-S901B, build AP3A.240905.015.A2.S901BXXSGFYG1. Portrait rotation 0, 1080×2340 px active window, 480 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 27, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 81, right: 0, bottom: 144, left: 0 },
  displayCutout: { top: 27.00000, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 81, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 170.66667, yDp: 0.00000, widthDp: 18.66667, heightDp: 27.00000,
    rightDp: 170.66667, bottomDp: 753.00000,
    xPx: 512, yPx: 0, widthPx: 56, heightPx: 81, rightPx: 512, bottomPx: 2259,
  },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL Vietnam/Hanoi, SM-S901B, build AP3A.240905.015.A2.S901BXXSGFYG1. Portrait rotation 0, 1080×2340 px active window, 480 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree." },
  sources: [captureSource("threeButton")],
};

export const galaxyS22: Device = {
  slug: "galaxy-s22",
  name: "Galaxy S22",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.1,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 422,
    logicalSizeDp: { width: 360.00, height: 780.00 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 36.00, topRight: 36.00, bottomRight: 36.00, bottomLeft: 36.00 },
    cornerRadiiPx: { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
