import type { InsetsMeasurement, Screen } from "../data/types";

const MAX_W = 320;

/** Front view of one screen. Overlays are drawn only from verified dp data. */
export function InsetsView({
  screen,
  measurement,
}: {
  screen: Screen;
  measurement: InsetsMeasurement | null;
}) {
  const dp = screen.logicalSizeDp;
  if (!dp) {
    return (
      <div className="flex h-56 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500 dark:border-neutral-700">
        Logical size (dp) for this screen is not verified yet.
      </div>
    );
  }

  const s = MAX_W / dp.width;
  const W = dp.width * s;
  const H = dp.height * s;
  const r = screen.cornerRadiiDp;

  const bars = measurement?.systemBars;
  const cut = measurement?.displayCutout;
  const safe = bars && cut
    ? {
        top: Math.max(bars.top, cut.top),
        right: Math.max(bars.right, cut.right),
        bottom: Math.max(bars.bottom, cut.bottom),
        left: Math.max(bars.left, cut.left),
      }
    : null;

  return (
    <svg viewBox={`-2 -2 ${W + 4} ${H + 4}`} className="w-full max-w-xs" role="img" aria-label={`${screen.label} screen insets`}>
      <rect x={0} y={0} width={W} height={H} rx={r ? r.topLeft * s : 0} className="fill-neutral-100 stroke-neutral-800 dark:fill-neutral-900 dark:stroke-neutral-300" strokeWidth={2} />
      {safe && (
        <>
          <rect x={safe.left * s} y={safe.top * s} width={W - (safe.left + safe.right) * s} height={H - (safe.top + safe.bottom) * s} className="fill-green-300/60" />
          <rect x={0} y={0} width={W} height={safe.top * s} className="fill-orange-300/70" />
          <rect x={0} y={H - safe.bottom * s} width={W} height={safe.bottom * s} className="fill-orange-300/70" />
        </>
      )}
    </svg>
  );
}
