import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Device, Insets, NavMode, Source } from "../data/types";
import { Dropdown } from "./Dropdown";
import { FoldRenderer3D } from "./FoldRenderer3D";
import { InsetsDiagram } from "./InsetsDiagram";
import { DiagramViewport } from "./DiagramViewport";
import { skins } from "../data/skins";
import { ResizeHandle } from "./ResizeHandle";
import { Icon } from "./Icon";
import { getRtlAvailability } from "../data/rtlAvailability";
import { formatLength, hasExactPx, safeInsets, safeInsetsPx } from "../data/measurementUnits";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copyable = typeof value === "string" || typeof value === "number";
  const copy = async () => {
    if (!copyable) return;
    try { await navigator.clipboard.writeText(String(value)); setStatus("Copied"); }
    catch { setStatus("Copy unavailable"); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setStatus(""), 1500);
  };
  return <div className="metric-row" role={copyable ? "button" : undefined} tabIndex={copyable ? 0 : undefined}
    title={copyable ? `Copy ${value}` : undefined} onClick={copy}
    onKeyDown={e => { if (copyable && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); void copy(); } }}>
    <dt>{label}</dt><dd><span>{value}</span><span role="status" className="copy-status">{status}</span></dd>
  </div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-subtle first:mt-0">{children}</h3>;
}

const PENDING = <span className="text-subtle">pending</span>;

function insetsRows(i: Insets, iPx: Insets | null | undefined, unit = "dp", fmt = (v: number, px?: number) => String(px ?? v)) {
  return (
    <>
      <Row label="Top" value={`${fmt(i.top, iPx?.top)} ${unit}`} />
      <Row label="Bottom" value={`${fmt(i.bottom, iPx?.bottom)} ${unit}`} />
      <Row label="Left" value={`${fmt(i.left, iPx?.left)} ${unit}`} />
      <Row label="Right" value={`${fmt(i.right, iPx?.right)} ${unit}`} />
    </>
  );
}

const pendingInsetsRows = <>
  <Row label="Top" value={PENDING} />
  <Row label="Bottom" value={PENDING} />
  <Row label="Left" value={PENDING} />
  <Row label="Right" value={PENDING} />
</>;

function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return <p className="text-sm text-muted">No verified source yet.</p>;
  return (
    <ul className="space-y-1 text-sm">
      {sources.map((s) => (
        <li key={`${s.label}|${s.url ?? ""}|${s.retrievedAt}`}>
          <span className="mr-2 rounded bg-canvas px-1.5 py-0.5 text-xs uppercase">{s.kind}</span>
          {s.url ? (
            <a href={s.url} className="underline" rel="noopener noreferrer" target="_blank">
              {s.label}
            </a>
          ) : (
            s.label
          )}
          <span className="text-muted"> · checked {s.retrievedAt}</span>
        </li>
      ))}
    </ul>
  );
}


const orientations = [
  { value: "0", label: "Portrait" }, { value: "90", label: "Landscape Left" },
  { value: "-90", label: "Landscape Right" }, { value: "180", label: "Portrait Upside Down" },
];

export function DeviceView({ device }: { device: Device }) {
  const initialHasCover = device.screens.some(screen => screen.id === "cover");
  const [metricsWidth, setMetricsWidth] = useState(292);
  const [navMode, setNavMode] = useState<NavMode>("threeButton");
  const [angle, setAngle] = useState(initialHasCover ? 0 : 180);
  const [screenId, setScreenId] = useState(initialHasCover ? "cover" : "main");
  const [transitionTarget, setTransitionTarget] = useState<"cover" | "main" | null>(null);
  const [zoom, setZoom] = useState(100);
  const [autoFit, setAutoFit] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [fitKey, setFitKey] = useState(0);
  const [showFrame, setShowFrame] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [layers, setLayers] = useState({ safe: true, insets: true, cutout: true, corners: true });
  const [units, setUnits] = useState<"dp" | "px">("dp");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const settings = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!settingsOpen) return;
    const close = (e: PointerEvent) => { if (!settings.current?.contains(e.target as Node)) setSettingsOpen(false); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setSettingsOpen(false); };
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [settingsOpen]);
  const foldable = device.formFactor === "foldable-book" || device.formFactor === "foldable-flip";
  const main = device.screens.find(s => s.id === "main")!;
  const screen = device.screens.find(s => s.id === screenId) ?? main;
  const measurement = screen.insets[navMode];
  const rtl = getRtlAvailability(device.slug);
  const skin = skins[`${device.slug}/${screen.id}`];
  const safe = measurement ? safeInsets(measurement) : null;
  const safePx = measurement ? safeInsetsPx(measurement) : null;
  const fmt = (v: number, px?: number | null) => formatLength({ dp: v, px, units });
  const mainSkin = skins[`${device.slug}/main`];
  const outerSkin = skins[`${device.slug}/cover`];
  const outerScreen = device.screens.find(s => s.id === "cover");
  const mainMeasurement = main.insets[navMode];
  const mainSafe = mainMeasurement ? safeInsets(mainMeasurement) : null;
  const mainSafePx = mainMeasurement ? safeInsetsPx(mainMeasurement) : null;
  const useFold = foldable && !!device.foldAnimation && !!mainSkin;
  const exactPxAvailable = hasExactPx(screen, measurement);
  useEffect(() => { if (units === "px" && !exactPxAvailable) setUnits("dp"); }, [exactPxAvailable, units]);
  const pose = (value: string) => {
    const nextAngle = Number(value);
    const target = nextAngle === 0 && device.screens.some(s => s.id === "cover") ? "cover" : "main";
    setAngle(nextAngle);
    if (useFold) {
      setTransitionTarget(target);
      if (autoFit) setFitKey(key => key + 1);
    }
    else {
      setScreenId(target);
      if (autoFit) setFitKey(key => key + 1);
    }
  };
  const size = screen.logicalSizeDp ?? (skin ? { width: skin.screen.width, height: skin.screen.height } : null);
  const orientationOptions = size && size.width > size.height ? [
    { value: "0", label: "Landscape Left" }, { value: "90", label: "Portrait" },
    { value: "-90", label: "Portrait Upside Down" }, { value: "180", label: "Landscape Right" },
  ] : orientations;
  const fitScreenId = transitionTarget ?? screenId;
  const closed = fitScreenId === "cover";
  const diagramWidth = useFold
    ? device.formFactor === "foldable-flip" ? 380 : closed ? 340 : 700
    : size ? 700 * (260 + 128) / (260 * size.height / size.width + 84) : 440;
  const diagramHeight = useFold && closed ? (device.formFactor === "foldable-flip" ? 390 : 500) : 700;
  return <article style={{ "--metrics-width": `${metricsWidth}px` } as React.CSSProperties} className="device-workspace" aria-label={device.name}>
    <h1 className="sr-only">{device.name} Window Insets</h1>
    <div className={`metrics-panel ${metricsOpen ? "is-open" : ""}`} aria-busy={transitionTarget !== null}>
      <button className="metrics-toggle" aria-expanded={metricsOpen} onClick={() => setMetricsOpen(!metricsOpen)}>Metrics<Icon name="chevron" /></button>
      <div className="metrics-content">
        <h2>Metrics</h2>
        {foldable && <div className="screen-tabs" aria-label="Display">{device.screens.map(s => <button key={s.id} aria-pressed={screen.id === s.id} onClick={() => pose(s.id === "cover" ? "0" : "180")}>{s.label === "Main" ? "Inner" : "Outer"}</button>)}</div>}
            <SectionLabel>Dimensions</SectionLabel>
            <dl>
              <Row
                label="Logical Size"
                value={screen.logicalSizeDp ? `${fmt(screen.logicalSizeDp.width, screen.logicalSizePx?.width)} × ${fmt(screen.logicalSizeDp.height, screen.logicalSizePx?.height)} ${units}` : PENDING}
              />
              <Row
                label="Resolution"
                value={screen.resolutionPx.width > 0 && screen.resolutionPx.height > 0 ? `${screen.resolutionPx.width} × ${screen.resolutionPx.height} px` : PENDING}
              />
              {screen.logicalSizePx && (screen.logicalSizePx.width !== screen.resolutionPx.width || screen.logicalSizePx.height !== screen.resolutionPx.height) &&
                <Row label="Captured Window" value={`${screen.logicalSizePx.width} × ${screen.logicalSizePx.height} px`} />}
              <Row label="Physical Density" value={screen.ppi > 0 ? `${screen.ppi} ppi` : PENDING} />
              <Row label="Android Density" value={screen.densityDpi ? `${screen.densityDpi} dpi` : PENDING} />
              <Row label="Scale" value={screen.densityDpi ? `${Number((screen.densityDpi / 160).toFixed(2))}×` : PENDING} />
            </dl>

            <SectionLabel>Safe Area Insets</SectionLabel>
            <dl>
              {safe ? insetsRows(safe, safePx, units, fmt) : pendingInsetsRows}
            </dl>

            {measurement?.cutoutShape && <>
              <SectionLabel>Reserved Regions</SectionLabel>
              <dl>
                <Row label="Size" value={`${fmt(measurement.cutoutShape.widthDp, measurement.cutoutShape.widthPx)} × ${fmt(measurement.cutoutShape.heightDp, measurement.cutoutShape.heightPx)} ${units}`} />
                <Row label="Left" value={`${fmt(measurement.cutoutShape.xDp, measurement.cutoutShape.xPx)} ${units}`} />
                <Row label="Top" value={`${fmt(measurement.cutoutShape.yDp, measurement.cutoutShape.yPx)} ${units}`} />
                <Row label="Right" value={`${fmt(measurement.cutoutShape.rightDp, measurement.cutoutShape.rightPx)} ${units}`} />
                <Row label="Bottom" value={`${fmt(measurement.cutoutShape.bottomDp, measurement.cutoutShape.bottomPx)} ${units}`} />
              </dl>
            </>}

            {screen.cornerRadiiDp && (
              <>
                <SectionLabel>Corner Radii · {screen.captureOrientation ? screen.captureOrientation[0].toUpperCase() + screen.captureOrientation.slice(1) : "Capture"}</SectionLabel>
                <dl>
                  <Row label="Top Left" value={`${fmt(screen.cornerRadiiDp.topLeft, screen.cornerRadiiPx?.topLeft)} ${units}`} />
                  <Row label="Top Right" value={`${fmt(screen.cornerRadiiDp.topRight, screen.cornerRadiiPx?.topRight)} ${units}`} />
                  <Row label="Bottom Right" value={`${fmt(screen.cornerRadiiDp.bottomRight, screen.cornerRadiiPx?.bottomRight)} ${units}`} />
                  <Row label="Bottom Left" value={`${fmt(screen.cornerRadiiDp.bottomLeft, screen.cornerRadiiPx?.bottomLeft)} ${units}`} />
                </dl>
              </>
            )}

        <details className="sources-details"><summary>Android details & sources</summary>
          <section className="rtl-status" aria-label="Remote Test Lab availability">
            <a href={rtl.sourceUrl} target="_blank" rel="noreferrer">{rtl.label} ↗</a>
            <p>{rtl.description}</p>
            <small>Checked {rtl.checkedAt} · {measurement ? "Measured selection" : "No capture for this selection"}</small>
          </section>
          <SectionLabel>System Bars · {navMode === "gesture" ? "Gesture" : "3-button"}</SectionLabel>
          <dl>{measurement ? insetsRows(measurement.systemBars, measurement.systemBarsPx, units, fmt) : pendingInsetsRows}</dl>
          <SectionLabel>Display Cutout Insets</SectionLabel>
          <dl>{measurement ? insetsRows(measurement.displayCutout, measurement.displayCutoutPx, units, fmt) : pendingInsetsRows}</dl>
          <SectionLabel>Measured On</SectionLabel>
          <dl>
            <Row label="One UI" value={measurement ? measurement.condition.oneUi : PENDING} />
            <Row label="Android" value={measurement ? measurement.condition.android : PENDING} />
          </dl>
          <p className="mb-3 text-xs text-muted">{device.name} · {screen.label} · {measurement ? `Captured ${screen.captureOrientation ?? "orientation unknown"}. Rotation changes the view, not the recorded Android insets.` : "Official artwork preview. Android insets have not been measured for this navigation mode."}</p>
          {measurement?.condition.note && <p className="mb-3 text-xs text-muted">{measurement.condition.note}</p>}
          <SourceList sources={Array.from(new Map((measurement?.sources ?? []).concat(screen.sources).map(s => [`${s.label}|${s.url ?? ""}`, s])).values())} />
          <Link to="/methodology" className="mt-3 block text-accent underline">How these values are measured →</Link>
        </details>
      </div>
    </div>
    <ResizeHandle label="Metrics width" value={metricsWidth} onChange={setMetricsWidth} min={250} max={400} />
    <section className="canvas-panel" aria-label="Device visualization">
      <DiagramViewport zoom={zoom} setZoom={setZoom} rotation={rotation} fitKey={fitKey}
        onUserTransform={() => setAutoFit(false)} onFit={() => setAutoFit(true)}
        baseWidth={useFold ? (device.formFactor === "foldable-flip" ? 380 : 700) : diagramWidth}
        baseHeight={700} fitWidth={diagramWidth} fitHeight={diagramHeight}>
        {useFold ? <FoldRenderer3D angle={angle} axis={device.formFactor === "foldable-flip" ? "horizontal" : "vertical"}
          widthDp={main.logicalSizeDp?.width ?? (mainSkin ? mainSkin.screen.width / 3 : 0)} heightDp={main.logicalSizeDp?.height ?? (mainSkin ? mainSkin.screen.height / 3 : 0)}
          safe={mainSafe} safePx={mainSafePx} logicalSizePx={main.logicalSizePx} cornerRadiiDp={main.cornerRadiiDp} cornerRadiiPx={main.cornerRadiiPx} cutoutShape={mainMeasurement?.cutoutShape}
          zoom={zoom} showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} skin={mainSkin} measured={!!main.logicalSizeDp} cover={outerScreen && outerSkin ? { screen: outerScreen, measurement: outerScreen.insets[navMode], skin: outerSkin } : undefined}
          onTransitionEnd={() => { if (transitionTarget) { setScreenId(transitionTarget); setTransitionTarget(null); } }} />
          : <InsetsDiagram screen={screen} measurement={measurement} zoom={zoom} showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} skin={skin} />}
      </DiagramViewport>
      {!measurement && <p className="pending-notice">{rtl.previewNotice}</p>}
      <div className="region-legend" aria-label="Region legend">
        {([{ key: "safe", label: "Safe Area", color: "#ade7bc" }, { key: "insets", label: "Insets", color: "#ffdab0" }, { key: "cutout", label: "Display Cutout", color: "#c4a0f1" }, { key: "corners", label: "Corner Radius", color: "#e4a6cc" }] as const).map(item => <button key={item.key} aria-pressed={layers[item.key]} onClick={() => setLayers(v => ({ ...v, [item.key]: !v[item.key] }))}><i style={{ background: item.color }} />{item.label}</button>)}
      </div>
    </section>
    <div className={`canvas-controls${useFold ? " is-foldable" : ""}`} aria-label="Canvas controls">
      <Dropdown label="Navigation" value={navMode} options={[{ value: "threeButton", label: "3-button" }, { value: "gesture", label: "Gesture" }]} onChange={v => setNavMode(v as NavMode)} />
      <Dropdown label="Orientation" value={String(rotation)} options={orientationOptions} onChange={v => { setRotation(Number(v)); setAutoFit(true); setFitKey(key => key + 1); }} />
      <Dropdown label="Zoom" value={`${Math.round(zoom)}%`} options={[{ value: "fit", label: "Fit to canvas" }, { value: "out", label: "− Zoom out" }, { value: "in", label: "+ Zoom in" }, ...[50,100,200,300,500].map(z => ({ value: String(z), label: `${z}%` }))]} onChange={v => { if (v === "fit") { setAutoFit(true); setFitKey(k => k + 1); } else { setAutoFit(false); setZoom(v === "in" ? Math.min(500, zoom + 10) : v === "out" ? Math.max(25, zoom - 10) : Number(v)); } }} />
      {useFold && <><Dropdown label="Pose" value={String(angle)} options={[{value:"0",label:"Closed"},{value:"90",label:"Partially Folded"},{value:"180",label:"Open"}]} onChange={pose} />
      <Dropdown label="Hinge" value={`${angle}°`} valueWidthCh={4} options={[]} onChange={() => {}} footer={<input aria-label="Hinge angle in degrees" type="range" min={0} max={180} value={angle} onChange={e => pose(e.target.value)} />} /></>}
      <div className="dropdown settings" ref={settings}><button className="toolbar-button" aria-label="View settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(!settingsOpen)}><Icon name="settings" /></button>
        {settingsOpen && <div className="dropdown-panel settings-panel">
          <label><input type="checkbox" checked={showFrame} onChange={e => setShowFrame(e.target.checked)} />Show Frame</label>
          <label><input type="checkbox" checked={showRegions} onChange={e => setShowRegions(e.target.checked)} />Show Regions</label>
          <label><input type="checkbox" checked={showDimensions} onChange={e => setShowDimensions(e.target.checked)} />Show Dimensions</label>
          <fieldset><legend>Dimension units</legend>{(["dp","px"] as const).map(u => <label key={u}><input type="radio" name="units" checked={units === u} disabled={u === "px" && !exactPxAvailable} onChange={() => setUnits(u)} />{u}</label>)}</fieldset>
        </div>}
      </div>
    </div>
    <p className="canvas-help">Scroll or drag to pan · Pinch to zoom · + / − to zoom · 0 to fit</p>
  </article>;
}
