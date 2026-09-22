import { useEffect, useRef } from "react";
import type { InsetsMeasurement, Screen } from "../data/types";

const MAX_W = 260;
const BASE_HEIGHT = 420;
const MIN_ZOOM = 25;
const MAX_ZOOM = 500;
const PAD_TOP = 40;
const PAD_LEFT = 40;
const PAD_RIGHT = 64;
const PAD_BOTTOM = 44;

const INK = "#1e293b"; // slate-800, for overall dimension lines
const INSET_COLOR = "#c2410c"; // orange-700, for inset dimension lines/chips
const RADIUS_COLOR = "#be185d"; // pink-700, for corner radius chips
const SAFE_FILL = "#4ade80"; // green-400
const INSET_FILL = "#fb923c"; // orange-400

type Units = "dp" | "px";

interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** A dimension line with arrowheads on both ends, an optional pair of dashed
 * extension lines, and a label chip at its midpoint. Orientation is inferred
 * from whether x1===x2 (vertical) or y1===y2 (horizontal). */
function DimensionLine({
  x1, y1, x2, y2, label, color, ext,
}: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; color: string;
  /** extension guide lines from the device edge out to this dimension line */
  ext?: { from: [number, number]; to: [number, number] }[];
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const chipW = Math.max(20, label.length * 7 + 8);
  const chipH = 14;

  return (
    <g>
      {ext?.map((e, i) => (
        <line
          key={i}
          x1={e.from[0]} y1={e.from[1]} x2={e.to[0]} y2={e.to[1]}
          stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.6}
        />
      ))}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={1.5}
        markerStart="url(#arrowhead)" markerEnd="url(#arrowhead)"
      />
      <rect
        x={midX - chipW / 2}
        y={midY - chipH / 2}
        width={chipW}
        height={chipH}
        rx={3}
        fill={color}
      />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={9.5}
        fontWeight={700}
        fill="#ffffff"
      >
        {label}
      </text>
    </g>
  );
}

/** Detailed insets diagram with outside dimension lines, inside chips and a
 * color legend — modeled after safearea.info's measurement view. */
export function InsetsDiagram({
  screen,
  measurement,
  zoom,
  onZoomChange,
  showFrame,
  showRegions,
  showDimensions,
  units,
}: {
  screen: Screen;
  measurement: InsetsMeasurement | null;
  /** Zoom/settings are controlled from the parent toolbar (DeviceView) so
   * every control lives in one uniform row, safearea.info-style, instead of
   * a second private toolbar duplicated inside this component. Scroll-to-zoom
   * still works here — it just reports the new value up via onZoomChange. */
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showFrame: boolean;
  showRegions: boolean;
  showDimensions: boolean;
  units: Units;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;

  // React's synthetic onWheel is attached passively (React 17+), so
  // event.preventDefault() inside it is silently ignored and the page still
  // scrolls underneath. A native listener with { passive: false } is the only
  // way to actually stop that scroll and zoom the diagram in place instead.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(zoomRef.current - e.deltaY / 4)));
      onZoomChangeRef.current(next);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const dp = screen.logicalSizeDp;
  if (!dp) {
    return (
      <div className="flex h-80 w-full max-w-lg items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
        Logical size (dp) for this screen is not verified yet.
      </div>
    );
  }

  // Convert a raw dp value to whichever unit the toggle is set to, for display only —
  // the diagram's own geometry always stays in dp (via `s`), only the printed label changes.
  const densityDpi = screen.densityDpi;
  function fmt(vDp: number): string {
    const v = units === "px" && densityDpi ? vDp * (densityDpi / 160) : vDp;
    return v === 0 ? "0" : Number(v.toFixed(2)).toString();
  }

  const s = MAX_W / dp.width;
  const W = dp.width * s;
  const H = dp.height * s;
  const r = screen.cornerRadiiDp;
  const rPx = r ? r.topLeft * s : 0;

  const bars = measurement?.systemBars;
  const cut = measurement?.displayCutout;
  const safe: Insets | null = bars && cut
    ? {
        top: Math.max(bars.top, cut.top),
        right: Math.max(bars.right, cut.right),
        bottom: Math.max(bars.bottom, cut.bottom),
        left: Math.max(bars.left, cut.left),
      }
    : null;

  const viewBox = `${-PAD_LEFT} ${-PAD_TOP} ${W + PAD_LEFT + PAD_RIGHT} ${H + PAD_TOP + PAD_BOTTOM}`;

  return (
    <div className="space-y-3">
      {/* No max-height/overflow cap here — matching safearea.info, zooming in
       * just grows the diagram (and the page scrolls), it doesn't get boxed
       * into a fixed viewport. */}
      <div ref={wrapRef}>
      <svg
        viewBox={viewBox}
        // Sized by its own real aspect ratio (device width:height), not stretched to
        // fill the container's width — that mismatch was letterboxing the phone shape
        // into a fraction of its box instead of showing it at its true proportions.
        // Zoom scales this base height; wheel-over-diagram and +/- controls adjust it.
        style={{
          height: `${(BASE_HEIGHT * zoom) / 100}px`,
          width: "auto",
          maxWidth: "none",
          display: "block",
          marginInline: "auto",
        }}
        role="img"
        aria-label={`${screen.label} screen insets diagram`}
      >
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
          </marker>
        </defs>

        {/* Device bezel */}
        {showFrame && (
          <rect x={0} y={0} width={W} height={H} rx={rPx} fill="#ffffff" stroke="#0f172a" strokeWidth={3} />
        )}

        {showRegions && (
          <>
            {/* Decorative case chrome — schematic only, not measured data: a speaker
             * grille and volume/power buttons, purely for visual recognizability. */}
            <rect x={W / 2 - 18} y={5} width={36} height={3} rx={1.5} fill="#1e293b" opacity={0.35} />
            <rect x={W - 1.5} y={H * 0.16} width={3} height={H * 0.06} rx={1.5} fill="#1e293b" opacity={0.55} />
            <rect x={W - 1.5} y={H * 0.24} width={3} height={H * 0.09} rx={1.5} fill="#1e293b" opacity={0.55} />

            {/* Safe area + inset bands */}
            {safe && (
              <>
                <rect
                  x={safe.left * s} y={safe.top * s}
                  width={W - (safe.left + safe.right) * s}
                  height={H - (safe.top + safe.bottom) * s}
                  fill={SAFE_FILL} fillOpacity={0.4}
                />
                {safe.top > 0 && <rect x={0} y={0} width={W} height={safe.top * s} fill={INSET_FILL} fillOpacity={0.55} />}
                {safe.bottom > 0 && <rect x={0} y={H - safe.bottom * s} width={W} height={safe.bottom * s} fill={INSET_FILL} fillOpacity={0.55} />}
                {safe.left > 0 && <rect x={0} y={0} width={safe.left * s} height={H} fill={INSET_FILL} fillOpacity={0.55} />}
                {safe.right > 0 && <rect x={W - safe.right * s} y={0} width={safe.right * s} height={H} fill={INSET_FILL} fillOpacity={0.55} />}

                {/* Real camera cutout, at its measured position/size (DisplayCutout.boundingRects) —
                 * not a placeholder: this pill sits exactly where the punch-hole/notch actually is. */}
                {measurement?.cutoutShape && (
                  <rect
                    x={measurement.cutoutShape.xDp * s}
                    y={measurement.cutoutShape.yDp * s}
                    width={measurement.cutoutShape.widthDp * s}
                    height={measurement.cutoutShape.heightDp * s}
                    rx={Math.min(measurement.cutoutShape.widthDp, measurement.cutoutShape.heightDp) * s / 2}
                    fill="#0f172a"
                  />
                )}

                {/* Safe area's own size, centered inside the green region — the
                 * "SAFE AREA / W × H" label safearea.info prints on top of its
                 * own safe-area fill (this is the safe rect's own dp size, not
                 * the overall device size shown by the outside dimension lines). */}
                {showDimensions && (() => {
                  const safeWDp = dp.width - safe.left - safe.right;
                  const safeHDp = dp.height - safe.top - safe.bottom;
                  const cx = safe.left * s + (W - (safe.left + safe.right) * s) / 2;
                  const cy = safe.top * s + (H - (safe.top + safe.bottom) * s) / 2;
                  return (
                    <g opacity={0.8}>
                      <text x={cx} y={cy - 7} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} letterSpacing={1} fill="#166534">
                        SAFE AREA
                      </text>
                      <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#166534">
                        {fmt(safeWDp)} × {fmt(safeHDp)}
                      </text>
                    </g>
                  );
                })()}
              </>
            )}
          </>
        )}

        {showDimensions && safe && (
          <>
            {/* Inside chips: value printed directly on the band it describes */}
            {safe.top > 0 && (
              <g>
                <rect x={W / 2 - 22} y={safe.top * s / 2 - 8} width={44} height={16} rx={3} fill={INSET_COLOR} />
                <text x={W / 2} y={safe.top * s / 2} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill="#fff">
                  {fmt(safe.top)}
                </text>
              </g>
            )}
            {safe.bottom > 0 && (
              <g>
                <rect x={W / 2 - 22} y={H - safe.bottom * s / 2 - 8} width={44} height={16} rx={3} fill={INSET_COLOR} />
                <text x={W / 2} y={H - safe.bottom * s / 2} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} fill="#fff">
                  {fmt(safe.bottom)}
                </text>
              </g>
            )}
          </>
        )}

        {/* Corner radius chips */}
        {showDimensions && r && rPx > 0 && (
          <>
            <g>
              <circle cx={-16} cy={-16} r={9} fill={RADIUS_COLOR} />
              <text x={-16} y={-16} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight={700} fill="#fff">{fmt(r.topLeft)}</text>
            </g>
            <g>
              <circle cx={W + 16} cy={-16} r={9} fill={RADIUS_COLOR} />
              <text x={W + 16} y={-16} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight={700} fill="#fff">{fmt(r.topRight)}</text>
            </g>
            <g>
              <circle cx={-16} cy={H + 16} r={9} fill={RADIUS_COLOR} />
              <text x={-16} y={H + 16} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight={700} fill="#fff">{fmt(r.bottomLeft)}</text>
            </g>
            <g>
              <circle cx={W + 16} cy={H + 16} r={9} fill={RADIUS_COLOR} />
              <text x={W + 16} y={H + 16} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight={700} fill="#fff">{fmt(r.bottomRight)}</text>
            </g>
          </>
        )}

        {showDimensions && (
          <>
            {/* Overall width (top) */}
            <DimensionLine
              x1={0} y1={-28} x2={W} y2={-28}
              label={fmt(dp.width)} color={INK}
              ext={[{ from: [0, 0], to: [0, -28] }, { from: [W, 0], to: [W, -28] }]}
            />

            {/* Overall height (left) */}
            <DimensionLine
              x1={-28} y1={0} x2={-28} y2={H}
              label={fmt(dp.height)} color={INK}
              ext={[{ from: [0, 0], to: [-28, 0] }, { from: [0, H], to: [-28, H] }]}
            />

            {/* Right-side outside dimension: top inset height */}
            {safe && safe.top > 0 && (
              <DimensionLine
                x1={W + 20} y1={0} x2={W + 20} y2={safe.top * s}
                label={fmt(safe.top)} color={INSET_COLOR}
                ext={[{ from: [W, 0], to: [W + 20, 0] }, { from: [W, safe.top * s], to: [W + 20, safe.top * s] }]}
              />
            )}

            {/* Right-side outside dimension: bottom inset height */}
            {safe && safe.bottom > 0 && (
              <DimensionLine
                x1={W + 20} y1={H - safe.bottom * s} x2={W + 20} y2={H}
                label={fmt(safe.bottom)} color={INSET_COLOR}
                ext={[{ from: [W, H - safe.bottom * s], to: [W + 20, H - safe.bottom * s] }, { from: [W, H], to: [W + 20, H] }]}
              />
            )}

            {/* Left/right inset widths, drawn only when present (rare on phones) */}
            {safe && safe.left > 0 && (
              <DimensionLine
                x1={0} y1={-14} x2={safe.left * s} y2={-14}
                label={fmt(safe.left)} color={INSET_COLOR}
                ext={[{ from: [0, 0], to: [0, -14] }, { from: [safe.left * s, 0], to: [safe.left * s, -14] }]}
              />
            )}
            {safe && safe.right > 0 && (
              <DimensionLine
                x1={W - safe.right * s} y1={-14} x2={W} y2={-14}
                label={fmt(safe.right)} color={INSET_COLOR}
                ext={[{ from: [W - safe.right * s, 0], to: [W - safe.right * s, -14] }, { from: [W, 0], to: [W, -14] }]}
              />
            )}
          </>
        )}
      </svg>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs border-t border-line pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: SAFE_FILL, opacity: 0.6 }} />
          <span className="text-muted">Safe Area</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: INSET_FILL, opacity: 0.7 }} />
          <span className="text-muted">Insets (bars + cutout)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: RADIUS_COLOR }} />
          <span className="text-muted">Corner Radius</span>
        </div>
      </div>
      <p className="text-center text-[11px] text-subtle">
        All measurements in {units} · {screen.label} screen · portrait
      </p>
    </div>
  );
}
