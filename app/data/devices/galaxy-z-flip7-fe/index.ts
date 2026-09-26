import type { Device, InsetsMeasurement, Source } from "../../types";

const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip7-fe";
const sourceFor = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Flip7 FE main (SM-F761B), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const gestureSource = sourceFor("gesture");
const threeButtonSource = sourceFor("threeButton");
const condition = {
  oneUi: "8.0",
  android: "16",
  note: "Samsung RTL, SM-F761B / build BP2A.250605.031.A3.F761BXXU4AYI1. Main display fully unfolded at 180° in portrait, rotation 0. Active and maximum windows are 1080×2640 px at 480 dpi and font scale 1. The capture reports a horizontal FLAT folding feature at y=1320 px. InsetsProbe and Android navigation configuration agree for both modes.",
};

const cutoutShape = {
  xDp: 169, yDp: 0, widthDp: 22, heightDp: 38.67, rightDp: 169, bottomDp: 841.33,
  xPx: 507, yPx: 0, widthPx: 66, heightPx: 116, rightPx: 507, bottomPx: 2524,
};

const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const navigationBottom = mode === "gesture" ? 15 : 48;
  const navigationBottomPx = mode === "gesture" ? 45 : 144;
  const source = mode === "gesture" ? gestureSource : threeButtonSource;
  return {
    systemBars: { top: 38.67, right: 0, bottom: navigationBottom, left: 0 },
    systemBarsPx: { top: 116, right: 0, bottom: navigationBottomPx, left: 0 },
    displayCutout: { top: 38.67, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 116, right: 0, bottom: 0, left: 0 },
    cutoutShape,
    condition,
    sources: [source],
  };
};

export const galaxyZFlip7Fe: Device = {
  slug: "galaxy-z-flip7-fe",
  name: "Galaxy Z Flip7 FE",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: null,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 0,
    resolutionPx: { width: 1080, height: 2640 },
    logicalSizePx: { width: 1080, height: 2640 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 0,
    logicalSizeDp: { width: 360, height: 880 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 36, topRight: 36, bottomRight: 36, bottomLeft: 36 },
    cornerRadiiPx: { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 },
    insets: {
      gesture: measurement("gesture"),
      threeButton: measurement("threeButton"),
    },
    sources: [gestureSource, threeButtonSource],
  }],
  sources: [gestureSource, threeButtonSource],
};
