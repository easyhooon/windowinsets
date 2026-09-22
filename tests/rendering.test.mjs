import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { bendPoint, createChassis, rigidPanelPoint } from '../app/components/foldGeometry.ts';
import { skins } from '../app/data/skins.ts';
import { isInCoverage } from '../app/data/coverage.ts';
import { getRtlAvailability, rtlCatalog } from '../app/data/rtlAvailability.ts';
import { galaxyZFold2 } from '../app/data/devices/galaxy-z-fold2/index.ts';
import { galaxyZFold8 } from '../app/data/devices/galaxy-z-fold8/index.ts';

test('folds remain finite and symmetric at closed, intermediate, and flat poses on both axes', () => {
  for (const vertical of [true, false]) for (const angle of [0, 1, 45, 90, 135, 179, 180]) {
    const p = bendPoint(vertical ? 1 : 0, vertical ? 0 : 1, 0, angle, vertical, .14);
    const q = bendPoint(vertical ? -1 : 0, vertical ? 0 : -1, 0, angle, vertical, .14);
    assert.ok([...p, ...q].every(Number.isFinite));
    assert.ok(Math.abs(p[vertical ? 0 : 1] + q[vertical ? 0 : 1]) < 1e-10);
    assert.equal(p[2], q[2]);
    const behind = bendPoint(vertical ? 1 : 0, vertical ? 0 : 1, -.065, angle, vertical, .14);
    assert.ok(Math.abs(Math.hypot(...p.map((v,i) => v - behind[i])) - .065) < 1e-10);
  }
  assert.deepEqual(bendPoint(1, 2, -.065, 180, true, .14), [1, 2, -.065]);
});

test('chassis is a closed solid with two triangles per shared edge', () => {
  const geometry = createChassis(4.2, 3.1, .15, .065);
  const indices = geometry.index.array;
  const edges = new Map();
  for (let i = 0; i < indices.length; i += 3) for (let j = 0; j < 3; j++) {
    const a = indices[i+j], b = indices[i+(j+1)%3];
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    edges.set(key, (edges.get(key) ?? 0) + 1);
  }
  assert.ok([...edges.values()].every(count => count === 2));
  geometry.dispose();
});

test('cover artwork and annotation margins stay on the rigid rear plane throughout folding', () => {
  const hinge = .147, rearZ = -.069;
  for (const vertical of [true, false]) for (const angle of [0, 45, 90, 180]) {
    const phi = (180 - angle) * Math.PI / 360;
    const surface = bendPoint(vertical ? hinge : 0, vertical ? 0 : hinge, 0, angle, vertical, hinge);
    for (const u of [-.1, .025, hinge, 1, 2]) {
      const point = rigidPanelPoint(vertical ? u : 0, vertical ? 0 : u, rearZ, angle, vertical, hinge);
      const normalDistance = -(point[vertical ? 0 : 1] - surface[vertical ? 0 : 1]) * Math.sin(phi)
        + (point[2] - surface[2]) * Math.cos(phi);
      assert.ok(Math.abs(normalDistance - rearZ) < 1e-9,
        `Cover vertex ${u} at ${angle}° must remain outside the chassis rear plane (${normalDistance})`);
    }
  }
});

test('official skin rectangles match original layout files and preserve the cover/main distinction', () => {
  for (const [key, skin] of Object.entries(skins)) {
    assert.ok(existsSync(`public${skin.image}`));
    if (skin.foreground) assert.ok(existsSync(`public${skin.foreground}`));
    const png = readFileSync(`public${skin.image}`);
    assert.deepEqual([skin.width, skin.height], [png.readUInt32BE(16), png.readUInt32BE(20)]);
    assert.ok(skin.screen.x >= 0 && skin.screen.y >= 0);
    assert.ok(skin.screen.x + skin.screen.width <= skin.width);
    assert.ok(skin.screen.y + skin.screen.height <= skin.height);
    const layout = readFileSync(`public/skins/${key}/layout`, 'utf8');
    const size = layout.match(/display\s*{\s*width\s+(\d+)\s*height\s+(\d+)/);
    const offset = layout.match(/part2\s*{\s*name\s+device\s*x\s+(\d+)\s*y\s+(\d+)/);
    assert.deepEqual([skin.screen.width, skin.screen.height], size.slice(1).map(Number));
    assert.deepEqual([skin.screen.x, skin.screen.y], offset.slice(1).map(Number));
  }
  const raw = JSON.parse(readFileSync('measurements/galaxy-z-fold8/main-threeButton.json','utf8'));
  assert.deepEqual([raw.display.widthPx, raw.display.heightPx], [skins['galaxy-z-fold8/cover'].screen.width, skins['galaxy-z-fold8/cover'].screen.height]);
  assert.notEqual(skins['galaxy-z-fold8/main'].screen.width, raw.display.widthPx);
});

test('preview catalogue has unique models and valid screen assets, excluding TriFold', () => {
  const catalog = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  assert.equal(new Set(catalog.map(device => device.slug)).size, catalog.length);
  assert.ok(catalog.some(device => device.formFactor === 'tablet'));
  for (const device of catalog) {
    assert.ok(!device.slug.includes('trifold'));
    assert.match(device.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(['bar', 'tablet', 'foldable-book', 'foldable-flip'].includes(device.formFactor));
    assert.ok(device.screens.includes('main'));
    assert.equal(new Set(device.screens).size, device.screens.length);
    for (const screen of device.screens) {
      assert.ok(['main', 'cover'].includes(screen));
      assert.ok(skins[`${device.slug}/${screen}`]);
    }
  }
});

test('2020 coverage keeps boundary models and archives older skins without publishing them', () => {
  const catalog = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  const supported = catalog.filter(device => isInCoverage({ ...device, releaseYear: null }));
  assert.equal(supported.length, 70);
  for (const slug of ['galaxy-fold', 'galaxy-tab-s4-10-5', 'galaxy-tab-s6']) {
    assert.ok(catalog.some(device => device.slug === slug));
    assert.ok(!supported.some(device => device.slug === slug));
  }
  for (const slug of ['galaxy-tab-s6-lite', 'galaxy-z-flip', 'galaxy-s20', 'galaxy-z-fold2']) {
    assert.ok(supported.some(device => device.slug === slug));
  }
  assert.equal(isInCoverage({ slug: 'measured-older-device', releaseYear: 2019 }), false);
  assert.equal(isInCoverage({ slug: 'measured-boundary-device', releaseYear: 2020 }), true);
});

test('RTL comparisons never turn an incomplete inventory into non-support claims', () => {
  const skins = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  const snapshot = rtlCatalog;
  assert.equal(new Set(snapshot.listedSlugs).size, snapshot.listedSlugs.length);
  for (const slug of snapshot.listedSlugs) {
    assert.ok(skins.some(device => device.slug === slug));
    assert.equal(getRtlAvailability(slug).status, 'listed');
  }
  const comparison = skins.map(device => getRtlAvailability(device.slug));
  assert.equal(comparison.filter(result => result.status === 'listed').length, 4);
  assert.ok(comparison.every(result => result.status !== 'not-listed'));
  // Existing captures do not imply that a model can still be reserved today.
  assert.equal(getRtlAvailability('galaxy-s25-plus').status, 'unknown');
  const complete = { ...snapshot, scope: 'reservation-catalog', complete: true };
  assert.equal(getRtlAvailability('galaxy-s20', complete).status, 'not-listed');
  assert.match(getRtlAvailability('galaxy-s20', complete).previewNotice, /Not listed/);
  assert.equal(getRtlAvailability('galaxy-z-fold8', complete).label, 'Reservable on RTL');
});

test('Fold8 recapture keeps cover and inner evidence distinct in both navigation modes', () => {
  const captures = [
    ['cover', 'gesture'],
    ['cover', 'threeButton'],
    ['main', 'gesture'],
    ['main', 'threeButton'],
  ];
  for (const [screenId, navMode] of captures) {
    const raw = JSON.parse(readFileSync(`measurements/galaxy-z-fold8/recapture-2026-09-22/${screenId}-${navMode}.json`, 'utf8'));
    const screen = galaxyZFold8.screens.find(candidate => candidate.id === screenId);
    assert.equal(raw.screen, screenId);
    assert.equal(raw.navigation.mode, navMode);
    assert.deepEqual(screen.resolutionPx, raw.display.currentWindowPx);
    assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
    assert.deepEqual(screen.insets[navMode].systemBars, raw.insets.systemBars.dp);
    assert.deepEqual(screen.insets[navMode].displayCutout, raw.insets.displayCutout.dp);
  }
  const cover = galaxyZFold8.screens.find(screen => screen.id === 'cover');
  const main = galaxyZFold8.screens.find(screen => screen.id === 'main');
  assert.deepEqual(cover.resolutionPx, { width: 1248, height: 1972 });
  assert.deepEqual(main.resolutionPx, { width: 2448, height: 1848 });
  assert.equal(main.insets.gesture.systemBars.bottom, 14.86);
  assert.equal(main.insets.threeButton.systemBars.bottom, 48);
});

test('Fold2 uses captured full-window dimensions rather than Android 13 app metrics', () => {
  const raw = JSON.parse(readFileSync('measurements/galaxy-z-fold2/main-threeButton.json', 'utf8'));
  const screen = galaxyZFold2.screens.find(screen => screen.id === 'main');
  assert.deepEqual(screen.resolutionPx, raw.display.currentWindowPx);
  assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
  assert.notEqual(screen.resolutionPx.height, raw.display.appMetricsPx.height);
  assert.equal(raw.display.appMetricsPx.height + raw.insets.systemBars.px.top + raw.insets.systemBars.px.bottom, screen.resolutionPx.height);
  assert.equal(screen.insets.threeButton.condition.oneUi, '5.1.1');
  assert.deepEqual(screen.insets.threeButton.systemBars, raw.insets.systemBars.dp);
  const gestureRaw = JSON.parse(readFileSync('measurements/galaxy-z-fold2/main-gesture.json', 'utf8'));
  assert.equal(gestureRaw.navigation.mode, 'gesture');
  assert.equal(gestureRaw.navigation.modeSource, 'configAndSideGestures');
  assert.deepEqual(screen.insets.gesture.systemBars, gestureRaw.insets.systemBars.dp);
  assert.equal(screen.insets.gesture.systemBars.bottom, 48);
  assert.match(screen.insets.gesture.condition.note, /taskbar/);
  const coverRaw = JSON.parse(readFileSync('measurements/galaxy-z-fold2/cover-threeButton.json', 'utf8'));
  const cover = galaxyZFold2.screens.find(screen => screen.id === 'cover');
  assert.deepEqual(cover.resolutionPx, coverRaw.display.currentWindowPx);
  assert.deepEqual(cover.logicalSizeDp, coverRaw.display.maximumWindowDp);
  assert.deepEqual(cover.insets.threeButton.systemBars, coverRaw.insets.systemBars.dp);
  assert.equal(cover.cornerRadiiDp, null);
  const coverGesture = JSON.parse(readFileSync('measurements/galaxy-z-fold2/cover-gesture.json', 'utf8'));
  assert.equal(coverGesture.navigation.mode, 'gesture');
  assert.deepEqual(cover.insets.gesture.systemBars, coverGesture.insets.systemBars.dp);
  assert.deepEqual(cover.resolutionPx, coverGesture.display.currentWindowPx);
  assert.equal(cover.insets.gesture.systemBars.bottom, 15);
  assert.deepEqual(coverRaw.hinge.foldingFeatures, []);
  assert.notEqual(cover.resolutionPx.width, skins['galaxy-z-fold2/cover'].screen.width);
  assert.match(cover.insets.threeButton.condition.note, /816×2260/);
});

test('Flip8 legacy cover label does not make its flat inner capture a cover measurement', () => {
  const raw = JSON.parse(readFileSync('measurements/galaxy-z-flip8/cover-threeButton.json', 'utf8'));
  assert.equal(raw.screen, 'cover');
  assert.equal(raw.hinge.angleDegrees, 180);
  assert.equal(raw.hinge.foldingFeatures[0].state, 'FLAT');
  assert.deepEqual([raw.display.widthPx, raw.display.heightPx], [skins['galaxy-z-flip8/main'].screen.width, skins['galaxy-z-flip8/main'].screen.height]);
  assert.notEqual(raw.display.widthPx, skins['galaxy-z-flip8/cover'].screen.width);
});
