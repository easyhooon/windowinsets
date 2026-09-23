import { DIAGRAM_COLORS, DIAGRAM_FONT } from './diagramStyle';
import type { Ruler } from './diagramAnnotations';

export type Point = { x: number; y: number };
export type ProjectedRuler = Ruler & { start: Point; end: Point; bracket?: Point; side: 'top' | 'bottom' | 'left' | 'right' };
export interface ProjectedMeasurements {
  rulers: ProjectedRuler[];
  body: { left: number; top: number; right: number; bottom: number };
  scale: number;
  format: (value: number) => string;
  units: string;
  screen: string;
}

/** Pack each measurement kind into parallel lanes, keeping short intervals
 * instead of a distant badge with a diagonal leader through another measurement. */
export function layoutProjectedRulers({ rulers, body, scale, format }: ProjectedMeasurements) {
  const lanes = new Map<string, Array<Array<{ interval: [number, number]; kind: Ruler['kind'] }>>>();
  return rulers.map(ruler => {
    const horizontal = ruler.side === 'top' || ruler.side === 'bottom';
    const text = (ruler.kind === 'radius' ? 'R ' : '') + format(ruler.value);
    const width = (text.length * 7.2 + 10) * scale;
    const height = 19 * scale;
    const a = horizontal ? ruler.start.x : ruler.start.y;
    const b = horizontal ? ruler.end.x : ruler.end.y;
    const middle = (a + b) / 2;
    const half = (horizontal ? width : height) / 2;
    const interval: [number, number] = [middle - half - 4 * scale, middle + half + 4 * scale];
    const rows = lanes.get(ruler.side) ?? [];
    let row = rows.findIndex(used => used.every(({ interval: [start, end], kind }) => kind === ruler.kind && (interval[1] < start || interval[0] > end)));
    if (row < 0) { row = rows.length; rows.push([]); }
    rows[row].push({ interval, kind: ruler.kind });
    lanes.set(ruler.side, rows);
    // A fixed lane width avoids varying-length values shifting adjacent lanes.
    const distance = (horizontal ? 24 + row * 26 : 40 + row * 65) * scale;
    const lane = ruler.side === 'top' ? body.top - distance : ruler.side === 'bottom' ? body.bottom + distance
      : ruler.side === 'left' ? body.left - distance : body.right + distance;
    const p = horizontal ? { x: a, y: lane } : { x: lane, y: a };
    const q = horizontal ? { x: b, y: lane } : { x: lane, y: b };
    // For a small span, place the badge beside the arrow, on the same lane.
    const short = Math.abs(b - a) < (horizontal ? width + 8 * scale : height + 8 * scale);
    const x = horizontal ? middle : lane + (short ? (ruler.side === 'left' ? -1 : 1) * (width / 2 + 5 * scale) : 0);
    const y = horizontal ? lane + (ruler.side === 'top' ? -1 : 1) * (height / 2 + 4 * scale) : middle;
    return { ...ruler, text, p, q, x, y, width, height };
  });
}

export function ProjectedRulers({ measurements }: { measurements: ProjectedMeasurements | null }) {
  if (!measurements) return null;
  const { scale, units, screen } = measurements;
  const colors = { size: DIAGRAM_COLORS.ink, inset: DIAGRAM_COLORS.inset, radius: DIAGRAM_COLORS.radius, cutout: '#8950e8' };
  return <svg className="projected-rulers" width="700" height="700" viewBox="0 0 700 700"
    aria-label={`${screen} measured dimensions`} style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'visible', pointerEvents: 'none' }}>
    {layoutProjectedRulers(measurements).map(ruler => {
      const color = colors[ruler.kind];
      const { p, q } = ruler;
      const angle = Math.atan2(q.y - p.y, q.x - p.x);
      const tip = 3 * scale;
      const arrows = [[p, angle], [q, angle + Math.PI]] as const;
      const copy = () => { navigator.clipboard.writeText(measurements.format(ruler.value)).catch(() => {}); };
      return <g key={ruler.name} data-ruler={ruler.name} stroke={color} strokeWidth={.75 * scale} fill="none">
        {ruler.bracket && <path opacity=".7" d={`M${ruler.start.x},${ruler.start.y} L${ruler.end.x},${ruler.end.y} L${ruler.bracket.x},${ruler.bracket.y}`} />}
        <path data-guide="true" opacity=".45" strokeDasharray={`${2 * scale} ${3 * scale}`}
          d={`M${ruler.start.x},${ruler.start.y} L${p.x},${p.y} M${ruler.end.x},${ruler.end.y} L${q.x},${q.y}`} />
        <path d={`M${p.x},${p.y} L${q.x},${q.y}`} />
        {arrows.map(([point, direction], i) => <path key={i} d={`M${point.x + tip * Math.cos(direction - .7)},${point.y + tip * Math.sin(direction - .7)} L${point.x},${point.y} L${point.x + tip * Math.cos(direction + .7)},${point.y + tip * Math.sin(direction + .7)}`} />)}
        <g role="button" tabIndex={0} aria-label={`Copy ${ruler.name}: ${ruler.text} ${units}`} onClick={copy}
          onPointerDown={event => event.stopPropagation()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); copy(); } }}
          style={{ pointerEvents: 'auto', cursor: 'copy' }}>
          <title>{`${ruler.name}: ${ruler.text} ${units}. Recorded display measurement; perspective changes its drawn length.`}</title>
          <rect data-badge="true" x={ruler.x - ruler.width / 2} y={ruler.y - ruler.height / 2} width={ruler.width} height={ruler.height} rx={2 * scale} fill={color} stroke="none" />
          <text x={ruler.x} y={ruler.y} fill="white" stroke="none" textAnchor="middle" dominantBaseline="central" fontFamily={DIAGRAM_FONT} fontWeight="500" fontSize={12 * scale}>{ruler.text}</text>
        </g>
      </g>;
    })}
  </svg>;
}
