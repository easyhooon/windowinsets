import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

type Bounds = { left: number; top: number; right: number; bottom: number };
export type DiagramViewportHandle = { fitFoldBounds: (bounds: Bounds) => number; setFoldAngle: (angle: number) => void; effectiveZoom: () => number };

export function DiagramViewport({ viewportRef, autoFit = false, closedFit, children, zoom, setZoom, rotation, fitKey, onUserTransform, onFit, baseWidth = 700, baseHeight = 700, fitWidth = baseWidth, fitHeight = baseHeight }: {
  viewportRef?: React.Ref<DiagramViewportHandle>; autoFit?: boolean; closedFit?: { width: number; height: number };
  children: React.ReactNode; zoom: number; setZoom: (value: number) => void;
  rotation: number; fitKey: number; baseWidth?: number; baseHeight?: number; fitWidth?: number; fitHeight?: number;
  onUserTransform?: () => void; onFit?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const displayedAngle = useRef(0);
  const effectiveZoom = useRef(zoom);
  const fitScales = useRef({ closed: zoom, open: zoom });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const live = useRef({ zoom, pan, setZoom, onUserTransform, onFit, autoFit, closedFit, rotation });
  live.current = { zoom, pan, setZoom, onUserTransform, onFit, autoFit, closedFit, rotation };
  const fitBounds = useRef({ fitWidth, fitHeight });
  fitBounds.current = { fitWidth, fitHeight };
  const fitCenter = useRef({ x: 0, y: 0 });
  const projectedFit = useRef<Bounds | null>(null);
  const fitFoldBounds = (bounds: Bounds) => {
      projectedFit.current = bounds;
      if (!live.current.autoFit || !ref.current || !scaleRef.current) return effectiveZoom.current;
      const sideways = Math.abs(live.current.rotation) % 180 === 90;
      const width = bounds.right - bounds.left, height = bounds.bottom - bounds.top;
      const availableW = ref.current.clientWidth - 32;
      const availableH = ref.current.clientHeight - 32;
      effectiveZoom.current = Math.max(25, Math.min(150, 100 * Math.min(availableW / (sideways ? height : width),
        availableH / (sideways ? width : height))));
      const displayedZoom = Math.round(effectiveZoom.current);
      if (live.current.zoom !== displayedZoom) {
        live.current.zoom = displayedZoom;
        live.current.setZoom(displayedZoom);
      }
      const x = (bounds.left + bounds.right) / 2 - 350;
      const y = (bounds.top + bounds.bottom) / 2 - 350;
      fitCenter.current = { x, y };
      scaleRef.current.style.transform = `scale(${effectiveZoom.current / 100}) rotate(${live.current.rotation}deg) translate(${-x}px, ${-y}px)`;
      return effectiveZoom.current;
    };
  const applyScale = (includeBounds = true) => {
    const progress = displayedAngle.current / 180;
    // Use the renderer's actual angle, including interrupted and reduced-motion frames.
    effectiveZoom.current = live.current.autoFit && live.current.closedFit
      ? fitScales.current.closed + (fitScales.current.open - fitScales.current.closed) * progress
      : live.current.zoom;
    if (scaleRef.current) scaleRef.current.style.transform = `scale(${effectiveZoom.current / 100}) rotate(${live.current.rotation}deg) translate(${-fitCenter.current.x}px, ${-fitCenter.current.y}px)`;
    if (includeBounds && projectedFit.current) fitFoldBounds(projectedFit.current);
  };
  useImperativeHandle(viewportRef, () => ({
    setFoldAngle: angle => { displayedAngle.current = angle; applyScale(false); },
    effectiveZoom: () => effectiveZoom.current,
    fitFoldBounds,
  }));
  useLayoutEffect(() => applyScale(), [zoom, rotation, autoFit]);
  const fitting = useRef(false);
  const [fitRevision, setFitRevision] = useState(0);
  const fit = useRef(() => {});
  useEffect(() => {
    const el = ref.current!;
    const fitCanvas = () => {
      fitting.current = true;
      setFitRevision(value => value + 1);
      const bounds = fitBounds.current;
      const sideways = Math.abs(rotation) % 180 === 90;
      const w = sideways ? bounds.fitHeight : bounds.fitWidth, h = sideways ? bounds.fitWidth : bounds.fitHeight;
      const scale = (width: number, height: number) => Math.max(25, Math.min(150, Math.floor(Math.min((el.clientWidth - 32) / width, (el.clientHeight - 32) / height) * 100)));
      const open = scale(w, h);
      fitScales.current = { open, closed: closedFit ? scale(sideways ? closedFit.height : closedFit.width, sideways ? closedFit.width : closedFit.height) : open };
      live.current.zoom = open;
      live.current.setZoom(open);
      applyScale();
      setPan({ x: 0, y: 0 });
    };
    fit.current = fitCanvas;
    const observer = new ResizeObserver(fitCanvas);
    observer.observe(el);
    fitCanvas();
    return () => observer.disconnect();
  }, [rotation]);
  useEffect(() => { fit.current(); }, [fitKey]);
  useEffect(() => {
    if (!fitting.current) return;
    const frame = requestAnimationFrame(() => {
      const el = ref.current!;
      const svg = el.querySelector('svg[role="group"]');
      if (!svg) { fitting.current = false; return; }
      // Fit the visible body and annotations, not the SVG's unused margins.
      // Constant-size labels need another pass after the device scale changes.
      const boxes = [...svg.querySelectorAll('[data-fit-body], [data-ruler]')].map(node => node.getBoundingClientRect());
      const left = Math.min(...boxes.map(box => box.left)), right = Math.max(...boxes.map(box => box.right));
      const top = Math.min(...boxes.map(box => box.top)), bottom = Math.max(...boxes.map(box => box.bottom));
      const viewport = el.getBoundingClientRect();
      const ratio = Math.min((viewport.width - 32) / (right - left), (viewport.height - 32) / (bottom - top));
      setPan(previous => ({ x: previous.x + viewport.left + viewport.width / 2 - (left + right) / 2,
        y: previous.y + viewport.top + viewport.height / 2 - (top + bottom) / 2 }));
      const next = Math.max(25, Math.min(150, Math.floor(zoom * ratio)));
      if (Math.abs(next - zoom) > 1) setZoom(next); else fitting.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [zoom, rotation, baseWidth, baseHeight, fitKey, fitRevision, setZoom]);

  useEffect(() => {
    const el = ref.current!;
    const changeZoom = (value: number) => {
      live.current.onUserTransform?.();
      live.current.setZoom(Math.max(25, Math.min(500, Math.round(value))));
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) changeZoom(effectiveZoom.current * Math.exp(-e.deltaY * 0.01));
      else {
        live.current.onUserTransform?.();
        setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
    };
    const keys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input,button,select,textarea,a")) return;
      if (["+", "=", "-", "0"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "0") { live.current.onFit?.(); fit.current(); }
        else changeZoom(effectiveZoom.current + (e.key === "-" ? -10 : 10));
      }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keys);
    return () => { el.removeEventListener("wheel", wheel); window.removeEventListener("keydown", keys); };
  }, []);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);
  return <div id="device-canvas" ref={ref} className="diagram-viewport" tabIndex={0} aria-label="Zoomable device canvas"
    onPointerDown={e => {
      if ((e.target as Element).closest("button,a,[role=button]")) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchStart.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: effectiveZoom.current };
      }
    }}
    onPointerMove={e => {
      const previous = pointers.current.get(e.pointerId);
      if (!previous) return;
      live.current.onUserTransform?.();
      const others = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId);
      if (others.length) {
        const other = others[0][1];
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        const start = pinchStart.current;
        if (start && start.distance > 0) setZoom(Math.max(25, Math.min(500, start.zoom * after / start.distance)));
      } else setPan(p => ({ x: p.x + e.clientX - previous.x, y: p.y + e.clientY - previous.y }));
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }}
    onPointerUp={e => { pointers.current.delete(e.pointerId); pinchStart.current = null; }} onPointerCancel={e => { pointers.current.delete(e.pointerId); pinchStart.current = null; }}
    onLostPointerCapture={e => { pointers.current.delete(e.pointerId); pinchStart.current = null; }}>
    <div className="diagram-position" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
      <div ref={scaleRef} style={{ width: baseWidth, height: baseHeight, transformOrigin: "center" }}>{children}</div>
    </div>
  </div>;
}
