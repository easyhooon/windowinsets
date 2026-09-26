import type { CornerRadii, CutoutShape, Insets } from '../data/types';
import type { DeviceSkin } from '../data/skins';

export interface Ruler {
  name: string; value: number; kind: 'size' | 'inset' | 'cutout' | 'radius';
  x1: number; y1: number; x2: number; y2: number;
  guides: [number, number, number, number][];
  labelX: number; labelY: number;
  secondaryValue?: number;
  symmetry?: 'corners' | 'inset-horizontal' | 'inset-vertical' | 'cutout-horizontal-offset' | 'cutout-vertical-offset';
  equivalentNames?: string[];
}

/** The canvas explains geometry; Metrics retains the complete measurement set.
 * Consolidate only equivalent geometry, never unrelated values that happen to match. */
export function visibleDiagramRulers(rulers: Ruler[], layers: { insets: boolean; cutout: boolean; corners: boolean }) {
  const visible = rulers.filter(ruler => ruler.kind === 'size' || layers[ruler.kind === 'inset' ? 'insets' : ruler.kind === 'radius' ? 'corners' : 'cutout']);
  const cutoutHeight = visible.find(ruler => ruler.name === 'Cutout height');
  const sharedHeight = cutoutHeight && visible.some(other =>
    other.kind === 'inset' && other.x1 === other.x2 &&
    Math.abs(other.y1 - cutoutHeight.y1) < 1e-8 && Math.abs(other.y2 - cutoutHeight.y2) < 1e-8);
  const compact: Ruler[] = [];
  for (const ruler of visible) {
    if (ruler.name === 'Cutout height') continue;
    const existing = ruler.symmetry && compact.find(other => other.symmetry === ruler.symmetry && Math.abs(other.value - ruler.value) < 1e-8);
    if (existing) {
      existing.equivalentNames!.push(ruler.name);
      continue;
    }
    compact.push({ ...ruler, equivalentNames: [ruler.name],
      ...(ruler.name === 'Cutout width' && cutoutHeight && !sharedHeight
        ? { name: 'Cutout size', secondaryValue: cutoutHeight.value } : {}),
    });
  }
  return compact;
}

/** Shared geometry for SVG and the folded canvas. The display is the origin;
 * ruler lanes start outside the official body, never outside a guessed bezel. */
export function diagramAnnotations(width: number, height: number, scale: number, skin: DeviceSkin | undefined,
  safe: Insets | null, radii: CornerRadii | null, cutout: CutoutShape | undefined, rotation = 0, chassis?: { left: number; top: number; right: number; bottom: number }) {
  const W = width * scale, H = height * scale;
  // Lane spacing is relative to display width so both rendering paths agree.
  const u = W / 260;
  let body = skin ? {
    left: (skin.body.x - skin.screen.x) * W / skin.screen.width,
    top: (skin.body.y - skin.screen.y) * H / skin.screen.height,
    right: (skin.body.x + skin.body.width - skin.screen.x) * W / skin.screen.width,
    bottom: (skin.body.y + skin.body.height - skin.screen.y) * H / skin.screen.height,
  } : { left: -2 * u, top: -2 * u, right: W + 2 * u, bottom: H + 2 * u };
  if (skin && rotation) {
    const l = (skin.body.x - skin.screen.x) / skin.screen.width;
    const t = (skin.body.y - skin.screen.y) / skin.screen.height;
    const r = l + skin.body.width / skin.screen.width;
    const b = t + skin.body.height / skin.screen.height;
    body = rotation === 1 ? { left: t * W, top: (1 - r) * H, right: b * W, bottom: (1 - l) * H }
      : rotation === 2 ? { left: (1 - r) * W, top: (1 - b) * H, right: (1 - l) * W, bottom: (1 - t) * H }
      : { left: (1 - b) * W, top: l * H, right: (1 - t) * W, bottom: r * H };
  }
  if (chassis) body = {
    left: Math.min(body.left, chassis.left * scale), top: Math.min(body.top, chassis.top * scale),
    right: Math.max(body.right, chassis.right * scale), bottom: Math.max(body.bottom, chassis.bottom * scale),
  };
  const rulers: Ruler[] = [];
  function horizontal(name: string, value: number, kind: Ruler['kind'], x1: number, x2: number, fromY: number, y: number, short = false, symmetry?: Ruler['symmetry']) {
    rulers.push({ name, value, kind, symmetry, x1, x2, y1: y, y2: y,
      guides: [[x1, fromY, x1, y], [x2, fromY, x2, y]],
      labelX: (x1 + x2) / 2, labelY: y + (short ? (y < 0 ? -12 : 12) * u : 0) });
  }
  function vertical(name: string, value: number, kind: Ruler['kind'], y1: number, y2: number, fromX: number, x: number, symmetry?: Ruler['symmetry']) {
    rulers.push({ name, value, kind, symmetry, x1: x, x2: x, y1, y2,
      guides: [[fromX, y1, x, y1], [fromX, y2, x, y2]], labelX: x, labelY: (y1 + y2) / 2 });
  }
  horizontal('Display width', width, 'size', 0, W, 0, body.top - 94 * u);
  vertical('Display height', height, 'size', 0, H, 0, body.left - 40 * u);
  if (safe) {
    if (safe.top) vertical('Top inset', safe.top, 'inset', 0, safe.top * scale, W, body.right + 32 * u, 'inset-vertical');
    if (safe.bottom) vertical('Bottom inset', safe.bottom, 'inset', H - safe.bottom * scale, H, W, body.right + 32 * u, 'inset-vertical');
    if (safe.left) horizontal('Left inset', safe.left, 'inset', 0, safe.left * scale, H, body.bottom + 58 * u, false, 'inset-horizontal');
    if (safe.right) horizontal('Right inset', safe.right, 'inset', W - safe.right * scale, W, H, body.bottom + 58 * u, false, 'inset-horizontal');
  }
  if (radii) {
    for (const [name, value, right, bottom] of [
      ['Top left radius', radii.topLeft, false, false], ['Top right radius', radii.topRight, true, false],
      ['Bottom left radius', radii.bottomLeft, false, true], ['Bottom right radius', radii.bottomRight, true, true],
    ] as const) {
      if (!value) continue;
      horizontal(name, value, 'radius', right ? W - value * scale : 0, right ? W : value * scale,
        bottom ? H - value * scale : value * scale, bottom ? body.bottom + 22 * u : body.top - 22 * u, true, 'corners');
    }
  }
  if (cutout) {
    const { xDp: x, yDp: y, widthDp: w, heightDp: h } = cutout;
    const nearBottom = y > height / 2;
    const cutoutLane = nearBottom ? body.bottom + 58 * u : body.top - 58 * u;
    const cutoutEdge = (nearBottom ? y + h : y) * scale;
    horizontal('Cutout width', w, 'cutout', x * scale, (x + w) * scale, cutoutEdge, cutoutLane, w * scale < 50 * u);
    vertical('Cutout height', h, 'cutout', y * scale, (y + h) * scale, (x + w) * scale, body.right + 80 * u);
    if (h * scale < 40 * u) rulers[rulers.length - 1].labelY = y * scale - 16 * u;
    // Position is measured from display edges, not from artwork or safe-area edges.
    if (x > 0) horizontal('Cutout left distance', x, 'cutout', 0, x * scale, cutoutEdge, cutoutLane, false, 'cutout-horizontal-offset');
    if (width - x - w > .01) horizontal('Cutout right distance', width - x - w, 'cutout', (x + w) * scale, W, cutoutEdge, cutoutLane, false, 'cutout-horizontal-offset');
    if (y > 0) vertical('Cutout top distance', y, 'cutout', 0, y * scale, (x + w) * scale, body.right + 80 * u, 'cutout-vertical-offset');
    if (height - y - h > .01) vertical('Cutout bottom distance', height - y - h, 'cutout', (y + h) * scale, H, (x + w) * scale, body.right + 80 * u, 'cutout-vertical-offset');
  }
  return { rulers, body, bounds: { left: body.left - 80 * u, top: body.top - 115 * u,
    right: body.right + 120 * u, bottom: body.bottom + 80 * u } };
}

/** Canvas px per dp for a flat diagram whose annotated bounds fill a 700 px tall SVG. */
export function flatCanvasPxPerDp(width: number, height: number, skin: DeviceSkin | undefined,
  safe: Insets | null, radii: CornerRadii | null, cutout: CutoutShape | undefined, rotation = 0) {
  const scale = 260 / width;
  const { bounds } = diagramAnnotations(width, height, scale, skin, safe, radii, cutout, rotation);
  return 700 * scale / (bounds.bottom - bounds.top);
}

export function flatDiagramSize(width: number, height: number, skin?: DeviceSkin) {
  const { bounds } = diagramAnnotations(width, height, 260 / width, skin, null, null, undefined);
  return { width: 700 * (bounds.right - bounds.left) / (bounds.bottom - bounds.top), height: 700 };
}
