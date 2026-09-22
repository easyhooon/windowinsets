import { useEffect, useRef, useState } from "react";

/** A single toolbar dropdown button: "Label: Value ▾" that opens a small
 * menu of options with a checkmark on the selected one — the same visual
 * pattern safearea.info uses for every one of its toolbar controls
 * (Orientation / Zoom / Pose / Hinge), used here so ours look uniform too. */
export function Dropdown({
  label,
  value,
  options,
  onChange,
  footer,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  /** Extra content rendered below the option list (e.g. a slider for Hinge). */
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm hover:bg-canvas"
      >
        <span className="text-muted">{label}:</span>
        <span className="font-semibold">{current?.label ?? value}</span>
        <span className="text-subtle text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 min-w-[10rem] rounded-md border border-line bg-surface py-1 shadow-card">
          {options.map((o) => (
            <button
              key={o.value}
              disabled={o.disabled}
              onClick={() => { if (!o.disabled) { onChange(o.value); setOpen(false); } }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${
                o.disabled ? "text-subtle" : "hover:bg-canvas"
              }`}
            >
              <span className="w-3 text-accent">{o.value === value ? "✓" : ""}</span>
              {o.label}
            </button>
          ))}
          {footer && <div className="border-t border-line px-3 pt-2 pb-1">{footer}</div>}
        </div>
      )}
    </div>
  );
}
