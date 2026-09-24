import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 FE Specifications",
  url: "https://www.samsung.com/sec/support/model/SM-S721NZKWKOD/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 170.1 mm (6.7-inch) display diagonal and 1080×2340 resolution; PPI is calculated from those values.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S24 FE (SM-S721N-KR4), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s24-fe/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 32.71, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 92, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 32.71, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S721N_KR4, build BP4A.251205.006.S721NKSSDDZG3. InsetsProbe manually labeled the built-in display Phone; portrait rotation 0, 1080×2340 px FHD+ display/window, 450 dpi and font scale 1. Android navigation settings and InsetsProbe classification agree. The raw capture has no DisplayCutout bounding rectangles, so no cutout shape is registered.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS24Fe: Device = {
  slug: "galaxy-s24-fe",
  name: "Galaxy S24 FE",
  brand: "Samsung",
  series: "Galaxy S24",
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
    ppi: 385,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
