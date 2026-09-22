import { useState } from "react";
import { Link } from "react-router";
import { isSpecced } from "../data/devices";
import type { Device, Insets, NavMode, Source } from "../data/types";
import { Dropdown } from "./Dropdown";
import { FoldRenderer3D } from "./FoldRenderer3D";
import { InsetsDiagram } from "./InsetsDiagram";

const POSES = [
  { label: "Closed", angle: 0 },
  { label: "Half-open", angle: 90 },
  { label: "Flat", angle: 180 },
];

const MIN_ZOOM = 25;
const MAX_ZOOM = 500;

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-mono">{value}</dd>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-subtle first:mt-0">{children}</h3>;
}

const PENDING = <span className="text-subtle">pending</span>;

function insetsRows(i: Insets, unit = "dp") {
  return (
    <>
      <Row label="Top" value={`${i.top} ${unit}`} />
      <Row label="Right" value={`${i.right} ${unit}`} />
      <Row label="Bottom" value={`${i.bottom} ${unit}`} />
      <Row label="Left" value={`${i.left} ${unit}`} />
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

/** Full device detail view: a single toolbar of uniform dropdown controls
 * (Navigation / Pose / Hinge / Zoom / Settings — matching safearea.info's
 * "Orientation: Portrait ▾  Zoom: 93% ▾  Pose: Closed ▾  Hinge: 0° ▾  ⚙"
 * pattern exactly, one consistent button style instead of mixed tab/slider/
 * icon controls), the fold animation or insets diagram, metrics panel and
 * sources. Shared by the device route and the home page (which shows this
 * directly for the newest device instead of a separate list-only page). */
export function DeviceView({ device }: { device: Device }) {
  const [navMode, setNavMode] = useState<NavMode>("threeButton");
  const [angle, setAngle] = useState(180);
  const [zoom, setZoom] = useState(100);
  const [showFrame, setShowFrame] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [units, setUnits] = useState<"dp" | "px">("dp");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const foldable = device.formFactor !== "bar";
  const cover = device.screens.find((s) => s.id === "cover");
  const main = device.screens.find((s) => s.id === "main")!;
  const screen = foldable && angle === 0 && cover ? cover : main;
  const measurement = screen.insets[navMode];

  const mainMeasurement = main.insets[navMode];
  const mainSafe = mainMeasurement
    ? {
        top: Math.max(mainMeasurement.systemBars.top, mainMeasurement.displayCutout.top),
        right: Math.max(mainMeasurement.systemBars.right, mainMeasurement.displayCutout.right),
        bottom: Math.max(mainMeasurement.systemBars.bottom, mainMeasurement.displayCutout.bottom),
        left: Math.max(mainMeasurement.systemBars.left, mainMeasurement.displayCutout.left),
      }
    : null;
  const foldAxis = device.formFactor === "foldable-flip" ? "horizontal" : "vertical";
  const canUsePx = !!screen.densityDpi;

  return (
    <article className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="text-2xl font-semibold">{device.name}</h1>
      <p className="text-sm text-muted">
        {device.series} · {device.releaseYear}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Dropdown
          label="Navigation"
          value={navMode}
          options={[
            { value: "threeButton", label: "3-button" },
            { value: "gesture", label: "Gesture" },
          ]}
          onChange={(v) => setNavMode(v as NavMode)}
        />
        {foldable && (
          <Dropdown
            label="Pose"
            value={String(POSES.find((p) => p.angle === angle)?.angle ?? angle)}
            options={POSES.map((p) => ({ value: String(p.angle), label: p.label }))}
            onChange={(v) => setAngle(Number(v))}
          />
        )}
        {foldable && (
          <Dropdown
            label="Hinge"
            value={`${angle}°`}
            valueWidthCh={4}
            options={[]}
            onChange={() => {}}
            footer={
              <input
                type="range"
                min={0}
                max={180}
                step={1}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-40"
                aria-label="Hinge angle in degrees"
              />
            }
          />
        )}
        <Dropdown
          label="Zoom"
          value={`${zoom}%`}
          valueWidthCh={4}
          options={[
            { value: "out", label: "− Zoom Out" },
            { value: "in", label: "+ Zoom In" },
            { value: "fit", label: "⤢ Zoom to Fit (100%)" },
          ]}
          onChange={(v) => {
            if (v === "out") setZoom((z) => Math.max(MIN_ZOOM, z - 10));
            else if (v === "in") setZoom((z) => Math.min(MAX_ZOOM, z + 10));
            else setZoom(100);
          }}
        />
        <div className="relative">
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm hover:bg-canvas"
            aria-label="Diagram settings"
            title="Diagram settings"
          >
            ⚙
          </button>
          {settingsOpen && (
            <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-line bg-surface p-2 text-left shadow-card">
              <label className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-canvas">
                <input type="checkbox" checked={showFrame} onChange={(e) => setShowFrame(e.target.checked)} /> Show Frame
              </label>
              <label className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-canvas">
                <input type="checkbox" checked={showRegions} onChange={(e) => setShowRegions(e.target.checked)} /> Show Regions
              </label>
              <label className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-canvas">
                <input type="checkbox" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} /> Show Dimensions
              </label>
              <div className="mt-1.5 border-t border-line pt-1.5">
                <p className="px-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wide text-subtle">Units</p>
                <label className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-canvas">
                  <input type="radio" name="dv-units" checked={units === "dp"} onChange={() => setUnits("dp")} /> dp
                </label>
                <label className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-canvas">
                  <input type="radio" name="dv-units" checked={units === "px"} onChange={() => setUnits("px")} disabled={!canUsePx} />
                  px{!canUsePx && <span className="text-subtle"> (needs density)</span>}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {foldable && (
        <div className="mt-6 flex items-center justify-center">
          <FoldRenderer3D
            angle={angle}
            axis={foldAxis}
            widthDp={main.logicalSizeDp?.width ?? 0}
            heightDp={main.logicalSizeDp?.height ?? 0}
            safe={mainSafe}
            cornerRadiiDp={main.cornerRadiiDp}
            cutoutShape={mainMeasurement?.cutoutShape}
            densityDpi={main.densityDpi}
            zoom={zoom} onZoomChange={setZoom}
            showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units}
          />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left: Metrics Panel — one value per row, like safearea.info.
         * Full width for foldables, since FoldRenderer3D above is already the
         * single unified diagram (no separate InsetsDiagram column needed). */}
        <div className={foldable ? "lg:col-span-3 lg:max-w-md" : "lg:col-span-1"}>
          <div className="rounded-[10px] border border-line bg-surface p-4 shadow-card">
            <h2 className="text-sm font-semibold">Metrics</h2>

            <SectionLabel>Dimensions</SectionLabel>
            <dl>
              <Row
                label="Logical Size"
                value={screen.logicalSizeDp ? `${screen.logicalSizeDp.width} × ${screen.logicalSizeDp.height} dp` : PENDING}
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
              {measurement ? insetsRows(measurement.systemBars) : (
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
              {measurement ? insetsRows(measurement.displayCutout) : (
                <>
                  <Row label="Top" value={PENDING} />
                  <Row label="Right" value={PENDING} />
                  <Row label="Bottom" value={PENDING} />
                  <Row label="Left" value={PENDING} />
                </>
              )}
            </dl>

            {screen.cornerRadiiDp && (
              <>
                <SectionLabel>Corner Radii · Portrait</SectionLabel>
                <dl>
                  <Row label="Top Left" value={`${screen.cornerRadiiDp.topLeft} dp`} />
                  <Row label="Top Right" value={`${screen.cornerRadiiDp.topRight} dp`} />
                  <Row label="Bottom Right" value={`${screen.cornerRadiiDp.bottomRight} dp`} />
                  <Row label="Bottom Left" value={`${screen.cornerRadiiDp.bottomLeft} dp`} />
                </dl>
              </>
            )}

            <SectionLabel>Measured On</SectionLabel>
            <dl>
              <Row label="One UI" value={measurement ? measurement.condition.oneUi : PENDING} />
              <Row label="Android" value={measurement ? measurement.condition.android : PENDING} />
            </dl>
          </div>
        </div>

        {/* Right: Insets Diagram — bar phones only. Foldables already show
         * their full diagram (with the same zoom/settings/corner/cutout
         * features) inside the folding FoldRenderer3D above. */}
        {!foldable && (
          <div className="lg:col-span-2 flex flex-col gap-4">
            <InsetsDiagram
              screen={screen} measurement={measurement}
              zoom={zoom} onZoomChange={setZoom}
              showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units}
            />
          </div>
        )}
      </div>

      {/* Sources */}
      <div className="mt-8 rounded-[10px] border border-line bg-surface p-4 shadow-card max-w-2xl">
        <h2 className="text-sm font-medium text-muted">Sources</h2>
        <SourceList sources={Array.from(new Map((measurement?.sources ?? []).concat(screen.sources).map(s => [s.label, s])).values())} />
        <p className="mt-3 text-sm">
          <Link to="/methodology" className="text-accent underline">
            How these values are measured →
          </Link>
        </p>
      </div>
    </article>
  );
}
