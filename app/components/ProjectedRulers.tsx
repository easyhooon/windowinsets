import { MeasurementRulers } from './MeasurementRulers';
import type { RulerMeasurements } from './measurementLayout';

export function ProjectedRulers({ measurements }: { measurements: RulerMeasurements | null }) {
  if (!measurements) return null;
  return <svg className="projected-rulers" width="700" height="700" viewBox="0 0 700 700"
    aria-label={`${measurements.screen} measured dimensions`} style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'visible', pointerEvents: 'none' }}>
    <MeasurementRulers measurements={measurements} onCopy={value => navigator.clipboard.writeText(value).catch(() => {})} />
  </svg>;
}
