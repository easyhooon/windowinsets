/**
 * Side-profile view of a book-style foldable. Hinge axis points out of the screen.
 * angle: 0 = closed, 180 = flat (same convention as Sensor.TYPE_HINGE_ANGLE).
 */
export function foldingState(angle: number): "CLOSED" | "HALF_OPENED" | "FLAT" {
  if (angle <= 0) return "CLOSED";
  if (angle >= 180) return "FLAT";
  return "HALF_OPENED";
}

export function FoldDiagram({ angle }: { angle: number }) {
  const half = (180 - angle) / 2; // each half rotates this far up from horizontal
  const len = 110;
  const state = foldingState(angle);

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="-140 -140 280 170" className="h-44 w-full max-w-xs" role="img" aria-label={`Hinge angle ${angle} degrees`}>
        <line x1="-130" y1="20" x2="130" y2="20" className="stroke-line" strokeDasharray="3 4" />
        {/* left half: rotates clockwise about the hinge at (0,0) */}
        <g style={{ transform: `rotate(${half}deg)`, transition: "transform 120ms linear" }}>
          <rect x={-len} y={-7} width={len} height={7} rx={3} className="fill-fg" />
          <rect x={-len + 4} y={-5} width={len - 8} height={2} rx={1} className="fill-accent" />
        </g>
        {/* right half: rotates counter-clockwise */}
        <g style={{ transform: `rotate(${-half}deg)`, transition: "transform 120ms linear" }}>
          <rect x={0} y={-7} width={len} height={7} rx={3} className="fill-fg" />
          <rect x={4} y={-5} width={len - 8} height={2} rx={1} className="fill-accent" />
        </g>
        <circle cx={0} cy={0} r={5} className="fill-fg stroke-subtle" />
      </svg>
      <figcaption className="mt-1 text-center text-sm">
        <span className="block text-xs text-muted">Side view · hinge seen edge-on</span>
        <span className="font-mono">{angle}°</span> ·{" "}
        <span className="font-mono text-xs text-muted">FoldingFeature.State = {state}</span>
      </figcaption>
    </figure>
  );
}
