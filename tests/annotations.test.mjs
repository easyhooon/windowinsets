import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { diagramAnnotations, placeRulerLabels } from '../app/components/diagramAnnotations.ts';
import { skins } from '../app/data/skins.ts';
test('rulers clear every official skin body rather than relying on bezel constants', () => {
  for (const skin of Object.values(skins)) {
    const w = skin.screen.width / 3, h = skin.screen.height / 3;
    const layout = diagramAnnotations(w, h, 260 / w, skin,
      { top: 24, right: 16, bottom: 48, left: 8 },
      { topLeft: 9.9, topRight: 20, bottomLeft: 8, bottomRight: 32 },
      { xDp: w / 2 - 10, yDp: 0, widthDp: 20, heightDp: 30 });
    for (const ruler of layout.rulers) {
      const { body, bounds } = layout;
      assert.ok(ruler.x1 === ruler.x2
        ? ruler.x1 < body.left || ruler.x1 > body.right
        : ruler.y1 < body.top || ruler.y1 > body.bottom, ruler.name);
      assert.ok(ruler.labelX > bounds.left && ruler.labelX < bounds.right);
      assert.ok(ruler.labelY > bounds.top && ruler.labelY < bounds.bottom);
      const length = Math.hypot(ruler.x2 - ruler.x1, ruler.y2 - ruler.y1);
      assert.ok(Math.abs(length - ruler.value * 260 / w) < 1e-8, ruler.name);
    }
  }
});

test('a bottom cutout gets bottom rulers, without guides crossing the safe area', () => {
  const layout = diagramAnnotations(361.14, 399.24, 260 / 361.14, skins['galaxy-z-flip7/cover'],
    { top: 0, right: 0, bottom: 83.81, left: 0 }, null,
    { xDp: 163.05, yDp: 315.43, widthDp: 198.09, heightDp: 83.81 });
  const width = layout.rulers.find(ruler => ruler.name === 'Cutout width');
  assert.ok(width.y1 > layout.body.bottom);
  assert.ok(width.guides.every(guide => Math.abs(guide[1] - 399.24 * 260 / 361.14) < 1e-8));
});


test('small folded textures pack displaced badges without clipping or re-testing a touching edge', { timeout: 1000 }, () => {
  const width = 360, height = 840, scale = 1200 / width;
  const { rulers } = diagramAnnotations(width, height, scale, skins['galaxy-z-flip8/main'],
    { top: 36, right: 0, bottom: 48, left: 0 },
    { topLeft: 22, topRight: 22, bottomLeft: 22, bottomRight: 22 },
    { xDp: 169.67, yDp: 0, widthDp: 20.67, heightDp: 36 });
  const pad = width * .6 * scale;
  const bounds = { left: -pad + scale, top: -pad + scale, right: width * scale + pad - scale, bottom: height * scale + pad - scale };
  const format = value => String(Number(value.toFixed(2)));
  for (const fontScale of [8.3, 10.14, 13.24, 19.1]) {
    const labels = placeRulerLabels(rulers, fontScale, format, bounds);
    for (const label of labels) {
      assert.ok(Number.isFinite(label.labelX) && Number.isFinite(label.labelY));
      assert.ok(label.labelY - 9 * fontScale >= bounds.top - 1);
      assert.ok(label.labelY + 9 * fontScale <= bounds.bottom + 1);
    }
  }
});

test('zoom-compensated badges clear the skin body', () => {
  const { rulers, body } = diagramAnnotations(475.43, 751.24, 260 / 475.43, skins['galaxy-z-fold8/cover'],
    { top: 41.9, right: 0, bottom: 48, left: 0 },
    { topLeft: 9.9, topRight: 9.9, bottomRight: 9.9, bottomLeft: 9.9 }, undefined);
  for (const scale of [1, 2, 3]) for (const label of placeRulerLabels(rulers, scale, String, undefined, body)) {
    const halfWidth = ((label.kind === 'radius' ? 'R ' : '') + String(label.value)).length * 3.6 * scale + 4 * scale;
    const halfHeight = 9 * scale;
    assert.ok(label.labelX + halfWidth < body.left || label.labelX - halfWidth > body.right ||
      label.labelY + halfHeight < body.top || label.labelY - halfHeight > body.bottom, label.name);
  }
});

test('cover rulers also clear the larger folded chassis', () => {
  const chassis = { left: -60, top: -90, right: 535, bottom: 840 };
  const { rulers, body } = diagramAnnotations(475, 751, 1, skins['galaxy-z-fold8/cover'],
    { top: 42, right: 0, bottom: 48, left: 0 },
    { topLeft: 10, topRight: 10, bottomRight: 10, bottomLeft: 10 }, undefined, 0, chassis);
  assert.ok(body.top <= chassis.top && body.bottom >= chassis.bottom);
  for (const ruler of rulers) assert.ok(ruler.x1 === ruler.x2
    ? ruler.x1 < chassis.left || ruler.x1 > chassis.right
    : ruler.y1 < chassis.top || ruler.y1 > chassis.bottom, ruler.name);
});
