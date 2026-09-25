import { chromium, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

// Run against a stable production build served by serve-test-build.mjs.
const baseURL = process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4175';
const output = resolve('docs/media');
const ffmpeg = process.env.FFMPEG_BIN ?? 'ffmpeg';
execFileSync(ffmpeg, ['-version'], { stdio: 'ignore' });
const temporary = await mkdtemp(join(tmpdir(), 'windowinsets-gifs-'));
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1,
    colorScheme: 'light', reducedMotion: 'reduce', locale: 'en-US' });
  const devices = process.argv.slice(2);
  for (const slug of devices.length ? devices : ['galaxy-z-fold8', 'galaxy-z-flip8', 'galaxy-z-trifold']) {
    const triFold = slug === 'galaxy-z-trifold';
    const frames = join(temporary, slug);
    await mkdir(frames);
    await page.goto(`${baseURL}/${slug}`);
    await page.locator('canvas[data-engine]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000); // Official artwork textures load asynchronously.
    for (let angle = 0; angle <= 180; angle += 3) {
      await page.getByRole('button', { name: /^Hinge:/ }).click();
      const slider = page.getByRole('slider', { name: triFold ? 'Fold sequence' : 'Hinge angle in degrees' });
      await slider.evaluate((input, value) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, String(value));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, angle);
      await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle', angle.toFixed(2));
      if (triFold) {
        await expect(page.locator('[data-left-angle]')).toHaveAttribute('data-left-angle', Math.max(0, angle * 2 - 180).toFixed(2));
        await expect(page.locator('[data-right-angle]')).toHaveAttribute('data-right-angle', Math.min(180, angle * 2).toFixed(2));
      }
      await page.getByRole('button', { name: /^Hinge:/ }).click();
      await page.waitForTimeout(60);
      await page.locator('.canvas-panel').screenshot({ path: join(frames, `angle-${angle}.png`) });
    }
    const timeline = [...Array(12).fill(0), ...Array.from({ length: 60 }, (_, i) => (i + 1) * 3),
      ...Array(12).fill(180), ...Array.from({ length: 59 }, (_, i) => 177 - i * 3)];
    for (const [index, angle] of timeline.entries()) {
      await copyFile(join(frames, `angle-${angle}.png`), join(frames, `frame-${String(index).padStart(3, '0')}.png`));
    }
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-framerate', '15', '-i', join(frames, 'frame-%03d.png'),
      '-filter_complex', '[0:v]scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3',
      '-loop', '0', join(output, `${slug}-hinge.gif`)], { stdio: 'inherit' });
    console.log(`${slug}: ${timeline.length} frames, 640px, 15 fps`);
  }
} finally {
  await browser.close();
  await rm(temporary, { recursive: true, force: true });
}
