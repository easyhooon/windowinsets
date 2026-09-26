import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Jump5 (Galaxy A27 5G) display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A276KZKAKTC/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 169.1 mm (6.7-inch) main display with 1080×2340 FHD+ resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A27 5G / Galaxy Jump5 (SM-A276K), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a27-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const internationalVariantSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A27 5G (SM-A276B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a27-5g/SM-A276B/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 36.27, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 102, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.55556, yDp: 8.53333, widthDp: 24.88889, heightDp: 24.88889, rightDp: 179.55556, bottomDp: 798.57778, xPx: 505, yPx: 24, widthPx: 70, heightPx: 70, rightPx: 505, bottomPx: 2246 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy Jump5 / Galaxy A27 5G, SM-A276K, build BP4A.251205.006.A276KKSU2AZH3. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture"), internationalVariantSource("gesture")],
    }
  : {
      systemBars: { top: 36.27, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 102, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.55556, yDp: 8.53333, widthDp: 24.88889, heightDp: 24.88889, rightDp: 179.55556, bottomDp: 798.57778, xPx: 505, yPx: 24, widthPx: 70, heightPx: 70, rightPx: 505, bottomPx: 2246 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy Jump5 / Galaxy A27 5G, SM-A276K, build BP4A.251205.006.A276KKSU2AZH3. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton"), internationalVariantSource("threeButton")],
    };

export const galaxyA27: Device = {
  slug: "galaxy-a27-5g",
  name: "Galaxy A27 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 385,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 41.96, topRight: 41.96, bottomRight: 41.96, bottomLeft: 41.96 },
    cornerRadiiPx: { topLeft: 118, topRight: 118, bottomRight: 118, bottomLeft: 118 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
