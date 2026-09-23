import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Flip5 Specifications",
  url: "https://images.samsung.com/is/content/samsung/assets/pl/2307/mktpd/b5/Galaxy_Z_Flip5_spec.pdf",
  retrievedAt: "2026-09-23",
};
const captureBase = "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip5";
const measuredSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Flip5 main, ${mode} (SM-F731B)`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-23",
});
const gestureSource = measuredSource("gesture");
const threeButtonSource = measuredSource("threeButton");
const condition = {
  oneUi: "6.1.1",
  android: "14",
  note: "Samsung RTL Vietnam/Hanoi, SM-F731BE-VN3, physically unfolded in portrait (rotation 0). Active and maximum windows both 1080×2640 px; density 480 dpi matched the default. A horizontal FLAT folding feature crossed y=1320. View rotation does not supply landscape insets.",
};
const cutoutShape = {
  xPx: 505, yPx: 0, widthPx: 71, heightPx: 94, rightPx: 504, bottomPx: 2546,
  xDp: 168.33, yDp: 0, widthDp: 23.67, heightDp: 31.33, rightDp: 168, bottomDp: 848.67,
};

export const galaxyZFlip5: Device = {
  slug: "galaxy-z-flip5",
  name: "Galaxy Z Flip5",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: 2023,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2640 },
      logicalSizePx: { width: 1080, height: 2640 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 425,
      logicalSizeDp: { width: 360, height: 880 },
      densityDpi: 480,
      cornerRadiiDp: { topLeft: 36, topRight: 36, bottomRight: 36, bottomLeft: 36 },
      cornerRadiiPx: { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 },
      insets: {
        gesture: {
          systemBars: { top: 31.33, right: 0, bottom: 15, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 45, left: 0 },
          displayCutout: { top: 31.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [gestureSource],
        },
        threeButton: {
          systemBars: { top: 31.33, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 144, left: 0 },
          displayCutout: { top: 31.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [threeButtonSource],
        },
      },
      sources: [samsungSpecs, gestureSource, threeButtonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
