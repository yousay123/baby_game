import * as THREE from "three";
import { COLORS } from "./constants.js";

const _texCache = new Map();

export function mat(color, opts = {}) {
  const { segments, segmentsY, capSegs, radSegs, ...matOpts } = opts;
  return new THREE.MeshStandardMaterial({
    color,
    roughness: matOpts.roughness ?? 0.72,
    metalness: matOpts.metalness ?? 0.05,
    ...matOpts,
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
    new THREE.SphereGeometry(r, opts?.segments || 24, opts?.segmentsY || 18),
    mat(color, { roughness: opts?.roughness ?? 0.58, ...opts })
  );
  mesh.castShadow = true;
  return mesh;
}

export function capsule(radius, length, color, opts = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, length, opts.capSegs || 6, opts.radSegs || 12),
    mat(color, { roughness: opts.roughness ?? 0.55, ...opts })
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function lathe(points, color, opts = {}) {
  const mesh = new THREE.Mesh(
    new THREE.LatheGeometry(points, opts.segments || 24),
    mat(color, { roughness: opts.roughness ?? 0.6, ...opts })
  );
  mesh.castShadow = true;
  return mesh;
}

/** Soft wallpaper / plaster canvas texture */
export function wallTexture(hex, style = "plaster") {
  const key = hex + style;
  if (_texCache.has(key)) return _texCache.get(key);
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#" + new THREE.Color(hex).getHexString();
  ctx.fillRect(0, 0, 256, 256);
  if (style === "plaster" || style === "home") {
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    // subtle stripe
    ctx.strokeStyle = "rgba(255,200,210,0.08)";
    for (let y = 0; y < 256; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  } else if (style === "tile" || style === "kitchen") {
    ctx.strokeStyle = "rgba(180,190,200,0.35)";
    for (let i = 0; i < 256; i += 32) {
      ctx.strokeRect(i, 0, 32, 256);
      ctx.strokeRect(0, i, 256, 32);
    }
  } else if (style === "market") {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(0, 0, 256, 40);
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  _texCache.set(key, tex);
  return tex;
}

export function floorTexture(hex, style = "wood") {
  const key = "f" + hex + style;
  if (_texCache.has(key)) return _texCache.get(key);
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  const base = "#" + new THREE.Color(hex).getHexString();
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  if (style === "wood" || style === "home" || style === "dining") {
    for (let x = 0; x < 256; x += 42) {
      ctx.fillStyle = x % 84 === 0 ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)";
      ctx.fillRect(x, 0, 40, 256);
      ctx.strokeStyle = "rgba(80,50,30,0.15)";
      ctx.strokeRect(x, 0, 40, 256);
    }
  } else if (style === "kitchen" || style === "tile") {
    for (let x = 0; x < 256; x += 32) {
      for (let y = 0; y < 256; y += 32) {
        if ((x / 32 + y / 32) % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect(x, y, 32, 32);
        }
        ctx.strokeStyle = "rgba(150,160,170,0.4)";
        ctx.strokeRect(x, y, 32, 32);
      }
    }
  } else {
    for (let y = 0; y < 256; y += 48) {
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, y, 256, 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  _texCache.set(key, tex);
  return tex;
}

function texturedBox(w, h, d, color, tex, opts = {}) {
  const m = mat(color, {
    map: tex,
    roughness: opts.roughness ?? 0.82,
    metalness: 0.02,
    ...opts,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * First-person enclosed room with full walls + ceiling.
 * doors: [{ wall:'left'|'right'|'back'|'front', along:0, to:'kitchen', label:'厨房', color }]
 */
export function buildRoom({
  width = 12,
  depth = 10,
  height = 2.85,
  floorColor = COLORS.floor,
  wallColor = COLORS.wall,
  accent = 0xffe0ea,
  style = "home",
  doors = [],
} = {}) {
  const root = new THREE.Group();
  root.name = "room";
  root.userData = { width, depth, height };

  const fTex = floorTexture(floorColor, style);
  const floor = texturedBox(width, 0.1, depth, floorColor, fTex, { roughness: 0.9 });
  floor.position.y = 0;
  floor.name = "floor";
  floor.userData.walkable = true;
  root.add(floor);

  const wTex = wallTexture(wallColor, style);
  const ceilTex = wallTexture(0xfff8f2, "plaster");
  const ceil = texturedBox(width, 0.08, depth, 0xfff8f2, ceilTex, { roughness: 0.95 });
  ceil.position.y = height;
  root.add(ceil);

  // Build each wall with optional door cutouts
  addWallWithDoors(root, {
    wall: "back",
    width,
    depth,
    height,
    wallColor,
    wTex,
    doors: doors.filter((d) => d.wall === "back"),
  });
  addWallWithDoors(root, {
    wall: "front",
    width,
    depth,
    height,
    wallColor,
    wTex,
    doors: doors.filter((d) => d.wall === "front"),
  });
  addWallWithDoors(root, {
    wall: "left",
    width,
    depth,
    height,
    wallColor,
    wTex,
    doors: doors.filter((d) => d.wall === "left"),
  });
  addWallWithDoors(root, {
    wall: "right",
    width,
    depth,
    height,
    wallColor,
    wTex,
    doors: doors.filter((d) => d.wall === "right"),
  });

  // Accent baseboard all around
  const trimH = 0.14;
  [
    [0, trimH / 2, -depth / 2 + 0.08, width, trimH, 0.08],
    [0, trimH / 2, depth / 2 - 0.08, width, trimH, 0.08],
    [-width / 2 + 0.08, trimH / 2, 0, 0.08, trimH, depth],
    [width / 2 - 0.08, trimH / 2, 0, 0.08, trimH, depth],
  ].forEach(([x, y, z, bw, bh, bd]) => {
    const t = box(bw, bh, bd, accent);
    t.position.set(x, y, z);
    root.add(t);
  });

  addRoomDressing(root, { width, depth, height, style, accent });

  return root;
}

function addWallWithDoors(root, { wall, width, depth, height, wallColor, wTex, doors }) {
  const thick = 0.18;
  const doorW = 1.15;
  const doorH = 2.15;
  const sorted = [...doors].sort((a, b) => (a.along || 0) - (b.along || 0));

  const isXWall = wall === "left" || wall === "right";
  const span = isXWall ? depth : width;
  const xPos = wall === "left" ? -width / 2 : wall === "right" ? width / 2 : 0;
  const zPos = wall === "back" ? -depth / 2 : wall === "front" ? depth / 2 : 0;

  // segments along the wall axis
  let cursor = -span / 2;
  const segments = [];
  sorted.forEach((d) => {
    const center = d.along || 0;
    const left = center - doorW / 2;
    const right = center + doorW / 2;
    if (left > cursor + 0.05) {
      segments.push({ from: cursor, to: left, kind: "wall" });
    }
    segments.push({ from: left, to: right, kind: "door", door: d });
    cursor = right;
  });
  if (cursor < span / 2 - 0.05) {
    segments.push({ from: cursor, to: span / 2, kind: "wall" });
  }
  if (!segments.length) {
    segments.push({ from: -span / 2, to: span / 2, kind: "wall" });
  }

  segments.forEach((seg) => {
    const segLen = seg.to - seg.from;
    const mid = (seg.from + seg.to) / 2;
    if (seg.kind === "wall") {
      if (isXWall) {
        const w = texturedBox(thick, height, segLen, wallColor, wTex);
        w.position.set(xPos, height / 2, mid);
        root.add(w);
      } else {
        const w = texturedBox(segLen, height, thick, wallColor, wTex);
        w.position.set(mid, height / 2, zPos);
        root.add(w);
      }
    } else {
      // lintel above door
      const lintelH = height - doorH;
      if (lintelH > 0.05) {
        if (isXWall) {
          const lintel = texturedBox(thick, lintelH, doorW, wallColor, wTex);
          lintel.position.set(xPos, doorH + lintelH / 2, mid);
          root.add(lintel);
        } else {
          const lintel = texturedBox(doorW, lintelH, thick, wallColor, wTex);
          lintel.position.set(mid, doorH + lintelH / 2, zPos);
          root.add(lintel);
        }
      }
      // door frame + panel in opening
      const door = createEmbeddedDoor(seg.door, wall, mid, xPos, zPos, doorW, doorH, thick);
      root.add(door);
    }
  });
}

export function createEmbeddedDoor(doorData, wall, alongMid, xPos, zPos, doorW, doorH, thick) {
  const g = new THREE.Group();
  g.name = "doorway";
  const color = doorData.color || 0xb8956a;
  const frameC = darken(color, 0.18);

  let panel;
  if (wall === "left" || wall === "right") {
    const face = wall === "left" ? 1 : -1;
    g.position.set(xPos, 0, alongMid);
    const frameL = box(thick + 0.04, doorH, 0.1, frameC);
    frameL.position.set(0, doorH / 2, -doorW / 2 + 0.05);
    const frameR = box(thick + 0.04, doorH, 0.1, frameC);
    frameR.position.set(0, doorH / 2, doorW / 2 - 0.05);
    const frameTop = box(thick + 0.04, 0.1, doorW + 0.04, frameC);
    frameTop.position.set(0, doorH - 0.05, 0);
    panel = box(0.07, doorH - 0.14, doorW - 0.14, color);
    panel.position.set(face * (thick * 0.35), doorH / 2, 0);
    const mold = box(0.02, doorH * 0.38, doorW - 0.32, darken(color, 0.1));
    mold.position.set(face * 0.045, 0, 0);
    const knob = sphere(0.045, 0xe8d080, { metalness: 0.55, roughness: 0.35 });
    knob.position.set(face * 0.09, -0.05, doorW * 0.22);
    panel.add(mold, knob);
    g.add(frameL, frameR, frameTop, panel);
  } else {
    const face = wall === "back" ? 1 : -1;
    g.position.set(alongMid, 0, zPos);
    const frameL = box(0.1, doorH, thick + 0.04, frameC);
    frameL.position.set(-doorW / 2 + 0.05, doorH / 2, 0);
    const frameR = box(0.1, doorH, thick + 0.04, frameC);
    frameR.position.set(doorW / 2 - 0.05, doorH / 2, 0);
    const frameTop = box(doorW + 0.04, 0.1, thick + 0.04, frameC);
    frameTop.position.set(0, doorH - 0.05, 0);
    panel = box(doorW - 0.14, doorH - 0.14, 0.07, color);
    panel.position.set(0, doorH / 2, face * (thick * 0.35));
    const mold = box(doorW - 0.32, doorH * 0.38, 0.02, darken(color, 0.1));
    mold.position.set(0, 0, face * 0.045);
    const knob = sphere(0.045, 0xe8d080, { metalness: 0.55, roughness: 0.35 });
    knob.position.set(doorW * 0.22, -0.05, face * 0.09);
    panel.add(mold, knob);
    g.add(frameL, frameR, frameTop, panel);
  }

  makeInteractable(g, {
    type: "door",
    to: doorData.to,
    label: doorData.label,
  });

  if (doorData.label) {
    const spr = makeLabelSprite(doorData.label, { scaleX: 0.7, scaleY: 0.17, fontSize: 30 });
    spr.position.set(0, doorH + 0.14, 0);
    g.add(spr);
  }

  return g;
}

export function setPlayCamera(camera, opts = {}) {
  camera.fov = opts.fov || 50;
  camera.near = opts.near || 0.35;
  camera.far = opts.far || 100;
  camera.updateProjectionMatrix();
}

function darken(hex, amount) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1 - amount);
  return c.getHex();
}

export function addWarmLights(scene, { intensity = 1, style = "home" } = {}) {
  const hemi = new THREE.HemisphereLight(0xfff8f5, 0x7a6860, 0.75 * intensity);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xfff0e4, 0.7 * intensity);
  dir.position.set(4, 10, 5);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.bias = -0.0005;
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0xd0e8ff, 0.25 * intensity);
  fill.position.set(-4, 6, -3);
  scene.add(fill);
  const pt = new THREE.PointLight(0xffe8d4, 0.85 * intensity, 22);
  pt.position.set(0, 3.2, 0);
  scene.add(pt);
  if (style === "market") {
    const neon = new THREE.PointLight(0xffb0c8, 0.35 * intensity, 16);
    neon.position.set(0, 3.0, 2);
    scene.add(neon);
  }
  return { hemi, dir, pt };
}

/** Extra wall / ceiling props so rooms don't feel empty */
export function addRoomDressing(root, { width, depth, height, style, accent = 0xffe0ea }) {
  const g = new THREE.Group();
  g.name = "dressing";

  // Baseboards
  const boardC = style === "kitchen" ? 0xffffff : 0xf5e6dc;
  [
    [0, 0.08, -depth / 2 + 0.06, width - 0.2, 0.16, 0.06],
    [0, 0.08, depth / 2 - 0.06, width - 0.2, 0.16, 0.06],
    [-width / 2 + 0.06, 0.08, 0, 0.06, 0.16, depth - 0.2],
    [width / 2 - 0.06, 0.08, 0, 0.06, 0.16, depth - 0.2],
  ].forEach(([x, y, z, w, h, d]) => {
    const b = box(w, h, d, boardC, { roughness: 0.8 });
    b.position.set(x, y, z);
    g.add(b);
  });

  // Ceiling light fixture
  const lamp = cyl(0.35, 0.4, 0.08, 0xfff8e8, { emissive: 0xffe8c0, emissiveIntensity: 0.35 });
  lamp.position.set(0, height - 0.12, 0);
  const cord = cyl(0.02, 0.02, 0.2, 0xd0d0d0);
  cord.position.set(0, height - 0.25, 0);
  g.add(lamp, cord);

  // Style accents
  if (style === "market") {
    // Aisle floor stripes
    for (let i = -2; i <= 2; i++) {
      const stripe = box(0.25, 0.01, depth - 1.5, 0xffe08a, { roughness: 0.9 });
      stripe.position.set(i * 3.2, 0.06, 0);
      g.add(stripe);
    }
    // Promo banners on back wall
    [-4, 0, 4].forEach((x, i) => {
      const banner = box(2.2, 0.55, 0.04, [0xff6b8a, 0x7ec8ff, 0xffe08a][i], { roughness: 0.5 });
      banner.position.set(x, height - 0.7, -depth / 2 + 0.12);
      g.add(banner);
    });
  } else if (style === "home" || style === "dining") {
    // Chair rail + wallpaper band
    const rail = box(width - 0.3, 0.08, 0.05, 0xe8d0b8);
    rail.position.set(0, 1.15, -depth / 2 + 0.1);
    g.add(rail);
    [-2.4, 0, 2.4].forEach((x, i) => {
      const frame = box(0.85, 0.7, 0.05, 0xc9a06a);
      frame.position.set(x, 2.15, -depth / 2 + 0.1);
      const pic = box(0.68, 0.52, 0.02, [accent, 0x7ec8ff, 0xffe08a][i]);
      pic.position.set(x, 2.15, -depth / 2 + 0.14);
      g.add(frame, pic);
    });
  } else if (style === "kitchen") {
    const splash = box(Math.min(width - 1, 8), 0.7, 0.04, 0xe8f4ff);
    splash.position.set(0, 1.5, -depth / 2 + 0.1);
    g.add(splash);
  }

  // Corner plants / shelves for non-market
  if (style !== "market") {
    const shelf = box(1.2, 0.06, 0.28, 0xd4a574);
    shelf.position.set(-width / 2 + 0.7, 1.6, -depth / 2 + 0.25);
    g.add(shelf);
  }

  root.add(g);
  return g;
}

export function makeLabelSprite(text, { color = "#fff", bg = "rgba(40,16,28,0.78)", scaleX = 0.62, scaleY = 0.16, fontSize = 28 } = {}) {
  const canvas = document.createElement("canvas");
  const big = fontSize >= 36;
  canvas.width = big ? 384 : 256;
  canvas.height = big ? 96 : 64;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  const padX = big ? 12 : 8;
  const padY = big ? 16 : 10;
  roundRect(ctx, padX, padY, canvas.width - padX * 2, canvas.height - padY * 2, big ? 20 : 16);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Microsoft YaHei, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const matSprite = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const sprite = new THREE.Sprite(matSprite);
  sprite.scale.set(scaleX, scaleY, 1);
  sprite.center.set(0.5, 0.5);
  sprite.renderOrder = 2;
  sprite.userData.isLabelTag = true;
  return sprite;
}

/** Only this mesh is clickable — does not mark parent/siblings */
export function makeInteractableHit(mesh, data) {
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
    if (c.isMesh || c.isGroup) {
      c.userData.interactive = true;
      Object.assign(c.userData, data);
    }
  });
  return mesh;
}
