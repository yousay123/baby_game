import * as THREE from "three";
import { COLORS } from "../core/constants.js";

export function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.72,
    metalness: opts.metalness ?? 0.05,
    ...opts,
  });
}

export function box(w, h, d, color, opts) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function cyl(rTop, rBot, h, color, opts) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBot, h, opts?.segments || 16),
    mat(color, opts)
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function sphere(r, color, opts) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 16, 12),
    mat(color, opts)
  );
  mesh.castShadow = true;
  return mesh;
}

/** Simple room: floor + 3 walls (open front for camera) */
export function buildRoom({
  width = 12,
  depth = 10,
  height = 4,
  floorColor = COLORS.floor,
  wallColor = COLORS.wall,
  accent = 0xffe0ea,
  withCeiling = true,
  style = "home",
} = {}) {
  const root = new THREE.Group();
  root.name = "room";

  const floor = box(width, 0.12, depth, floorColor, { roughness: 0.85 });
  floor.position.y = 0;
  floor.name = "floor";
  floor.userData.walkable = true;
  root.add(floor);

  // wood plank overlay for home
  if (style === "home" || style === "dining") {
    const plankW = 0.6;
    const n = Math.ceil(width / plankW);
    for (let i = 0; i < n; i++) {
      const shade = i % 2 === 0 ? floorColor : darken(floorColor, 0.08);
      const p = box(plankW - 0.03, 0.02, depth - 0.15, shade, { roughness: 0.9 });
      p.position.set(-width / 2 + plankW / 2 + i * plankW, 0.07, 0);
      root.add(p);
    }
  }
  if (style === "market") {
    // tile grid hint
    for (let i = 0; i < 6; i++) {
      const line = box(width, 0.01, 0.02, 0xc8c0b8);
      line.position.set(0, 0.08, -depth / 2 + 1 + i * 1.5);
      root.add(line);
    }
  }
  if (style === "kitchen") {
    // checker tiles
    const tile = 0.5;
    for (let xi = 0; xi < width / tile; xi++) {
      for (let zi = 0; zi < depth / tile; zi++) {
        if ((xi + zi) % 2 === 0) continue;
        const t = box(tile - 0.02, 0.015, tile - 0.02, 0xe8eef4);
        t.position.set(-width / 2 + tile / 2 + xi * tile, 0.08, -depth / 2 + tile / 2 + zi * tile);
        root.add(t);
      }
    }
  }

  const back = box(width, height, 0.16, wallColor);
  back.position.set(0, height / 2, -depth / 2);
  root.add(back);

  // wall accent stripe
  const stripe = box(width - 0.3, 0.5, 0.04, accent);
  stripe.position.set(0, 1.0, -depth / 2 + 0.1);
  root.add(stripe);

  const left = box(0.16, height, depth, wallColor);
  left.position.set(-width / 2, height / 2, 0);
  root.add(left);

  const right = box(0.16, height, depth, wallColor);
  right.position.set(width / 2, height / 2, 0);
  root.add(right);

  const base = box(width, 0.22, 0.1, 0xd8c0b0);
  base.position.set(0, 0.2, -depth / 2 + 0.12);
  root.add(base);

  if (withCeiling) {
    const ceil = box(width, 0.1, depth, 0xfff8f2, { roughness: 0.95 });
    ceil.position.y = height;
    root.add(ceil);
  }

  // back wall frames
  if (style === "home" || style === "dining") {
    [-2.4, 0, 2.4].forEach((x, i) => {
      const frame = box(0.75, 0.6, 0.05, 0xc9a06a);
      frame.position.set(x, 2.4, -depth / 2 + 0.12);
      const pic = box(0.58, 0.42, 0.02, [0xffb0c8, 0x7ec8ff, 0xffe08a][i]);
      pic.position.set(x, 2.4, -depth / 2 + 0.16);
      root.add(frame, pic);
    });
  }

  return root;
}

function darken(hex, amount) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1 - amount);
  return c.getHex();
}

export function addWarmLights(scene, { intensity = 1 } = {}) {
  const hemi = new THREE.HemisphereLight(0xfff0f8, 0x806050, 0.55 * intensity);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffe8d8, 1.05 * intensity);
  dir.position.set(4, 10, 6);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.near = 1;
  dir.shadow.camera.far = 30;
  dir.shadow.camera.left = -10;
  dir.shadow.camera.right = 10;
  dir.shadow.camera.top = 10;
  dir.shadow.camera.bottom = -10;
  scene.add(dir);
  const fill = new THREE.PointLight(0xffb0c8, 0.35 * intensity, 20);
  fill.position.set(-3, 3, 2);
  scene.add(fill);
  return { hemi, dir, fill };
}

export function makeLabelSprite(text, { color = "#fff", bg = "rgba(40,16,28,0.75)" } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg;
  roundRect(ctx, 8, 8, 240, 48, 16);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = "bold 28px Microsoft YaHei, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 34);
  const tex = new THREE.CanvasTexture(canvas);
  const matSprite = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(matSprite);
  sprite.scale.set(1.6, 0.4, 1);
  sprite.position.y = 2.2;
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function makeInteractable(mesh, data) {
  mesh.userData.interactive = true;
  Object.assign(mesh.userData, data);
  mesh.traverse((c) => {
    if (c.isMesh) {
      c.userData.interactive = true;
      Object.assign(c.userData, data);
    }
  });
  return mesh;
}
