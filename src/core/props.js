import * as THREE from "three";
import { box, cyl, sphere, mat, makeInteractable, makeLabelSprite } from "./builders.js";
import { COLORS } from "./constants.js";

/** Rounded-ish soft box via slightly bevelled look (stacked) */
export function softBox(w, h, d, color, opts) {
  return box(w, h, d, color, { roughness: 0.65, ...opts });
}

export function addCeiling(room, width, depth, height = 4, color = 0xfff8f2) {
  const ceil = box(width, 0.08, depth, color, { roughness: 0.9 });
  ceil.position.y = height;
  ceil.receiveShadow = true;
  room.add(ceil);
  return ceil;
}

export function addFloorPlanks(room, width, depth, color = 0xd4b896) {
  const g = new THREE.Group();
  const plankW = 0.55;
  const n = Math.ceil(width / plankW);
  for (let i = 0; i < n; i++) {
    const shade = i % 2 === 0 ? color : color * 0.92;
    const p = box(plankW - 0.02, 0.02, depth - 0.2, shade, { roughness: 0.88 });
    p.position.set(-width / 2 + plankW / 2 + i * plankW, 0.07, 0);
    g.add(p);
  }
  room.add(g);
  return g;
}

export function addWallTrim(room, width, depth, height = 4) {
  const trimC = 0xf5dce6;
  const rail = box(width - 0.4, 0.12, 0.06, trimC);
  rail.position.set(0, 1.1, -depth / 2 + 0.12);
  room.add(rail);
  // picture frames
  [-2.2, 0, 2.2].forEach((x, i) => {
    const frame = box(0.7, 0.55, 0.05, 0xc9a06a);
    frame.position.set(x, 2.3, -depth / 2 + 0.12);
    const pic = box(0.55, 0.4, 0.02, [0xffb0c8, 0x7ec8ff, 0xffe08a][i]);
    pic.position.set(x, 2.3, -depth / 2 + 0.16);
    room.add(frame, pic);
  });
}

export function createWindow(x, y, z) {
  const g = new THREE.Group();
  const frame = box(1.8, 1.5, 0.1, 0xf8f0e8);
  const glass = box(1.5, 1.2, 0.04, 0xa8d8ff, { roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.65 });
  glass.position.z = 0.04;
  const sill = box(2, 0.1, 0.25, 0xe8d8c8);
  sill.position.set(0, -0.8, 0.1);
  const curtainL = box(0.35, 1.5, 0.08, 0xff9bb8);
  curtainL.position.set(-0.85, 0, 0.12);
  const curtainR = box(0.35, 1.5, 0.08, 0xff9bb8);
  curtainR.position.set(0.85, 0, 0.12);
  g.add(frame, glass, sill, curtainL, curtainR);
  g.position.set(x, y, z);
  return g;
}

export function createPlant(x = 0, z = 0) {
  const g = new THREE.Group();
  const pot = cyl(0.18, 0.14, 0.28, 0xc45a4a);
  pot.position.y = 0.14;
  const dirt = cyl(0.15, 0.15, 0.04, 0x5a3a28);
  dirt.position.y = 0.28;
  const stem = cyl(0.03, 0.03, 0.5, 0x3a7a40);
  stem.position.y = 0.55;
  [-0.12, 0, 0.12].forEach((ox, i) => {
    const leaf = sphere(0.16, 0x4aaa50);
    leaf.scale.set(1.2, 0.45, 0.8);
    leaf.position.set(ox, 0.75 + i * 0.08, 0.05 * (i - 1));
    g.add(leaf);
  });
  g.add(pot, dirt, stem);
  g.position.set(x, 0, z);
  return g;
}

export function createSofa() {
  const g = new THREE.Group();
  const base = softBox(2.6, 0.45, 1.05, 0xffb0c8);
  base.position.y = 0.35;
  const back = softBox(2.6, 0.7, 0.28, 0xff9bb8);
  back.position.set(0, 0.85, -0.4);
  const armL = softBox(0.28, 0.5, 1.05, 0xff8fab);
  armL.position.set(-1.2, 0.55, 0);
  const armR = softBox(0.28, 0.5, 1.05, 0xff8fab);
  armR.position.set(1.2, 0.55, 0);
  const c1 = softBox(0.7, 0.18, 0.45, 0xffe0ea);
  c1.position.set(-0.55, 0.62, 0.1);
  const c2 = softBox(0.7, 0.18, 0.45, 0xfff0f5);
  c2.position.set(0.55, 0.62, 0.1);
  const legs = [
    [-1.1, 0.08, 0.4],
    [1.1, 0.08, 0.4],
    [-1.1, 0.08, -0.4],
    [1.1, 0.08, -0.4],
  ];
  legs.forEach(([x, y, z]) => {
    const leg = cyl(0.05, 0.05, 0.16, 0x8a5a38);
    leg.position.set(x, y, z);
    g.add(leg);
  });
  g.add(base, back, armL, armR, c1, c2);
  return g;
}

export function createCoffeeTable() {
  const g = new THREE.Group();
  const top = softBox(1.3, 0.08, 0.7, 0xe8d0b0);
  top.position.y = 0.42;
  const leg = box(0.9, 0.35, 0.08, 0xc4a080);
  leg.position.y = 0.2;
  const mug = cyl(0.06, 0.05, 0.1, 0xff8fb3);
  mug.position.set(0.3, 0.52, 0.1);
  const book = softBox(0.28, 0.04, 0.2, 0x7ec8ff);
  book.position.set(-0.25, 0.48, -0.1);
  const remote = softBox(0.18, 0.03, 0.08, 0x3a3a42);
  remote.position.set(0.1, 0.48, -0.15);
  g.add(top, leg, mug, book, remote);
  return g;
}

export function createTVStand() {
  const g = new THREE.Group();
  const cabinet = softBox(2.2, 0.55, 0.55, 0xd4b090);
  cabinet.position.y = 0.28;
  const door1 = softBox(0.9, 0.4, 0.04, 0xc49868);
  door1.position.set(-0.5, 0.28, 0.28);
  const door2 = softBox(0.9, 0.4, 0.04, 0xc49868);
  door2.position.set(0.5, 0.28, 0.28);
  const screen = softBox(1.7, 1.0, 0.08, 0x1a2030);
  screen.position.set(0, 1.15, 0);
  screen.name = "tvScreen";
  const bezel = softBox(1.85, 1.12, 0.06, 0x111418);
  bezel.position.set(0, 1.15, -0.02);
  const stand = softBox(0.5, 0.08, 0.25, 0x2a3038);
  stand.position.set(0, 0.62, 0);
  const spL = softBox(0.25, 0.45, 0.25, 0x3a4048);
  spL.position.set(-1.15, 0.85, 0);
  const spR = softBox(0.25, 0.45, 0.25, 0x3a4048);
  spR.position.set(1.15, 0.85, 0);
  g.add(cabinet, door1, door2, bezel, screen, stand, spL, spR);
  g.userData.screen = screen;
  return g;
}

export function createFloorLamp() {
  const g = new THREE.Group();
  const base = cyl(0.22, 0.25, 0.08, 0x4a4048);
  base.position.y = 0.04;
  const pole = cyl(0.03, 0.03, 1.5, 0xd0c0b0, { metalness: 0.4, roughness: 0.4 });
  pole.position.y = 0.8;
  const shade = cyl(0.28, 0.35, 0.35, 0xffe8c0, { roughness: 0.55 });
  shade.position.y = 1.65;
  const bulb = sphere(0.08, 0xfff6d0, { emissive: 0xffe8a0, emissiveIntensity: 0.3 });
  bulb.position.y = 1.5;
  bulb.name = "lampBulb";
  g.add(base, pole, shade, bulb);
  g.userData.bulb = bulb;
  return g;
}

export function createAC() {
  const g = new THREE.Group();
  const body = softBox(1.4, 0.38, 0.35, 0xf4f8fb);
  const vent = softBox(1.15, 0.08, 0.04, 0xc8d4e0);
  vent.position.set(0, -0.05, 0.18);
  const led = softBox(0.08, 0.04, 0.02, 0x4ade80);
  led.position.set(0.55, 0.1, 0.18);
  led.name = "acLed";
  g.add(body, vent, led);
  g.userData.led = led;
  return g;
}

export function createCeilingLamp() {
  const g = new THREE.Group();
  const mount = cyl(0.08, 0.08, 0.15, 0xe8e0d8);
  const shade = cyl(0.45, 0.5, 0.2, 0xfff3d0, { roughness: 0.4 });
  shade.position.y = -0.2;
  const glow = sphere(0.15, 0xfff8e0, { emissive: 0xffe8b0, emissiveIntensity: 0.5 });
  glow.position.y = -0.15;
  glow.name = "ceilBulb";
  g.add(mount, shade, glow);
  g.userData.bulb = glow;
  return g;
}

export function createBookshelf() {
  const g = new THREE.Group();
  const frame = softBox(1.1, 1.8, 0.4, 0xc9a06a);
  frame.position.y = 0.9;
  for (let i = 0; i < 4; i++) {
    const shelf = softBox(1.0, 0.04, 0.36, 0xb89060);
    shelf.position.y = 0.35 + i * 0.4;
    g.add(shelf);
    for (let j = 0; j < 4; j++) {
      const book = softBox(0.12, 0.28, 0.22, [0xef6b8a, 0x7ec8ff, 0xffe08a, 0x6ecf7a][j]);
      book.position.set(-0.35 + j * 0.22, 0.5 + i * 0.4, 0);
      g.add(book);
    }
  }
  g.add(frame);
  return g;
}

export function createDogBed() {
  const g = new THREE.Group();
  const base = softBox(0.9, 0.12, 0.7, 0xffd0a0);
  base.position.y = 0.08;
  const rim = softBox(0.95, 0.2, 0.15, 0xffb070);
  rim.position.set(0, 0.18, -0.28);
  const cushion = softBox(0.7, 0.08, 0.5, 0xffe8d0);
  cushion.position.y = 0.16;
  const bone = softBox(0.25, 0.06, 0.08, 0xfff8f0);
  bone.position.set(0.15, 0.22, 0.05);
  g.add(base, rim, cushion, bone);
  return g;
}

export function createRug() {
  const g = new THREE.Group();
  const rug = softBox(2.8, 0.03, 2.0, 0xffc8d8, { roughness: 0.95 });
  rug.position.y = 0.08;
  const border = softBox(2.9, 0.02, 2.1, 0xff9bb8);
  border.position.y = 0.075;
  g.add(border, rug);
  return g;
}

export function createSideTable() {
  const g = new THREE.Group();
  const top = softBox(0.55, 0.06, 0.55, 0xe0c8a8);
  top.position.y = 0.55;
  const leg = cyl(0.06, 0.08, 0.5, 0xc4a080);
  leg.position.y = 0.28;
  const vase = cyl(0.06, 0.08, 0.22, 0xffffff);
  vase.position.y = 0.7;
  const flower = sphere(0.08, 0xff6b8a);
  flower.position.y = 0.88;
  g.add(top, leg, vase, flower);
  return g;
}

/* -------- Kitchen appliances -------- */

export function createFridge() {
  const g = new THREE.Group();
  const body = softBox(1.15, 2.35, 0.95, 0xf2f7fb, { roughness: 0.35, metalness: 0.15 });
  body.position.y = 1.18;
  const topDoor = softBox(1.05, 0.85, 0.06, 0xe8f0f6);
  topDoor.position.set(0, 1.85, 0.48);
  const botDoor = softBox(1.05, 1.25, 0.06, 0xe8f0f6);
  botDoor.position.set(0, 0.75, 0.48);
  const h1 = softBox(0.06, 0.35, 0.06, 0xb0c0d0, { metalness: 0.6, roughness: 0.3 });
  h1.position.set(0.42, 1.85, 0.55);
  const h2 = softBox(0.06, 0.55, 0.06, 0xb0c0d0, { metalness: 0.6, roughness: 0.3 });
  h2.position.set(0.42, 0.75, 0.55);
  const logo = softBox(0.25, 0.08, 0.02, 0x7ec8ff);
  logo.position.set(-0.25, 2.15, 0.52);
  g.add(body, topDoor, botDoor, h1, h2, logo);
  return g;
}

export function createSinkUnit() {
  const g = new THREE.Group();
  const counter = softBox(1.4, 0.12, 0.85, 0xe8eef4);
  counter.position.y = 1.0;
  const cab = softBox(1.35, 0.9, 0.8, 0xffffff);
  cab.position.y = 0.45;
  const basin = softBox(0.7, 0.15, 0.5, 0xc0d0dc, { metalness: 0.4, roughness: 0.35 });
  basin.position.set(-0.15, 1.02, 0);
  const faucet = cyl(0.03, 0.03, 0.35, 0xd0d8e0, { metalness: 0.7, roughness: 0.25 });
  faucet.position.set(-0.15, 1.25, -0.2);
  const spout = softBox(0.25, 0.04, 0.04, 0xd0d8e0, { metalness: 0.7, roughness: 0.25 });
  spout.position.set(-0.05, 1.4, -0.05);
  const board = softBox(0.4, 0.04, 0.3, 0xd4a06a);
  board.position.set(0.4, 1.08, 0.1);
  const water = softBox(0.5, 0.02, 0.35, 0x7ec8ff, { transparent: true, opacity: 0.45 });
  water.position.set(-0.15, 0.98, 0);
  water.name = "sinkWater";
  g.add(cab, counter, basin, faucet, spout, board, water);
  return g;
}

export function createStove() {
  const g = new THREE.Group();
  const body = softBox(1.35, 0.22, 0.85, 0x3a3a44);
  body.position.y = 1.05;
  const cab = softBox(1.3, 0.9, 0.8, 0x4a4a55);
  cab.position.y = 0.45;
  [[-0.3, 0.25], [0.3, 0.25], [-0.3, -0.15], [0.3, -0.15]].forEach(([x, z], i) => {
    const burner = cyl(0.14, 0.14, 0.04, 0x222228);
    burner.position.set(x, 1.18, z);
    burner.name = i === 0 ? "burner" : `burner${i}`;
    g.add(burner);
  });
  const pan = cyl(0.2, 0.18, 0.08, 0x2a2a30, { metalness: 0.5, roughness: 0.4 });
  pan.position.set(-0.3, 1.25, 0.25);
  const handle = softBox(0.25, 0.04, 0.06, 0x1a1a20);
  handle.position.set(-0.55, 1.25, 0.25);
  const knobs = [-0.4, -0.15, 0.15, 0.4].map((x) => {
    const k = cyl(0.04, 0.04, 0.05, 0xd0d0d8);
    k.position.set(x, 1.0, 0.4);
    return k;
  });
  g.add(body, cab, pan, handle, ...knobs);
  g.userData.burner = g.getObjectByName("burner");
  return g;
}

export function createRiceCooker() {
  const g = new THREE.Group();
  const body = cyl(0.28, 0.3, 0.4, 0xffffff, { roughness: 0.35 });
  body.position.y = 1.15;
  const lid = cyl(0.29, 0.29, 0.08, 0xf0f0f0);
  lid.position.y = 1.38;
  const button = cyl(0.04, 0.04, 0.03, 0xef6b8a);
  button.position.set(0, 1.2, 0.28);
  const steamCap = cyl(0.05, 0.05, 0.06, 0xd0d0d0);
  steamCap.position.y = 1.46;
  g.add(body, lid, button, steamCap);
  return g;
}

export function createOven() {
  const g = new THREE.Group();
  const body = softBox(1.15, 1.0, 0.75, 0x505860);
  body.position.y = 0.55;
  const window = softBox(0.75, 0.45, 0.04, 0x1a2030);
  window.position.set(0, 0.65, 0.38);
  window.name = "ovenWindow";
  const handle = softBox(0.5, 0.05, 0.05, 0xc0c8d0, { metalness: 0.6 });
  handle.position.set(0, 0.95, 0.42);
  const knob = cyl(0.05, 0.05, 0.04, 0xd0d8e0);
  knob.position.set(0.4, 0.95, 0.4);
  g.add(body, window, handle, knob);
  g.userData.window = window;
  return g;
}

export function createHood() {
  const g = new THREE.Group();
  const canopy = softBox(1.7, 0.2, 0.75, 0xd8e0e8, { metalness: 0.3, roughness: 0.4 });
  const chimney = softBox(0.55, 0.7, 0.4, 0xc8d0d8);
  chimney.position.y = 0.45;
  const light = softBox(0.8, 0.04, 0.15, 0xffe8a0, { emissive: 0xffd080, emissiveIntensity: 0 });
  light.position.set(0, -0.12, 0.1);
  light.name = "hoodLight";
  g.add(canopy, chimney, light);
  g.userData.light = light;
  return g;
}

export function createMicrowave() {
  const g = new THREE.Group();
  const body = softBox(0.75, 0.5, 0.5, 0xe8e8e8);
  const window = softBox(0.4, 0.3, 0.04, 0x2a3038);
  window.position.set(-0.08, 0, 0.26);
  window.name = "mwWindow";
  const panel = softBox(0.18, 0.35, 0.04, 0xd0d0d0);
  panel.position.set(0.25, 0, 0.26);
  g.add(body, window, panel);
  g.userData.window = window;
  return g;
}

export function createDishwasher() {
  const g = new THREE.Group();
  const body = softBox(1.05, 0.9, 0.7, 0xf0f2f4);
  body.position.y = 0.45;
  const door = softBox(0.95, 0.7, 0.05, 0xe4e8ec);
  door.position.set(0, 0.45, 0.36);
  const handle = softBox(0.4, 0.04, 0.04, 0xb0b8c0);
  handle.position.set(0, 0.7, 0.4);
  g.add(body, door, handle);
  return g;
}

export function createKitchenCounter(width = 8) {
  const g = new THREE.Group();
  const top = softBox(width, 0.12, 1.05, 0xe8eef4);
  top.position.y = 1.0;
  const base = softBox(width, 0.9, 1.0, 0xffffff);
  base.position.y = 0.45;
  // drawer lines
  for (let i = 0; i < 5; i++) {
    const drawer = softBox(1.2, 0.28, 0.04, 0xf5f5f5);
    drawer.position.set(-width / 2 + 1.2 + i * 1.4, 0.7, 0.5);
    const handle = softBox(0.2, 0.03, 0.03, 0xc0c8d0);
    handle.position.set(-width / 2 + 1.2 + i * 1.4, 0.7, 0.54);
    g.add(drawer, handle);
  }
  g.add(top, base);
  return g;
}

export function createUpperCabinets(width = 6) {
  const g = new THREE.Group();
  const cab = softBox(width, 0.7, 0.45, 0xffffff);
  cab.position.y = 2.55;
  for (let i = 0; i < 4; i++) {
    const door = softBox(1.2, 0.55, 0.04, 0xf8f8f8);
    door.position.set(-width / 2 + 1 + i * 1.45, 2.55, 0.24);
    g.add(door);
  }
  g.add(cab);
  return g;
}

/* -------- Market -------- */

export function createMarketShelf(cat, label) {
  const g = new THREE.Group();
  const frame = softBox(2.0, 2.4, 0.7, 0xc9a06a);
  frame.position.y = 1.2;
  // shelves
  for (let row = 0; row < 4; row++) {
    const shelf = softBox(1.85, 0.05, 0.6, 0xb89058);
    shelf.position.y = 0.4 + row * 0.55;
    g.add(shelf);
    // goods on shelf
    for (let col = 0; col < 5; col++) {
      const item = createGoodsMesh(cat, col);
      item.position.set(-0.7 + col * 0.35, 0.55 + row * 0.55, 0.05);
      g.add(item);
    }
    // price tag
    const tag = softBox(1.7, 0.1, 0.02, 0xffe08a);
    tag.position.set(0, 0.35 + row * 0.55, 0.32);
    g.add(tag);
  }
  const sign = makeLabelSprite(label);
  sign.position.set(0, 2.7, 0);
  g.add(frame, sign);
  return g;
}

export function createGoodsMesh(cat, seed = 0) {
  const colors = {
    veg: [0xff6b5a, 0xff8f40, 0x4aaa50, 0xd8f0c8, 0x3ecf6a],
    drinks: [0xffb347, 0xf5f5f5, 0x7ec8ff, 0xd4a574, 0xffe0f0],
    daily: [0xf5f0e0, 0xf0d060, 0xfff8e8, 0xffe8b0, 0x5a3a28],
    snack: [0xffe08a, 0xe8c898, 0xc89868, 0xfff3c4, 0x3a6a40],
  };
  const c = (colors[cat] || colors.snack)[seed % 5];
  if (cat === "drinks") {
    const bottle = cyl(0.06, 0.07, 0.22, c);
    const cap = cyl(0.04, 0.04, 0.04, 0xef6b8a);
    cap.position.y = 0.13;
    const g = new THREE.Group();
    g.add(bottle, cap);
    return g;
  }
  if (cat === "veg") {
    return sphere(0.09 + (seed % 3) * 0.02, c);
  }
  return softBox(0.14, 0.16, 0.1, c);
}

export function createShoppingCart() {
  const g = new THREE.Group();
  const basket = softBox(0.55, 0.35, 0.4, 0x3b82c4, { metalness: 0.3, roughness: 0.45, transparent: true, opacity: 0.85 });
  basket.position.y = 0.45;
  const handle = softBox(0.08, 0.45, 0.08, 0x4a5568);
  handle.position.set(-0.35, 0.55, 0);
  const bar = softBox(0.35, 0.05, 0.05, 0x4a5568);
  bar.position.set(-0.2, 0.75, 0);
  [[-0.2, 0.08, 0.15], [0.2, 0.08, 0.15], [-0.2, 0.08, -0.15], [0.2, 0.08, -0.15]].forEach(([x, y, z]) => {
    const w = cyl(0.07, 0.07, 0.05, 0x2d3748);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, y, z);
    g.add(w);
  });
  // items in cart
  const i1 = softBox(0.12, 0.12, 0.1, 0xffb347);
  i1.position.set(-0.1, 0.5, 0);
  const i2 = softBox(0.1, 0.14, 0.1, 0xff6b8a);
  i2.position.set(0.1, 0.52, 0.05);
  g.add(basket, handle, bar, i1, i2);
  return g;
}

export function createCheckoutCounter() {
  const g = new THREE.Group();
  const desk = softBox(2.2, 1.0, 1.0, 0x4a5568);
  desk.position.y = 0.55;
  const belt = softBox(1.4, 0.05, 0.45, 0x2d3748);
  belt.position.set(-0.2, 1.08, 0);
  const register = softBox(0.45, 0.35, 0.4, 0x1a2030);
  register.position.set(0.7, 1.25, 0);
  const screen = softBox(0.35, 0.25, 0.04, 0x7ec8ff);
  screen.position.set(0.7, 1.45, 0.15);
  const cashier = softBox(0.35, 0.7, 0.25, 0xffb0c8);
  cashier.position.set(0.7, 0.55, -0.35);
  const head = sphere(0.14, 0xf2c4a0);
  head.position.set(0.7, 1.05, -0.35);
  g.add(desk, belt, register, screen, cashier, head);
  return g;
}

export function createAutoDoor() {
  const g = new THREE.Group();
  const frame = softBox(2.0, 2.4, 0.2, 0x88a8c8);
  frame.position.y = 1.2;
  const glassL = softBox(0.85, 2.1, 0.06, 0xa8d0ff, { transparent: true, opacity: 0.5, roughness: 0.2 });
  glassL.position.set(-0.45, 1.15, 0.05);
  const glassR = softBox(0.85, 2.1, 0.06, 0xa8d0ff, { transparent: true, opacity: 0.5, roughness: 0.2 });
  glassR.position.set(0.45, 1.15, 0.05);
  g.add(frame, glassL, glassR);
  return g;
}

/* -------- Dining -------- */

export function createDiningTable() {
  const g = new THREE.Group();
  const top = softBox(2.8, 0.1, 1.5, 0xd4a574);
  top.position.y = 0.88;
  const apron = softBox(2.6, 0.12, 1.3, 0xc49060);
  apron.position.y = 0.78;
  [[-1.15, 0.4, -0.55], [1.15, 0.4, -0.55], [-1.15, 0.4, 0.55], [1.15, 0.4, 0.55]].forEach(([x, y, z]) => {
    const leg = softBox(0.1, 0.78, 0.1, 0x8a5a38);
    leg.position.set(x, y, z);
    g.add(leg);
  });
  // placemats
  [-0.7, 0, 0.7].forEach((x) => {
    const matMesh = softBox(0.45, 0.02, 0.35, 0xffe8f0);
    matMesh.position.set(x, 0.94, 0);
    g.add(matMesh);
  });
  g.add(top, apron);
  return g;
}

export function createDiningChair() {
  const g = new THREE.Group();
  const seat = softBox(0.5, 0.08, 0.5, 0xe8c8a0);
  seat.position.y = 0.48;
  const back = softBox(0.5, 0.55, 0.08, 0xe0c090);
  back.position.set(0, 0.8, -0.22);
  [[-0.18, 0.24, 0.18], [0.18, 0.24, 0.18], [-0.18, 0.24, -0.18], [0.18, 0.24, -0.18]].forEach(([x, y, z]) => {
    const leg = softBox(0.06, 0.48, 0.06, 0x8a5a38);
    leg.position.set(x, y, z);
    g.add(leg);
  });
  const cushion = softBox(0.42, 0.05, 0.42, 0xffb0c8);
  cushion.position.y = 0.54;
  g.add(seat, back, cushion);
  return g;
}

export function createPlateSet(vessel, dish) {
  const g = new THREE.Group();
  if (vessel === "bowl") {
    const bowl = cyl(0.16, 0.12, 0.1, 0xfaf6f0, { roughness: 0.4 });
    const rim = cyl(0.17, 0.17, 0.02, 0xf0e8e0);
    rim.position.y = 0.05;
    const food = sphere(0.11, dishColor(dish));
    food.scale.set(1, 0.5, 1);
    food.position.y = 0.08;
    g.add(bowl, rim, food);
  } else {
    const plate = cyl(0.2, 0.18, 0.03, 0xfaf6f0, { roughness: 0.4 });
    const rim = cyl(0.22, 0.2, 0.015, 0xf0e8e0);
    rim.position.y = 0.01;
    const food = softBox(0.2, 0.05, 0.16, dishColor(dish));
    food.position.y = 0.05;
    // garnish
    const g1 = sphere(0.03, 0x4aaa50);
    g1.position.set(0.06, 0.08, 0.04);
    g.add(plate, rim, food, g1);
  }
  // chopsticks / spoon
  if (vessel === "bowl") {
    const spoon = softBox(0.04, 0.02, 0.2, 0xd0d0d8, { metalness: 0.5 });
    spoon.position.set(0.18, 0.08, 0);
    g.add(spoon);
  } else {
    const chop = softBox(0.02, 0.02, 0.22, 0x5a3a28);
    chop.position.set(0.2, 0.05, 0);
    const chop2 = softBox(0.02, 0.02, 0.22, 0x5a3a28);
    chop2.position.set(0.24, 0.05, 0.02);
    g.add(chop, chop2);
  }
  return g;
}

function dishColor(dish) {
  if (!dish) return 0x6ecf7a;
  if (String(dish).includes("饭") || String(dish).includes("粥")) return 0xf5f0e0;
  if (String(dish).includes("包")) return 0xe8c898;
  return 0x6ecf7a;
}

export function createVanity() {
  const g = new THREE.Group();
  const desk = softBox(2.4, 0.12, 0.75, 0xf5d0e0);
  desk.position.y = 0.85;
  const legs = softBox(2.2, 0.7, 0.6, 0xffe0ea);
  legs.position.y = 0.4;
  const mirrorFrame = softBox(1.5, 1.5, 0.08, 0xffb0c8);
  mirrorFrame.position.set(0, 1.85, -0.35);
  const mirror = softBox(1.25, 1.25, 0.04, 0xc8e8ff, { metalness: 0.5, roughness: 0.15 });
  mirror.position.set(0, 1.85, -0.3);
  // makeup items
  const lipstick = cyl(0.03, 0.03, 0.12, 0xef6b8a);
  lipstick.position.set(0.6, 1.0, 0.1);
  const palette = softBox(0.25, 0.04, 0.18, 0xffd0e0);
  palette.position.set(0.3, 0.95, 0.15);
  const brush = softBox(0.03, 0.2, 0.03, 0xd4a06a);
  brush.position.set(0.45, 1.05, 0.2);
  g.add(desk, legs, mirrorFrame, mirror, lipstick, palette, brush);
  return g;
}

export function createStool() {
  const g = new THREE.Group();
  const seat = cyl(0.28, 0.3, 0.1, 0xffb0c8);
  seat.position.y = 0.55;
  const pole = cyl(0.05, 0.05, 0.5, 0xd0c0b0);
  pole.position.y = 0.28;
  const base = cyl(0.25, 0.28, 0.06, 0x8a7a70);
  base.position.y = 0.03;
  g.add(seat, pole, base);
  return g;
}

export { makeInteractable, makeLabelSprite, COLORS };
