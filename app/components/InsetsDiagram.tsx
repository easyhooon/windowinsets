import { DIAGRAM_FONT, DIAGRAM_COLORS } from "./diagramStyle";
import type { DeviceSkin } from "../data/skins";
import type { InsetsMeasurement, Screen } from "../data/types";
import { cornerPairs, formatLengthFromPairs, insetPairs, safeInsets, safeInsetsPx } from "../data/measurementUnits";

const MAX_W = 260;
const BASE_HEIGHT = 700;
const PAD_TOP = 40;
const PAD_LEFT = 64;
const PAD_RIGHT = 64;
const PAD_BOTTOM = 44;

const INK = DIAGRAM_COLORS.ink;
const INSET_COLOR = DIAGRAM_COLORS.inset;
const RADIUS_COLOR = DIAGRAM_COLORS.radius;
const SAFE_FILL = DIAGRAM_COLORS.safeFill;
const INSET_FILL = DIAGRAM_COLORS.insetFill;

type Units = "dp" | "px";

interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function Badge({ x, y, label, color, scale }: { x: number; y: number; label: string; color: string; scale: number }) {
  const width = (label.length * 7.2 + 8) * scale;
  return <g>
    <rect x={x - width / 2} y={y - 9 * scale} width={width} height={18 * scale} rx={2 * scale} fill={color} />
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12 * scale} fontWeight={500} fill="#fff">{label}</text>
  </g>;
}

function RegionLabel({ x, y, name, value, color, scale, width, height, inline = false }: {
  x: number; y: number; name: string; value: string; color: string; scale: number; width: number; height: number; inline?: boolean;
}) {
  const labelWidth = inline ? name.length + value.length + 4 : Math.max(name.length, value.length) + 2;
  const k = Math.min(scale, height / (inline ? 22 : 42), width / (labelWidth * 8));
  const nameW = (name.length * 7.2 + 8) * k, valueW = value.length * 7.2 * k, gap = 10 * k;
  return <g>
    <Badge x={inline ? x - (valueW + gap) / 2 : x} y={inline ? y : y - 10 * k} label={name} color={color} scale={k} />
    <text x={inline ? x + (nameW + gap) / 2 : x} y={inline ? y : y + 12 * k} textAnchor="middle" dominantBaseline="central" fontSize={12 * k} fill={color}>{value}</text>
  </g>;
}

/** A dimension line with arrowheads on both ends, an optional pair of dashed
 * extension lines, and a label chip at its midpoint. Orientation is inferred
 * from whether x1===x2 (vertical) or y1===y2 (horizontal). */
function DimensionLine({
  x1, y1, x2, y2, label, color, ext, scale,
}: {
  x1: number; y1: number; x2: number; y2: number;
  label: string; color: string; scale: number;
  /** extension guide lines from the device edge out to this dimension line */
  ext?: { from: [number, number]; to: [number, number] }[];
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

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
        stroke={color} strokeWidth={0.7}
        markerStart="url(#arrowhead)" markerEnd="url(#arrowhead)"
      />
      <Badge x={midX} y={midY} label={label} color={color} scale={scale} />
    </g>
  );
}

/** Detailed insets diagram with outside dimension lines, inside chips and a
 * color legend — modeled after safearea.info's measurement view. */
export function InsetsDiagram({
  screen,
  measurement,
  zoom,
  showFrame,
  showRegions,
  showDimensions,
  units,
  layers,
  skin,
}: {
  screen: Screen;
  measurement: InsetsMeasurement | null;
  /** The parent viewport handles pan, fit and zoom. */
  zoom: number;
  showFrame: boolean;
  showRegions: boolean;
  showDimensions: boolean;
  units: Units;
  layers: { safe: boolean; insets: boolean; cutout: boolean; corners: boolean };
  skin?: DeviceSkin;
}) {
  const measured = !!screen.logicalSizeDp;
  showDimensions = showDimensions && measured;
  const dp = screen.logicalSizeDp ?? (skin ? { width: skin.screen.width / 3, height: skin.screen.height / 3 } : null);
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
  const rPx = r ? r.topLeft * s : 0;

  const safe: Insets | null = measurement ? safeInsets(measurement) : null;
  const safePx = measurement ? safeInsetsPx(measurement) : null;
  const fmt = formatLengthFromPairs(units, [
    [dp.width, screen.logicalSizePx?.width],
    [dp.height, screen.logicalSizePx?.height],
    ...(safe && safePx && screen.logicalSizePx ? [
      [dp.width - safe.left - safe.right, screen.logicalSizePx.width - safePx.left - safePx.right],
      [dp.height - safe.top - safe.bottom, screen.logicalSizePx.height - safePx.top - safePx.bottom],
    ] as const : []),
    ...insetPairs(safe, safePx),
    ...cornerPairs(r, screen.cornerRadiiPx),
  ]);

  const labelScale = (H + PAD_TOP + PAD_BOTTOM) / BASE_HEIGHT * 100 / zoom;
  const viewBox = `${-PAD_LEFT} ${-PAD_TOP} ${W + PAD_LEFT + PAD_RIGHT} ${H + PAD_TOP + PAD_BOTTOM}`;

  return (
    <div className="space-y-3">
      <div>
      <svg
        onPointerDown={e => { if ((e.target as Element).closest("text")) e.stopPropagation(); }}
        onClick={async e => {
          const label = (e.target as Element).closest("text")?.textContent?.trim();
          if (label && /^[\d.]+$/.test(label)) { try { await navigator.clipboard.writeText(label); } catch {} }
        }}
        viewBox={viewBox}
        // Sized by its own real aspect ratio (device width:height), not stretched to
        // fill the container's width — that mismatch was letterboxing the phone shape
        // into a fraction of its box instead of showing it at its true proportions.
        // The parent owns zoom; compensate annotation size so rulers remain readable.
        style={{
          height: `${BASE_HEIGHT}px`,
          fontFamily: DIAGRAM_FONT,
          width: "auto",
          maxWidth: "none",
          display: "block",
          marginInline: "auto",
        }}
        role="img"
        aria-label={`${screen.label} screen insets diagram`}
      >
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
          </marker>
          <clipPath id="display-clip"><rect x={0} y={0} width={W} height={H} rx={rPx || (skin ? skin.body.radius * W / skin.screen.width * .6 : 0)} /></clipPath>
        </defs>

        {skin && showFrame && <svg x={-skin.screen.x * W / skin.screen.width} y={-skin.screen.y * H / skin.screen.height} width={skin.width * W / skin.screen.width} height={skin.height * H / skin.screen.height} viewBox={`0 0 ${skin.width} ${skin.height}`} overflow="visible">
          <defs><clipPath id="skin-body"><rect x={skin.body.x} y={skin.body.y} width={skin.body.width} height={skin.body.height} rx={skin.body.radius} /></clipPath></defs>
          <image href={skin.image} width={skin.width} height={skin.height} clipPath="url(#skin-body)" />
          <rect x={skin.screen.x} y={skin.screen.y} width={skin.screen.width} height={skin.screen.height} rx={rPx * skin.screen.width / W} fill="white" />
        </svg>}
        {/* Device bezel */}
        {showFrame && !skin && (
          <rect x={0} y={0} width={W} height={H} rx={rPx} fill="#ffffff" stroke="#0f172a" strokeWidth={3} />
        )}

        {showRegions && (
          <g clipPath="url(#display-clip)">
            {/* Decorative case chrome — schematic only, not measured data: a speaker
             * grille and volume/power buttons, purely for visual recognizability. */}
            {!skin && <rect x={W / 2 - 18} y={5} width={36} height={3} rx={1.5} fill="#1e293b" opacity={0.35} />}
            {!skin && <rect x={W - 1.5} y={H * 0.16} width={3} height={H * 0.06} rx={1.5} fill="#1e293b" opacity={0.55} />}
            {!skin && <rect x={W - 1.5} y={H * 0.24} width={3} height={H * 0.09} rx={1.5} fill="#1e293b" opacity={0.55} />}

            {/* Safe area + inset bands */}
            {safe && (
              <>
                <rect
                  x={safe.left * s} y={safe.top * s}
                  width={W - (safe.left + safe.right) * s}
                  height={H - (safe.top + safe.bottom) * s}
                  fill={SAFE_FILL} fillOpacity={layers.safe ? 1 : 0}
                />
                {safe.top > 0 && <rect x={0} y={0} width={W} height={safe.top * s} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}
                {safe.bottom > 0 && <rect x={0} y={H - safe.bottom * s} width={W} height={safe.bottom * s} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}
                {safe.left > 0 && <rect x={0} y={0} width={safe.left * s} height={H} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}
                {safe.right > 0 && <rect x={W - safe.right * s} y={0} width={safe.right * s} height={H} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}

                {/* Real camera cutout, at its measured position/size (DisplayCutout.boundingRects) —
                 * not a placeholder: this pill sits exactly where the punch-hole/notch actually is. */}
                {layers.cutout && measurement?.cutoutShape && (
                  <rect
                    x={measurement.cutoutShape.xDp * s}
                    y={measurement.cutoutShape.yDp * s}
                    width={measurement.cutoutShape.widthDp * s}
                    height={measurement.cutoutShape.heightDp * s}
                    rx={1}
                    fill="#c4a0f1"
                  />
                )}

                {/* Safe area's own size, centered inside the green region — the
                 * "SAFE AREA / W × H" label safearea.info prints on top of its
                 * own safe-area fill (this is the safe rect's own dp size, not
                 * the overall device size shown by the outside dimension lines). */}
                {showDimensions && layers.safe && (() => {
                  const safeWDp = dp.width - safe.left - safe.right;
                  const safeHDp = dp.height - safe.top - safe.bottom;
                  const cx = safe.left * s + (W - (safe.left + safe.right) * s) / 2;
                  const cy = safe.top * s + (H - (safe.top + safe.bottom) * s) / 2;
                  return <RegionLabel x={cx} y={cy} name="SAFE AREA" value={`${fmt(safeWDp)} × ${fmt(safeHDp)}`} color={DIAGRAM_COLORS.safe} scale={labelScale} width={safeWDp * s} height={safeHDp * s} />;

                })()}
              </>
            )}
          </g>
        )}

        {showDimensions && layers.insets && safe && (
          <>
            {safe.top > 0 && <RegionLabel x={W * .25} y={safe.top * s / 2} name="TOP" value={fmt(safe.top)} color={INSET_COLOR} scale={labelScale} width={W / 2} height={safe.top * s} inline />}
            {safe.bottom > 0 && <RegionLabel x={W / 2} y={H - safe.bottom * s / 2} name="BOTTOM" value={fmt(safe.bottom)} color={INSET_COLOR} scale={labelScale} width={W} height={safe.bottom * s} inline />}

          </>
        )}

        {skin?.foreground && showFrame && <image href={skin.foreground} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />}
        {!measurement && <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={12 * labelScale} fill="#59636e">Skin preview</text>}
        {/* Corner radius chips */}
        {showDimensions && layers.corners && r && rPx > 0 && (
          <>
            {[
              { x: -16, y: -16, value: r.topLeft },
              { x: W + 16, y: -16, value: r.topRight },
              { x: -16, y: H + 16, value: r.bottomLeft },
              { x: W + 16, y: H + 16, value: r.bottomRight },
            ].map(({ x, y, value }) => {
              const label = fmt(value);
              return <Badge key={`${x}-${y}`} x={x} y={y} label={label} color={RADIUS_COLOR} scale={labelScale} />;
            })}
          </>
        )}

        {showDimensions && (
          <>
            {/* Overall width (top) */}
            <DimensionLine scale={labelScale}
              x1={0} y1={-28} x2={W} y2={-28}
              label={fmt(dp.width)} color={INK}
              ext={[{ from: [0, 0], to: [0, -28] }, { from: [W, 0], to: [W, -28] }]}
            />

            {/* Overall height (left) */}
            <DimensionLine scale={labelScale}
              x1={-28} y1={0} x2={-28} y2={H}
              label={fmt(dp.height)} color={INK}
              ext={[{ from: [0, 0], to: [-28, 0] }, { from: [0, H], to: [-28, H] }]}
            />

            {/* Left/right inset widths, drawn only when present (rare on phones) */}
            {layers.insets && safe && safe.left > 0 && (
              <DimensionLine scale={labelScale}
                x1={0} y1={-14} x2={safe.left * s} y2={-14}
                label={fmt(safe.left)} color={INSET_COLOR}
                ext={[{ from: [0, 0], to: [0, -14] }, { from: [safe.left * s, 0], to: [safe.left * s, -14] }]}
              />
            )}
            {layers.insets && safe && safe.right > 0 && (
              <DimensionLine scale={labelScale}
                x1={W - safe.right * s} y1={-14} x2={W} y2={-14}
                label={fmt(safe.right)} color={INSET_COLOR}
                ext={[{ from: [W - safe.right * s, 0], to: [W - safe.right * s, -14] }, { from: [W, 0], to: [W, -14] }]}
              />
            )}
          </>
        )}
      </svg>
      </div>

    </div>
  );
}
