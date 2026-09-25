import { expect, test } from '@playwright/test';

test('S25 Ultra and Flip8 keep compact rulers visible around the overlaid legend on a short phone viewport', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 384, height: 720 });
  for (const slug of ['galaxy-s25-ultra', 'galaxy-z-flip8']) {
    await page.goto('/' + slug);
    const rulers = page.locator(slug.includes('flip') ? '.projected-rulers [role="button"]' : '[aria-label="Measurement rulers"] [role="button"]');
    await expect(rulers.first()).toBeVisible();
    const groups = await page.locator('[data-symmetry]').evaluateAll(nodes => nodes.map(node => ({ group: node.getAttribute('data-symmetry'), value: Number(node.getAttribute('data-value')) })));
    for (const [index, entry] of groups.entries()) {
      expect(groups.slice(index + 1).some(other => other.group === entry.group && Math.abs(other.value - entry.value) < 1e-8)).toBe(false);
    }
    await expect.poll(() => page.evaluate(() => {
      const viewport = document.querySelector('#device-canvas')!.getBoundingClientRect();
      const legend = document.querySelector('.region-legend')!.getBoundingClientRect();
      const badges = [...document.querySelectorAll('.projected-rulers [data-badge], [aria-label="Measurement rulers"] rect')];
      return badges.every(node => {
        const b = node.getBoundingClientRect();
        const overlapsLegend = b.left < legend.right && b.right > legend.left && b.top < legend.bottom && b.bottom > legend.top;
        return b.left >= viewport.left && b.right <= viewport.right && b.top >= viewport.top && b.bottom <= viewport.bottom && !overlapsLegend;
      });
    })).toBe(true);
    const text = await rulers.allTextContents();
    expect(text.filter(value => value.includes('R '))).toHaveLength(slug.includes('flip') ? 2 : 1);
    await expect(page).toHaveScreenshot(`${slug}-compact-short-mobile.png`);
    // A duplicate cutout-height ruler must reappear as part of the size when
    // Insets is hidden; the exact displayed pair remains copyable.
    await page.getByRole('button', { name: 'Insets', exact: true }).click();
    const cutout = page.getByRole('button', { name: /Cutout size:/ });
    await expect(cutout).toBeVisible();
    const shown = await cutout.locator('text').textContent();
    await cutout.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(shown);
  }
});
