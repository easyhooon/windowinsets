import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S22 Plus display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-s/galaxy-s22-plus-for-business-sm-s901-sm-s906bzwgeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.6-inch display and 2340×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S22 Plus (SM-S906B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s22-plus/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 26.31, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 74, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 26.31111, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 74, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 182.75556, yDp: 0.00000, widthDp: 18.48889, heightDp: 26.31111,
    rightDp: 182.75556, bottomDp: 805.68889,
    xPx: 514, yPx: 0, widthPx: 52, heightPx: 74, rightPx: 514, bottomPx: 2266,
  },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL Vietnam/Hanoi, SM-S906B, build AP3A.240905.015.A2.S906BXXUDFYD9. Portrait rotation 0, 1080×2340 px active window, 450 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.31, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 74, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 26.31111, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 74, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 182.75556, yDp: 0.00000, widthDp: 18.48889, heightDp: 26.31111,
    rightDp: 182.75556, bottomDp: 805.68889,
    xPx: 514, yPx: 0, widthPx: 52, heightPx: 74, rightPx: 514, bottomPx: 2266,
  },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL Vietnam/Hanoi, SM-S906B, build AP3A.240905.015.A2.S906BXXUDFYD9. Portrait rotation 0, 1080×2340 px active window, 450 dpi and font scale 1. Android setting and InsetsProbe navigation classification agree." },
  sources: [captureSource("threeButton")],
};

export const galaxyS22Plus: Device = {
  slug: "galaxy-s22-plus",
  name: "Galaxy S22 Plus",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 390,
    logicalSizeDp: { width: 384.00, height: 832.00 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 35.91, topRight: 35.91, bottomRight: 35.91, bottomLeft: 35.91 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
