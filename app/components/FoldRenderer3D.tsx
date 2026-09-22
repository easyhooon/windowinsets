import { DIAGRAM_FONT, DIAGRAM_COLORS } from "./diagramStyle";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { bendPoint, createChassis, rigidPanelPoint } from "./foldGeometry";
import type { DeviceSkin } from "../data/skins";
import type { CutoutShape, Screen, InsetsMeasurement } from "../data/types";
import { cornerPairs, formatLengthFromPairs, insetPairs, safeInsets, safeInsetsPx } from "../data/measurementUnits";

const SEGMENTS = 96; // vertices along the fold axis — higher = smoother curve
const THICKNESS = 0.065; // Stylized world-space thickness, not measured hardware data.
const ANNOTATION_PAD_DP = 80;

const INK = DIAGRAM_COLORS.ink;
const INSET_COLOR = DIAGRAM_COLORS.inset;
const RADIUS_COLOR = DIAGRAM_COLORS.radius;
const SAFE_FILL = DIAGRAM_COLORS.safeFill;
const INSET_FILL = DIAGRAM_COLORS.insetFill;

type Units = "dp" | "px";

interface Insets { top: number; right: number; bottom: number; left: number }
interface CornerRadii { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number }

/** Draws the full flat measurement diagram (bezel, safe/inset regions, real
 * cutout, corner-radius chips, outside dimension arrows) onto a 2D canvas —
 * this canvas becomes the WebGL texture, so every pixel (including the
 * dimension lines) bends along with the mesh automatically. Coordinates are
 * in device dp, scaled by `px` to canvas pixels. */
function drawDiagram(
  ctx: CanvasRenderingContext2D,
  dpW: number, dpH: number, px: number,
  opts: {
    safe: Insets | null;
    cornerRadiiDp: CornerRadii | null;
    cutoutShape?: CutoutShape;
    showFrame: boolean; showRegions: boolean; showDimensions: boolean;
    fmt: (v: number) => string;
    layers: { safe: boolean; insets: boolean; cutout: boolean; corners: boolean };
    skin?: DeviceSkin;
    artwork?: HTMLImageElement;
    foreground?: HTMLImageElement;
    annotationScale: number;
    hits: { x: number; y: number; width: number; height: number; text: string }[];
  },
) {
  const W = dpW * px, H = dpH * px;
  let labelScale = opts.annotationScale;
  const PAD = ANNOTATION_PAD_DP * px;
  // Labels grow as the viewport zooms out. Clamp them to the available annotation
  // margin so long dimensions (for example 932.57) are never texture-clipped.
  const outsideLabels = [opts.fmt(dpW), opts.fmt(dpH)];
  if (opts.safe) outsideLabels.push(opts.fmt(opts.safe.top), opts.fmt(opts.safe.right), opts.fmt(opts.safe.bottom), opts.fmt(opts.safe.left));
  if (opts.cornerRadiiDp) outsideLabels.push(...Object.values(opts.cornerRadiiDp).map(opts.fmt));
  const longest = Math.max(...outsideLabels.map(label => label.length), 1);
  const marginScale = (2 * (ANNOTATION_PAD_DP - 20) - 8) / (longest * 7.2);
  labelScale = Math.min(labelScale, marginScale);
  ctx.clearRect(0, 0, W + PAD * 2, H + PAD * 2);
  ctx.save();
  ctx.translate(PAD, PAD);

  const r = opts.cornerRadiiDp ? opts.cornerRadiiDp.topLeft * px : 0;

  function roundedRectPath(x: number, y: number, w: number, h: number, rr: number) {
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  if (opts.showFrame && opts.skin && opts.artwork?.complete && opts.artwork.naturalWidth) {
    const skin = opts.skin;
    const sx = W / skin.screen.width, sy = H / skin.screen.height;
    ctx.save();
    roundedRectPath((skin.body.x - skin.screen.x) * sx, (skin.body.y - skin.screen.y) * sy, skin.body.width * sx, skin.body.height * sy, skin.body.radius * Math.min(sx, sy));
    ctx.clip();
    ctx.drawImage(opts.artwork, -skin.screen.x * sx, -skin.screen.y * sy, skin.width * sx, skin.height * sy);
    ctx.restore();
  }
  if (opts.showFrame) {
    roundedRectPath(0, 0, W, H, r);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3 * px;
    ctx.strokeStyle = "#0f172a";
    if (!opts.skin) ctx.stroke();
  }

  const safe = opts.safe;
  if (opts.showRegions && safe) {
    ctx.save();
    roundedRectPath(0, 0, W, H, r);
    ctx.clip();

    ctx.fillStyle = SAFE_FILL; ctx.globalAlpha = opts.layers.safe ? 1 : 0;
    ctx.fillRect(safe.left * px, safe.top * px, W - (safe.left + safe.right) * px, H - (safe.top + safe.bottom) * px);

    ctx.fillStyle = INSET_FILL; ctx.globalAlpha = opts.layers.insets ? 1 : 0;
    if (safe.top > 0) ctx.fillRect(0, 0, W, safe.top * px);
    if (safe.bottom > 0) ctx.fillRect(0, H - safe.bottom * px, W, safe.bottom * px);
    if (safe.left > 0) ctx.fillRect(0, 0, safe.left * px, H);
    if (safe.right > 0) ctx.fillRect(W - safe.right * px, 0, safe.right * px, H);

    if (opts.layers.cutout && opts.cutoutShape) {
      const c = opts.cutoutShape;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#c4a0f1";
      const cx = c.xDp * px, cy = c.yDp * px, cw = c.widthDp * px, ch = c.heightDp * px;
      roundedRectPath(cx, cy, cw, ch, 1 * px);
      ctx.fill();
    }

    // Safe area's own size, centered inside the green region — the
    // "SAFE AREA / W × H" label safearea.info prints on top of its own
    // safe-area fill (the safe rect's own dp size, not the overall device
    // size the outside dimension arrows already show).
    if (opts.showDimensions && opts.layers.safe) {
      const safeWDp = dpW - safe.left - safe.right;
      const safeHDp = dpH - safe.top - safe.bottom;
      const scx = safe.left * px + (W - (safe.left + safe.right) * px) / 2;
      const scy = safe.top * px + (H - (safe.top + safe.bottom) * px) / 2;
      regionLabel(scx, scy, "SAFE AREA", `${opts.fmt(safeWDp)} × ${opts.fmt(safeHDp)}`, DIAGRAM_COLORS.safe, W, H, false);
    }
    ctx.restore();
  }

  if (opts.showFrame && opts.foreground?.complete && opts.foreground.naturalWidth) {
    ctx.drawImage(opts.foreground, 0, 0, W, H);
  }
  if (!opts.safe && opts.skin) {
    ctx.fillStyle = "#59636e";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `400 ${12 * px * labelScale}px ${DIAGRAM_FONT}`;
    ctx.fillText("Skin preview", W / 2, H / 2);
  }

  function chip(x: number, y: number, text: string, color: string, scale = labelScale) {
    const fontSize = 12 * px * scale;
    ctx.font = `500 ${fontSize}px ${DIAGRAM_FONT}`;
    const w = ctx.measureText(text).width + 8 * px * scale, h = 18 * px * scale;
    opts.hits.push({ x: x - w / 2 + PAD, y: y - h / 2 + PAD, width: w, height: h, text });
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    roundedRectPath(x - w / 2, y - h / 2, w, h, 2 * px * scale);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function regionLabel(x: number, y: number, name: string, value: string, color: string, areaW: number, areaH: number, inline: boolean) {
    const labelWidth = inline ? name.length + value.length + 4 : Math.max(name.length, value.length) + 2;
    const scale = Math.min(labelScale, areaH / ((inline ? 22 : 42) * px), areaW / (labelWidth * 8 * px));
    const fontSize = 12 * px * scale;
    ctx.font = `500 ${fontSize}px ${DIAGRAM_FONT}`;
    const nameW = ctx.measureText(name).width + 8 * px * scale;
    const valueW = ctx.measureText(value).width;
    const gap = 10 * px * scale;
    const nameX = inline ? x - (valueW + gap) / 2 : x;
    chip(nameX, inline ? y : y - 10 * px * scale, name, color, scale);
    ctx.fillStyle = color;
    ctx.font = `400 ${fontSize}px ${DIAGRAM_FONT}`;
    const valueX = inline ? x + (nameW + gap) / 2 : x;
    const valueY = inline ? y : y + 12 * px * scale;
    const valueWidth = ctx.measureText(value).width;
    opts.hits.push({ x: valueX - valueWidth / 2 + PAD, y: valueY - fontSize / 2 + PAD, width: valueWidth, height: fontSize, text: value });
    ctx.fillText(value, valueX, valueY);
  }

  function arrowLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3 * px;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const size = 5 * px;
    for (const [ex, ey, a] of [[x1, y1, ang + Math.PI], [x2, y2, ang]] as const) {
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + size * Math.cos(a - 0.4), ey + size * Math.sin(a - 0.4));
      ctx.lineTo(ex + size * Math.cos(a + 0.4), ey + size * Math.sin(a + 0.4));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  function extLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1 * px;
    ctx.setLineDash([2 * px, 2 * px]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  if (opts.showDimensions) {
    ctx.globalAlpha = 1;
    // Overall width/height, outside
    extLine(0, 0, 0, -20 * px, INK); extLine(W, 0, W, -20 * px, INK);
    arrowLine(0, -20 * px, W, -20 * px, INK);
    chip(W / 2, -20 * px, opts.fmt(dpW), INK);

    extLine(0, 0, -20 * px, 0, INK); extLine(0, H, -20 * px, H, INK);
    arrowLine(-20 * px, 0, -20 * px, H, INK);
    chip(-20 * px, H / 2, opts.fmt(dpH), INK);

    if (safe && opts.layers.insets) {
      if (safe.top > 0) {
        regionLabel(W * .25, safe.top * px / 2, "TOP", opts.fmt(safe.top), INSET_COLOR, W / 2, safe.top * px, true);
      }
      if (safe.bottom > 0) {
        regionLabel(W / 2, H - safe.bottom * px / 2, "BOTTOM", opts.fmt(safe.bottom), INSET_COLOR, W, safe.bottom * px, true);
      }
      if (safe.left > 0) {
        extLine(0, 0, 0, -12 * px, INSET_COLOR); extLine(safe.left * px, 0, safe.left * px, -12 * px, INSET_COLOR);
        arrowLine(0, -12 * px, safe.left * px, -12 * px, INSET_COLOR);
      }
      if (safe.right > 0) {
        extLine(W - safe.right * px, 0, W - safe.right * px, -12 * px, INSET_COLOR); extLine(W, 0, W, -12 * px, INSET_COLOR);
        arrowLine(W - safe.right * px, -12 * px, W, -12 * px, INSET_COLOR);
      }
    }

    if (opts.layers.corners && r > 0 && opts.cornerRadiiDp) {
      const cr = opts.cornerRadiiDp;
      const dot = (x: number, y: number, v: number) => chip(x, y, opts.fmt(v), RADIUS_COLOR);
      dot(-16 * px, -16 * px, cr.topLeft);
      dot(W + 16 * px, -16 * px, cr.topRight);
      dot(-16 * px, H + 16 * px, cr.bottomLeft);
      dot(W + 16 * px, H + 16 * px, cr.bottomRight);
    }
  }

  ctx.restore();
}

/** A lit solid chassis and an annotated display share the same cylindrical
 * hinge. Official skin artwork is aligned using its emulator layout rectangle.
 * Only measured screens get numeric annotations; unmeasured skins are previews. */
export function FoldRenderer3D({
  angle,
  axis,
  widthDp,
  heightDp,
  safe,
  safePx,
  logicalSizePx,
  cornerRadiiDp,
  cornerRadiiPx,
  cutoutShape,
  zoom,
  showFrame,
  showRegions,
  showDimensions,
  units,
  layers,
  skin,
  measured = true,
  cover,
  onTransitionEnd,
}: {
  angle: number;
  axis: "vertical" | "horizontal";
  widthDp: number;
  heightDp: number;
  safe: Insets | null;
  safePx?: Insets | null;
  logicalSizePx?: { width: number; height: number } | null;
  cornerRadiiDp?: CornerRadii | null;
  cornerRadiiPx?: CornerRadii | null;
  cutoutShape?: CutoutShape;
  /** Zoom/settings are controlled from the parent toolbar (DeviceView) so
   * every control on the page lives in one uniform row, safearea.info-style,
   * instead of a second private toolbar duplicated inside this component. */
  zoom: number;
  showFrame: boolean;
  showRegions: boolean;
  showDimensions: boolean;
  units: Units;
  layers: { safe: boolean; insets: boolean; cutout: boolean; corners: boolean };
  skin?: DeviceSkin;
  measured?: boolean;
  cover?: { screen: Screen; measurement: InsetsMeasurement | null; skin: DeviceSkin };
  onTransitionEnd?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({ angle, safe, safePx, logicalSizePx, cornerRadiiDp: cornerRadiiDp ?? null, cornerRadiiPx: cornerRadiiPx ?? null, cutoutShape, showFrame, showRegions, showDimensions, units, zoom, layers, cover, onTransitionEnd });
  stateRef.current = { angle, safe, safePx, logicalSizePx, cornerRadiiDp: cornerRadiiDp ?? null, cornerRadiiPx: cornerRadiiPx ?? null, cutoutShape, showFrame, showRegions, showDimensions, units, zoom, layers, cover, onTransitionEnd };

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap || !widthDp || !heightDp) return;

    const containerW = axis === "horizontal" ? 380 : 700, containerH = 700;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerW, containerH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const deviceGroup = new THREE.Group();
    scene.add(deviceGroup);
    scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x55596a, 2.5));
    const key = new THREE.DirectionalLight(0xfff3df, 3.5);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc4d9ff, 2);
    rim.position.set(4, -1, -3);
    scene.add(rim);
    const camera = new THREE.PerspectiveCamera(32, containerW / containerH, 0.1, 100);
    // Slightly elevated/angled viewpoint (not a flat head-on view) so the
    // fold's depth is actually visible instead of just its silhouette.
    camera.position.set(0, 1.1, 8.4);
    camera.lookAt(0, 0, 0.3);

    const isVertical = axis === "vertical";
    const dpW = widthDp, dpH = heightDp;
    const worldPerCssPixel = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z / containerH;

    // Each screen uses its own capture or official skin coordinates. Cover
    // measurements must never be rotated/stretched to stand in for the inside.
    const silW = dpW, silH = dpH;

    const annotationMargin = ANNOTATION_PAD_DP * 2;
    const aspect = (silW + annotationMargin) / (silH + annotationMargin);
    // Keep the LONGER silhouette edge pinned to a constant world size so the
    // camera framing stays consistent whichever way the panel ends up
    // oriented — otherwise a landscape silhouette (book fold) would blow
    // past the frustum tuned for the old always-portrait assumption and get
    // clipped down to just its green center.
    const target = 4.2;
    const worldW = aspect >= 1 ? target : target * aspect;
    const worldH = aspect >= 1 ? target / aspect : target;
    const segX = isVertical ? SEGMENTS : 2;
    const segY = isVertical ? 2 : SEGMENTS;
    const geometry = new THREE.PlaneGeometry(worldW, worldH, segX, segY);
    const basePositions = geometry.attributes.position.array.slice();

    const px = 1200 / dpW; // canvas px per dp — fixed texel density, independent of zoom or rotation
    const PAD = ANNOTATION_PAD_DP * px;
    // Annotation margins remain outside the physical chassis.
    const contentW = dpW * px + PAD * 2;
    const contentH = dpH * px + PAD * 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(contentW);
    canvas.height = Math.ceil(contentH);
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.FrontSide, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    deviceGroup.add(mesh);

    // The annotation texture includes margins; the solid ends at the display.
    const bodyW = worldW * silW / (silW + annotationMargin) * (skin ? skin.body.width / skin.screen.width : 1);
    const bodyH = worldH * silH / (silH + annotationMargin) * (skin ? skin.body.height / skin.screen.height : 1);
    const radius = skin ? skin.body.radius / skin.body.width * bodyW : (cornerRadiiDp?.topLeft ?? 8) * bodyW / silW;
    const shellGeometry = createChassis(bodyW, bodyH, radius, THICKNESS);
    const shellBase = shellGeometry.attributes.position.array.slice();
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: "#424a53", metalness: 0.65, roughness: 0.3,
    });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    deviceGroup.add(shellMesh);

    // The outer display is a real rear-facing textured panel, so closing the
    // hinge reveals it without replacing the renderer or resetting animation.
    const coverCanvas = document.createElement("canvas");
    coverCanvas.width = 1000; coverCanvas.height = 1600;
    const coverCtx = coverCanvas.getContext("2d")!;
    const coverTexture = new THREE.CanvasTexture(coverCanvas);
    coverTexture.colorSpace = THREE.SRGBColorSpace;
    coverTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const coverMaterial = new THREE.MeshBasicMaterial({ map: coverTexture, transparent: true, side: THREE.FrontSide, depthWrite: false });
    const coverGeometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    const coverMesh = new THREE.Mesh(coverGeometry, coverMaterial);
    deviceGroup.add(coverMesh);
    let coverBase = coverGeometry.attributes.position.array.slice();
    const coverArtwork = new Image();
    const coverForeground = new Image();
    const coverHits: { x: number; y: number; width: number; height: number; text: string }[] = [];

    function redrawCover() {
      const st = stateRef.current;
      const data = st.cover;
      coverHits.length = 0;
      if (!data) { coverMesh.visible = false; return; }
      const { screen, measurement, skin: outerSkin } = data;
      const size = screen.logicalSizeDp ?? { width: outerSkin.screen.width / 3, height: outerSkin.screen.height / 3 };
      const factor = 1000 / (size.width + annotationMargin);
      coverCanvas.width = 1000;
      coverCanvas.height = Math.ceil((size.height + annotationMargin) * factor);
      const physicalPanelW = isVertical ? bodyW / 2 - hingeZoneHalfWidth : bodyW;
      const physicalPanelH = isVertical ? bodyH : bodyH / 2 - hingeZoneHalfWidth;
      const fullW = (size.width + annotationMargin) * outerSkin.screen.width / size.width;
      const fullH = (size.height + annotationMargin) * outerSkin.screen.height / size.height;
      const scale = Math.min(physicalPanelW / outerSkin.body.width, physicalPanelH / outerSkin.body.height);
      const panelW = fullW * scale, panelH = fullH * scale;
      const positions = coverGeometry.attributes.position;
      // Front UVs are mirrored on the back of the upper/right panel.
      const uv = coverGeometry.attributes.uv;
      for (let i = 0; i < positions.count; i++) {
        const u = uv.getX(i), v = uv.getY(i);
        const x = (isVertical ? .5 - u : u - .5) * panelW + (isVertical ? bodyW / 4 + hingeZoneHalfWidth / 2 : 0);
        const y = (isVertical ? v - .5 : .5 - v) * panelH + (isVertical ? 0 : bodyH / 4 + hingeZoneHalfWidth / 2);
        positions.setXYZ(i, x, y, -THICKNESS - .004);
      }
      coverBase = positions.array.slice();
      const outerSafe = measurement ? safeInsets(measurement) : null;
      const outerSafePx = measurement ? safeInsetsPx(measurement) : null;
      drawDiagram(coverCtx, size.width, size.height, factor, {
        safe: outerSafe, cornerRadiiDp: screen.cornerRadiiDp, cutoutShape: measurement?.cutoutShape,
        showFrame: st.showFrame, showRegions: st.showRegions, showDimensions: st.showDimensions && !!screen.logicalSizeDp,
        fmt: formatLengthFromPairs(st.units, [
          [size.width, screen.logicalSizePx?.width], [size.height, screen.logicalSizePx?.height],
          ...(outerSafe && outerSafePx && screen.logicalSizePx ? [
            [size.width - outerSafe.left - outerSafe.right, screen.logicalSizePx.width - outerSafePx.left - outerSafePx.right],
            [size.height - outerSafe.top - outerSafe.bottom, screen.logicalSizePx.height - outerSafePx.top - outerSafePx.bottom],
          ] as Array<[number, number]> : []),
          ...insetPairs(outerSafe, outerSafePx),
          ...cornerPairs(screen.cornerRadiiDp, screen.cornerRadiiPx),
        ]), layers: st.layers, skin: outerSkin,
        artwork: coverArtwork, foreground: coverForeground, hits: coverHits,
        annotationScale: worldPerCssPixel / (panelW / (size.width + annotationMargin)) * 100 / st.zoom,
      });
      coverTexture.needsUpdate = true;
    }

    const hits: { x: number; y: number; width: number; height: number; text: string }[] = [];
    const artwork = new Image();
    const foreground = new Image();

    function redrawTexture() {
      hits.length = 0;
      const st = stateRef.current;
      const fmt = formatLengthFromPairs(st.units, [
        [dpW, st.logicalSizePx?.width], [dpH, st.logicalSizePx?.height],
        ...(st.safe && st.safePx && st.logicalSizePx ? [
          [dpW - st.safe.left - st.safe.right, st.logicalSizePx.width - st.safePx.left - st.safePx.right],
          [dpH - st.safe.top - st.safe.bottom, st.logicalSizePx.height - st.safePx.top - st.safePx.bottom],
        ] as Array<[number, number]> : []),
        ...insetPairs(st.safe, st.safePx),
        ...cornerPairs(st.cornerRadiiDp, st.cornerRadiiPx),
      ]);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDiagram(ctx, dpW, dpH, px, {
        safe: st.safe, cornerRadiiDp: st.cornerRadiiDp, cutoutShape: st.cutoutShape,
        showFrame: st.showFrame, showRegions: st.showRegions, showDimensions: st.showDimensions && measured, fmt, layers: st.layers, skin, artwork, foreground, hits, annotationScale: worldPerCssPixel / (worldW / (dpW + annotationMargin)) * 100 / st.zoom,
      });
      ctx.restore();
      texture.needsUpdate = true;
    }

    const extent = isVertical ? worldW : worldH;
    const hingeZoneHalfWidth = extent * 0.035;
    let displayedAngle = stateRef.current.angle;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyBend() {
      for (const [geo, base] of [[geometry, basePositions], [shellGeometry, shellBase], [coverGeometry, coverBase]] as const) {
        const positions = geo.attributes.position;
        const transform = geo === coverGeometry ? rigidPanelPoint : bendPoint;
        for (let i = 0; i < positions.count; i++) {
          const point = transform(base[i * 3], base[i * 3 + 1], base[i * 3 + 2], displayedAngle, isVertical, hingeZoneHalfWidth);
          positions.setXYZ(i, ...point);
        }
        positions.needsUpdate = true;
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
      }
      shellMesh.visible = stateRef.current.showFrame;
      // Inner annotation margins extend beyond the chassis; hide them when shut.
      mesh.visible = displayedAngle > 0.5;
      coverMesh.visible = !!stateRef.current.cover && displayedAngle < 100;
      const reveal = Math.max(0, 1 - displayedAngle / 100);
      const turn = reveal * reveal * (3 - 2 * reveal) * Math.PI / 2;
      deviceGroup.rotation.set(isVertical ? 0 : turn, isVertical ? -turn : 0, 0);
      // Center the folded depth after rotating the chassis into the outer view.
      deviceGroup.position.set(isVertical ? Math.sin(turn) * bodyW / 4 : 0, isVertical ? 0 : Math.sin(turn) * bodyH / 4, 0);
    }

    let raf = 0;
    let lastTime = 0;
    function render(time: number) {
      raf = 0;
      const target = stateRef.current.angle;
      const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      displayedAngle = reducedMotion.matches ? target : displayedAngle + (target - displayedAngle) * (1 - Math.exp(-delta / 75));
      if (Math.abs(target - displayedAngle) < 0.05) displayedAngle = target;
      if (mount) mount.dataset.displayedAngle = displayedAngle.toFixed(2);
      const pixelRatio = Math.min(4, window.devicePixelRatio * Math.max(1, stateRef.current.zoom / 100));
      if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
      applyBend();
      camera.position.y = (180 - displayedAngle) / 180 * 1.1;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (displayedAngle !== target) raf = requestAnimationFrame(render);
      else { lastTime = 0; stateRef.current.onTransitionEnd?.(); }
    }
    const update = () => {
      redrawTexture();
      redrawCover();
      if (!raf) raf = requestAnimationFrame(render);
    };
    const outerSkin = stateRef.current.cover?.skin;
    if (outerSkin) {
      coverArtwork.onload = update; coverForeground.onload = update;
      coverArtwork.src = outerSkin.image; if (outerSkin.foreground) coverForeground.src = outerSkin.foreground;
    }
    if (skin) {
      artwork.onload = update; foreground.onload = update;
      artwork.src = skin.image; if (skin.foreground) foreground.src = skin.foreground;
    }
    update();
    (mount as HTMLDivElement & { __update?: () => void }).__update = update;

    const raycaster = new THREE.Raycaster();
    const copyLabel = async (e: PointerEvent) => {
      // offset coordinates account for the viewport's CSS scale and rotation.
      raycaster.setFromCamera(new THREE.Vector2(e.offsetX / containerW * 2 - 1, 1 - e.offsetY / containerH * 2), camera);
      const innerIntersection = raycaster.intersectObject(mesh)[0];
      const coverIntersection = raycaster.intersectObject(coverMesh)[0];
      const intersection = !innerIntersection ? coverIntersection : !coverIntersection ? innerIntersection : innerIntersection.distance <= coverIntersection.distance ? innerIntersection : coverIntersection;
      const uv = intersection?.uv;
      if (!uv) return;
      const isCover = intersection?.object === coverMesh;
      const targetCanvas = isCover ? coverCanvas : canvas;
      const targetHits = isCover ? coverHits : hits;
      const x = uv.x * targetCanvas.width, y = (1 - uv.y) * targetCanvas.height;
      const hit = targetHits.find(h => x >= h.x && x <= h.x + h.width && y >= h.y && y <= h.y + h.height);
      if (hit) { e.stopPropagation(); try { await navigator.clipboard.writeText(hit.text); } catch {} }
    };
    renderer.domElement.addEventListener("pointerdown", copyLabel);

    return () => {
      cancelAnimationFrame(raf);
      artwork.onload = null; foreground.onload = null;
      coverArtwork.onload = null; coverForeground.onload = null;
      delete (mount as HTMLDivElement & { __update?: () => void }).__update;
      renderer.domElement.removeEventListener("pointerdown", copyLabel);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      coverGeometry.dispose(); coverMaterial.dispose(); coverTexture.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      renderer.dispose();
    };
    // Geometry/scene are rebuilt only when the device itself changes; angle
    // and display toggles update in place via the ref-backed redraw below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthDp, heightDp, axis, skin, measured]);

  // Cheap updates (no scene rebuild) whenever angle or display options change.
  useEffect(() => {
    const mount = mountRef.current as (HTMLDivElement & { __update?: () => void }) | null;
    mount?.__update?.();
  }, [angle, safe, safePx, logicalSizePx, cornerRadiiDp, cornerRadiiPx, cutoutShape, showFrame, showRegions, showDimensions, units, zoom, layers, cover, onTransitionEnd]);

  if (!widthDp || !heightDp) {
    return (
      <div className="flex h-40 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
        Main screen logical size is not verified yet.
      </div>
    );
  }

  return <div ref={wrapRef} style={{ width: axis === "horizontal" ? 380 : 700, height: 700 }}>
    <div ref={mountRef} role="img" aria-label={`${axis === "vertical" ? "Book" : "Flip"} fold diagram, ${angle} degrees`} style={{ width: axis === "horizontal" ? 380 : 700, height: 700 }} />
  </div>;
}
