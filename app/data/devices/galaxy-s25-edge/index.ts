import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Edge Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s25-edge/specs/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 169.1 mm display diagonal and 1440×3120 panel resolution; PPI is calculated from those values.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S25 Edge (SM-S937N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s25-edge/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 33.07, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 93, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 33.07, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 93, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 180.98, yDp: 0, widthDp: 22.4, heightDp: 33.07,
    rightDp: 180.62, bottomDp: 798.93,
    xPx: 509, yPx: 0, widthPx: 63, heightPx: 93, rightPx: 508, bottomPx: 2247,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S937N_KR10, build BP4A.251205.006.S937NKSS9CZG3. Portrait rotation 0, FHD+ screen resolution, default 450 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS25Edge: Device = {
  slug: "galaxy-s25-edge",
  name: "Galaxy S25 Edge",
  brand: "Samsung",
  series: "Galaxy S25",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1440, height: 3120 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 516,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: { topLeft: 29.16, topRight: 29.16, bottomRight: 29.16, bottomLeft: 29.16 },
      cornerRadiiPx: { topLeft: 82, topRight: 82, bottomRight: 82, bottomLeft: 82 },
      insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
      sources: [samsungSpecs, gestureSource, buttonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
