import type { InsetsMeasurement, Screen } from "../data/types";

const MAX_W = 280;

interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Insets diagram with dimension labels (like safearea.info) */
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
      <div className="flex h-80 w-full max-w-lg items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
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

  const formatDim = (val: number) => (val === 0 ? "0" : val.toFixed(2));

  return (
    <div className="space-y-4">
      {/* Device visualization with labels */}
      <div className="relative inline-block">
        {/* Top dimension label */}
        {safe && safe.top > 0 && (
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              {formatDim(safe.top)} dp
            </div>
          </div>
        )}

        {/* Main diagram with side labels */}
        <div className="flex items-start gap-2">
          {/* Left dimension label */}
          {safe && safe.left > 0 && (
            <div className="flex flex-col items-center justify-center pt-12">
              <div className="bg-blue-600 text-white px-1.5 py-1 rounded text-xs font-semibold whitespace-nowrap">
                {formatDim(safe.left)}
              </div>
            </div>
          )}

          {/* SVG Diagram */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="border-4 border-slate-900 rounded-lg bg-white flex-shrink-0"
            role="img"
            aria-label={`${screen.label} screen insets diagram`}
            style={{ width: MAX_W, height: "auto" }}
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
                  stroke="#22c55e"
                  strokeWidth="0.5"
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
          </svg>

          {/* Right dimension label */}
          {safe && safe.right > 0 && (
            <div className="flex flex-col items-center justify-center pt-12">
              <div className="bg-blue-600 text-white px-1.5 py-1 rounded text-xs font-semibold whitespace-nowrap">
                {formatDim(safe.right)}
              </div>
            </div>
          )}
        </div>

        {/* Bottom dimension label */}
        {safe && safe.bottom > 0 && (
          <div className="flex justify-center mt-2">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              {formatDim(safe.bottom)} dp
            </div>
          </div>
        )}
      </div>

      {/* Detailed metrics display */}
      {safe && (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded">
            <div className="text-center">
              <div className="text-xs text-muted">Top</div>
              <div className="font-semibold">{formatDim(safe.top)} dp</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted">Right</div>
              <div className="font-semibold">{formatDim(safe.right)} dp</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted">Bottom</div>
              <div className="font-semibold">{formatDim(safe.bottom)} dp</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted">Left</div>
              <div className="font-semibold">{formatDim(safe.left)} dp</div>
            </div>
          </div>
          <div className="text-center text-xs text-muted">
            Logical size: {formatDim(dp.width)} × {formatDim(dp.height)} dp
          </div>
        </div>
      )}

      {/* Color Legend */}
      <div className="flex flex-wrap gap-4 text-xs border-t pt-3">
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
