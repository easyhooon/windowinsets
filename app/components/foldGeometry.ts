import * as THREE from "three";

/** Transform artwork attached to the positive (right/upper) rigid panel. */
export function rigidPanelPoint(x: number, y: number, z: number, angle: number, vertical: boolean, hinge: number) {
  const tangent = bendPoint(vertical ? hinge : x, vertical ? y : hinge, z, angle, vertical, hinge);
  const offset = (vertical ? x : y) - hinge;
  const phi = (180 - angle) * Math.PI / 360;
  // Extend the panel's tangent through its annotation margins. Applying the
  // cylindrical bend there would pull vertices inside the opaque chassis.
  return vertical
    ? [tangent[0] + offset * Math.cos(phi), y, tangent[2] + offset * Math.sin(phi)] as const
    : [x, tangent[1] + offset * Math.cos(phi), tangent[2] + offset * Math.sin(phi)] as const;
}

/** Stylized chassis, not a measurement of the device's physical thickness. */
export function createChassis(width: number, height: number, radius: number, thickness: number) {
  const plane = new THREE.PlaneGeometry(width, height, 64, 64);
  const p = plane.attributes.position;
  const positions: number[] = [];
  const r = Math.min(radius, width / 2, height / 2);
  for (const z of [-0.008, -thickness]) {
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      const cornerY = Math.max(0, Math.abs(y) - (height / 2 - r));
      const halfWidth = width / 2 - r + Math.sqrt(Math.max(0, r * r - cornerY * cornerY));
      positions.push(p.getX(i) * halfWidth / (width / 2), y, z);
    }
  }
  const indices = Array.from(plane.index!.array);
  const front = [...indices];
  for (let i = 0; i < front.length; i += 3) {
    indices.push(front[i + 2] + p.count, front[i + 1] + p.count, front[i] + p.count);
  }
  // Clockwise perimeter: join both faces to make a watertight solid.
  const perimeter: number[] = [];
  for (let x = 0; x <= 64; x++) perimeter.push(x);
  for (let y = 1; y <= 64; y++) perimeter.push(y * 65 + 64);
  for (let x = 63; x >= 0; x--) perimeter.push(64 * 65 + x);
  for (let y = 63; y > 0; y--) perimeter.push(y * 65);
  for (let i = 0; i < perimeter.length; i++) {
    const a = perimeter[i], b = perimeter[(i + 1) % perimeter.length];
    indices.push(a, a + p.count, b, b, a + p.count, b + p.count);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  plane.dispose();
  return geometry;
}

/** Cylindrical hinge with rigid tangent panels. Offset follows the analytical
 * normal so the closed chassis stays outside the inward-facing display. */
export function bendPoint(x: number, y: number, z: number, angle: number, vertical: boolean, hinge: number) {
  const bend = (180 - angle) * Math.PI / 180;
  if (bend < 0.00001) return [x, y, z] as const;
  const u = vertical ? x : y;
  const sign = Math.sign(u);
  const distance = Math.abs(u);
  const radius = 2 * hinge / bend;
  const phi = Math.min(distance, hinge) / radius;
  const beyond = Math.max(0, distance - hinge);
  const along = sign * (radius * Math.sin(phi) + beyond * Math.cos(phi) - z * Math.sin(phi));
  const depth = radius * (1 - Math.cos(phi)) + beyond * Math.sin(phi) + z * Math.cos(phi);
  return vertical ? [along, y, depth] as const : [x, along, depth] as const;
}
