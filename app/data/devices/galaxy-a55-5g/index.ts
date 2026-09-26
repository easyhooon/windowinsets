import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Quantum5 / Galaxy A55 5G display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A556SZKBSKC/",
  retrievedAt: "2026-09-25",
  note: "Samsung identifies SM-A556S as Galaxy Quantum5 (SKT) and lists a 168.3 mm, 1080×2340 FHD+ main display. The registered Galaxy A55 5G skin has the same screen resolution.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Quantum5 / Galaxy A55 5G (SM-A556S), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a55-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 31.64, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 89, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 31.64, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 89, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 180.27, yDp: 8.18, widthDp: 23.47, heightDp: 23.47, rightDp: 180.27, bottomDp: 800.36, xPx: 507, yPx: 23, widthPx: 66, heightPx: 66, rightPx: 507, bottomPx: 2251 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy Quantum5 / Galaxy A55 5G (SM-A556S), build BP4A.251205.006.A556SKSS9DZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 31.64, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 89, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 31.64, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 89, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 180.27, yDp: 8.18, widthDp: 23.47, heightDp: 23.47, rightDp: 180.27, bottomDp: 800.36, xPx: 507, yPx: 23, widthPx: 66, heightPx: 66, rightPx: 507, bottomPx: 2251 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy Quantum5 / Galaxy A55 5G (SM-A556S), build BP4A.251205.006.A556SKSS9DZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA55: Device = {
  slug: "galaxy-a55-5g",
  name: "Galaxy A55 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 389,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 41.96, topRight: 41.96, bottomRight: 41.96, bottomLeft: 41.96 },
    cornerRadiiPx: { topLeft: 118, topRight: 118, bottomRight: 118, bottomLeft: 118 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
