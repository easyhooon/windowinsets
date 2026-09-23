import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

export type DiagramViewportHandle = { setFoldAngle: (angle: number) => void; effectiveZoom: () => number };

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
  const applyScale = () => {
    const progress = displayedAngle.current / 180;
    // Use the renderer's actual angle, including interrupted and reduced-motion frames.
    effectiveZoom.current = live.current.autoFit && live.current.closedFit
      ? fitScales.current.closed + (fitScales.current.open - fitScales.current.closed) * progress
      : live.current.zoom;
    if (scaleRef.current) scaleRef.current.style.transform = `scale(${effectiveZoom.current / 100}) rotate(${live.current.rotation}deg)`;
  };
  useImperativeHandle(viewportRef, () => ({
    setFoldAngle: angle => { displayedAngle.current = angle; applyScale(); },
    effectiveZoom: () => effectiveZoom.current,
  }));
  useLayoutEffect(applyScale);
  const fit = useRef(() => {});
  useEffect(() => {
    const el = ref.current!;
    const fitCanvas = () => {
      const bounds = fitBounds.current;
      const sideways = Math.abs(rotation) % 180 === 90;
      const w = sideways ? bounds.fitHeight : bounds.fitWidth, h = sideways ? bounds.fitWidth : bounds.fitHeight;
      const verticalReserve = el.clientWidth < 768 ? 160 : 100;
      const scale = (width: number, height: number) => Math.max(25, Math.min(150, Math.floor(Math.min((el.clientWidth - 52) / width, (el.clientHeight - verticalReserve) / height) * 100)));
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
  return <div id="device-canvas" ref={ref} className="diagram-viewport" tabIndex={0} aria-label="Zoomable device canvas"
    onPointerDown={e => {
      if ((e.target as Element).closest("button,a,[role=button]")) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }}
    onPointerMove={e => {
      const previous = pointers.current.get(e.pointerId);
      if (!previous) return;
      live.current.onUserTransform?.();
      const others = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId);
      if (others.length) {
        const other = others[0][1];
        const before = Math.hypot(previous.x - other.x, previous.y - other.y);
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (before > 0) setZoom(Math.max(25, Math.min(500, effectiveZoom.current * after / before)));
      } else setPan(p => ({ x: p.x + e.clientX - previous.x, y: p.y + e.clientY - previous.y }));
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }}
    onPointerUp={e => pointers.current.delete(e.pointerId)} onPointerCancel={e => pointers.current.delete(e.pointerId)}
    onLostPointerCapture={e => pointers.current.delete(e.pointerId)}>
    <div className="diagram-position" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
      <div ref={scaleRef} style={{ width: baseWidth, height: baseHeight, transformOrigin: "center" }}>{children}</div>
    </div>
  </div>;
}
