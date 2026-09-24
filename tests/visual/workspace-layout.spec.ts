import { expect, test } from '@playwright/test';

test('the workspace allocates real space to the canvas, legend and controls at every breakpoint', async ({ page }) => {
  test.setTimeout(120_000);
  // Different aspect ratios and data availability exercise the same layout contract.
  for (const slug of ['galaxy-s25-ultra', 'galaxy-z-fold8', 'galaxy-z-flip8', 'galaxy-tab-s11-ultra']) {
    for (const [width, height] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      await page.goto('/' + slug);
      await expect.poll(() => page.evaluate(() => {
        const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
        const canvas = box('#device-canvas'), footer = box('.canvas-footer'), controls = box('.canvas-controls');
        const errors: string[] = [];
        if (canvas.height < 140 || canvas.width < 150) errors.push('canvas squeezed');
        if (canvas.bottom > footer.top + 1) errors.push('footer overlaps canvas');
        if (window.innerWidth < 1200 && footer.bottom > controls.top + 1) errors.push('controls overlap footer');
        if (controls.bottom > window.innerHeight + 1) errors.push('controls clipped');
        if (document.documentElement.scrollWidth > window.innerWidth) errors.push('horizontal page overflow');
        for (const node of document.querySelectorAll('.canvas-controls .toolbar-button')) {
          if (node.scrollWidth > node.clientWidth + 1) errors.push('control text clipped');
        }
        if (window.innerWidth >= 768) {
          for (const handle of document.querySelectorAll('.resize-handle')) {
            if (handle.getBoundingClientRect().width < 6) errors.push('resize handle has no pointer target');
          }
        }
        return errors;
      }), { message: `${slug} ${width}×${height}` }).toEqual([]);
      if (width < 768) {
        const before = await page.locator('#device-canvas').boundingBox();
        await page.getByRole('button', { name: 'Metrics', exact: true }).click();
        const after = await page.locator('#device-canvas').boundingBox();
        expect(after!.height).toBeCloseTo(before!.height, 0);
        await expect(page.locator('.metrics-content')).toBeVisible();
      }
    }
  }
});
