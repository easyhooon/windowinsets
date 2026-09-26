import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S23 FE display specifications",
  url: "https://www.samsung.com/mx/smartphones/galaxy-s/galaxy-s23-fe-cream-128gb-sm-s711bzwlltm/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.4-inch display and 2340×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S23 FE (SM-S711B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s23-fe/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 34.49, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 97, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 29.15556, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 181.68889, yDp: 8.53333, widthDp: 20.62222, heightDp: 20.62222,
    rightDp: 181.68889, bottomDp: 802.84444,
    xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258,
  },
  condition: { oneUi: "8.5", android: "16", note: "Samsung RTL Vietnam/Hanoi, SM-S711B, build BP4A.251205.006.S711BXXSIGZH9. Portrait rotation 0, 1080×2340 px active window, 450 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 34.49, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 97, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 29.15556, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 181.68889, yDp: 8.53333, widthDp: 20.62222, heightDp: 20.62222,
    rightDp: 181.68889, bottomDp: 802.84444,
    xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258,
  },
  condition: { oneUi: "8.5", android: "16", note: "Samsung RTL Vietnam/Hanoi, SM-S711B, build BP4A.251205.006.S711BXXSIGZH9. Portrait rotation 0, 1080×2340 px active window, 450 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree." },
  sources: [captureSource("threeButton")],
};

export const galaxyS23Fe: Device = {
  slug: "galaxy-s23-fe",
  name: "Galaxy S23 FE",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.4,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 403,
    logicalSizeDp: { width: 384.00, height: 832.00 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
    cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
