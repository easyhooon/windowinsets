import type { Insets, InsetsMeasurement, Screen } from "./types";

export type Units = "dp" | "px";
export type ExactLengthPair = readonly [dp: number, px: number | null | undefined];

export function formatLength({
  dp,
  px,
  units,
}: {
  dp: number;
  px?: number | null;
  units: Units;
}): string {
  const value = units === "px" ? px : dp;
  if (value == null) return "pending";
  return value === 0 ? "0" : Number(value.toFixed(2)).toString();
}

export function formatLengthFromPairs(units: Units, pairs: ExactLengthPair[]) {
  const exact = new Map(
    pairs
      .filter((pair): pair is readonly [number, number] => pair[1] != null)
      .map(([dp, px]) => [dp.toFixed(6), px]),
  );
  return (dp: number) => formatLength({ dp, px: exact.get(dp.toFixed(6)), units });
}

export function insetPairs(dp?: Insets | null, px?: Insets | null): ExactLengthPair[] {
  if (!dp) return [];
  return [
    [dp.top, px?.top],
    [dp.right, px?.right],
    [dp.bottom, px?.bottom],
    [dp.left, px?.left],
  ];
}

export function cornerPairs(
  dp?: Screen["cornerRadiiDp"],
  px?: Screen["cornerRadiiPx"],
): ExactLengthPair[] {
  if (!dp) return [];
  return [
    [dp.topLeft, px?.topLeft],
    [dp.topRight, px?.topRight],
    [dp.bottomRight, px?.bottomRight],
    [dp.bottomLeft, px?.bottomLeft],
  ];
}

export function hasExactPx(screen: Screen, measurement: InsetsMeasurement | null): boolean {
  if (!screen.logicalSizePx) return false;
  if (screen.cornerRadiiDp && !screen.cornerRadiiPx) return false;
  if (!measurement) return true;
  if (!measurement.systemBarsPx || !measurement.displayCutoutPx) return false;
  const cutout = measurement.cutoutShape;
  return !cutout || [cutout.xPx, cutout.yPx, cutout.widthPx, cutout.heightPx, cutout.rightPx, cutout.bottomPx].every(value => value != null);
}

export function safeInsets(measurement: InsetsMeasurement): Insets {
  return {
    top: Math.max(measurement.systemBars.top, measurement.displayCutout.top),
    right: Math.max(measurement.systemBars.right, measurement.displayCutout.right),
    bottom: Math.max(measurement.systemBars.bottom, measurement.displayCutout.bottom),
    left: Math.max(measurement.systemBars.left, measurement.displayCutout.left),
  };
}

export function safeInsetsPx(measurement: InsetsMeasurement): Insets | null {
  if (!measurement.systemBarsPx || !measurement.displayCutoutPx) return null;
  return {
    top: Math.max(measurement.systemBarsPx.top, measurement.displayCutoutPx.top),
    right: Math.max(measurement.systemBarsPx.right, measurement.displayCutoutPx.right),
    bottom: Math.max(measurement.systemBarsPx.bottom, measurement.displayCutoutPx.bottom),
    left: Math.max(measurement.systemBarsPx.left, measurement.displayCutoutPx.left),
  };
}
