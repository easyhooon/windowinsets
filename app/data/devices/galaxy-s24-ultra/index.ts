import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 Ultra Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s24-ultra/specs/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 172.5 mm display diagonal and 1440×3120 resolution; PPI is calculated from those values.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S24 Ultra (SM-S928N-KR3), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s24-ultra/recapture-2026-09-24/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 34.49, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 97, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S928N-KR3, build BP4A.251205.006.S928NKSS6DZG1. Portrait rotation 0, default FHD+ screen resolution, 450 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. The raw capture has no cutout bounding rectangle. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

export const galaxyS24Ultra: Device = {
  slug: "galaxy-s24-ultra",
  name: "Galaxy S24 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3120 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 506,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 2.13, topRight: 2.13, bottomRight: 2.13, bottomLeft: 2.13 },
    cornerRadiiPx: { topLeft: 6, topRight: 6, bottomRight: 6, bottomLeft: 6 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
