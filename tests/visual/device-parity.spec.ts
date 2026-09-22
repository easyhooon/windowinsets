import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const devices = [
  { slug: "galaxy-z-fold8", label: "Fold8" },
  { slug: "galaxy-z-fold7", label: "Fold7" },
  { slug: "galaxy-z-flip8", label: "Flip8" },
] as const;

const poses = ["Closed", "Partially Folded", "Open"] as const;

async function waitForDiagram(page: Page) {
  await page.locator("canvas").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_000);
}

async function openMetricsIfCollapsed(page: Page) {
  const toggle = page.getByRole("button", { name: "Metrics" });
  if (await toggle.isVisible()) await toggle.click();
}

async function waitForFoldTransition(page: Page) {
  const metrics = page.locator(".metrics-panel");
  await expect(metrics).toHaveAttribute("aria-busy", "true");
  await expect(metrics).toHaveAttribute("aria-busy", "false", { timeout: 5_000 });
}

async function chooseDropdown(page: Page, label: string, option: string) {
  await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("button", { name: option, exact: true }).click();
}

async function chooseUnits(page: Page, units: "dp" | "px") {
  await page.getByRole("button", { name: "View settings" }).click();
  await page.getByRole("radio", { name: units }).click();
  await page.getByRole("button", { name: "View settings" }).click();
}

test("per-device JSON export downloads the complete versioned device payload", async ({ page }) => {
  await page.goto("/galaxy-z-flip8");
  const button = page.getByRole("button", { name: "Export JSON" });
  await expect(button).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await button.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("galaxy-z-flip8-window-insets.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = JSON.parse(await readFile(path!, "utf8"));
  expect(exported.schema).toBe("https://windowinsets.info/schemas/device-window-insets-v1.schema.json");
  expect(exported.schemaVersion).toBe(1);
  expect(exported.screens.map((screen: { id: string }) => screen.id)).toEqual(["cover", "main"]);
  expect(exported.screens[0].navigationModes.gesture.status).toBe("measured");
  expect(exported.screens[0].navigationModes.threeButton.status).toBe("measured");
});

for (const device of devices) {
  for (const pose of poses) {
    test(`${device.label} ${pose} remains readable`, async ({ page }, testInfo) => {
      await page.goto(`/${device.slug}`);
      await waitForDiagram(page);
      if (pose !== "Closed") {
        await page.getByRole("button", { name: "Pose: Closed" }).click();
        await page.getByRole("button", { name: pose, exact: true }).click();
        await waitForFoldTransition(page);
      }
      await expect(page).toHaveScreenshot(`${device.slug}-${pose.toLowerCase().replaceAll(" ", "-")}.png`, {
        fullPage: true,
      });

      await expect(page.getByRole("button", { name: /^Navigation:/ })).toBeVisible();
      await expect(page.getByRole("button", { name: `Pose: ${pose}` })).toBeVisible();
      if (testInfo.project.name === "mobile") {
        await expect(page.locator('[aria-label="Region legend"]')).toBeVisible();
      }
    });
  }
}

test("Fold8 gesture px diagrams remain readable through every pose", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await chooseDropdown(page, "Navigation", "Gesture");
  await chooseUnits(page, "px");
  for (const pose of poses) {
    if (pose !== "Closed") {
      await page.getByRole("button", { name: /^Pose:/ }).click();
      await page.getByRole("button", { name: pose, exact: true }).click();
      await waitForFoldTransition(page);
    }
    await expect(page).toHaveScreenshot(`galaxy-z-fold8-gesture-px-${pose.toLowerCase().replaceAll(" ", "-")}.png`, { fullPage: true });
  }
});

test("Flip8 gesture diagrams and exact inner px remain readable", async ({ page }) => {
  await page.goto("/galaxy-z-flip8");
  await waitForDiagram(page);
  await chooseDropdown(page, "Navigation", "Gesture");
  await expect(page).toHaveScreenshot("galaxy-z-flip8-gesture-dp-closed.png", { fullPage: true });
  for (const pose of ["Partially Folded", "Open"] as const) {
    await page.getByRole("button", { name: /^Pose:/ }).click();
    await page.getByRole("button", { name: pose, exact: true }).click();
    await waitForFoldTransition(page);
    await expect(page).toHaveScreenshot(`galaxy-z-flip8-gesture-dp-${pose.toLowerCase().replaceAll(" ", "-")}.png`, { fullPage: true });
  }
  await chooseUnits(page, "px");
  await expect(page).toHaveScreenshot("galaxy-z-flip8-gesture-px-open.png", { fullPage: true });
});

test("S25 Ultra exposes exact captured px separately from panel resolution", async ({ page }) => {
  await page.goto("/galaxy-s25-ultra");
  await expect(page.locator("svg text").filter({ hasText: /^34\.13$/ })).toHaveCount(1);
  await openMetricsIfCollapsed(page);
  await page.getByRole("button", { name: "View settings" }).click();
  await page.getByRole("radio", { name: "px" }).click();

  await expect(page.getByRole("button", { name: "Logical Size 1080 × 2340 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resolution 1440 × 3120 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Captured Window 1080 × 2340 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Top 96 px" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Right 514 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bottom 2244 px" })).toBeVisible();
});

test("S25 Ultra remains readable across navigation, units, and orientation", async ({ page }) => {
  await page.goto("/galaxy-s25-ultra");
  const orientations = ["Portrait", "Landscape Left", "Portrait Upside Down", "Landscape Right"];
  for (const navigation of ["3-button", "Gesture"]) {
    await chooseDropdown(page, "Navigation", navigation);
    for (const units of ["dp", "px"] as const) {
      await chooseUnits(page, units);
      for (const orientation of orientations) {
        await chooseDropdown(page, "Orientation", orientation);
        await expect(page).toHaveScreenshot(
          `galaxy-s25-ultra-${navigation.toLowerCase()}-${units}-${orientation.toLowerCase().replaceAll(" ", "-")}.png`,
          { fullPage: true },
        );
      }
    }
  }
});

test("Fold7 animation switches from measured cover to measured inner display", async ({ page }) => {
  await page.goto("/galaxy-z-fold7");
  await waitForDiagram(page);
  await openMetricsIfCollapsed(page);
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await waitForFoldTransition(page);
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Inner" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Logical Size 832 × 749.71 dp" })).toBeVisible();
});

test("fold pose changes preserve an explicit zoom", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.getByRole("button", { name: /^Zoom:/ }).click();
  await page.getByRole("button", { name: "200%", exact: true }).click();
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await waitForFoldTransition(page);
  await expect(page.getByRole("button", { name: "Zoom: 200%" })).toBeVisible();
});

test("fold pose changes preserve pan and 0 restores automatic fit", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  const viewport = page.getByRole("region", { name: "Device visualization" }).getByLabel("Zoomable device canvas");
  const position = viewport.locator(".diagram-position");
  await viewport.dispatchEvent("wheel", { deltaX: -36, deltaY: -24 });
  const manualTransform = await position.evaluate(element => (element as HTMLElement).style.transform);
  expect(manualTransform).not.toBe("translate(0px, 0px)");

  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await waitForFoldTransition(page);
  await expect(position).toHaveAttribute("style", `transform: ${manualTransform};`);

  await viewport.focus();
  await page.keyboard.press("0");
  await expect(position).toHaveAttribute("style", /translate\(0px, 0px\)/);
  const fitZoom = await page.getByRole("button", { name: /^Zoom:/ }).textContent();
  await page.keyboard.press("=");
  await expect(page.getByRole("button", { name: /^Zoom:/ })).not.toHaveText(fitZoom!);
  await page.keyboard.press("0");
  await expect(page.getByRole("button", { name: /^Zoom:/ })).toHaveText(fitZoom!);
});

test("animated hinge keeps outer metrics until the inner display is visible", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".metrics-panel")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Outer" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => Number(await page.getByRole("img", { name: /Book fold diagram/ }).getAttribute("data-displayed-angle")))
    .toBeGreaterThan(0);
  const intermediateAngle = Number(await page.getByRole("img", { name: /Book fold diagram/ }).getAttribute("data-displayed-angle"));
  expect(intermediateAngle).toBeLessThan(180);
  await expect(page.locator(".metrics-panel")).toHaveAttribute("aria-busy", "false", { timeout: 5_000 });
  await expect(page.getByRole("img", { name: /Book fold diagram/ })).toHaveAttribute("data-displayed-angle", "180.00");
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Inner" })).toHaveAttribute("aria-pressed", "true");
});

test("reduced motion reaches the same Fold endpoint", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Inner" })).toHaveAttribute("aria-pressed", "true");
});

test("Fold cover dimension labels copy their displayed value", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  await canvas.click({ position: { x: box!.width * 0.5, y: box!.height * 0.22 } });
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("475.43");
});
