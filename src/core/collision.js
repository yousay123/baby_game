/** Simple circle-vs-AABB blocking for walkable rooms */

export function makeBoxCollider(x, z, halfX, halfZ) {
  return {
    minX: x - halfX,
    maxX: x + halfX,
    minZ: z - halfZ,
    maxZ: z + halfZ,
  };
}

export function hitsCollider(x, z, radius, box) {
  const cx = Math.max(box.minX, Math.min(x, box.maxX));
  const cz = Math.max(box.minZ, Math.min(z, box.maxZ));
  const dx = x - cx;
  const dz = z - cz;
  return dx * dx + dz * dz < radius * radius;
}

export function hitsAny(x, z, radius, colliders) {
  for (const b of colliders) {
    if (hitsCollider(x, z, radius, b)) return true;
  }
  return false;
}

/** Axis-separated slide so you can skim along shelves */
export function tryMove(x, z, dx, dz, radius, colliders, halfW, halfD) {
  const clamp = (v, h) => Math.max(-h, Math.min(h, v));
  let nx = clamp(x + dx, halfW);
  let nz = clamp(z + dz, halfD);
  if (!hitsAny(nx, nz, radius, colliders)) return { x: nx, z: nz };

  nx = clamp(x + dx, halfW);
  if (!hitsAny(nx, z, radius, colliders)) return { x: nx, z };

  nz = clamp(z + dz, halfD);
  if (!hitsAny(x, nz, radius, colliders)) return { x, z: nz };

  return { x, z };
}
