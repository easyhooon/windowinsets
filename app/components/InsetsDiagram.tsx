import { useId, useState } from "react";
import { diagramAnnotations, placeRulerLabels } from "./diagramAnnotations";
import { DIAGRAM_FONT, DIAGRAM_COLORS } from "./diagramStyle";
import type { DeviceSkin } from "../data/skins";
import type { InsetsMeasurement, Screen } from "../data/types";
import { cutoutPairs, cornerPairs, formatLengthFromPairs, insetPairs, safeInsets, safeInsetsPx } from "../data/measurementUnits";

const MAX_W = 260;
const BASE_HEIGHT = 700;
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
  const id = useId().replace(/:/g, "");
  const [copyStatus, setCopyStatus] = useState("");
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
  const cornerPath = r ? `M ${r.topLeft * s},0 H ${W - r.topRight * s} A ${r.topRight * s},${r.topRight * s} 0 0 1 ${W},${r.topRight * s} V ${H - r.bottomRight * s} A ${r.bottomRight * s},${r.bottomRight * s} 0 0 1 ${W - r.bottomRight * s},${H} H ${r.bottomLeft * s} A ${r.bottomLeft * s},${r.bottomLeft * s} 0 0 1 0,${H - r.bottomLeft * s} V ${r.topLeft * s} A ${r.topLeft * s},${r.topLeft * s} 0 0 1 ${r.topLeft * s},0 Z` : undefined;

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
    ...cutoutPairs(measurement?.cutoutShape),
  ]);

  const { rulers, bounds, body } = diagramAnnotations(dp.width, dp.height, s, showFrame ? skin : undefined, safe, r, measurement?.cutoutShape);
  const labelScale = (bounds.bottom - bounds.top) / BASE_HEIGHT * 100 / zoom;
  const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`;
  const cutout = measurement?.cutoutShape;
  const bottomLabelWidth = cutout && cutout.yDp + cutout.heightDp >= dp.height - (safe?.bottom ?? 0) && cutout.xDp > 0
    ? cutout.xDp * s : W;
  const colors = { size: INK, inset: INSET_COLOR, radius: RADIUS_COLOR, cutout: "#8950e8" };
  const visibleRulers = placeRulerLabels(rulers.filter(ruler => ruler.kind === "size" || layers[ruler.kind === "inset" ? "insets" : ruler.kind === "radius" ? "corners" : "cutout"]), labelScale, fmt, undefined, body);
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setCopyStatus(`Copied ${value}`); }
    catch { setCopyStatus("Copy unavailable"); }
  }

  return (
    <div className="space-y-3">
      <div>
      <svg
        onPointerDown={e => { if ((e.target as Element).closest("text")) e.stopPropagation(); }}
        onClick={async e => {
          const label = (e.target as Element).closest("text")?.textContent?.trim();
          if (label && /^[\d.]+$/.test(label)) { await copy(label); }
        }}
        viewBox={viewBox}
        overflow="visible"
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
        role="group"
        aria-label={`${screen.label} screen insets diagram`}
      >
        <defs>
          <clipPath id={`${id}-display`}>{cornerPath ? <path d={cornerPath} /> : <rect width={W} height={H} rx={skin ? skin.body.radius * W / skin.screen.width * .6 : 0} />}</clipPath>
        </defs>

        {skin && showFrame && <svg x={-skin.screen.x * W / skin.screen.width} y={-skin.screen.y * H / skin.screen.height} width={skin.width * W / skin.screen.width} height={skin.height * H / skin.screen.height} viewBox={`0 0 ${skin.width} ${skin.height}`} overflow="visible">
          <defs><clipPath id={`${id}-body`}><rect x={skin.body.x} y={skin.body.y} width={skin.body.width} height={skin.body.height} rx={skin.body.radius} /></clipPath></defs>
          <image href={skin.image} width={skin.width} height={skin.height} clipPath={`url(#${id}-body)`} />
          <rect x={skin.screen.x} y={skin.screen.y} width={skin.screen.width} height={skin.screen.height} rx={rPx * skin.screen.width / W} fill="white" />
        </svg>}
        {/* Device bezel */}
        {showFrame && !skin && (
          <rect x={0} y={0} width={W} height={H} rx={rPx} fill="#ffffff" stroke="#0f172a" strokeWidth={3} />
        )}

        {showRegions && (
          <g clipPath={`url(#${id}-display)`}>
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

                {/* OS exclusion bounds; the foreground artwork retains the physical camera. */}
                {layers.cutout && measurement?.cutoutShape && (
                  <rect
                    x={measurement.cutoutShape.xDp * s}
                    y={measurement.cutoutShape.yDp * s}
                    width={measurement.cutoutShape.widthDp * s}
                    height={measurement.cutoutShape.heightDp * s}
                    stroke="#8950e8" strokeWidth={.7 * labelScale}
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
            {safe.bottom > 0 && <RegionLabel x={bottomLabelWidth / 2} y={H - safe.bottom * s / 2} name="BOTTOM" value={fmt(safe.bottom)} color={INSET_COLOR} scale={labelScale} width={bottomLabelWidth} height={safe.bottom * s} inline />}

          </>
        )}

        {skin?.foreground && showFrame && <image href={skin.foreground} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />}
        {!measurement && <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={12 * labelScale} fill="#59636e">Skin preview</text>}
        {showDimensions && <g aria-label="Measurement rulers">
          {visibleRulers.map(ruler => {
            const color = colors[ruler.kind];
            const value = fmt(ruler.value);
            const label = ruler.kind === "radius" ? `R ${value}` : value;
            const vertical = ruler.x1 === ruler.x2;
            const arrow = 3 * labelScale;
            return <g key={ruler.name} role="button" tabIndex={0} aria-label={`${ruler.name}: ${value} ${units}. Copy ${value}`}
              onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); void copy(value); }}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); void copy(value); } }} style={{ cursor: "copy" }}>
              <title>{`${ruler.name}: ${value} ${units}`}</title>
              {ruler.guides.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={.7 * labelScale} strokeDasharray={`${2 * labelScale} ${2 * labelScale}`} opacity={.65} />)}
              <line x1={ruler.x1} y1={ruler.y1} x2={ruler.x2} y2={ruler.y2} stroke={color} strokeWidth={.7 * labelScale} />
              {[[ruler.x1, ruler.y1, 1], [ruler.x2, ruler.y2, -1]].map(([x, y, direction], i) => <path key={i} d={vertical
                ? `M ${x - arrow},${y + arrow * direction} L ${x},${y} L ${x + arrow},${y + arrow * direction}`
                : `M ${x + arrow * direction},${y - arrow} L ${x},${y} L ${x + arrow * direction},${y + arrow}`}
                stroke={color} strokeWidth={.7 * labelScale} fill="none" />)}
              {ruler.kind === "radius" && <path d={`M ${ruler.x1},${ruler.guides[0][1]} H ${ruler.x2} V ${ruler.guides[0][1] < H / 2 ? 0 : H}`} fill="none" stroke={color} strokeWidth={.8 * labelScale} />}
              {((vertical && (ruler.labelX !== ruler.x1 || ruler.labelY < ruler.y1 || ruler.labelY > ruler.y2)) || (!vertical && ruler.labelY !== ruler.y1)) &&
                <line x1={ruler.labelX} y1={ruler.labelY} x2={(ruler.x1 + ruler.x2) / 2} y2={(ruler.y1 + ruler.y2) / 2} stroke={color} strokeWidth={.7 * labelScale} />}
              <Badge x={ruler.labelX} y={ruler.labelY} label={label} color={color} scale={labelScale} />
            </g>;
          })}
        </g>}
      </svg>
      <span role="status" className="sr-only">{copyStatus}</span>
      </div>

    </div>
  );
}
