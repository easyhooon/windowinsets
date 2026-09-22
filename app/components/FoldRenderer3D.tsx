import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { CutoutShape } from "../data/types";

const MIN_ZOOM = 25;
const MAX_ZOOM = 500;
const SEGMENTS = 48; // vertices along the fold axis — higher = smoother curve
const THICKNESS = 0.09; // world units the "shell" mesh sits behind the front face — a visible edge/bezel, not an infinitely-thin sheet

const INK = "#1e293b";
const INSET_COLOR = "#c2410c";
const RADIUS_COLOR = "#be185d";
const SAFE_FILL = "#4ade80";
const INSET_FILL = "#fb923c";

type Units = "dp" | "px";

interface Insets { top: number; right: number; bottom: number; left: number }
interface CornerRadii { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number }

function fmtWith(units: Units, densityDpi: number | null) {
  return (vDp: number) => {
    const v = units === "px" && densityDpi ? vDp * (densityDpi / 160) : vDp;
    return v === 0 ? "0" : Number(v.toFixed(2)).toString();
  };
}

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
  },
) {
  const W = dpW * px, H = dpH * px;
  const PAD = 34 * px; // margin for outside dimension lines, scaled modestly
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

  if (opts.showFrame) {
    roundedRectPath(0, 0, W, H, r);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3 * px;
    ctx.strokeStyle = "#0f172a";
    ctx.stroke();
  }

  const safe = opts.safe;
  if (opts.showRegions && safe) {
    ctx.save();
    roundedRectPath(0, 0, W, H, r);
    ctx.clip();

    ctx.fillStyle = SAFE_FILL; ctx.globalAlpha = 0.4;
    ctx.fillRect(safe.left * px, safe.top * px, W - (safe.left + safe.right) * px, H - (safe.top + safe.bottom) * px);

    ctx.fillStyle = INSET_FILL; ctx.globalAlpha = 0.55;
    if (safe.top > 0) ctx.fillRect(0, 0, W, safe.top * px);
    if (safe.bottom > 0) ctx.fillRect(0, H - safe.bottom * px, W, safe.bottom * px);
    if (safe.left > 0) ctx.fillRect(0, 0, safe.left * px, H);
    if (safe.right > 0) ctx.fillRect(W - safe.right * px, 0, safe.right * px, H);

    if (opts.cutoutShape) {
      const c = opts.cutoutShape;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0f172a";
      const cx = c.xDp * px, cy = c.yDp * px, cw = c.widthDp * px, ch = c.heightDp * px;
      roundedRectPath(cx, cy, cw, ch, Math.min(cw, ch) / 2);
      ctx.fill();
    }

    // Safe area's own size, centered inside the green region — the
    // "SAFE AREA / W × H" label safearea.info prints on top of its own
    // safe-area fill (the safe rect's own dp size, not the overall device
    // size the outside dimension arrows already show).
    if (opts.showDimensions) {
      const safeWDp = dpW - safe.left - safe.right;
      const safeHDp = dpH - safe.top - safe.bottom;
      const scx = safe.left * px + (W - (safe.left + safe.right) * px) / 2;
      const scy = safe.top * px + (H - (safe.top + safe.bottom) * px) / 2;
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#166534";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${9 * px}px sans-serif`;
      ctx.fillText("SAFE AREA", scx, scy - 8 * px);
      ctx.font = `700 ${12 * px}px sans-serif`;
      ctx.fillText(`${opts.fmt(safeWDp)} × ${opts.fmt(safeHDp)}`, scx, scy + 9 * px);
    }
    ctx.restore();
  }

  function chip(x: number, y: number, text: string, color: string, w = 40 * px, h = 15 * px, fontSize = 10 * px) {
    ctx.fillStyle = color;
    roundedRectPath(x - w / 2, y - h / 2, w, h, 3 * px);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 0.5);
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

    if (safe) {
      if (safe.top > 0) {
        chip(W / 2, safe.top * px / 2, opts.fmt(safe.top), INSET_COLOR);
        extLine(W, 0, W + 18 * px, 0, INSET_COLOR); extLine(W, safe.top * px, W + 18 * px, safe.top * px, INSET_COLOR);
        arrowLine(W + 18 * px, 0, W + 18 * px, safe.top * px, INSET_COLOR);
        chip(W + 18 * px, safe.top * px / 2, opts.fmt(safe.top), INSET_COLOR, 34 * px, 14 * px, 8.5 * px);
      }
      if (safe.bottom > 0) {
        chip(W / 2, H - safe.bottom * px / 2, opts.fmt(safe.bottom), INSET_COLOR);
        extLine(W, H - safe.bottom * px, W + 18 * px, H - safe.bottom * px, INSET_COLOR); extLine(W, H, W + 18 * px, H, INSET_COLOR);
        arrowLine(W + 18 * px, H - safe.bottom * px, W + 18 * px, H, INSET_COLOR);
        chip(W + 18 * px, H - safe.bottom * px / 2, opts.fmt(safe.bottom), INSET_COLOR, 34 * px, 14 * px, 8.5 * px);
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

    if (r > 0 && opts.cornerRadiiDp) {
      const cr = opts.cornerRadiiDp;
      const rad = 9 * px, fs = 7 * px;
      const dot = (x: number, y: number, v: number) => {
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fillStyle = RADIUS_COLOR; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = `700 ${fs}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(opts.fmt(v), x, y + 0.5);
      };
      dot(-16 * px, -16 * px, cr.topLeft);
      dot(W + 16 * px, -16 * px, cr.topRight);
      dot(-16 * px, H + 16 * px, cr.bottomLeft);
      dot(W + 16 * px, H + 16 * px, cr.bottomRight);
    }
  }

  ctx.restore();
}

/**
 * A genuine WebGL 3D renderer (three.js) for the foldable device: a plane
 * mesh subdivided along the hinge axis that bends smoothly around a
 * cylindrical arc as `angle` changes — 0deg (flat) = zero curvature, 180deg
 * (closed) = a half-circle bringing both ends to face each other. This is
 * the same technique safearea.info's own renderer uses (confirmed via
 * their bundle: WebGLRenderer/BufferGeometry/ShaderMaterial), replacing the
 * earlier 2-rigid-panel CSS 3D transform approach, which could only hinge
 * at a sharp crease rather than curve continuously.
 *
 * The entire measurement diagram (bezel, colored regions, real cutout,
 * corner-radius chips, dimension arrows) is baked into a single 2D canvas
 * texture applied to the mesh — since it's pixels on the bending surface,
 * every label and line curves correctly with the mesh for free, with no
 * separate 3D-projection math needed for the labels themselves.
 */
export function FoldRenderer3D({
  angle,
  axis,
  widthDp,
  heightDp,
  safe,
  cornerRadiiDp,
  cutoutShape,
  densityDpi,
  zoom,
  onZoomChange,
  showFrame,
  showRegions,
  showDimensions,
  units,
}: {
  angle: number;
  axis: "vertical" | "horizontal";
  widthDp: number;
  heightDp: number;
  safe: Insets | null;
  cornerRadiiDp?: CornerRadii | null;
  cutoutShape?: CutoutShape;
  densityDpi?: number | null;
  /** Zoom/settings are controlled from the parent toolbar (DeviceView) so
   * every control on the page lives in one uniform row, safearea.info-style,
   * instead of a second private toolbar duplicated inside this component. */
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showFrame: boolean;
  showRegions: boolean;
  showDimensions: boolean;
  units: Units;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({ angle, safe, cornerRadiiDp: cornerRadiiDp ?? null, cutoutShape, showFrame, showRegions, showDimensions, units, zoom });
  stateRef.current = { angle, safe, cornerRadiiDp: cornerRadiiDp ?? null, cutoutShape, showFrame, showRegions, showDimensions, units, zoom };
  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap || !widthDp || !heightDp) return;

    const containerW = 340, containerH = 460;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerW, containerH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, containerW / containerH, 0.1, 100);
    // Slightly elevated/angled viewpoint (not a flat head-on view) so the
    // fold's depth is actually visible instead of just its silhouette.
    camera.position.set(0, 1.6, 8.4);
    camera.lookAt(0, 0, 0.3);

    const isVertical = axis === "vertical";
    const dpW = widthDp, dpH = heightDp;

    // The captured measurement's width/height reflect whatever rotation the
    // OS happened to be in at capture time (Android's screenWidthDp/HeightDp
    // are current-rotation-relative, not a fixed "panel shape"). A physical
    // book-fold (vertical hinge, splits the panel into left/right halves)
    // must be landscape once flat — the closed halves sit side by side and
    // double the width. A flip-fold (horizontal hinge, top/bottom halves)
    // must be portrait once flat, for the same reason in the other axis.
    // If the raw dp values don't already match that shape (e.g. our Fold8
    // capture came out portrait because the probe ran unrotated), rotate the
    // silhouette 90° here rather than stretching — the finished diagram
    // texture (already correctly laid out in the captured frame, insets and
    // all) is then sampled rotated onto the plane, so every measured number
    // stays exactly as recorded; only the on-screen orientation changes.
    const capturedIsLandscape = dpW > dpH;
    const needsRotate = isVertical ? !capturedIsLandscape : capturedIsLandscape;
    const silW = needsRotate ? dpH : dpW;
    const silH = needsRotate ? dpW : dpH;

    const aspect = silW / silH;
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

    const px = 340 / dpW; // canvas px per dp — fixed texel density, independent of zoom or rotation
    const PAD = 34 * px;
    // drawDiagram always lays the diagram out in the captured dpW×dpH frame
    // (content box below). When rotating, the canvas's own pixel buffer is
    // swapped to match the silhouette instead, and each redraw rotates the
    // 2D context itself before calling drawDiagram — so drawDiagram's own
    // coordinates never change, only where they land in the final bitmap.
    // (Doing the rotation here, on exact pixel boxes, instead of as a UV
    // rotation on the finished texture, sidesteps the fixed-size PAD margin
    // occupying a different *fraction* of width vs height once swapped.)
    const contentW = dpW * px + PAD * 2;
    const contentH = dpH * px + PAD * 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(needsRotate ? contentH : contentW);
    canvas.height = Math.ceil(needsRotate ? contentW : contentH);
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // A plain flat sheet reads as paper-thin, especially mid-fold — real
    // hardware has a visible edge (glass + frame). Cheap fix: a second,
    // unlit dark "shell" mesh sharing the same bent topology but pushed
    // back along the front face's own surface normals by a small constant
    // — wherever the bend or the camera's slight elevation reveals the
    // side profile, this shows through as a thin dark rim, giving the
    // device an actual sense of thickness instead of a zero-depth sheet.
    const shellGeometry = geometry.clone();
    const shellMaterial = new THREE.MeshBasicMaterial({ color: "#334155", side: THREE.DoubleSide });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shellMesh);

    function redrawTexture() {
      const st = stateRef.current;
      const fmt = fmtWith(st.units, densityDpi ?? null);
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (needsRotate) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-contentW / 2, -contentH / 2);
      }
      drawDiagram(ctx, dpW, dpH, px, {
        safe: st.safe, cornerRadiiDp: st.cornerRadiiDp, cutoutShape: st.cutoutShape,
        showFrame: st.showFrame, showRegions: st.showRegions, showDimensions: st.showDimensions, fmt,
      });
      ctx.restore();
      texture.needsUpdate = true;
    }

    /** Bends the flat plane around a cylindrical arc: 0deg total bend = flat,
     * 180deg = a half-circle bringing both edges to face each other. Every
     * vertex (not just two rigid halves) moves, producing a continuous
     * curve rather than a sharp crease. */
    // Real hardware bends sharply only right at the hinge mechanism — the
    // two screen halves on either side are rigid glass/panel, not flexible.
    // Modeling the whole surface as one uniform arc (first attempt) curved
    // the entire panel like a banana, which doesn't match a real foldable.
    // Fix: only a narrow "hinge zone" actually curves; everything outside
    // it stays perfectly flat and just rotates as a rigid body, tangent to
    // the curve at the zone boundary so the two pieces still meet smoothly.
    const extent = isVertical ? worldW : worldH;
    const hingeZoneHalfWidth = extent * 0.035;

    function applyBend() {
      const st = stateRef.current;
      const totalBendRad = ((180 - st.angle) * Math.PI) / 180;
      const posAttr = geometry.attributes.position;
      const Rh = totalBendRad > 0.0001 ? (2 * hingeZoneHalfWidth) / totalBendRad : Infinity;
      const phiMax = Rh !== Infinity ? hingeZoneHalfWidth / Rh : 0;
      const edge = { x: Rh !== Infinity ? Rh * Math.sin(phiMax) : hingeZoneHalfWidth, z: Rh !== Infinity ? Rh * (1 - Math.cos(phiMax)) : 0 };
      const tangent = { c: Math.cos(phiMax), s: Math.sin(phiMax) };

      for (let i = 0; i < posAttr.count; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const u = isVertical ? bx : by; // signed distance from hinge along the fold axis
        const sign = u < 0 ? -1 : 1;
        const au = Math.abs(u);
        let arcPos: number, depth: number;

        if (Rh === Infinity || au <= hingeZoneHalfWidth) {
          const phi = Rh === Infinity ? 0 : au / Rh;
          arcPos = (Rh === Infinity ? au : Rh * Math.sin(phi));
          depth = Rh === Infinity ? 0 : Rh * (1 - Math.cos(phi));
        } else {
          const beyond = au - hingeZoneHalfWidth;
          arcPos = edge.x + beyond * tangent.c;
          depth = edge.z + beyond * tangent.s;
        }

        let nx = bx, ny = by, nz = 0;
        if (isVertical) { nx = sign * arcPos; nz = depth; } else { ny = sign * arcPos; nz = depth; }
        posAttr.setXYZ(i, nx, ny, nz);
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Push the shell mesh's matching vertices back along the just-computed
      // surface normals — done after computeVertexNormals() above so this
      // always uses the current (bent) normals, not the flat plane's.
      const normalAttr = geometry.attributes.normal;
      const shellPos = shellGeometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        shellPos.setXYZ(
          i,
          posAttr.getX(i) - normalAttr.getX(i) * THICKNESS,
          posAttr.getY(i) - normalAttr.getY(i) * THICKNESS,
          posAttr.getZ(i) - normalAttr.getZ(i) * THICKNESS,
        );
      }
      shellPos.needsUpdate = true;
      shellGeometry.computeVertexNormals();
    }

    redrawTexture();
    applyBend();

    let raf = 0;
    function render() {
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    }
    render();

    (mount as HTMLDivElement & { __update?: () => void }).__update = () => {
      redrawTexture();
      applyBend();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const z = stateRef.current.zoom;
      onZoomChangeRef.current(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(z - e.deltaY / 4))));
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("wheel", onWheel);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      renderer.dispose();
    };
    // Geometry/scene are rebuilt only when the device itself changes; angle
    // and display toggles update in place via the ref-backed redraw below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthDp, heightDp, axis, densityDpi]);

  // Cheap updates (no scene rebuild) whenever angle or display options change.
  useEffect(() => {
    const mount = mountRef.current as (HTMLDivElement & { __update?: () => void }) | null;
    mount?.__update?.();
  }, [angle, safe, cornerRadiiDp, cutoutShape, showFrame, showRegions, showDimensions, units, zoom]);

  if (!widthDp || !heightDp) {
    return (
      <div className="flex h-40 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
        Main screen logical size is not verified yet.
      </div>
    );
  }

  const fmt = fmtWith(units, densityDpi ?? null);
  // Same rotate-to-physical-silhouette rule as inside the render effect —
  // duplicated here (cheaply) just so this caption's dimensions match what
  // the 3D view actually shows flat, not the as-captured rotation.
  const capturedIsLandscape = widthDp > heightDp;
  const silhouetteRotated = axis === "vertical" ? !capturedIsLandscape : capturedIsLandscape;
  const [silDpW, silDpH] = silhouetteRotated ? [heightDp, widthDp] : [widthDp, heightDp];

  return (
    <div className="space-y-3">
      <div ref={wrapRef} className="flex justify-center" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
        <div ref={mountRef} style={{ width: 340, height: 460 }} />
      </div>

      <p className="text-center text-sm">
        <span className="block text-xs text-muted">{axis === "vertical" ? "Book fold · vertical hinge" : "Flip fold · horizontal hinge"}</span>
        <span className="font-mono">{angle}°</span>
        <span className="ml-2 font-mono text-xs text-muted">{fmt(silDpW)} × {fmt(silDpH)} {units}</span>
      </p>

      <div className="flex flex-wrap justify-center gap-4 text-xs border-t border-line pt-3">
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ backgroundColor: SAFE_FILL, opacity: 0.6 }} /><span className="text-muted">Safe Area</span></div>
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ backgroundColor: INSET_FILL, opacity: 0.7 }} /><span className="text-muted">Insets (bars + cutout)</span></div>
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: RADIUS_COLOR }} /><span className="text-muted">Corner Radius</span></div>
      </div>
    </div>
  );
}
