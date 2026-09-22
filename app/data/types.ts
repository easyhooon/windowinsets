/** All lengths are dp unless the field name says otherwise. */

export type NavMode = "gesture" | "threeButton";

/**
 * official  – published by the manufacturer / Google
 * measured  – measured on a real device or Samsung Remote Test Lab, with a log in /measurements
 * community – submitted by a contributor, not yet independently verified
 */
export type SourceKind = "official" | "measured" | "community";

export interface Source {
  kind: SourceKind;
  label: string;
  url?: string;
  /** ISO date (YYYY-MM-DD) the source was last checked */
  retrievedAt: string;
  note?: string;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Software conditions an inset measurement is only valid for. */
export interface MeasurementCondition {
  oneUi: string;
  android: string;
  /** e.g. "Settings > Display > Navigation bar" defaults */
  note?: string;
}

/** The cutout's own bounding rectangle in dp, as reported by
 * DisplayCutout.boundingRects — its real position and size, not just how far
 * it intrudes from each edge. Used to draw the punch-hole/notch at its true
 * spot instead of a full-width placeholder band. */
export interface CutoutShape {
  xDp: number;
  yDp: number;
  widthDp: number;
  heightDp: number;
}

export interface InsetsMeasurement {
  /** WindowInsets.Type.systemBars() */
  systemBars: Insets;
  /** WindowInsets.Type.displayCutout() */
  displayCutout: Insets;
  /** Present only when the raw capture included boundingRects. */
  cutoutShape?: CutoutShape;
  condition: MeasurementCondition;
  sources: Source[];
}

export interface CornerRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface Screen {
  id: "cover" | "main";
  label: string;
  diagonalInch: number;
  resolutionPx: { width: number; height: number };
  ppi: number;
  /** null = not verified yet. Never estimate. */
  logicalSizeDp: { width: number; height: number } | null;
  densityDpi: number | null;
  cornerRadiiDp: CornerRadii | null;
  /** Portrait insets per navigation mode; null = not measured yet. */
  insets: Record<NavMode, InsetsMeasurement | null>;
  sources: Source[];
}

export type FormFactor = "bar" | "tablet" | "foldable-book" | "foldable-flip";

export interface Device {
  slug: string;
  name: string;
  brand: "Samsung";
  series: string;
  formFactor: FormFactor;
  /** Enable only for models whose animated skin rendering has been implemented. */
  foldAnimation?: boolean;
  /** null for artwork-only entries whose product specifications are not sourced. */
  releaseYear: number | null;
  /** Cover screen (if any) first, then the main screen. */
  screens: Screen[];
  sources: Source[];
}
