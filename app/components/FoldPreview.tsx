import type { CSSProperties } from "react";

const MAX_W = 240;
const PERSPECTIVE = 900;

interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface CornerRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

/**
 * 3D hinge preview for foldables. Two rigid panels of the (flat, unfolded)
 * main screen rotate toward each other about a shared hinge edge, driven by
 * `angle` using the same convention as Android's FoldingFeature/hinge-angle
 * sensor: 0 = closed (panels face each other), 180 = flat/open.
 *
 * axis "vertical"   = book-style fold (Z Fold): hinge runs top-to-bottom,
 *                     splitting the screen into left/right halves.
 * axis "horizontal" = flip-style fold (Z Flip): hinge runs left-to-right,
 *                     splitting the screen into top/bottom halves.
 */
export function FoldPreview({
  angle,
  axis,
  widthDp,
  heightDp,
  safe,
  cornerRadiiDp,
}: {
  angle: number;
  axis: "vertical" | "horizontal";
  widthDp: number;
  heightDp: number;
  safe: Insets | null;
  cornerRadiiDp?: CornerRadii | null;
}) {
  if (!widthDp || !heightDp) {
    return (
      <div className="flex h-40 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
        Main screen logical size is not verified yet.
      </div>
    );
  }

  const s = MAX_W / widthDp;
  const W = widthDp * s;
  const H = heightDp * s;
  const isVertical = axis === "vertical";
  const halfW = isVertical ? W / 2 : W;
  const halfH = isVertical ? H : H / 2;

  // 0deg at flat/open (angle=180), 90deg at fully closed (angle=0) — same
  // math as the old side-profile diagram: half = (180 - angle) / 2.
  const half = (180 - angle) / 2;
  const r = cornerRadiiDp ? cornerRadiiDp.topLeft * s : 0;

  function insetBands(part: "a" | "b") {
    if (!safe) return null;
    const bands: React.ReactNode[] = [];
    const showTop = isVertical || part === "a";
    const showBottom = isVertical || part === "b";
    const showLeft = !isVertical || part === "a";
    const showRight = !isVertical || part === "b";

    if (showTop && safe.top > 0) bands.push(<div key="t" style={{ position: "absolute", top: 0, left: 0, right: 0, height: safe.top * s }} className="bg-orange-400/60" />);
    if (showBottom && safe.bottom > 0) bands.push(<div key="b" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: safe.bottom * s }} className="bg-orange-400/60" />);
    if (showLeft && safe.left > 0) bands.push(<div key="l" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: safe.left * s }} className="bg-orange-400/60" />);
    if (showRight && safe.right > 0) bands.push(<div key="r" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: safe.right * s }} className="bg-orange-400/60" />);
    return bands;
  }

  const panelBase: CSSProperties = {
    position: "absolute",
    width: halfW,
    height: halfH,
    backfaceVisibility: "hidden",
    transition: "transform 150ms linear",
    // Keeps these panels on their own compositor layer so Chromium reliably
    // repaints the 3D transform on every angle change instead of occasionally
    // leaving a stale flat render after the first paint.
    willChange: "transform",
  };

  const panelA: CSSProperties = isVertical
    ? { ...panelBase, left: 0, top: 0, transformOrigin: "right center", transform: `rotateY(${half}deg)`, borderRadius: `${r}px 0 0 ${r}px` }
    : { ...panelBase, left: 0, top: 0, transformOrigin: "center bottom", transform: `rotateX(${-half}deg)`, borderRadius: `${r}px ${r}px 0 0` };

  const panelB: CSSProperties = isVertical
    ? { ...panelBase, left: halfW, top: 0, transformOrigin: "left center", transform: `rotateY(${-half}deg)`, borderRadius: `0 ${r}px ${r}px 0` }
    : { ...panelBase, left: 0, top: halfH, transformOrigin: "center top", transform: `rotateX(${half}deg)`, borderRadius: `0 0 ${r}px ${r}px` };

  return (
    <figure className="flex flex-col items-center gap-2">
      <div style={{ perspective: PERSPECTIVE, width: W + 60, height: H + 40 }} className="flex items-center justify-center">
        <div style={{ transformStyle: "preserve-3d", position: "relative", width: W, height: H }}>
          <div style={panelA} className="border-2 border-slate-900 bg-green-400/40 overflow-hidden">
            {insetBands("a")}
          </div>
          <div style={panelB} className="border-2 border-slate-900 bg-green-400/40 overflow-hidden">
            {insetBands("b")}
          </div>
          {/* hinge crease — stays put; both panels rotate about this edge */}
          <div
            className="absolute bg-slate-900"
            style={
              isVertical
                ? { left: halfW - 1, top: 0, width: 2, height: H }
                : { left: 0, top: halfH - 1, width: W, height: 2 }
            }
          />
        </div>
      </div>
      <figcaption className="text-center text-sm">
        <span className="block text-xs text-muted">
          {isVertical ? "Book fold · vertical hinge" : "Flip fold · horizontal hinge"}
        </span>
        <span className="font-mono">{angle}°</span>
      </figcaption>
    </figure>
  );
}
