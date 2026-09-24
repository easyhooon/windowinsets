import { expect, test, type Page } from "@playwright/test";

async function choose(page: Page, label: string, option: string) {
  await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("button", { name: option, exact: true }).click();
}
async function settled(page: Page, angle: number) {
  await expect(page.locator("[data-displayed-angle]")).toHaveAttribute("data-displayed-angle", angle.toFixed(2));
}
async function sample(page: Page) {
  return page.evaluate(() => {
    const scale = document.querySelector<HTMLElement>(".diagram-position > div")!;
    return {
      angle: Number(document.querySelector<HTMLElement>("[data-displayed-angle]")!.dataset.displayedAngle),
      scale: new DOMMatrix(getComputedStyle(scale).transform).a,
      pan: document.querySelector<HTMLElement>(".diagram-position")!.style.transform,
    };
  });
}
for (const slug of ["galaxy-z-fold8", "galaxy-z-flip8"]) {
  test(`${slug} automatic fit follows every hinge frame`, async ({ page }) => {
    await page.goto(`/${slug}`);
    await settled(page, 0);
    const closed = await sample(page);
    await choose(page, "Pose", "Open");
    await settled(page, 180);
    const open = await sample(page);
    expect(closed.scale).toBeGreaterThan(0);
    expect(open.scale).toBeGreaterThan(0);
    // Sample the actual CSS transform and rendered angle in the same animation frame.
    for (const [pose, target] of [["Closed", 0], ["Partially Folded", 90], ["Open", 180], ["Closed", 0]] as const) {
      await page.getByRole("button", { name: /^Pose:/ }).click();
      const frames = page.evaluate(() => new Promise<Array<{ angle: number; scale: number }>>(resolve => {
        const samples: Array<{ angle: number; scale: number }> = [];
        const start = performance.now();
        const tick = () => {
          const el = document.querySelector<HTMLElement>("[data-displayed-angle]")!;
          const transform = getComputedStyle(document.querySelector(".diagram-position > div")!).transform;
          samples.push({ angle: Number(el.dataset.displayedAngle), scale: new DOMMatrix(transform).a });
          if (performance.now() - start < 1000) requestAnimationFrame(tick);
          else resolve(samples);
        };
        requestAnimationFrame(tick);
      }));
      await page.getByRole("button", { name: pose, exact: true }).click();
      const values = await frames;
      expect(values.filter(v => v.angle > 1 && v.angle < 179).length).toBeGreaterThan(2);
      for (const frame of values) {
        // Fit now includes screen-space badges, whose constant font size and
        // occupied lanes change with perspective; it is no longer linear.
        expect(frame.scale).toBeGreaterThan(0);
        expect(frame.scale).toBeLessThanOrEqual(1.5);
      }
      await settled(page, target);
      const displayedZoom = await page.getByRole("button", { name: /^Zoom:/ }).textContent();
      expect(displayedZoom).toBe(`Zoom:${Math.round((await sample(page)).scale * 100)}%`);
    }
    await page.screenshot({ path: test.info().outputPath(`${slug}-closed.png`) });
    await choose(page, "Pose", "Open");
    await settled(page, 180);
    await page.screenshot({ path: test.info().outputPath(`${slug}-open.png`) });
  });

  test(`${slug} manual scale and pan survive poses and Fit recovery`, async ({ page }) => {
    await page.goto(`/${slug}`);
    await settled(page, 0);
    const before = await sample(page);
    await page.locator("#device-canvas").dispatchEvent("wheel", { deltaX: -36, deltaY: -24 });
    const manual = await sample(page);
    expect(manual.scale).toBeCloseTo(before.scale, 4);
    for (const pose of ["Open", "Partially Folded", "Closed"]) {
      await choose(page, "Pose", pose);
      await settled(page, pose === "Open" ? 180 : pose === "Closed" ? 0 : 90);
      expect(await sample(page)).toMatchObject({ scale: manual.scale, pan: manual.pan });
    }
    await choose(page, "Zoom", "200%");
    await choose(page, "Pose", "Open");
    await settled(page, 180);
    expect((await sample(page)).scale).toBe(2);
    await page.locator("#device-canvas").focus();
    await page.keyboard.press("0");
    expect((await sample(page)).pan).toBe("translate(0px, 0px)");
    expect((await sample(page)).scale).toBeLessThanOrEqual(1.5);
    await choose(page, "Pose", "Closed");
    await settled(page, 0);
    expect((await sample(page)).scale).toBeCloseTo(before.scale, 4);
  });

  test(`${slug} reduced motion synchronizes fit and hinge endpoints`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${slug}`);
    await settled(page, 0);
    const closed = await sample(page);
    for (const [pose, angle] of [["Open", 180], ["Partially Folded", 90], ["Closed", 0]] as const) {
      await choose(page, "Pose", pose);
      await settled(page, angle);
      const current = await sample(page);
      if (angle === 0) expect(current.scale).toBeCloseTo(closed.scale, 4);
      expect(current.scale).toBeGreaterThan(0);
      expect(current.scale).toBeLessThanOrEqual(1.5);
      // Fewer annotations can let multiple poses reach the 150% Fit ceiling.
      // An explicit Fit must reproduce the scale already reached at the endpoint.
      await page.locator('#device-canvas').focus();
      await page.keyboard.press('0');
      await expect.poll(async () => (await sample(page)).scale).toBeCloseTo(current.scale, 4);
    }
  });
}

test("fully measured Fold6 shows both inner navigation modes", async ({ page }) => {
  await page.goto("/galaxy-z-fold6");
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  const toggle = page.getByRole("button", { name: "Metrics", exact: true });
  if (await toggle.isVisible()) await toggle.click();
  await page.locator(".screen-tabs").getByRole("button", { name: "Inner", exact: true }).click();
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("fold6-inner-three-button.png") });
  await choose(page, "Navigation", "Gesture");
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("fold6-inner-gesture.png") });
  await page.locator(".screen-tabs").getByRole("button", { name: "Outer", exact: true }).click();
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  expect((await page.locator(".diagram-position > div").boundingBox())!.width).toBeGreaterThan(0);
  await page.screenshot({ path: test.info().outputPath("fold6-complete-measurements.png") });
});
