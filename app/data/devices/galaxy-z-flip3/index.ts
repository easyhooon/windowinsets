import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Flip3 5G Specifications",
  url: "https://news.samsung.com/ca/the-next-chapter-in-mobile-innovation-unfold-your-world-with-galaxy-z-fold3-5g-and-galaxy-z-flip3-5g",
  retrievedAt: "2026-09-24",
};
const captureBase = "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip3";
const measuredSource = (mode: "gesture" | "threeButton", date: string): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Flip3 main, ${mode} (SM-F711B)`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: date,
});
const gestureSource = measuredSource("gesture", "2026-09-24");
const threeButtonSource = measuredSource("threeButton", "2026-09-23");
const condition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL Vietnam/Hanoi, SM-F711B-VN2, physically unfolded in portrait (rotation 0). Active and maximum windows both 1080×2640 px; density 480 dpi matched the default. A horizontal FLAT folding feature crossed y=1320. Navigation modes were captured on separate reservations on 2026-09-23 and 2026-09-24. View rotation does not supply landscape insets.",
};
const cutoutShape = {
  xPx: 505, yPx: 0, widthPx: 71, heightPx: 94, rightPx: 504, bottomPx: 2546,
  xDp: 168.33, yDp: 0, widthDp: 23.67, heightDp: 31.33, rightDp: 168, bottomDp: 848.67,
};

export const galaxyZFlip3: Device = {
  slug: "galaxy-z-flip3",
  name: "Galaxy Z Flip3",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: 2021,
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
