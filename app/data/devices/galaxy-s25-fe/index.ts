import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 FE Specifications",
  url: "https://www.samsung.com/sg/smartphones/galaxy-s/galaxy-s25-fe-icyblue-512gb-sm-s731blbhxsp/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 171.1 mm display diagonal and 1080×2340 resolution; PPI is calculated from those values.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S25 FE (SM-S731N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s25-fe/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 34.49, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 97, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 29.16, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 181.69, yDp: 8.53, widthDp: 20.62, heightDp: 20.62,
    rightDp: 181.69, bottomDp: 802.84,
    xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S731N_KR1, build BP4A.251205.006.S731NKSS8BZG3. Portrait rotation 0, default FHD+ screen resolution, 450 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. Screen timeout was set to 10 minutes. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS25Fe: Device = {
  slug: "galaxy-s25-fe",
  name: "Galaxy S25 FE",
  brand: "Samsung",
  series: "Galaxy S25",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2340 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 383,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
      cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
      insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
      sources: [samsungSpecs, gestureSource, buttonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
