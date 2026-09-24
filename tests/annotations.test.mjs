import test from 'node:test';
import assert from 'node:assert/strict';
import { diagramAnnotations, visibleDiagramRulers } from '../app/components/diagramAnnotations.ts';
import { layoutMeasurementRulers } from '../app/components/measurementLayout.ts';
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


test('shared annotation layout clears bodies and adjacent badges at every zoom', () => {
  for (const skin of Object.values(skins)) {
    const width = skin.screen.width / 3, height = skin.screen.height / 3;
    const { rulers, body } = diagramAnnotations(width, height, 260 / width, skin,
      { top: 24, bottom: 48, left: 0, right: 0 },
      { topLeft: 12, topRight: 12, bottomLeft: 24, bottomRight: 24 },
      { xDp: width / 2 - 8, yDp: 0, widthDp: 16, heightDp: 24 });
    const positioned = visibleDiagramRulers(rulers, { insets: true, cutout: true, corners: true }).map(r => ({ ...r,
      start: { x: r.guides[0][0], y: r.guides[0][1] },
      end: { x: r.guides[1][0], y: r.guides[1][1] },
      side: r.y1 === r.y2 ? (r.y1 < 0 ? 'top' : 'bottom') : (r.x1 < 0 ? 'left' : 'right'),
    }));
    for (const scale of [.5, 1, 2, 4]) for (const compact of [false, true]) {
      const labels = layoutMeasurementRulers({ rulers: positioned, body, scale, compact, format: v => v.toFixed(2), units: 'dp', screen: 'Test' });
      const boxes = labels.map(r => ({ left: r.x - r.width / 2, right: r.x + r.width / 2, top: r.y - r.height / 2, bottom: r.y + r.height / 2 }));
      const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      for (const [index, box] of boxes.entries()) {
        assert.ok(!overlaps(box, body), labels[index].name);
        assert.ok(!boxes.slice(index + 1).some(other => overlaps(box, other)), labels[index].name);
      }
    }
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

test('compact rulers retain distinct geometry and restore cutout height when insets are hidden', async () => {
  const { rulers } = diagramAnnotations(384, 832, 1, undefined,
    { top: 34.13, bottom: 48, left: 0, right: 0 },
    { topLeft: 14.93, topRight: 14.93, bottomLeft: 14.93, bottomRight: 14.93 },
    { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13 });
  const layers = { insets: true, cutout: true, corners: true };
  const compact = visibleDiagramRulers(rulers, layers);
  assert.equal(compact.length, 9);
  assert.equal(compact.filter(r => r.kind === 'radius').length, 1);
  assert.ok(compact.some(r => r.name === 'Cutout left distance'));
  assert.ok(compact.some(r => r.name === 'Cutout right distance'));
  assert.ok(compact.some(r => r.name === 'Cutout bottom distance'));
  assert.ok(!compact.some(r => r.name === 'Cutout height'));
  assert.ok(visibleDiagramRulers(rulers, { ...layers, insets: false }).some(r => r.name === 'Cutout size' && r.secondaryValue === 34.13));
  // An equal length at a different vertical position is not the same interval.
  const shifted = rulers.map(r => r.name === 'Cutout height' ? { ...r, y1: r.y1 + 5, y2: r.y2 + 5 } : r);
  assert.ok(visibleDiagramRulers(shifted, layers).some(r => r.name === 'Cutout size' && r.secondaryValue === 34.13));
  const asymmetric = rulers.map(r => r.name === 'Bottom right radius' ? { ...r, value: 20 } : r);
  assert.equal(visibleDiagramRulers(asymmetric, layers).filter(r => r.kind === 'radius').length, 2);
});


test('equal symmetric measurements collapse once; unequal source lengths all remain', () => {
  const make = (safe, cutout) => visibleDiagramRulers(diagramAnnotations(400, 800, 1, undefined, safe,
    { topLeft: 10, topRight: 10, bottomLeft: 20, bottomRight: 20 }, cutout).rulers,
    { insets: true, cutout: true, corners: true });
  const equal = make({ top: 24, bottom: 24, left: 8, right: 8 }, { xDp: 190, yDp: 390, widthDp: 20, heightDp: 20 });
  for (const group of ['inset-vertical', 'inset-horizontal', 'cutout-horizontal-offset', 'cutout-vertical-offset']) {
    const values = equal.filter(r => r.symmetry === group);
    assert.equal(values.length, 1, group);
    assert.equal(values[0].equivalentNames.length, 2, group);
  }
  assert.equal(equal.filter(r => r.symmetry === 'corners').length, 2);
  const unequal = make({ top: 24, bottom: 48, left: 8, right: 16 }, { xDp: 190.001, yDp: 380, widthDp: 20, heightDp: 20 });
  for (const group of ['inset-vertical', 'inset-horizontal', 'cutout-horizontal-offset', 'cutout-vertical-offset']) {
    assert.equal(unequal.filter(r => r.symmetry === group).length, 2, group);
  }
});
