import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Note20 display specifications",
  url: "https://www.samsung.com/us/business/support/owners/product/galaxy-note20-5g-verizon/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch display, 2400×1080 FHD+ resolution and 393 ppi.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Note20 (SM-N981U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-note20/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 32.71, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 92, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 32.71111, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.84444, yDp: 0.00000, widthDp: 26.31111, heightDp: 32.71111, rightDp: 178.84444, bottomDp: 820.62222, xPx: 503, yPx: 0, widthPx: 74, heightPx: 92, rightPx: 503, bottomPx: 2308 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-N981U, build TP1A.220624.014.N981USQS6HXC1. portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 32.71, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 92, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 32.71111, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.84444, yDp: 0.00000, widthDp: 26.31111, heightDp: 32.71111, rightDp: 178.84444, bottomDp: 820.62222, xPx: 503, yPx: 0, widthPx: 74, heightPx: 92, rightPx: 503, bottomPx: 2308 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-N981U, build TP1A.220624.014.N981USQS6HXC1. portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1." },
  sources: [captureSource("threeButton")],
};

export const galaxyNote20: Device = {
  slug: "galaxy-note20",
  name: "Galaxy Note20",
  brand: "Samsung",
  series: "Galaxy Note",
  formFactor: "bar",
  releaseYear: 2020,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 393,
    logicalSizeDp: { width: 384.00000, height: 853.33333 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 8.88889, topRight: 8.88889, bottomRight: 8.88889, bottomLeft: 8.88889 },
    cornerRadiiPx: { topLeft: 25, topRight: 25, bottomRight: 25, bottomLeft: 25 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
