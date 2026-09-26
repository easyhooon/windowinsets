import { ProjectedRulers } from "./ProjectedRulers";
import { layoutMeasurementRulers, type RulerMeasurements, type Point } from "./measurementLayout";
import { visibleDiagramRulers, diagramAnnotations } from "./diagramAnnotations";
import { InsetsDiagram } from "./InsetsDiagram";
import { DIAGRAM_FONT, DIAGRAM_COLORS } from "./diagramStyle";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FOLD_CAMERA_DISTANCE, FOLD_CAMERA_FOV, FOLD_DISPLAY_TARGET, FOLD_FRUSTUM_HEIGHT, bendPoint, createChassis, createFoldHousings, hingeHalfWidth, rigidPanelPoint, verticalHinge, coverPoint, coverSide, triFoldPoint, triFoldAngles, triFoldViewTurn, createTriFoldDisplay, createTriFoldHousings, createTriFoldHingeStrips } from "./foldGeometry";
import type { DeviceSkin } from "../data/skins";
import { skinAssetUrl } from "../data/skinAssetUrl";
import type { CutoutShape, Screen, InsetsMeasurement } from "../data/types";
import { cutoutPairs, cornerPairs, formatLengthFromPairs, insetPairs, safeInsets, safeInsetsPx } from "../data/measurementUnits";
import { CLASH_COLOR, PREVIEW_INSET_OPACITY, appMockShapes, type AppPreview } from "./appPreview";

export const COVER_REVEAL_ANGLE = 60; // Illustrative primary surface, not a measured hinge state.
/** TriFold turns over the same span but faces its rear cover only past the half turn. */
export function coverRevealAngle(triFold: boolean) {
  return triFold ? COVER_REVEAL_ANGLE / 2 : COVER_REVEAL_ANGLE;
}

const SEGMENTS = 96; // vertices along the fold axis — higher = smoother curve
const DEFAULT_THICKNESS = 0.065; // Preview fallback when no published chassis dimensions exist.

const INK = DIAGRAM_COLORS.ink;
const INSET_COLOR = DIAGRAM_COLORS.inset;
const RADIUS_COLOR = DIAGRAM_COLORS.radius;
const SAFE_FILL = DIAGRAM_COLORS.safeFill;
const INSET_FILL = DIAGRAM_COLORS.insetFill;

type Units = "dp" | "px";

interface Insets { top: number; right: number; bottom: number; left: number }
interface CornerRadii { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number }
type QuarterTurns = 0 | 1 | 2 | 3;

function transformSkin(
  ctx: CanvasRenderingContext2D,
  skin: DeviceSkin,
  width: number,
  height: number,
  rotation: QuarterTurns,
) {
  const { x, y, width: screenW, height: screenH } = skin.screen;
  if (rotation === 1) {
    const sx = height / screenW, sy = width / screenH;
    ctx.transform(0, -sx, sy, 0, -y * sy, (screenW + x) * sx);
  } else if (rotation === 2) {
    const sx = width / screenW, sy = height / screenH;
    ctx.transform(-sx, 0, 0, -sy, (screenW + x) * sx, (screenH + y) * sy);
  } else if (rotation === 3) {
    const sx = height / screenW, sy = width / screenH;
    ctx.transform(0, sx, -sy, 0, (screenH + y) * sy, -x * sx);
  } else {
    const sx = width / screenW, sy = height / screenH;
    ctx.transform(sx, 0, 0, sy, -x * sx, -y * sy);
  }
}

function drawForeground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  rotation: QuarterTurns,
) {
  ctx.save();
  if (rotation === 1) {
    ctx.transform(0, -height / image.naturalWidth, width / image.naturalHeight, 0, 0, height);
  } else if (rotation === 2) {
    ctx.transform(-width / image.naturalWidth, 0, 0, -height / image.naturalHeight, width, height);
  } else if (rotation === 3) {
    ctx.transform(0, height / image.naturalWidth, -width / image.naturalHeight, 0, width, 0);
  } else {
    ctx.scale(width / image.naturalWidth, height / image.naturalHeight);
  }
  ctx.drawImage(image, 0, 0);
  ctx.restore();
}

/** Draws the full flat measurement diagram (bezel, safe/inset regions, real
 * cutout and region labels) onto a 2D canvas —
 * this canvas becomes the WebGL texture, so every pixel (including the
 * region labels) bends along with the mesh automatically. External rulers are
 * projected separately so their labels and leaders never bend through the hinge. Coordinates are
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
    appPreview: AppPreview;
    skin?: DeviceSkin;
    skinRotation?: QuarterTurns;
    artwork?: HTMLImageElement;
    foreground?: HTMLImageElement;
    paddingDp: number | { x: number; y: number };
    annotationScale: number;
    hits: { x: number; y: number; width: number; height: number; text: string }[];
  },
) {
  const W = dpW * px, H = dpH * px;
  const labelScale = opts.annotationScale;
  const padX = (typeof opts.paddingDp === "number" ? opts.paddingDp : opts.paddingDp.x) * px;
  const padY = (typeof opts.paddingDp === "number" ? opts.paddingDp : opts.paddingDp.y) * px;
  ctx.clearRect(0, 0, W + padX * 2, H + padY * 2);
  ctx.save();
  ctx.translate(padX, padY);

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
    ctx.save();
    transformSkin(ctx, skin, W, H, opts.skinRotation ?? 0);
    roundedRectPath(skin.body.x, skin.body.y, skin.body.width, skin.body.height, skin.body.radius);
    ctx.clip();
    ctx.drawImage(opts.artwork, 0, 0);
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
  if (opts.showRegions && safe && opts.appPreview !== "off") {
    ctx.save();
    roundedRectPath(0, 0, W, H, r);
    ctx.clip();
    const shapes = appMockShapes(dpW, dpH, safe, opts.appPreview);
    for (const shape of shapes) {
      if (shape.kind === "rect") {
        if (shape.fill === "transparent") continue;
        ctx.fillStyle = shape.fill;
        roundedRectPath(shape.x * px, shape.y * px, shape.width * px, shape.height * px, shape.radius * px);
        ctx.fill();
      } else if (shape.kind === "circle") {
        ctx.fillStyle = shape.fill;
        ctx.beginPath(); ctx.arc(shape.cx * px, shape.cy * px, shape.r * px, 0, Math.PI * 2); ctx.fill();
      } else if (shape.kind === "text") {
        ctx.fillStyle = shape.fill;
        ctx.font = `400 ${shape.size * px}px Roboto, system-ui, sans-serif`;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(shape.text, shape.x * px, shape.y * px);
      } else {
        const h = shape.size / 2 * px;
        ctx.strokeStyle = shape.stroke; ctx.lineWidth = 2.4 * px; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(shape.cx * px - h, shape.cy * px); ctx.lineTo(shape.cx * px + h, shape.cy * px);
        ctx.moveTo(shape.cx * px, shape.cy * px - h); ctx.lineTo(shape.cx * px, shape.cy * px + h);
        ctx.stroke();
      }
    }
    if (opts.layers.insets) {
      ctx.globalAlpha = PREVIEW_INSET_OPACITY;
      ctx.fillStyle = INSET_FILL;
      if (safe.top > 0) ctx.fillRect(0, 0, W, safe.top * px);
      if (safe.bottom > 0) ctx.fillRect(0, H - safe.bottom * px, W, safe.bottom * px);
      if (safe.left > 0) ctx.fillRect(0, 0, safe.left * px, H);
      if (safe.right > 0) ctx.fillRect(W - safe.right * px, 0, safe.right * px, H);
      ctx.globalAlpha = 1;
    }
    if (opts.layers.cutout && opts.cutoutShape) {
      const c = opts.cutoutShape;
      ctx.fillStyle = "#c4a0f1";
      roundedRectPath(c.xDp * px, c.yDp * px, c.widthDp * px, c.heightDp * px, 1 * px);
      ctx.fill();
    }
    const k = labelScale;
    ctx.strokeStyle = CLASH_COLOR; ctx.lineWidth = 1.4 * px * k; ctx.setLineDash([3 * px * k, 2 * px * k]);
    for (const shape of shapes) {
      if (shape.kind === "rect" && shape.clash) roundedRectPath((shape.x - 3) * px, (shape.y - 3) * px, (shape.width + 6) * px, (shape.height + 6) * px, (shape.radius + 3) * px);
      else if (shape.kind === "text" && shape.clash) roundedRectPath((shape.x - 3) * px, (shape.y - shape.size / 2 - 3) * px, (shape.width + 6) * px, (shape.size + 6) * px, 3 * px);
      else continue;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  } else if (opts.showRegions && safe) {
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
    drawForeground(ctx, opts.foreground, W, H, opts.skinRotation ?? 0);
  }

  function chip(x: number, y: number, text: string, color: string, scale = labelScale) {
    const fontSize = 12 * px * scale;
    ctx.font = `500 ${fontSize}px ${DIAGRAM_FONT}`;
    const w = ctx.measureText(text).width + 8 * px * scale, h = 18 * px * scale;
    opts.hits.push({ x: x - w / 2 + padX, y: y - h / 2 + padY, width: w, height: h, text });
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
    opts.hits.push({ x: valueX - valueWidth / 2 + padX, y: valueY - fontSize / 2 + padY, width: valueWidth, height: fontSize, text: value });
    ctx.fillText(value, valueX, valueY);
  }

  ctx.restore();
}

/** A lit solid chassis and an annotated display share the same cylindrical
 * hinge. Official skin artwork is aligned using its emulator layout rectangle.
 * Only measured screens get numeric annotations; unmeasured skins are previews. */
export function FoldRenderer3D({
  angle,
  axis,
  triFold = false,
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
  appPreview = "off",
  skin,
  skinRotation = 0,
  viewRotation = 0,
  measured = true,
  cover,
  fallbackMain,
  chassisMm,
  onTransitionEnd,
  onDisplayedAngle,
  onMeasurementBounds,
}: {
  angle: number;
  axis: "vertical" | "horizontal";
  triFold?: boolean;
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
  appPreview?: AppPreview;
  skin?: DeviceSkin;
  skinRotation?: QuarterTurns;
  viewRotation?: number;
  measured?: boolean;
  cover?: { screen: Screen; measurement: InsetsMeasurement | null; skin: DeviceSkin };
  fallbackMain?: { screen: Screen; measurement: InsetsMeasurement | null };
  chassisMm?: { unfoldedWidth: number; unfoldedDepth: number; foldedDepth: number };
  onMeasurementBounds?: (bounds: { left: number; top: number; right: number; bottom: number }, body: { left: number; top: number; right: number; bottom: number }, angle: number) => number | undefined;
  onDisplayedAngle?: (angle: number) => number | undefined;
  onTransitionEnd?: () => void;
}) {
  const [measurements, setMeasurements] = useState<RulerMeasurements | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({ angle, safe, safePx, logicalSizePx, cornerRadiiDp: cornerRadiiDp ?? null, cornerRadiiPx: cornerRadiiPx ?? null, cutoutShape, showFrame, showRegions, showDimensions, units, zoom, layers, appPreview, cover, onTransitionEnd, onDisplayedAngle, onMeasurementBounds });
  stateRef.current = { angle, safe, safePx, logicalSizePx, cornerRadiiDp: cornerRadiiDp ?? null, cornerRadiiPx: cornerRadiiPx ?? null, cutoutShape, showFrame, showRegions, showDimensions, units, zoom, layers, appPreview, cover, onTransitionEnd, onDisplayedAngle, onMeasurementBounds };

  useEffect(() => {
    if (webglUnavailable) return;
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap || !widthDp || !heightDp) return;

    const containerW = 700, containerH = 700;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setWebglUnavailable(true); return; }
    renderer.setSize(containerW, containerH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = "position:absolute;inset:0;z-index:1;width:700px;height:700px";
    mount.style.position = "relative";
    mount.appendChild(renderer.domElement);
    const contextLost = (event: Event) => { event.preventDefault(); setWebglUnavailable(true); };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);

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
    // Like the reference, a head-on perspective camera gives the fold its
    // depth: panel edges swinging toward the viewer grow, so the silhouette
    // narrows into the hinge. The z=0 plane keeps the shared frustum scale,
    // and the facing display is kept on that plane in flat poses.
    const frustumHeight = FOLD_FRUSTUM_HEIGHT;
    const camera = new THREE.PerspectiveCamera(FOLD_CAMERA_FOV, containerW / containerH, 0.1, 100);
    camera.position.set(0, 0, FOLD_CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);

    // A landscape capture rotates the physical hinge along with the artwork.
    const rotatedBook = axis === "vertical" && skinRotation % 2 === 1;
    const isVertical = verticalHinge(axis, skinRotation);
    const dpW = widthDp, dpH = heightDp;
    const worldPerCssPixel = frustumHeight / containerH;

    // Each screen uses its own capture or official skin coordinates. Cover
    // measurements must never be rotated/stretched to stand in for the inside.
    const silW = dpW, silH = dpH;

    // Exterior rulers are projected SVG now. Keep only enough texture padding
    // for the official bezel instead of shrinking the display into empty texels.
    const margin = dpW * .25;
    const aspect = (silW + margin) / (silH + margin);
    // Keep the LONGER silhouette edge pinned to a constant world size so the
    // camera framing stays consistent whichever way the panel ends up
    // oriented — otherwise a landscape silhouette (book fold) would blow
    // past the frustum tuned for the old always-portrait assumption and get
    // clipped down to just its green center.
    const target = FOLD_DISPLAY_TARGET;
    const worldW = aspect >= 1 ? target : target * aspect;
    const worldH = aspect >= 1 ? target / aspect : target;
    // The annotation texture includes margins; the solid ends at the display.
    const skinRotated = skinRotation % 2 === 1;
    const bodyW = worldW * silW / (silW + margin) * (skin ? (skinRotated ? skin.body.height / skin.screen.height : skin.body.width / skin.screen.width) : 1);
    const bodyH = worldH * silH / (silH + margin) * (skin ? (skinRotated ? skin.body.width / skin.screen.width : skin.body.height / skin.screen.height) : 1);
    // Match the published open-panel depth-to-width ratio. The hinge contour
    // remains illustrative because the 2D skin provides no side geometry.
    const shellThickness = chassisMm ? (rotatedBook ? bodyH : bodyW) * chassisMm.unfoldedDepth / chassisMm.unfoldedWidth : DEFAULT_THICKNESS;
    const segX = isVertical ? SEGMENTS : 2;
    const segY = isVertical ? 2 : SEGMENTS;
    const geometry = triFold ? createTriFoldDisplay(worldW, worldH, bodyW, shellThickness)
      : new THREE.PlaneGeometry(worldW, worldH, segX, segY);
    const basePositions = geometry.attributes.position.array.slice();

    const px = 1200 / dpW; // canvas px per dp — fixed texel density, independent of zoom or rotation
    const PAD = margin / 2 * px;
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

    const displayMaterial = { map: texture, transparent: true, side: THREE.FrontSide, depthWrite: false };
    const material = triFold
      ? new THREE.MeshStandardMaterial({ ...displayMaterial, roughness: .72, metalness: 0 })
      : new THREE.MeshBasicMaterial(displayMaterial);
    const mesh = new THREE.Mesh(geometry, material);
    deviceGroup.add(mesh);

    const skinBodyWidth = skinRotated ? skin?.body.height : skin?.body.width;
    const radius = skin && skinBodyWidth ? skin.body.radius / skinBodyWidth * bodyW : (cornerRadiiDp?.topLeft ?? 8) * bodyW / silW;
    const foldedDepth = chassisMm ? (rotatedBook ? bodyH : bodyW) * chassisMm.foldedDepth / chassisMm.unfoldedWidth : undefined;
    const hingeZoneHalfWidth = hingeHalfWidth(shellThickness, foldedDepth);
    const shellGeometry = triFold ? createTriFoldHousings(bodyW, bodyH, radius, shellThickness) : createFoldHousings(bodyW, bodyH, radius, shellThickness, hingeZoneHalfWidth, isVertical);
    const shellBase = shellGeometry.attributes.position.array.slice();
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: "#424a53", metalness: 0.65, roughness: 0.3,
    });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    deviceGroup.add(shellMesh);
    const hingeGeometry = triFold ? createTriFoldHingeStrips(bodyW, bodyH - radius * 2, shellThickness) : createChassis(isVertical ? hingeZoneHalfWidth * 2 : bodyW - radius * 2,
      isVertical ? bodyH - radius * 2 : hingeZoneHalfWidth * 2, 0, shellThickness);
    const hingeBase = hingeGeometry.attributes.position.array.slice();
    const hingeMaterial = new THREE.MeshStandardMaterial({ color: "#252b32", metalness: .7, roughness: .38 });
    const hingeMesh = new THREE.Mesh(hingeGeometry, hingeMaterial);
    deviceGroup.add(hingeMesh);

    // The outer display is a real rear-facing textured panel, so closing the
    // hinge reveals it without replacing the renderer or resetting animation.
    const coverCanvas = document.createElement("canvas");
    coverCanvas.width = 1800; coverCanvas.height = 1600;
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

    // TriFold's cover is on the fixed middle panel's rear, not either wing.
    const outerPoint = (u: number, v: number, width: number, height: number) => triFold
      ? [(0.5 - u) * width, (v - 0.5) * height] as const
      : coverPoint(u, v, width, height, bodyW, bodyH, hingeZoneHalfWidth, isVertical, rotatedBook);
    const innerTransform = (x: number, y: number, z: number, value: number) => triFold
      ? triFoldPoint(x, y, z, value, bodyW, shellThickness)
      : bendPoint(x, y, z, value, isVertical, hingeZoneHalfWidth);
    const outerTransform = (x: number, y: number, z: number, value: number) => triFold
      ? [x, y, z] as const : rigidPanelPoint(x, y, z, value, isVertical, hingeZoneHalfWidth, coverSide(isVertical, rotatedBook));

    let coverPanel = { width: 0, height: 0, padX: 0, padY: 0 };
    let annotationZoom = zoom;
    let textureZoom = zoom;
    function redrawCover() {
      const st = stateRef.current;
      const data = st.cover;
      coverHits.length = 0;
      if (!data) { coverMesh.visible = false; return; }
      const { screen, measurement, skin: outerSkin } = data;
      const size = screen.logicalSizeDp ?? { width: outerSkin.screen.width / 3, height: outerSkin.screen.height / 3 };
      // The original Fold's small outer display leaves much more chassis above
      // and below it than later covers. Include the entire official body clip.
      const padX = Math.max(size.width * .125,
        (outerSkin.screen.x - outerSkin.body.x) * size.width / outerSkin.screen.width,
        (outerSkin.body.x + outerSkin.body.width - outerSkin.screen.x - outerSkin.screen.width) * size.width / outerSkin.screen.width);
      const padY = Math.max(size.width * .125,
        (outerSkin.screen.y - outerSkin.body.y) * size.height / outerSkin.screen.height,
        (outerSkin.body.y + outerSkin.body.height - outerSkin.screen.y - outerSkin.screen.height) * size.height / outerSkin.screen.height);
      const factor = 1800 / (size.width + padX * 2);
      coverCanvas.width = 1800;
      coverCanvas.height = Math.ceil((size.height + padY * 2) * factor);
      const physicalPanelW = triFold ? bodyW / 3 : isVertical ? bodyW / 2 - hingeZoneHalfWidth : bodyW;
      const physicalPanelH = isVertical ? bodyH : bodyH / 2 - hingeZoneHalfWidth;
      const fullW = (size.width + padX * 2) * outerSkin.screen.width / size.width;
      const fullH = (size.height + padY * 2) * outerSkin.screen.height / size.height;
      const scale = rotatedBook
        ? Math.min(physicalPanelH / outerSkin.body.width, physicalPanelW / outerSkin.body.height)
        : Math.min(physicalPanelW / outerSkin.body.width, physicalPanelH / outerSkin.body.height);
      const panelW = fullW * scale, panelH = fullH * scale;
      coverPanel = { width: panelW, height: panelH, padX, padY };
      const positions = coverGeometry.attributes.position;
      // Front UVs are mirrored on the back of the upper/right panel.
      const uv = coverGeometry.attributes.uv;
      for (let i = 0; i < positions.count; i++) {
        const u = uv.getX(i), v = uv.getY(i);
        const [x, y] = outerPoint(u, v, panelW, panelH);
        positions.setXYZ(i, x, y, -shellThickness - .004);
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
          ...cutoutPairs(measurement?.cutoutShape),
        ]), layers: st.layers, skin: outerSkin, skinRotation: screen.captureRotation ?? 0,
        appPreview: st.appPreview, artwork: coverArtwork, foreground: coverForeground, hits: coverHits, paddingDp: { x: padX, y: padY },
        annotationScale: worldPerCssPixel / (panelW / (size.width + padX * 2)) * 100 / annotationZoom,
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
        ...cutoutPairs(st.cutoutShape),
      ]);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDiagram(ctx, dpW, dpH, px, {
        safe: st.safe, cornerRadiiDp: st.cornerRadiiDp, cutoutShape: st.cutoutShape,
        showFrame: st.showFrame, showRegions: st.showRegions, showDimensions: st.showDimensions && measured, fmt, layers: st.layers, appPreview: st.appPreview, skin, skinRotation, artwork, foreground, hits, paddingDp: margin / 2, annotationScale: worldPerCssPixel / (worldW / (dpW + margin)) * 100 / annotationZoom,
      });
      ctx.restore();
      texture.needsUpdate = true;
    }


    let displayedAngle = stateRef.current.angle;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function applyBend() {
      const seat = Math.max(0, 1 - displayedAngle / COVER_REVEAL_ANGLE);
      for (const [geo, base] of [[geometry, basePositions], [shellGeometry, shellBase], [hingeGeometry, hingeBase], [coverGeometry, coverBase]] as const) {
        const positions = geo.attributes.position;
        const transform = geo === coverGeometry ? outerTransform : innerTransform;
        for (let i = 0; i < positions.count; i++) {
          const point = transform(base[i * 3], base[i * 3 + 1], base[i * 3 + 2], displayedAngle);
          // Seat the hinge barrel inside the ends of the housings, rather
          // than letting its radius protrude like a flap beyond the cover.
          const hingeInset = !triFold && geo === hingeGeometry ? shellThickness * seat * seat * (3 - 2 * seat) : 0;
          positions.setXYZ(i, point[0], point[1], point[2] + hingeInset);
        }
        positions.needsUpdate = true;
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
      }
      shellMesh.visible = stateRef.current.showFrame;
      hingeMesh.visible = stateRef.current.showFrame;
      // Inner annotation margins extend beyond the chassis; hide them when shut.
      mesh.visible = displayedAngle > 0.5;
      coverMesh.visible = !!stateRef.current.cover && displayedAngle < 100;
      const reveal = Math.max(0, 1 - displayedAngle / 100);
      if (triFold) {
        const triTurn = triFoldViewTurn(displayedAngle, COVER_REVEAL_ANGLE);
        deviceGroup.rotation.set(0, triTurn, 0);
        deviceGroup.position.set(0, 0, 0);
        seatFacingDisplay(triTurn / Math.PI);
        return;
      }
      const turn = reveal * reveal * (3 - 2 * reveal) * Math.PI / 2;
      // Turn the cover panel's rear toward the camera, leaving the hinge on its outer-view side.
      const side = coverSide(isVertical, rotatedBook);
      deviceGroup.rotation.set(isVertical ? 0 : turn, isVertical ? -side * turn : 0, rotatedBook ? turn : 0, "ZYX");
      // Center the folded depth after rotating the chassis into the outer view.
      deviceGroup.position.set(isVertical ? side * Math.sin(turn) * bodyW / 4 : 0, isVertical ? 0 : Math.sin(turn) * bodyH / 4, 0);
      if (rotatedBook) deviceGroup.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), turn);
      seatFacingDisplay(turn / (Math.PI / 2));
    }

    // Keep the facing cover on the z=0 plane so the closed view's scale
    // keeps zoom as CSS px per dp; open poses already lie there.
    const coverBox = new THREE.Box3();
    function seatFacingDisplay(weight: number) {
      if (weight <= 0 || !coverMesh.visible) return;
      deviceGroup.updateMatrix();
      coverGeometry.computeBoundingBox();
      coverBox.copy(coverGeometry.boundingBox!).applyMatrix4(deviceGroup.matrix);
      deviceGroup.position.z -= coverBox.max.z * weight;
    }

    function projectMeasurements() {
      const st = stateRef.current;
      if (!st.showDimensions) { setMeasurements(null); return; }
      // Only annotate the front-facing display. Never show hidden inner values
      // through the cover, or use cover captures as inner measurements.
      const outer = displayedAngle < coverRevealAngle(triFold) ? st.cover : undefined;
      const size = outer?.screen.logicalSizeDp;
      if (displayedAngle < coverRevealAngle(triFold) ? !size : !measured) { setMeasurements(null); return; }
      const w = size?.width ?? dpW, h = size?.height ?? dpH;
      const inset = outer ? (outer.measurement ? safeInsets(outer.measurement) : null) : st.safe;
      const insetPx = outer ? (outer.measurement ? safeInsetsPx(outer.measurement) : null) : st.safePx;
      const corners = outer ? outer.screen.cornerRadiiDp : st.cornerRadiiDp;
      const cornersPx = outer ? outer.screen.cornerRadiiPx : st.cornerRadiiPx;
      const cutout = outer ? outer.measurement?.cutoutShape : st.cutoutShape;
      const logicalPx = outer ? outer.screen.logicalSizePx : st.logicalSizePx;
      const format = formatLengthFromPairs(st.units, [[w, logicalPx?.width], [h, logicalPx?.height],
        ...insetPairs(inset, insetPx), ...cornerPairs(corners, cornersPx), ...cutoutPairs(cutout)]);
      const layout = diagramAnnotations(w, h, 1, st.showFrame ? (outer?.skin ?? skin) : undefined,
        inset, corners, cutout, outer ? outer.screen.captureRotation ?? 0 : skinRotation);
      deviceGroup.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const projectWorld = (x: number, y: number, z: number): Point => {
        const v = new THREE.Vector3(x, y, z).applyMatrix4(deviceGroup.matrixWorld).project(camera);
        return { x: (v.x + 1) * 350, y: (1 - v.y) * 350 };
      };
      const project = (x: number, y: number) => {
        if (outer) {
          const u = (x + coverPanel.padX) / (w + 2 * coverPanel.padX);
          const v = 1 - (y + coverPanel.padY) / (h + 2 * coverPanel.padY);
          const [bx, by] = outerPoint(u, v, coverPanel.width, coverPanel.height);
          return projectWorld(...outerTransform(bx, by, -shellThickness - .004, displayedAngle));
        }
        return projectWorld(...innerTransform((x - w / 2) * worldW / (w + margin), (h / 2 - y) * worldH / (h + margin), 0, displayedAngle));
      };
      const points: Point[] = [];
      // Include the actual bent shell and artwork perimeter in screen-space bounds.
      if (st.showFrame) {
        for (const geo of [shellGeometry, hingeGeometry]) {
          const positions = geo.attributes.position;
          for (let i = 0; i < positions.count; i++) points.push(projectWorld(positions.getX(i), positions.getY(i), positions.getZ(i)));
        }
      }
      for (let i = 0; i <= 32; i++) {
        const x = layout.body.left + (layout.body.right - layout.body.left) * i / 32;
        const y = layout.body.top + (layout.body.bottom - layout.body.top) * i / 32;
        points.push(project(x, layout.body.top), project(x, layout.body.bottom), project(layout.body.left, y), project(layout.body.right, y));
      }
      const body = { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)),
        top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) };
      const next: RulerMeasurements = { body, compact: true, scale: 100 / annotationZoom, format, units: st.units, screen: outer ? 'Cover' : 'Inner',
        rulers: visibleDiagramRulers(layout.rulers, st.layers).map(r => ({ ...r,
          start: project(r.guides[0][0], r.guides[0][1]), end: project(r.guides[1][0], r.guides[1][1]),
          bracket: r.kind === 'radius' ? project(r.guides[1][0], r.guides[1][1] > h / 2 ? h : 0) : undefined,
          side: r.y1 === r.y2 ? (r.y1 < 0 ? 'top' : 'bottom') : (r.x1 < 0 ? 'left' : 'right'),
        })) };
      // Constant screen-size labels can change lanes as the model shrinks.
      // Converge within this frame, including nearly edge-on cover displays.
      for (let pass = 0; pass < 32; pass++) {
        const labels = layoutMeasurementRulers(next);
        const bounds = { left: Math.min(body.left, ...labels.map(r => Math.min(r.p.x, r.q.x, r.x - r.width / 2))),
          right: Math.max(body.right, ...labels.map(r => Math.max(r.p.x, r.q.x, r.x + r.width / 2))),
          top: Math.min(body.top, ...labels.map(r => Math.min(r.p.y, r.q.y, r.y - r.height / 2))),
          bottom: Math.max(body.bottom, ...labels.map(r => Math.max(r.p.y, r.q.y, r.y + r.height / 2))) };
        const fitted = st.onMeasurementBounds?.(bounds, body, displayedAngle) ?? annotationZoom;
        const difference = Math.abs(fitted - annotationZoom);
        annotationZoom = fitted;
        next.scale = 100 / fitted;
        if (difference < .01) break;
      }
      setMeasurements(next);
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
      const effectiveZoom = stateRef.current.onDisplayedAngle?.(displayedAngle) ?? stateRef.current.zoom;
      annotationZoom = effectiveZoom;
      if (mount) {
        mount.dataset.displayedAngle = displayedAngle.toFixed(2);
        if (triFold) {
          const hinges = triFoldAngles(displayedAngle);
          mount.dataset.leftAngle = hinges.left.toFixed(2);
          mount.dataset.rightAngle = hinges.right.toFixed(2);
        }
      }
      const pixelRatio = Math.min(4, window.devicePixelRatio * Math.max(1, stateRef.current.zoom / 100));
      if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
      applyBend();
      // Texture canvases stay off-DOM. An axis-aligned backup behind a
      // perspective surface leaks a second, flat silhouette around the model.
      projectMeasurements();
      if (Math.abs(textureZoom - annotationZoom) > .1) {
        redrawTexture(); redrawCover();
        textureZoom = annotationZoom;
        // redrawCover updates its unbent vertices.
        applyBend();
      }
      try { renderer.render(scene, camera); }
      catch { setWebglUnavailable(true); return; }
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
      coverArtwork.src = skinAssetUrl(outerSkin.image); if (outerSkin.foreground) coverForeground.src = skinAssetUrl(outerSkin.foreground);
    }
    if (skin) {
      artwork.onload = update; foreground.onload = update;
      artwork.src = skinAssetUrl(skin.image); if (skin.foreground) foreground.src = skinAssetUrl(skin.foreground);
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
      if (hit) { e.stopPropagation(); try { await navigator.clipboard.writeText(hit.text.replace(/^R /, "")); } catch {} }
    };
    renderer.domElement.addEventListener("pointerdown", copyLabel);

    return () => {
      cancelAnimationFrame(raf);
      artwork.onload = null; foreground.onload = null;
      coverArtwork.onload = null; coverForeground.onload = null;
      delete (mount as HTMLDivElement & { __update?: () => void }).__update;
      renderer.domElement.removeEventListener("pointerdown", copyLabel);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      coverGeometry.dispose(); coverMaterial.dispose(); coverTexture.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      hingeGeometry.dispose(); hingeMaterial.dispose();
      renderer.dispose();
    };
    // Geometry/scene are rebuilt only when the device itself changes; angle
    // and display toggles update in place via the ref-backed redraw below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthDp, heightDp, axis, triFold, skin, skinRotation, measured, chassisMm, webglUnavailable]);

  // Cheap updates (no scene rebuild) whenever angle or display options change.
  useEffect(() => {
    const mount = mountRef.current as (HTMLDivElement & { __update?: () => void }) | null;
    mount?.__update?.();
  }, [viewRotation, angle, safe, safePx, logicalSizePx, cornerRadiiDp, cornerRadiiPx, cutoutShape, showFrame, showRegions, showDimensions, units, zoom, layers, appPreview, cover, onTransitionEnd]);

  if (!widthDp || !heightDp) {
    return (
      <div className="flex h-40 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
        Main screen logical size is not verified yet.
      </div>
    );
  }

  if (webglUnavailable) {
    const visible = angle < coverRevealAngle(triFold) && cover ? cover : fallbackMain;
    if (visible) return <div role="img" aria-label={`${triFold ? "TriFold" : axis === "vertical" ? "Book" : "Flip"} fold flat fallback diagram`} style={{ width: 700, height: 700 }}>
      <InsetsDiagram screen={visible.screen} measurement={visible.measurement} zoom={100} showFrame={showFrame}
        showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} appPreview={appPreview}
        skin={angle < coverRevealAngle(triFold) && cover ? cover.skin : skin} />
    </div>;
  }

  return <div ref={wrapRef} style={{ width: 700, height: 700, position: "relative" }}>
    <div ref={mountRef} data-fold-renderer role="img" aria-label={triFold
      ? `TriFold fold diagram, left hinge ${triFoldAngles(angle).left} degrees, right hinge ${triFoldAngles(angle).right} degrees`
      : `${axis === "vertical" ? "Book" : "Flip"} fold diagram, ${angle} degrees`} style={{ width: 700, height: 700 }} />
    <ProjectedRulers measurements={measurements} />
  </div>;
}
