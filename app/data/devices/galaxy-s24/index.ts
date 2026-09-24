import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s24/specs/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 156.4 mm display diagonal; PPI is calculated from this diagonal and the published 2340×1080 resolution.",
};

const samsungResolution: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 Product Specifications",
  url: "https://www.samsung.com/sec/support/model/SM-S921NZOFKOO/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists the 2340×1080 px FHD+ main display resolution.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S24 (SM-S921N-KR3), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s24/main-${mode}.json`,
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
    note: "Samsung RTL Korea/Gumi, SM-S921N-KR3, build BP4A.251205.006.S921NKSSGDZG1. Portrait rotation 0, default 2340×1080 display resolution, 480 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. Navigation setting and inset classification agree.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS24: Device = {
  slug: "galaxy-s24",
  name: "Galaxy S24",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
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
    cornerRadiiDp: { topLeft: 36, topRight: 36, bottomRight: 36, bottomLeft: 36 },
    cornerRadiiPx: { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, samsungResolution, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, samsungResolution, gestureSource, buttonSource],
};
