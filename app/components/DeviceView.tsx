import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { isSpecced } from "../data/devices";
import type { Device, Insets, NavMode, Source } from "../data/types";
import { Dropdown } from "./Dropdown";
import { FoldRenderer3D } from "./FoldRenderer3D";
import { InsetsDiagram } from "./InsetsDiagram";
import { DiagramViewport } from "./DiagramViewport";
import { skins } from "../data/skins";
import { ResizeHandle } from "./ResizeHandle";
import { Icon } from "./Icon";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copyable = typeof value === "string" || typeof value === "number";
  return <div className="metric-row"><dt>{label}</dt><dd>
    <button disabled={!copyable} title={copyable ? `Copy ${value}` : undefined} onClick={async () => {
      try { await navigator.clipboard.writeText(String(value)); setStatus("Copied"); }
      catch { setStatus("Copy unavailable"); }
      clearTimeout(timer.current); timer.current = setTimeout(() => setStatus(""), 1500);
    }}>{value}</button><span role="status" className="copy-status">{status}</span>
  </dd></div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-subtle first:mt-0">{children}</h3>;
}

const PENDING = <span className="text-subtle">pending</span>;

function insetsRows(i: Insets, unit = "dp", fmt = (v: number) => String(v)) {
  return (
    <>
      <Row label="Top" value={`${fmt(i.top)} ${unit}`} />
      <Row label="Right" value={`${fmt(i.right)} ${unit}`} />
      <Row label="Bottom" value={`${fmt(i.bottom)} ${unit}`} />
      <Row label="Left" value={`${fmt(i.left)} ${unit}`} />
    </>
  );
}

function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return <p className="text-sm text-muted">No verified source yet.</p>;
  return (
    <ul className="space-y-1 text-sm">
      {sources.map((s) => (
        <li key={s.label + s.retrievedAt}>
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
  const [metricsWidth, setMetricsWidth] = useState(292);
  const [navMode, setNavMode] = useState<NavMode>("threeButton");
  const [angle, setAngle] = useState(device.formFactor === "foldable-book" ? 0 : 180);
  const [screenId, setScreenId] = useState(device.formFactor === "foldable-book" ? "cover" : "main");
  const [zoom, setZoom] = useState(100);
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
  const skin = skins[`${device.slug}/${screen.id}`];
  const safe = measurement ? {
    top: Math.max(measurement.systemBars.top, measurement.displayCutout.top),
    right: Math.max(measurement.systemBars.right, measurement.displayCutout.right),
    bottom: Math.max(measurement.systemBars.bottom, measurement.displayCutout.bottom),
    left: Math.max(measurement.systemBars.left, measurement.displayCutout.left),
  } : null;
  const fmt = (v: number) => String(Number((units === "px" && screen.densityDpi ? v * screen.densityDpi / 160 : v).toFixed(2)));
  const pose = (value: string) => {
    setAngle(Number(value));
    setScreenId(Number(value) === 0 && device.screens.some(s => s.id === "cover") ? "cover" : "main");
  };
  const mainSkin = skins[`${device.slug}/main`];
  const outerSkin = skins[`${device.slug}/cover`];
  const outerScreen = device.screens.find(s => s.id === "cover");
  const mainMeasurement = main.insets[navMode];
  const mainSafe = mainMeasurement ? {
    top: Math.max(mainMeasurement.systemBars.top, mainMeasurement.displayCutout.top),
    right: Math.max(mainMeasurement.systemBars.right, mainMeasurement.displayCutout.right),
    bottom: Math.max(mainMeasurement.systemBars.bottom, mainMeasurement.displayCutout.bottom),
    left: Math.max(mainMeasurement.systemBars.left, mainMeasurement.displayCutout.left),
  } : null;
  const useFold = foldable && !!device.foldAnimation && !!mainSkin;
  const size = screen.logicalSizeDp ?? (skin ? { width: skin.screen.width, height: skin.screen.height } : null);
  const orientationOptions = !useFold && size && size.width > size.height ? [
    { value: "0", label: "Landscape Left" }, { value: "90", label: "Portrait" },
    { value: "-90", label: "Portrait Upside Down" }, { value: "180", label: "Landscape Right" },
  ] : orientations;
  const diagramWidth = useFold ? (device.formFactor === "foldable-flip" ? 380 : 700) : size ? 700 * (260 + 128) / (260 * size.height / size.width + 84) : 440;
  return <article style={{ "--metrics-width": `${metricsWidth}px` } as React.CSSProperties} className="device-workspace" aria-label={device.name}>
    <h1 className="sr-only">{device.name} Window Insets</h1>
    <div className={`metrics-panel ${metricsOpen ? "is-open" : ""}`}>
      <button className="metrics-toggle" aria-expanded={metricsOpen} onClick={() => setMetricsOpen(!metricsOpen)}>Metrics<Icon name="chevron" /></button>
      <div className="metrics-content">
        <h2>Metrics</h2>
        {foldable && <div className="screen-tabs" aria-label="Display">{device.screens.map(s => <button key={s.id} aria-pressed={screen.id === s.id} onClick={() => { setScreenId(s.id); setAngle(s.id === "cover" ? 0 : 180); }}>{s.label === "Main" ? "Inner" : "Outer"}</button>)}</div>}
                    <SectionLabel>Dimensions</SectionLabel>
            <dl>
              <Row
                label="Logical Size"
                value={screen.logicalSizeDp ? `${fmt(screen.logicalSizeDp.width)} × ${fmt(screen.logicalSizeDp.height)} ${units}` : PENDING}
              />
              <Row
                label="Resolution"
                value={isSpecced(screen) ? `${screen.resolutionPx.width} × ${screen.resolutionPx.height} px` : PENDING}
              />
              <Row label="Pixel Density" value={isSpecced(screen) ? `${screen.ppi} ppi` : PENDING} />
              <Row label="Density (dpi)" value={screen.densityDpi ?? PENDING} />
              <Row label="Diagonal" value={isSpecced(screen) ? `${screen.diagonalInch.toFixed(1)}″` : PENDING} />
            </dl>

            <SectionLabel>Safe Area Insets · {navMode === "gesture" ? "Gesture" : "3-button"}</SectionLabel>
            <dl>
              {measurement ? insetsRows(measurement.systemBars, units, fmt) : (
                <>
                  <Row label="Top" value={PENDING} />
                  <Row label="Right" value={PENDING} />
                  <Row label="Bottom" value={PENDING} />
                  <Row label="Left" value={PENDING} />
                </>
              )}
            </dl>

            <SectionLabel>Display Cutout</SectionLabel>
            <dl>
              {measurement ? insetsRows(measurement.displayCutout, units, fmt) : (
                <>
                  <Row label="Top" value={PENDING} />
                  <Row label="Right" value={PENDING} />
                  <Row label="Bottom" value={PENDING} />
                  <Row label="Left" value={PENDING} />
                </>
              )}
            </dl>

            {measurement?.cutoutShape && <>
              <SectionLabel>Cutout bounds</SectionLabel>
              <dl>{Object.entries({ X: measurement.cutoutShape.xDp, Y: measurement.cutoutShape.yDp, Width: measurement.cutoutShape.widthDp, Height: measurement.cutoutShape.heightDp }).map(([label, value]) => <Row key={label} label={label} value={`${fmt(value)} ${units}`} />)}</dl>
            </>}

            {screen.cornerRadiiDp && (
              <>
                <SectionLabel>Corner Radii · Portrait</SectionLabel>
                <dl>
                  <Row label="Top Left" value={`${fmt(screen.cornerRadiiDp.topLeft)} ${units}`} />
                  <Row label="Top Right" value={`${fmt(screen.cornerRadiiDp.topRight)} ${units}`} />
                  <Row label="Bottom Right" value={`${fmt(screen.cornerRadiiDp.bottomRight)} ${units}`} />
                  <Row label="Bottom Left" value={`${fmt(screen.cornerRadiiDp.bottomLeft)} ${units}`} />
                </dl>
              </>
            )}

            <SectionLabel>Measured On</SectionLabel>
            <dl>
              <Row label="One UI" value={measurement ? measurement.condition.oneUi : PENDING} />
              <Row label="Android" value={measurement ? measurement.condition.android : PENDING} />
            </dl>
        <details className="sources-details"><summary>Sources & measurement conditions</summary>
          <p className="mb-3 text-xs text-muted">{device.name} · {screen.label} · {measurement ? "Captured portrait. Rotation changes the view, not the recorded Android insets." : "Official artwork preview. Android insets have not been measured for this navigation mode."}</p>
          <SourceList sources={Array.from(new Map((measurement?.sources ?? []).concat(screen.sources).map(s => [s.label, s])).values())} />
          <Link to="/methodology" className="mt-3 block text-accent underline">How these values are measured →</Link>
        </details>
      </div>
    </div>
    <ResizeHandle label="Metrics width" value={metricsWidth} onChange={setMetricsWidth} min={250} max={400} />
    <section className="canvas-panel" aria-label="Device visualization">
      <DiagramViewport zoom={zoom} setZoom={setZoom} rotation={rotation} fitKey={fitKey} baseWidth={diagramWidth}>
        {useFold ? <FoldRenderer3D angle={angle} axis={device.formFactor === "foldable-flip" ? "horizontal" : "vertical"}
          widthDp={main.logicalSizeDp?.width ?? (mainSkin ? mainSkin.screen.width / 3 : 0)} heightDp={main.logicalSizeDp?.height ?? (mainSkin ? mainSkin.screen.height / 3 : 0)}
          safe={mainSafe} cornerRadiiDp={main.cornerRadiiDp} cutoutShape={mainMeasurement?.cutoutShape} densityDpi={main.densityDpi}
          zoom={zoom} showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} skin={mainSkin} measured={!!main.logicalSizeDp} cover={outerScreen && outerSkin ? { screen: outerScreen, measurement: outerScreen.insets[navMode], skin: outerSkin } : undefined} />
          : <InsetsDiagram screen={screen} measurement={measurement} zoom={zoom} showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} skin={skin} />}
      </DiagramViewport>
      {!screen.logicalSizeDp && <p className="pending-notice">{skin ? "Official skin preview · Insets and dimensions pending measurement" : "Measurements pending for this device"}</p>}
      <div className="region-legend" aria-label="Region legend">
        {([{ key: "safe", label: "Safe Area", color: "#ade7bc" }, { key: "insets", label: "Insets", color: "#ffdab0" }, { key: "cutout", label: "Display Cutout", color: "#c4a0f1" }, { key: "corners", label: "Corner Radius", color: "#e4a6cc" }] as const).map(item => <button key={item.key} aria-pressed={layers[item.key]} onClick={() => setLayers(v => ({ ...v, [item.key]: !v[item.key] }))}><i style={{ background: item.color }} />{item.label}</button>)}
      </div>
    </section>
    <div className={`canvas-controls${useFold ? " is-foldable" : ""}`} aria-label="Canvas controls">
      <Dropdown label="Navigation" value={navMode} options={[{ value: "threeButton", label: "3-button" }, { value: "gesture", label: "Gesture" }]} onChange={v => setNavMode(v as NavMode)} />
      <Dropdown label="Orientation" value={String(rotation)} options={orientationOptions} onChange={v => setRotation(Number(v))} />
      <Dropdown label="Zoom" value={`${Math.round(zoom)}%`} options={[{ value: "fit", label: "Fit to canvas" }, { value: "out", label: "− Zoom out" }, { value: "in", label: "+ Zoom in" }, ...[50,100,200,300,500].map(z => ({ value: String(z), label: `${z}%` }))]} onChange={v => { if (v === "fit") setFitKey(k => k + 1); else setZoom(v === "in" ? Math.min(500, zoom + 10) : v === "out" ? Math.max(25, zoom - 10) : Number(v)); }} />
      {useFold && <><Dropdown label="Pose" value={String(angle)} options={[{value:"0",label:"Closed"},{value:"90",label:"Partially Folded"},{value:"180",label:"Open"}]} onChange={pose} />
      <Dropdown label="Hinge" value={`${angle}°`} valueWidthCh={4} options={[]} onChange={() => {}} footer={<input aria-label="Hinge angle in degrees" type="range" min={0} max={180} value={angle} onChange={e => pose(e.target.value)} />} /></>}
      <div className="dropdown settings" ref={settings}><button className="toolbar-button" aria-label="View settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(!settingsOpen)}><Icon name="settings" /></button>
        {settingsOpen && <div className="dropdown-panel settings-panel">
          <label><input type="checkbox" checked={showFrame} onChange={e => setShowFrame(e.target.checked)} />Show Frame</label>
          <label><input type="checkbox" checked={showRegions} onChange={e => setShowRegions(e.target.checked)} />Show Regions</label>
          <label><input type="checkbox" checked={showDimensions} onChange={e => setShowDimensions(e.target.checked)} />Show Dimensions</label>
          <fieldset><legend>Dimension units</legend>{(["dp","px"] as const).map(u => <label key={u}><input type="radio" name="units" checked={units === u} disabled={u === "px" && !screen.densityDpi} onChange={() => setUnits(u)} />{u}</label>)}</fieldset>
        </div>}
      </div>
    </div>
    <p className="canvas-help">Scroll or drag to pan · Pinch to zoom · + / − to zoom · 0 to fit</p>
  </article>;
}
