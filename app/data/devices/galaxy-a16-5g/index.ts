import type { Device, InsetsMeasurement, Source } from "../../types";

const lteSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A16 LTE (SM-A165N) display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A165NLGEKOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 169.1 mm (6.7-inch) main display at 1080×2340 FHD+. The available official A16 5G skin has the same 1080×2340 display rectangle. Insets below were measured on the LTE unit and retain its exact Android / One UI configuration.",
};

const fiveGSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A16 5G display specifications",
  url: "https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a16-5g-blue-black-128gb-sm-a166bzkdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung also lists a 169.1 mm (6.7-inch), 1080×2340 FHD+ display for the A16 5G; this supports using the available A16 5G screen artwork for the shared display geometry.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A16 LTE (SM-A165N), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a16-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 35.56, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 100, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 35.56, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 100, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.11111, yDp: 0, widthDp: 49.77778, heightDp: 35.55556, rightDp: 167.11111, bottomDp: 796.44444, xPx: 470, yPx: 0, widthPx: 140, heightPx: 100, rightPx: 470, bottomPx: 2240 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A16 LTE (SM-A165N), build BP4A.251205.006.A165NKSS8DZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The available official skin is for Galaxy A16 5G; Samsung lists the LTE and 5G models with the same 169.1 mm, 1080×2340 display geometry." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 35.56, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 100, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 35.56, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 100, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.11111, yDp: 0, widthDp: 49.77778, heightDp: 35.55556, rightDp: 167.11111, bottomDp: 796.44444, xPx: 470, yPx: 0, widthPx: 140, heightPx: 100, rightPx: 470, bottomPx: 2240 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A16 LTE (SM-A165N), build BP4A.251205.006.A165NKSS8DZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The available official skin is for Galaxy A16 5G; Samsung lists the LTE and 5G models with the same 169.1 mm, 1080×2340 display geometry." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA16: Device = {
  slug: "galaxy-a16-5g",
  name: "Galaxy A16",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 386,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 41.96, topRight: 41.96, bottomRight: 41.96, bottomLeft: 41.96 },
    cornerRadiiPx: { topLeft: 118, topRight: 118, bottomRight: 118, bottomLeft: 118 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [lteSpecs, fiveGSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [lteSpecs, fiveGSpecs, captureSource("gesture"), captureSource("threeButton")],
};
