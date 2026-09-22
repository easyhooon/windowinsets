import type { InsetsMeasurement, Screen } from "../data/types";

const MAX_W = 340;
const LABEL_OFFSET = 20;

interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Enhanced insets diagram with dimension labels (like safearea.info) */
export function InsetsDiagram({
  screen,
  measurement,
}: {
  screen: Screen;
  measurement: InsetsMeasurement | null;
}) {
  const dp = screen.logicalSizeDp;
  if (!dp) {
    return (
      <div className="flex h-96 w-full max-w-lg items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
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

  // Format dimensions for display
  const formatDim = (val: number) => (val === 0 ? "0" : val.toFixed(2));

  return (
    <div className="space-y-4">
      {/* SVG Diagram */}
      <svg
        viewBox={`${-LABEL_OFFSET * 3} ${-LABEL_OFFSET * 3} ${W + LABEL_OFFSET * 6} ${H + LABEL_OFFSET * 6}`}
        className="w-full max-w-lg border border-line rounded-lg bg-white p-4"
        role="img"
        aria-label={`${screen.label} screen insets diagram`}
      >
        {/* Device bezel */}
        <rect x={0} y={0} width={W} height={H} rx={r ? r.topLeft * s : 0} className="fill-slate-900" />

        {/* Safe area & insets */}
        {safe && (
          <>
            {/* Safe area (green) */}
            <rect
              x={safe.left * s}
              y={safe.top * s}
              width={W - (safe.left + safe.right) * s}
              height={H - (safe.top + safe.bottom) * s}
              className="fill-green-400/40"
            />

            {/* Top inset (orange) */}
            {safe.top > 0 && (
              <rect x={0} y={0} width={W} height={safe.top * s} className="fill-orange-400/50" />
            )}

            {/* Bottom inset (orange) */}
            {safe.bottom > 0 && (
              <rect
                x={0}
                y={H - safe.bottom * s}
                width={W}
                height={safe.bottom * s}
                className="fill-orange-400/50"
              />
            )}

            {/* Right inset (orange) */}
            {safe.right > 0 && (
              <rect
                x={W - safe.right * s}
                y={0}
                width={safe.right * s}
                height={H}
                className="fill-orange-400/50"
              />
            )}
          </>
        )}

        {/* Dimension lines & labels */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-slate-600">
          {/* Top dimension */}
          {safe && safe.top > 0 && (
            <>
              <line x1={-LABEL_OFFSET * 1.5} y1={0} x2={-LABEL_OFFSET * 0.5} y2={0} />
              <line x1={-LABEL_OFFSET} y1={-LABEL_OFFSET * 0.8} x2={-LABEL_OFFSET} y2={safe.top * s} />
              <line x1={-LABEL_OFFSET * 1.5} y1={safe.top * s} x2={-LABEL_OFFSET * 0.5} y2={safe.top * s} />
              <text
                x={-LABEL_OFFSET * 2.5}
                y={safe.top * s / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-600 text-xs font-semibold"
              >
                {formatDim(safe.top)}
              </text>
            </>
          )}

          {/* Bottom dimension */}
          {safe && safe.bottom > 0 && (
            <>
              <line x1={-LABEL_OFFSET * 1.5} y1={H} x2={-LABEL_OFFSET * 0.5} y2={H} />
              <line x1={-LABEL_OFFSET} y1={H - safe.bottom * s} x2={-LABEL_OFFSET} y2={H + LABEL_OFFSET * 0.8} />
              <line x1={-LABEL_OFFSET * 1.5} y1={H - safe.bottom * s} x2={-LABEL_OFFSET * 0.5} y2={H - safe.bottom * s} />
              <text
                x={-LABEL_OFFSET * 2.5}
                y={H - safe.bottom * s / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-600 text-xs font-semibold"
              >
                {formatDim(safe.bottom)}
              </text>
            </>
          )}

          {/* Right dimension */}
          {safe && safe.right > 0 && (
            <>
              <line x1={W} y1={-LABEL_OFFSET * 1.5} x2={W} y2={-LABEL_OFFSET * 0.5} />
              <line x1={W - safe.right * s} y1={-LABEL_OFFSET} x2={W + LABEL_OFFSET * 0.8} y2={-LABEL_OFFSET} />
              <line x1={W - safe.right * s} y1={-LABEL_OFFSET * 1.5} x2={W - safe.right * s} y2={-LABEL_OFFSET * 0.5} />
              <text
                x={W - safe.right * s / 2}
                y={-LABEL_OFFSET * 2.5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-600 text-xs font-semibold"
              >
                {formatDim(safe.right)}
              </text>
            </>
          )}

          {/* Left dimension (if exists) */}
          {safe && safe.left > 0 && (
            <>
              <line x1={0} y1={-LABEL_OFFSET * 1.5} x2={0} y2={-LABEL_OFFSET * 0.5} />
              <line x1={safe.left * s} y1={-LABEL_OFFSET} x2={-LABEL_OFFSET * 0.8} y2={-LABEL_OFFSET} />
              <line x1={safe.left * s} y1={-LABEL_OFFSET * 1.5} x2={safe.left * s} y2={-LABEL_OFFSET * 0.5} />
              <text
                x={safe.left * s / 2}
                y={-LABEL_OFFSET * 2.5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-600 text-xs font-semibold"
              >
                {formatDim(safe.left)}
              </text>
            </>
          )}

          {/* Width at top */}
          <line x1={0} y1={-LABEL_OFFSET * 3.2} x2={W} y2={-LABEL_OFFSET * 3.2} strokeWidth="2" />
          <line x1={0} y1={-LABEL_OFFSET * 2.8} x2={0} y2={-LABEL_OFFSET * 3.6} strokeWidth="2" />
          <line x1={W} y1={-LABEL_OFFSET * 2.8} x2={W} y2={-LABEL_OFFSET * 3.6} strokeWidth="2" />
          <text
            x={W / 2}
            y={-LABEL_OFFSET * 3.5}
            textAnchor="middle"
            className="fill-slate-900 text-xs font-bold"
          >
            {formatDim(dp.width)}
          </text>

          {/* Height on right */}
          <line x1={W + LABEL_OFFSET * 3.2} y1={0} x2={W + LABEL_OFFSET * 3.2} y2={H} strokeWidth="2" />
          <line x1={W + LABEL_OFFSET * 2.8} y1={0} x2={W + LABEL_OFFSET * 3.6} y2={0} strokeWidth="2" />
          <line x1={W + LABEL_OFFSET * 2.8} y1={H} x2={W + LABEL_OFFSET * 3.6} y2={H} strokeWidth="2" />
          <text
            x={W + LABEL_OFFSET * 3.5}
            y={H / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-900 text-xs font-bold"
            transform={`rotate(90 ${W + LABEL_OFFSET * 3.5} ${H / 2})`}
          >
            {formatDim(dp.height)}
          </text>
        </g>
      </svg>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-400/40 border border-green-600" />
          <span className="text-muted">Safe Area</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-orange-400/50 border border-orange-600" />
          <span className="text-muted">Insets (bars + cutout)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-slate-900" />
          <span className="text-muted">Device bezel</span>
        </div>
      </div>
    </div>
  );
}
