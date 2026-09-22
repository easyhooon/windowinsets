import { useRef } from "react";

export function ResizeHandle({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (value: number) => void; min: number; max: number;
}) {
  const start = useRef<{ x: number; width: number } | null>(null);
  const update = (v: number) => onChange(Math.min(max, Math.max(min, v)));
  return <div className="resize-handle" role="separator" aria-label={label} aria-orientation="vertical" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} tabIndex={0}
    onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); start.current = { x: e.clientX, width: value }; }}
    onPointerMove={e => { if (start.current) update(start.current.width + e.clientX - start.current.x); }}
    onPointerUp={() => { start.current = null; }} onPointerCancel={() => { start.current = null; }}
    onKeyDown={e => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); update(value + (e.key === "ArrowLeft" ? -10 : 10)); } }} />;
}
