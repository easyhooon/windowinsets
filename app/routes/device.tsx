import { useState } from "react";
import { Link } from "react-router";
import { FoldDiagram } from "../components/FoldDiagram";
import { InsetsView } from "../components/InsetsView";
import { Segmented } from "../components/Segmented";
import { findDevice, isSpecced, SITE_URL } from "../data/devices";
import type { Insets, NavMode, Source } from "../data/types";
import type { Route } from "./+types/device";

export function meta({ params }: Route.MetaArgs) {
  const device = findDevice(params.slug);
  if (!device) return [{ title: "Not found | windowinsets.info" }];
  const title = `${device.name} Window Insets & Display Metrics | windowinsets.info`;
  const description = `Status bar, navigation bar and cutout insets, resolution, density and hinge states for ${device.name}, with sources for every value.`;
  const url = `${SITE_URL}/${device.slug}`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

const NAV_OPTIONS: { value: NavMode; label: string }[] = [
  { value: "gesture", label: "Gesture" },
  { value: "threeButton", label: "3-button" },
];

const POSES = [
  { label: "Closed", angle: 0 },
  { label: "Half-open", angle: 90 },
  { label: "Flat", angle: 180 },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-mono">{value}</dd>
    </div>
  );
}

const PENDING = <span className="text-subtle">pending</span>;

function insetsText(i: Insets) {
  return `T ${i.top} · R ${i.right} · B ${i.bottom} · L ${i.left} dp`;
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

export default function DevicePage({ params }: Route.ComponentProps) {
  const device = findDevice(params.slug);
  const [navMode, setNavMode] = useState<NavMode>("gesture");
  const [angle, setAngle] = useState(180);

  if (!device) throw new Response("Not Found", { status: 404 });

  const foldable = device.formFactor !== "bar";
  const cover = device.screens.find((s) => s.id === "cover");
  const main = device.screens.find((s) => s.id === "main")!;
  const screen = foldable && angle === 0 && cover ? cover : main;
  const measurement = screen.insets[navMode];

  return (
    <article className="mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="text-2xl font-semibold">{device.name}</h1>
      <p className="text-sm text-muted">
        {device.series} · {device.releaseYear}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Segmented label="Navigation" value={navMode} options={NAV_OPTIONS} onChange={setNavMode} />
        {foldable && (
          <Segmented
            label="Pose"
            value={POSES.find((p) => p.angle === angle)?.label ?? ""}
            options={POSES.map((p) => ({ value: p.label, label: p.label }))}
            onChange={(l) => setAngle(POSES.find((p) => p.label === l)!.angle)}
          />
        )}
      </div>

      {foldable && (
        <div className="mt-4">
          <label className="flex items-center gap-3 text-sm">
            <span className="text-muted">Hinge</span>
            <input
              type="range"
              min={0}
              max={180}
              step={1}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full max-w-sm"
              aria-label="Hinge angle in degrees"
            />
          </label>
        </div>
      )}

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center gap-6">
          {foldable && <FoldDiagram angle={angle} />}
          <InsetsView screen={screen} measurement={measurement} />
          <p className="text-xs text-muted">{screen.label} screen · portrait</p>
        </div>

        <div className="self-start rounded-[10px] border border-line bg-surface p-4 shadow-card">
          <h2 className="text-sm font-medium text-muted">Display · {screen.label}</h2>
          <dl>
            <Row label="Diagonal" value={isSpecced(screen) ? `${screen.diagonalInch.toFixed(1)}″` : PENDING} />
            <Row
              label="Resolution"
              value={isSpecced(screen) ? `${screen.resolutionPx.width} × ${screen.resolutionPx.height} px` : PENDING}
            />
            <Row label="Pixel density" value={isSpecced(screen) ? `${screen.ppi} ppi` : PENDING} />
            <Row label="Density (dpi)" value={screen.densityDpi ?? PENDING} />
            <Row
              label="Logical size"
              value={screen.logicalSizeDp ? `${screen.logicalSizeDp.width} × ${screen.logicalSizeDp.height} dp` : PENDING}
            />
          </dl>

          <h2 className="mt-6 text-sm font-medium text-muted">
            Insets · {navMode === "gesture" ? "Gesture" : "3-button"} navigation
          </h2>
          <dl>
            <Row label="System bars" value={measurement ? insetsText(measurement.systemBars) : PENDING} />
            <Row label="Display cutout" value={measurement ? insetsText(measurement.displayCutout) : PENDING} />
            <Row
              label="Measured on"
              value={measurement ? `One UI ${measurement.condition.oneUi} · Android ${measurement.condition.android}` : PENDING}
            />
          </dl>

          <h2 className="mt-6 text-sm font-medium text-muted">Sources</h2>
          <SourceList sources={[...screen.sources, ...(measurement?.sources ?? [])]} />
          <p className="mt-3 text-sm">
            <Link to="/methodology" className="text-accent underline">
              How these values are measured →
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
