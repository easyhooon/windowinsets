import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S11 Ultra Specifications",
  url: "https://www.samsung.com/sec/support/model/SM-X930NZSEKOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 369.9 mm (14.6-inch) display diagonal and 2960×1848 px WQXGA+ resolution; PPI is calculated from those values.",
};

const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab-s11-ultra";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S11 Ultra main (SM-X930), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL Galaxy Tab S11 Ultra Wi-Fi (SM-X930), build BP4A.251205.006.X930XXS7BZG3. Main display landscape, rotation 1, full-screen 2960×1848 px window, 280 dpi and font scale 1. Probe's non-foldable screen label is `phone`; this capture is classified as the tablet's main display from the model and dimensions. Gesture mode is confirmed by Settings, config_navBarInteractionMode=2 and left/right system gesture insets, although the inset-only heuristic reports threeButton because the tappable bottom inset is nonzero.",
};

const cutoutShape = {
  xDp: 817.14, yDp: 0, widthDp: 57.14, heightDp: 16, rightDp: 817.14, bottomDp: 1040,
  xPx: 1430, yPx: 0, widthPx: 100, heightPx: 28, rightPx: 1430, bottomPx: 1820,
};

const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const navigationBottom = mode === "gesture" ? 14.86 : 48;
  const navigationBottomPx = mode === "gesture" ? 26 : 84;
  const source = mode === "gesture" ? gestureSource : threeButtonSource;
  return {
    systemBars: { top: 34.29, right: 0, bottom: navigationBottom, left: 0 },
    systemBarsPx: { top: 60, right: 0, bottom: navigationBottomPx, left: 0 },
    displayCutout: { top: 16, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 28, right: 0, bottom: 0, left: 0 },
    cutoutShape,
    condition,
    sources: [source],
  };
};

export const galaxyTabS11Ultra: Device = {
  slug: "galaxy-tab-s11-ultra",
  name: "Galaxy Tab S11 Ultra",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 14.6,
    resolutionPx: { width: 2960, height: 1848 },
    logicalSizePx: { width: 2960, height: 1848 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 240,
    logicalSizeDp: { width: 1691.43, height: 1056 },
    densityDpi: 280,
    cornerRadiiDp: { topLeft: 25.14, topRight: 25.14, bottomRight: 25.14, bottomLeft: 25.14 },
    cornerRadiiPx: { topLeft: 44, topRight: 44, bottomRight: 44, bottomLeft: 44 },
    insets: {
      gesture: measurement("gesture"),
      threeButton: measurement("threeButton"),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
