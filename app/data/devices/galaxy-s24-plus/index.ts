import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24+ Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s24/specs/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 169.1 mm display diagonal; the product support specification lists 3120×1440 QHD+. PPI is calculated from those values.",
};

const samsungResolution: Source = {
  kind: "official",
  label: "Samsung Galaxy S24+ Product Specifications",
  url: "https://www.samsung.com/sec/support/model/SM-S926NZAAKOO/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists 3120×1440 px QHD+ main display resolution.",
};

const buttonSource: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy S24+ (SM-S926N-KR3), main 3-button",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s24-plus/main-threeButton.json",
  retrievedAt: "2026-09-24",
};

const gestureSource: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy S24+ (SM-S926N-KR3), main gesture",
  url: "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-s24-plus/main-gesture.json",
  retrievedAt: "2026-09-24",
};

const buttonInsets: InsetsMeasurement = {
  systemBars: { top: 33.78, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 95, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 183.11, yDp: 0, widthDp: 18.13, heightDp: 33.42,
    rightDp: 182.76, bottomDp: 798.58,
    xPx: 515, yPx: 0, widthPx: 51, heightPx: 94, rightPx: 514, bottomPx: 2246,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S926N-KR3, build BP4A.251205.006.S926NKSSGDZG1. Portrait rotation 0, FHD+ display setting, 450 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. Only 3-button navigation is captured.",
  },
  sources: [buttonSource],
};

const gestureInsets: InsetsMeasurement = {
  systemBars: { top: 33.78, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 95, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 33.42, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 183.11, yDp: 0, widthDp: 18.13, heightDp: 33.42,
    rightDp: 182.76, bottomDp: 798.58,
    xPx: 515, yPx: 0, widthPx: 51, heightPx: 94, rightPx: 514, bottomPx: 2246,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S926N-KR3, build BP4A.251205.006.S926NKSSGDZG1. Portrait rotation 0, FHD+ display setting, 450 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. Swipe gestures are confirmed by both the Android setting and inset classification.",
  },
  sources: [gestureSource],
};

export const galaxyS24Plus: Device = {
  slug: "galaxy-s24-plus",
  name: "Galaxy S24+",
  brand: "Samsung",
  series: "Galaxy S24",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
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
    cornerRadiiDp: { topLeft: 35.91, topRight: 35.91, bottomRight: 35.91, bottomLeft: 35.91 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: gestureInsets, threeButton: buttonInsets },
    sources: [samsungSpecs, samsungResolution, buttonSource, gestureSource],
  }],
  sources: [samsungSpecs, samsungResolution, buttonSource],
};
