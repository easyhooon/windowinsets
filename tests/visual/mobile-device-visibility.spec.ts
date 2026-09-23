import { expect, test } from "@playwright/test";

async function visibleSafeAreaWidth(page: import("@playwright/test").Page) {
  const viewport = await page.locator(".diagram-viewport").boundingBox();
  expect(viewport).not.toBeNull();
  const screenshot = await page.screenshot();
  return page.evaluate(async ({ png, ys }) => {
    const image = new Image();
    image.src = `data:image/png;base64,${png}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let longest = 0;
    for (const y of ys) {
      const row = context.getImageData(0, y, canvas.width, 1).data;
      let current = 0;
      for (let x = 0; x < canvas.width; x++) {
        const r = row[x * 4], g = row[x * 4 + 1], b = row[x * 4 + 2];
        current = g > r + 18 && g > b + 8 && r > 120 ? current + 1 : 0;
        longest = Math.max(longest, current);
      }
    }
    return longest;
  }, { png: screenshot.toString("base64"), ys: [.4, .5, .6].map(ratio => Math.round(viewport!.y + viewport!.height * ratio)) });
}

test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

test("Fold8 cover stays visible at phone resolution, including transparent WebGL compositing", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await expect(page.locator("[data-displayed-angle]")).toHaveAttribute("data-displayed-angle", "0.00");
  await expect.poll(() => visibleSafeAreaWidth(page)).toBeGreaterThan(185);
  const metrics = await page.getByRole("button", { name: "Metrics", exact: true }).boundingBox();
  const corner = await page.locator('[data-ruler="Top left radius"] [data-badge]').boundingBox();
  expect(metrics).not.toBeNull();
  expect(corner).not.toBeNull();
  expect(corner!.y).toBeGreaterThan(metrics!.y + metrics!.height);

  // Reproduce a GPU surface which composites as transparent without a context-lost event.
  await page.locator("[data-displayed-angle] canvas").first().evaluate(canvas => { (canvas as HTMLCanvasElement).style.opacity = "0"; });
  await expect.poll(() => visibleSafeAreaWidth(page)).toBeGreaterThan(185);
});

test("Fold8 cover still renders when WebGL construction fails", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind === "webgl" || kind === "webgl2") return null;
      return (original as Function).apply(this, [kind, ...args]);
    } as typeof original;
  });
  await page.goto("/galaxy-z-fold8");
  await expect(page.getByRole("img", { name: /flat fallback diagram/ })).toBeVisible();
  await expect.poll(() => visibleSafeAreaWidth(page)).toBeGreaterThan(150);
});
