import type { Insets } from "../data/types";

/** App preview state: off, content ignoring insets, or padded by the recorded
 * safe-area inset (systemBars ∪ displayCutout, IME hidden). Compose's
 * `WindowInsets.safeDrawing` and a View's combined `getInsets` resolve to the
 * same values, so the mock is toolkit-neutral and a simulation derived from the
 * capture, not a rendered app frame. */
export type AppPreview = "off" | "ignored" | "applied";

export type MockShape =
  | { kind: "rect"; x: number; y: number; width: number; height: number; radius: number; fill: string; clash?: boolean }
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string }
  | { kind: "text"; x: number; y: number; text: string; size: number; fill: string; clash?: boolean; width: number }
  | { kind: "plus"; cx: number; cy: number; size: number; stroke: string };

const SURFACE = "#fef7ff";
const APP_BAR = "#e8def8";
const ON_SURFACE = "#1d1b20";
const SKELETON = "#d9d3e0";
const FAB = "#6750a4";
const AVATARS = ["#7d5260", "#625b71", "#6750a4", "#386a20", "#0061a4"];
export const CLASH_COLOR = "#d1242f";

const APP_BAR_HEIGHT = 64;
const ROW_HEIGHT = 72;
const FAB_SIZE = 56;
const FAB_MARGIN = 16;
const TITLE_SIZE = 22;

function overlaps(a: { x: number; y: number; width: number; height: number }, bands: { x: number; y: number; width: number; height: number }[]) {
  return bands.some(b => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height);
}

/** A Material 3 Scaffold (top app bar, list, FAB) laid out in dp. Backgrounds
 * always draw edge to edge; "applied" pads content by `safe` as
 * `contentWindowInsets = WindowInsets.safeDrawing` would. */
export function appMockShapes(width: number, height: number, safe: Insets, mode: Exclude<AppPreview, "off">): MockShape[] {
  const pad = mode === "applied" ? safe : { top: 0, right: 0, bottom: 0, left: 0 };
  const bands = [
    { x: 0, y: 0, width, height: safe.top },
    { x: 0, y: height - safe.bottom, width, height: safe.bottom },
    { x: 0, y: 0, width: safe.left, height },
    { x: width - safe.right, y: 0, width: safe.right, height },
  ].filter(b => b.width > 0 && b.height > 0);
  const shapes: MockShape[] = [
    { kind: "rect", x: 0, y: 0, width, height, radius: 0, fill: SURFACE },
  ];

  const barBottom = pad.top + APP_BAR_HEIGHT;
  for (let i = 0, y = barBottom; y < height; i++, y += ROW_HEIGHT) {
    const left = pad.left + 16, right = width - pad.right - 16;
    const lineX = left + 56, lineW = Math.max(0, right - lineX);
    shapes.push(
      { kind: "circle", cx: left + 20, cy: y + ROW_HEIGHT / 2, r: 20, fill: AVATARS[i % AVATARS.length] },
      { kind: "rect", x: lineX, y: y + 22, width: lineW * .55, height: 10, radius: 5, fill: "#b8b0c4" },
      { kind: "rect", x: lineX, y: y + 40, width: lineW * (.9 - (i % 3) * .12), height: 8, radius: 4, fill: SKELETON },
    );
  }

  // TopAppBar paints its container behind the status bar, then places its
  // content below the top inset.
  shapes.push({ kind: "rect", x: 0, y: 0, width, height: barBottom, radius: 0, fill: APP_BAR });
  const menu = { x: pad.left + 16, y: pad.top + 20, width: 24, height: 24 };
  shapes.push({ kind: "rect", ...menu, radius: 3, fill: "transparent", clash: overlaps(menu, bands) });
  for (const dy of [5, 11, 17]) shapes.push({ kind: "rect", x: menu.x + 3, y: menu.y + dy, width: 18, height: 2, radius: 1, fill: ON_SURFACE });
  const titleWidth = TITLE_SIZE * .58 * 5;
  const title = { x: pad.left + 56, y: pad.top + APP_BAR_HEIGHT / 2 - TITLE_SIZE / 2, width: titleWidth, height: TITLE_SIZE };
  shapes.push({ kind: "text", x: title.x, y: pad.top + APP_BAR_HEIGHT / 2, text: "Inbox", size: TITLE_SIZE, fill: ON_SURFACE, width: titleWidth, clash: overlaps(title, bands) });

  const fab = { x: width - pad.right - FAB_MARGIN - FAB_SIZE, y: height - pad.bottom - FAB_MARGIN - FAB_SIZE, width: FAB_SIZE, height: FAB_SIZE };
  shapes.push(
    { kind: "rect", ...fab, radius: 16, fill: FAB, clash: overlaps(fab, bands) },
    { kind: "plus", cx: fab.x + FAB_SIZE / 2, cy: fab.y + FAB_SIZE / 2, size: 24, stroke: "#ffffff" },
  );
  return shapes;
}

/** Inset bands drawn over the mock, so obscured content stays visible. */
export const PREVIEW_INSET_OPACITY = .72;
