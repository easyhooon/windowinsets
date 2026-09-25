import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A17 display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A175NZAAKOD/",
  retrievedAt: "2026-09-25",
  note: "The RTL unit SM-A175N is Galaxy A17 LTE, not the 5G variant. Samsung lists the LTE display as 169.1 mm, 1080×2340 FHD+; the available official emulator artwork is the A17 5G skin with the same screen rectangle.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A17 (SM-A175N), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-a17-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => {
  if (mode === "gesture") return {
      systemBars: { top: 35.56, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 100, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 35.56, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 100, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.11111, yDp: 0.00000, widthDp: 49.77778, heightDp: 35.55556, rightDp: 167.11111, bottomDp: 796.44444, xPx: 470, yPx: 0, widthPx: 140, heightPx: 100, rightPx: 470, bottomPx: 2240 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A17 (SM-A175N), build BP4A.251205.006.A175NKSS6CZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The RTL unit SM-A175N is Galaxy A17 LTE, not the 5G variant. Samsung lists the LTE display as 169.1 mm, 1080×2340 FHD+; the available official emulator artwork is the A17 5G skin with the same screen rectangle." },
      sources: [captureSource("gesture")],
    };
  if (mode === "threeButton") return {
      systemBars: { top: 35.56, right: 0, bottom: 48.00, left: 0 },
      systemBarsPx: { top: 100, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 35.56, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 100, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.11111, yDp: 0.00000, widthDp: 49.77778, heightDp: 35.55556, rightDp: 167.11111, bottomDp: 796.44444, xPx: 470, yPx: 0, widthPx: 140, heightPx: 100, rightPx: 470, bottomPx: 2240 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A17 (SM-A175N), build BP4A.251205.006.A175NKSS6CZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The RTL unit SM-A175N is Galaxy A17 LTE, not the 5G variant. Samsung lists the LTE display as 169.1 mm, 1080×2340 FHD+; the available official emulator artwork is the A17 5G skin with the same screen rectangle." },
      sources: [captureSource("threeButton")],
    };
  return null;
};

export const galaxyA17: Device = {
  slug: "galaxy-a17-5g",
  name: "Galaxy A17",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2025,
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
    cornerRadiiDp: { topLeft: 39.11, topRight: 39.11, bottomRight: 39.11, bottomLeft: 39.11 },
    cornerRadiiPx: { topLeft: 110, topRight: 110, bottomRight: 110, bottomLeft: 110 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
