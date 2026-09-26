import type { Device, InsetsMeasurement, Source } from "../../types";

const specs: Source = {
  kind: "official",
  label: "Samsung Galaxy S26 Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s26/specs/",
  retrievedAt: "2026-09-23",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.2.1 on Samsung RTL Galaxy S26 (SM-S942N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s26/main-${mode}.json`,
  retrievedAt: "2026-09-23",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 37, right: 0, bottom: mode === "gesture" ? 15 : 48, left: 0 },
  systemBarsPx: { top: 111, right: 0, bottom: mode === "gesture" ? 45 : 144, left: 0 },
  displayCutout: { top: 37, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 111, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 169.33, yDp: 0, widthDp: 21.33, heightDp: 37,
    rightDp: 169.33, bottomDp: 743,
    xPx: 508, yPx: 0, widthPx: 64, heightPx: 111, rightPx: 508, bottomPx: 2229,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S942N_KR1, build BP4A.251205.006.S942NKSS4AZHA. Portrait rotation 0, FHD+ screen resolution, 480 dpi and font scale 1. The captured app window and physical panel are both 1080×2340 px. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS26: Device = {
  slug: "galaxy-s26",
  name: "Galaxy S26",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.3,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 0,
    logicalSizeDp: { width: 360, height: 780 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 28, topRight: 28, bottomRight: 28, bottomLeft: 28 },
    cornerRadiiPx: { topLeft: 84, topRight: 84, bottomRight: 84, bottomLeft: 84 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [specs, gestureSource, buttonSource],
  }],
  sources: [specs, gestureSource, buttonSource],
};
