import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s25/specs/",
  retrievedAt: "2026-09-24",
  note: "PPI calculated from Samsung's listed 156.4 mm display diagonal and 1080×2340 resolution.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S25 (SM-S931N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s25/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 34.33, right: 0, bottom: mode === "gesture" ? 15 : 48, left: 0 },
  systemBarsPx: { top: 103, right: 0, bottom: mode === "gesture" ? 45 : 144, left: 0 },
  displayCutout: { top: 34.33, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 103, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 170.33, yDp: 0, widthDp: 19.33, heightDp: 34.33,
    rightDp: 170.33, bottomDp: 745.67,
    xPx: 511, yPx: 0, widthPx: 58, heightPx: 103, rightPx: 511, bottomPx: 2237,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S931N_KR1, build BP4A.251205.006.S931NKSSBCZG3. Portrait rotation 0, FHD+ screen resolution, default 480 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS25: Device = {
  slug: "galaxy-s25",
  name: "Galaxy S25",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.2,
      resolutionPx: { width: 1080, height: 2340 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 419,
      logicalSizeDp: { width: 360, height: 780 },
      densityDpi: 480,
      cornerRadiiDp: { topLeft: 34, topRight: 34, bottomRight: 34, bottomLeft: 34 },
      cornerRadiiPx: { topLeft: 102, topRight: 102, bottomRight: 102, bottomLeft: 102 },
      insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
      sources: [samsungSpecs, gestureSource, buttonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
