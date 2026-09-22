import { useEffect, useRef, useState } from "react";

export function DiagramViewport({ children, zoom, setZoom, rotation, fitKey, baseWidth = 700, baseHeight = 700 }: {
  children: React.ReactNode; zoom: number; setZoom: (value: number) => void;
  rotation: number; fitKey: number; baseWidth?: number; baseHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const live = useRef({ zoom, pan, setZoom });
  live.current = { zoom, pan, setZoom };
  const fit = useRef(() => {});
  useEffect(() => {
    const el = ref.current!;
    const fitCanvas = () => {
      const sideways = Math.abs(rotation) % 180 === 90;
      const w = sideways ? baseHeight : baseWidth, h = sideways ? baseWidth : baseHeight;
      live.current.setZoom(Math.max(25, Math.min(150, Math.floor(Math.min((el.clientWidth - 52) / w, (el.clientHeight - 100) / h) * 100))));
      setPan({ x: 0, y: 0 });
    };
    fit.current = fitCanvas;
    const observer = new ResizeObserver(fitCanvas);
    observer.observe(el);
    fitCanvas();
    return () => observer.disconnect();
  }, [baseWidth, baseHeight, rotation]);
  useEffect(() => { fit.current(); }, [fitKey]);
  useEffect(() => {
    const el = ref.current!;
    const changeZoom = (value: number) => live.current.setZoom(Math.max(25, Math.min(500, Math.round(value))));
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) changeZoom(live.current.zoom * Math.exp(-e.deltaY * 0.01));
      else setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    };
    const keys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input,button,select,textarea,a")) return;
      if (["+", "=", "-", "0"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "0") fit.current(); else changeZoom(live.current.zoom + (e.key === "-" ? -10 : 10));
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
      const others = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId);
      if (others.length) {
        const other = others[0][1];
        const before = Math.hypot(previous.x - other.x, previous.y - other.y);
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (before > 0) setZoom(Math.max(25, Math.min(500, live.current.zoom * after / before)));
      } else setPan(p => ({ x: p.x + e.clientX - previous.x, y: p.y + e.clientY - previous.y }));
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }}
    onPointerUp={e => pointers.current.delete(e.pointerId)} onPointerCancel={e => pointers.current.delete(e.pointerId)}
    onLostPointerCapture={e => pointers.current.delete(e.pointerId)}>
    <div className="diagram-position" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
      <div style={{ width: baseWidth, height: baseHeight, transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transformOrigin: "center" }}>{children}</div>
    </div>
  </div>;
}
