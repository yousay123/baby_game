import * as THREE from "three";
import { box, cyl, sphere, mat, makeInteractable, makeInteractableHit, makeLabelSprite } from "./builders.js";
import { COLORS, MARKET_GOODS } from "./constants.js";

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
  const pot = cyl(0.16, 0.12, 0.26, 0xc45a4a, { roughness: 0.55, segments: 20 });
  pot.position.y = 0.13;
  const rim = cyl(0.17, 0.17, 0.03, 0xd46a5a, { segments: 20 });
  rim.position.y = 0.26;
  const dirt = cyl(0.13, 0.13, 0.04, 0x5a3a28);
  dirt.position.y = 0.26;
  const stem = cyl(0.025, 0.02, 0.45, 0x3a7a40);
  stem.position.y = 0.5;
  [-0.1, 0.02, 0.1].forEach((ox, i) => {
    const leaf = sphere(0.14, [0x4aaa50, 0x5ec060, 0x3a9a48][i], { segments: 14 });
    leaf.scale.set(1.3, 0.4, 0.9);
    leaf.position.set(ox, 0.7 + i * 0.08, 0.04 * (i - 1));
    leaf.rotation.z = (i - 1) * 0.35;
    g.add(leaf);
  });
  g.add(pot, rim, dirt, stem);
  g.position.set(x, 0, z);
  return g;
}

export function createSofa() {
  const g = new THREE.Group();
  // Soft cushioned sofa — stacked rounded forms, not a single brick
  const base = softBox(2.5, 0.22, 0.95, 0xffb0c8, { roughness: 0.75 });
  base.position.y = 0.28;
  const seat = softBox(2.35, 0.2, 0.85, 0xffc0d4, { roughness: 0.7 });
  seat.position.y = 0.48;
  const back = softBox(2.5, 0.55, 0.22, 0xff9bb8, { roughness: 0.7 });
  back.position.set(0, 0.78, -0.36);
  // Rounded armrests
  const armL = cyl(0.18, 0.18, 0.9, 0xff8fab, { roughness: 0.7 });
  armL.rotation.x = Math.PI / 2;
  armL.position.set(-1.15, 0.55, 0);
  const armR = cyl(0.18, 0.18, 0.9, 0xff8fab, { roughness: 0.7 });
  armR.rotation.x = Math.PI / 2;
  armR.position.set(1.15, 0.55, 0);
  const c1 = sphere(0.28, 0xffe0ea, { roughness: 0.8, segments: 16 });
  c1.scale.set(1.3, 0.7, 1.1);
  c1.position.set(-0.55, 0.62, 0.1);
  const c2 = sphere(0.28, 0xfff0f5, { roughness: 0.8, segments: 16 });
  c2.scale.set(1.3, 0.7, 1.1);
  c2.position.set(0.55, 0.62, 0.1);
  [[-1.05, 0.08, 0.35], [1.05, 0.08, 0.35], [-1.05, 0.08, -0.35], [1.05, 0.08, -0.35]].forEach(([x, y, z]) => {
    const leg = cyl(0.04, 0.05, 0.16, 0x8a5a38, { roughness: 0.5 });
    leg.position.set(x, y, z);
    g.add(leg);
  });
  g.add(base, seat, back, armL, armR, c1, c2);
  return g;
}

export function createCoffeeTable() {
  const g = new THREE.Group();
  // Oval glass-top coffee table
  const top = cyl(0.55, 0.48, 0.04, 0xe8d8c0, { roughness: 0.35, metalness: 0.08, segments: 32 });
  top.scale.set(1.35, 1, 1);
  top.position.y = 0.42;
  const glass = cyl(0.5, 0.44, 0.02, 0xc8e0f0, {
    roughness: 0.12,
    metalness: 0.15,
    transparent: true,
    opacity: 0.45,
    segments: 32,
  });
  glass.scale.set(1.35, 1, 1);
  glass.position.y = 0.45;
  [[-0.35, 0.35], [0.35, 0.35], [-0.35, -0.35], [0.35, -0.35]].forEach(([x, z]) => {
    const leg = cyl(0.035, 0.03, 0.4, 0x8a6a48, { roughness: 0.45 });
    leg.position.set(x * 1.1, 0.2, z * 0.7);
    g.add(leg);
  });
  const mug = cyl(0.05, 0.045, 0.09, 0xff8fb3, { roughness: 0.4 });
  mug.position.set(0.25, 0.52, 0.08);
  const book = softBox(0.22, 0.03, 0.16, 0x7ec8ff);
  book.position.set(-0.2, 0.48, -0.08);
  book.rotation.y = 0.2;
  g.add(top, glass, mug, book);
  return g;
}

export function createTVStand() {
  const g = new THREE.Group();
  const cabinet = softBox(2.1, 0.5, 0.5, 0xd4b090, { roughness: 0.55 });
  cabinet.position.y = 0.28;
  [-0.5, 0.5].forEach((x) => {
    const door = softBox(0.85, 0.35, 0.03, 0xc49868);
    door.position.set(x, 0.28, 0.26);
    const knob = sphere(0.02, 0xe8d080, { metalness: 0.4, roughness: 0.4, segments: 8 });
    knob.position.set(x + (x > 0 ? -0.3 : 0.3), 0.28, 0.3);
    g.add(door, knob);
  });
  [[-0.9, 0.04, 0.18], [0.9, 0.04, 0.18], [-0.9, 0.04, -0.18], [0.9, 0.04, -0.18]].forEach(([x, y, z]) => {
    const leg = cyl(0.03, 0.03, 0.08, 0x6a4a30);
    leg.position.set(x, y, z);
    g.add(leg);
  });
  const screen = softBox(1.65, 0.95, 0.06, 0x1a2030, { roughness: 0.3 });
  screen.position.set(0, 1.15, 0);
  screen.name = "tvScreen";
  const bezel = softBox(1.78, 1.05, 0.05, 0x111418);
  bezel.position.set(0, 1.15, -0.02);
  const stand = softBox(0.4, 0.06, 0.2, 0x2a3038);
  stand.position.set(0, 0.62, 0);
  g.add(cabinet, bezel, screen, stand);
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
  const back = softBox(1.05, 1.75, 0.04, 0xb89060, { roughness: 0.7 });
  back.position.set(0, 0.95, -0.16);
  const sideL = softBox(0.05, 1.8, 0.38, 0xc9a06a, { roughness: 0.65 });
  sideL.position.set(-0.52, 0.9, 0);
  const sideR = softBox(0.05, 1.8, 0.38, 0xc9a06a, { roughness: 0.65 });
  sideR.position.set(0.52, 0.9, 0);
  const top = softBox(1.12, 0.05, 0.4, 0xc9a06a);
  top.position.set(0, 1.82, 0);
  g.add(back, sideL, sideR, top);
  for (let i = 0; i < 4; i++) {
    const shelf = softBox(1.0, 0.035, 0.34, 0xd4b080);
    shelf.position.set(0, 0.32 + i * 0.4, 0.02);
    g.add(shelf);
    for (let j = 0; j < 5; j++) {
      const h = 0.18 + (j % 3) * 0.04;
      const book = softBox(0.08, h, 0.2, [0xef6b8a, 0x7ec8ff, 0xffe08a, 0x6ecf7a, 0xc9a0e0][j]);
      book.position.set(-0.36 + j * 0.18, 0.32 + i * 0.4 + h / 2 + 0.02, 0.02);
      g.add(book);
    }
  }
  [[-0.4, 0.03, 0.12], [0.4, 0.03, 0.12], [-0.4, 0.03, -0.12], [0.4, 0.03, -0.12]].forEach(([x, y, z]) => {
    const foot = cyl(0.03, 0.03, 0.06, 0x6a4a30);
    foot.position.set(x, y, z);
    g.add(foot);
  });
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
  const body = softBox(1.15, 2.35, 0.9, 0xf2f7fb, { roughness: 0.35, metalness: 0.15 });
  body.position.y = 1.18;
  // 内腔（开门后可见）
  const cavity = softBox(0.95, 2.0, 0.7, 0xd8e8f0, { roughness: 0.7 });
  cavity.position.set(0, 1.15, 0.05);
  const shelf1 = softBox(0.9, 0.03, 0.65, 0xc8d8e4);
  shelf1.position.set(0, 1.55, 0.08);
  const shelf2 = softBox(0.9, 0.03, 0.65, 0xc8d8e4);
  shelf2.position.set(0, 1.0, 0.08);

  // 左铰链开门（门板中心相对铰链偏右）
  const hingeX = -0.52;
  const topPivot = new THREE.Group();
  topPivot.name = "fridgeDoorTop";
  topPivot.position.set(hingeX, 1.85, 0.46);
  const topDoor = softBox(1.05, 0.85, 0.06, 0xd0e4f4);
  topDoor.position.set(0.525, 0, 0);
  const h1 = softBox(0.06, 0.35, 0.06, 0xb0c0d0, { metalness: 0.6, roughness: 0.3 });
  h1.position.set(0.94, 0, 0.06);
  topPivot.add(topDoor, h1);

  const botPivot = new THREE.Group();
  botPivot.name = "fridgeDoorBot";
  botPivot.position.set(hingeX, 0.75, 0.46);
  const botDoor = softBox(1.05, 1.25, 0.06, 0xd0e4f4);
  botDoor.position.set(0.525, 0, 0);
  const h2 = softBox(0.06, 0.55, 0.06, 0xb0c0d0, { metalness: 0.6, roughness: 0.3 });
  h2.position.set(0.94, 0, 0.06);
  botPivot.add(botDoor, h2);

  const logo = softBox(0.25, 0.08, 0.02, 0x7ec8ff);
  logo.position.set(-0.15, 2.15, 0.5);
  topPivot.add(logo);

  g.add(body, cavity, shelf1, shelf2, topPivot, botPivot);
  g.userData.doorTop = topPivot;
  g.userData.doorBot = botPivot;
  g.userData.doorOpen = 0;
  g.userData.doorTarget = 0;
  return g;
}

/** open: true 开门 / false 关门 —— 立即可见，并继续平滑动画 */
export function setFridgeDoorsOpen(fridge, open) {
  if (!fridge) return;
  const ud = fridge.userData;
  const top = ud.doorTop || fridge.getObjectByName("fridgeDoorTop");
  const bot = ud.doorBot || fridge.getObjectByName("fridgeDoorBot");
  if (!top || !bot) return;
  ud.doorTop = top;
  ud.doorBot = bot;
  ud.doorTarget = open ? 1 : 0;
  // 立刻转到一半，保证用户马上能看到门在动
  const snap = open ? Math.max(ud.doorOpen || 0, 0.45) : Math.min(ud.doorOpen ?? 1, 0.55);
  ud.doorOpen = open ? snap : snap;
  const angle = -(ud.doorOpen) * Math.PI * 0.85;
  top.rotation.y = angle;
  bot.rotation.y = angle;
}

export function updateFridgeDoors(fridge, dt = 0.016) {
  if (!fridge) return;
  const ud = fridge.userData;
  const top = ud.doorTop || fridge.getObjectByName("fridgeDoorTop");
  const bot = ud.doorBot || fridge.getObjectByName("fridgeDoorBot");
  if (!top || !bot) return;
  ud.doorTop = top;
  ud.doorBot = bot;
  const t = ud.doorTarget ?? 0;
  let cur = ud.doorOpen ?? 0;
  if (Math.abs(t - cur) < 0.01) {
    cur = t;
  } else {
    cur += Math.sign(t - cur) * Math.min(Math.abs(t - cur), 3.5 * dt);
  }
  ud.doorOpen = cur;
  const angle = -cur * Math.PI * 0.85;
  top.rotation.y = angle;
  bot.rotation.y = angle;
}

export function createSinkUnit() {
  const g = new THREE.Group();
  const counter = softBox(1.4, 0.12, 0.85, 0xe8eef4);
  counter.position.y = 1.0;
  const cab = softBox(1.35, 0.9, 0.8, 0xffffff);
  cab.position.y = 0.45;
  // 盆底凹陷感：深色盆体
  const basin = softBox(0.7, 0.12, 0.5, 0xa8b8c8, { metalness: 0.45, roughness: 0.35 });
  basin.position.set(-0.15, 1.02, 0);
  const faucet = cyl(0.03, 0.03, 0.35, 0xd0d8e0, { metalness: 0.7, roughness: 0.25 });
  faucet.position.set(-0.15, 1.25, -0.2);
  const spout = softBox(0.28, 0.045, 0.045, 0xd0d8e0, { metalness: 0.7, roughness: 0.25 });
  spout.position.set(-0.02, 1.42, -0.02);
  const board = softBox(0.4, 0.04, 0.3, 0xd4a06a);
  board.position.set(0.4, 1.08, 0.1);

  // 水面在盆上方，避免被盆体挡住
  const water = softBox(0.55, 0.04, 0.38, 0x4db8ff, {
    transparent: true,
    opacity: 0.75,
    roughness: 0.15,
    metalness: 0.1,
    depthWrite: false,
  });
  water.position.set(-0.15, 1.1, 0.02);
  water.name = "sinkWater";
  water.visible = false;
  water.renderOrder = 2;

  // 粗一点的水流柱，从龙头垂到水面
  const stream = cyl(0.035, 0.05, 0.32, 0x6ecfff, {
    transparent: true,
    opacity: 0.8,
    roughness: 0.2,
    depthWrite: false,
  });
  stream.position.set(-0.02, 1.28, 0.02);
  stream.name = "sinkStream";
  stream.visible = false;
  stream.renderOrder = 3;

  const splash = sphere(0.1, 0x9ae0ff, {
    transparent: true,
    opacity: 0.55,
    segments: 10,
    depthWrite: false,
  });
  splash.scale.set(1.6, 0.4, 1.4);
  splash.position.set(-0.02, 1.12, 0.04);
  splash.name = "sinkSplash";
  splash.visible = false;
  splash.renderOrder = 3;

  g.add(cab, counter, basin, faucet, spout, board, water, stream, splash);
  g.userData.waterOn = false;
  g.userData.water = water;
  g.userData.stream = stream;
  g.userData.splash = splash;
  return g;
}

export function setSinkWater(sink, on) {
  if (!sink) return;
  const ud = sink.userData;
  const water = ud.water || sink.getObjectByName("sinkWater");
  const stream = ud.stream || sink.getObjectByName("sinkStream");
  const splash = ud.splash || sink.getObjectByName("sinkSplash");
  ud.water = water;
  ud.stream = stream;
  ud.splash = splash;
  ud.waterOn = !!on;
  if (water) {
    water.visible = !!on;
    if (water.material) water.material.opacity = on ? 0.75 : 0;
  }
  if (stream) {
    stream.visible = !!on;
    if (stream.material) stream.material.opacity = on ? 0.8 : 0;
  }
  if (splash) {
    splash.visible = !!on;
    if (splash.material) splash.material.opacity = on ? 0.55 : 0;
  }
}

export function updateSinkWater(sink, t = 0) {
  if (!sink?.userData?.waterOn) return;
  const stream = sink.userData.stream || sink.getObjectByName("sinkStream");
  const splash = sink.userData.splash || sink.getObjectByName("sinkSplash");
  const water = sink.userData.water || sink.getObjectByName("sinkWater");
  if (stream) {
    stream.scale.y = 1 + Math.sin(t * 14) * 0.12;
    if (stream.material) stream.material.opacity = 0.65 + Math.sin(t * 11) * 0.15;
  }
  if (splash) {
    splash.scale.set(1.5 + Math.sin(t * 16) * 0.2, 0.35, 1.3 + Math.cos(t * 13) * 0.15);
    if (splash.material) splash.material.opacity = 0.4 + Math.sin(t * 10) * 0.15;
  }
  if (water?.material) {
    water.material.opacity = 0.65 + Math.sin(t * 5) * 0.1;
  }
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

/**
 * Gondola shelf. doubleSided=true → island with goods on both faces.
 * Only the pink「选购」plates are clickable (avoids mis-clicks while walking).
 */
export function createMarketShelf(cat, label, { doubleSided = true } = {}) {
  const g = new THREE.Group();
  const depth = doubleSided ? 1.15 : 0.72;
  const halfD = depth / 2;
  const metal = { roughness: 0.35, metalness: 0.45 };

  // Slim metal uprights + wood shelves (store gondola, not toy blocks)
  [-1.0, 1.0].forEach((x) => {
    const post = cyl(0.035, 0.035, 2.15, 0x8a95a5, metal);
    post.position.set(x, 1.1, 0);
    g.add(post);
  });
  const spine = softBox(0.06, 2.0, 0.06, 0x7a8595, metal);
  spine.position.set(0, 1.05, 0);
  const base = softBox(2.15, 0.1, depth + 0.06, 0x5a6575, metal);
  base.position.set(0, 0.05, 0);
  const topBar = softBox(2.15, 0.06, depth + 0.04, 0x8a95a5, metal);
  topBar.position.set(0, 2.15, 0);
  g.add(spine, base, topBar);

  const headerColors = { veg: 0x6ecf7a, drinks: 0x7ec8ff, daily: 0xffe08a, snack: 0xff9bb8 };
  const header = softBox(2.05, 0.12, 0.05, headerColors[cat] || 0xffe08a);
  header.position.set(0, 2.28, 0);
  g.add(header);

  const goods = MARKET_GOODS[cat] || [];
  const sides = doubleSided ? [1, -1] : [1];

  for (const side of sides) {
    for (let row = 0; row < 4; row++) {
      const y = 0.38 + row * 0.42;
      const board = softBox(1.95, 0.04, halfD - 0.06, 0xe0c8a0, { roughness: 0.7 });
      board.position.set(0, y, side * (halfD / 2));
      g.add(board);

      const lip = softBox(1.9, 0.06, 0.025, 0xc9a070);
      lip.position.set(0, y + 0.04, side * (halfD - 0.04));
      g.add(lip);

      const led = softBox(1.8, 0.015, 0.02, 0xfff8e8, { emissive: 0xffe8c0, emissiveIntensity: 0.35 });
      led.position.set(0, y + 0.36, side * (halfD * 0.7));
      g.add(led);

      for (let col = 0; col < 4; col++) {
        const itemDef = goods[(col + row) % Math.max(goods.length, 1)];
        const item = createGoodsMesh(cat, itemDef, col + row * 4);
        item.position.set(-0.65 + col * 0.44, y + 0.14, side * (halfD * 0.5));
        item.rotation.y = side > 0 ? 0 : Math.PI;
        g.add(item);
      }
    }

    const title = label || ({ veg: "蔬菜", drinks: "饮料", daily: "粮油", snack: "零食" }[cat] || cat);
    const sign = makeLabelSprite(title, { bg: "rgba(80,40,30,0.82)", scaleX: 0.48, scaleY: 0.12 });
    sign.position.set(0, 2.28, side * (halfD + 0.05));
    g.add(sign);

    const hit = softBox(0.95, 0.32, 0.1, 0xef6b8a);
    hit.position.set(0, 2.22, side * (halfD + 0.08));
    makeInteractableHit(hit, { type: "shelf", cat });
    const buy = makeLabelSprite(`选购·${title}`, {
      bg: "rgba(239,107,138,0.95)",
      scaleX: 0.5,
      scaleY: 0.12,
    });
    buy.position.set(0, 2.48, side * (halfD + 0.12));
    g.add(hit, buy);
  }

  return g;
}

export function createGoodsMesh(cat, itemDef, seed = 0) {
  const id = itemDef?.id || "";
  const name = itemDef?.name || "";
  const hex = itemDef?.color ? parseInt(String(itemDef.color).replace("#", ""), 16) : 0xffe08a;
  const g = new THREE.Group();

  if (id === "juice") {
    // 果汁瓶：透明橙瓶 + 标签
    const bottle = cyl(0.055, 0.065, 0.26, hex || 0xffb347, { roughness: 0.25, transparent: true, opacity: 0.85 });
    bottle.position.y = 0.13;
    const neck = cyl(0.03, 0.04, 0.06, hex || 0xffb347, { roughness: 0.25 });
    neck.position.y = 0.28;
    const cap = cyl(0.032, 0.032, 0.04, 0xef6b8a);
    cap.position.y = 0.33;
    const label = softBox(0.1, 0.1, 0.02, 0xfff8f0);
    label.position.set(0, 0.12, 0.06);
    g.add(bottle, neck, cap, label);
  } else if (id === "milk") {
    // 牛奶纸盒
    const carton = softBox(0.12, 0.26, 0.09, 0xf8f8f8);
    carton.position.y = 0.13;
    const blue = softBox(0.12, 0.08, 0.02, 0x7ec8ff);
    blue.position.set(0, 0.16, 0.05);
    const peak = softBox(0.1, 0.05, 0.07, 0xe8e8e8);
    peak.position.y = 0.28;
    const spout = softBox(0.04, 0.03, 0.03, 0xd0d0d0);
    spout.position.set(0.03, 0.3, 0.02);
    g.add(carton, blue, peak, spout);
  } else if (id === "soda") {
    // 汽水易拉罐
    const can = cyl(0.055, 0.055, 0.22, hex || 0x7ec8ff, { metalness: 0.55, roughness: 0.35 });
    can.position.y = 0.11;
    const top = cyl(0.052, 0.052, 0.02, 0xc0c8d0, { metalness: 0.6 });
    top.position.y = 0.23;
    const stripe = softBox(0.11, 0.05, 0.015, 0xffffff);
    stripe.position.set(0, 0.12, 0.055);
    const logo = softBox(0.06, 0.06, 0.012, 0xef6b8a);
    logo.position.set(0, 0.06, 0.055);
    g.add(can, top, stripe, logo);
  } else if (id === "tomato") {
    const body = sphere(0.1, 0xff6b5a, { roughness: 0.5 });
    body.position.y = 0.1;
    const stem = cyl(0.012, 0.01, 0.04, 0x3a8a40);
    stem.position.y = 0.2;
    const leaf = softBox(0.06, 0.01, 0.04, 0x4aaa50);
    leaf.position.set(0.03, 0.19, 0);
    g.add(body, stem, leaf);
  } else if (id === "carrot") {
    const body = cyl(0.04, 0.015, 0.26, 0xff8f40, { roughness: 0.65 });
    body.rotation.z = 0.4;
    body.position.set(0.02, 0.12, 0);
    const greens = sphere(0.045, 0x4aaa50, { segments: 8 });
    greens.scale.set(1.3, 0.5, 0.8);
    greens.position.set(0.08, 0.24, 0);
    g.add(body, greens);
  } else if (id === "broccoli") {
    const stem = cyl(0.035, 0.045, 0.1, 0xc8e0b0);
    stem.position.y = 0.05;
    const head = sphere(0.1, 0x4aaa50, { roughness: 0.85 });
    head.position.y = 0.14;
    const bump1 = sphere(0.055, 0x3ecf6a);
    bump1.position.set(0.05, 0.16, 0.03);
    const bump2 = sphere(0.05, 0x45b85a);
    bump2.position.set(-0.04, 0.15, 0.04);
    g.add(stem, head, bump1, bump2);
  } else if (id === "cabbage") {
    const core = sphere(0.09, 0xe8f5d8, { roughness: 0.7 });
    core.position.y = 0.09;
    const leaf1 = softBox(0.16, 0.03, 0.12, 0xd0e8b8);
    leaf1.position.set(0.06, 0.08, 0.04);
    leaf1.rotation.z = 0.4;
    const leaf2 = softBox(0.14, 0.03, 0.1, 0xc0dca8);
    leaf2.position.set(-0.05, 0.1, 0.03);
    leaf2.rotation.z = -0.3;
    g.add(core, leaf1, leaf2);
  } else if (id === "rice") {
    const sack = softBox(0.16, 0.2, 0.12, 0xf5f0e0);
    sack.position.y = 0.1;
    const band = softBox(0.16, 0.05, 0.02, 0xc49868);
    band.position.set(0, 0.12, 0.065);
    const rice = softBox(0.1, 0.03, 0.06, 0xfffaf0);
    rice.position.set(0, 0.22, 0);
    g.add(sack, band, rice);
  } else if (id === "oil") {
    const bottle = cyl(0.05, 0.06, 0.22, 0xf0d060, { roughness: 0.28, transparent: true, opacity: 0.9 });
    bottle.position.y = 0.11;
    const cap = cyl(0.028, 0.028, 0.04, 0xef6b8a);
    cap.position.y = 0.24;
    const handle = softBox(0.03, 0.08, 0.025, 0xe8c040);
    handle.position.set(0.07, 0.12, 0);
    const label = softBox(0.08, 0.08, 0.015, 0xfff8e0);
    label.position.set(0, 0.1, 0.055);
    g.add(bottle, cap, handle, label);
  } else if (id === "flour") {
    const bag = softBox(0.14, 0.22, 0.1, 0xfff8e8);
    bag.position.y = 0.11;
    const seal = softBox(0.12, 0.035, 0.08, 0xe0d8c8);
    seal.position.y = 0.24;
    const mark = softBox(0.08, 0.06, 0.015, 0xd4a06a);
    mark.position.set(0, 0.1, 0.055);
    g.add(bag, seal, mark);
  } else if (id === "egg") {
    const tray = softBox(0.2, 0.04, 0.12, 0xffe8b0);
    tray.position.y = 0.02;
    for (let i = 0; i < 4; i++) {
      const egg = sphere(0.035, 0xfff8e8);
      egg.scale.set(1, 1.3, 1);
      egg.position.set(-0.06 + (i % 2) * 0.06, 0.07, -0.03 + Math.floor(i / 2) * 0.06);
      g.add(egg);
    }
    g.add(tray);
  } else if (id === "chips") {
    const bag = softBox(0.12, 0.22, 0.06, 0xffe08a);
    bag.position.y = 0.11;
    const top = softBox(0.11, 0.035, 0.05, 0xef6b8a);
    top.position.y = 0.23;
    const chip = softBox(0.05, 0.01, 0.04, 0xffd060);
    chip.position.set(0.02, 0.12, 0.04);
    g.add(bag, top, chip);
  } else if (id === "bread") {
    const loaf = softBox(0.2, 0.09, 0.11, 0xe8c898);
    loaf.position.y = 0.06;
    const crust = softBox(0.18, 0.035, 0.09, 0xc89868);
    crust.position.y = 0.12;
    const slice = softBox(0.02, 0.07, 0.09, 0xfff0d0);
    slice.position.set(0.1, 0.06, 0);
    g.add(loaf, crust, slice);
  } else {
    // fallback pack with color
    const pack = softBox(0.14, 0.18, 0.09, hex);
    pack.position.y = 0.09;
    g.add(pack);
  }

  // 商品名小标（贴在商品上方，小号）
  if (name) {
    const tag = makeLabelSprite(name, {
      bg: "rgba(255,255,255,0.94)",
      color: "#5a3040",
      scaleX: 0.2,
      scaleY: 0.055,
      fontSize: 22,
    });
    tag.position.set(0, 0.36, 0.02);
    g.add(tag);
  }
  return g;
}

export function createShoppingCart() {
  const g = new THREE.Group();
  // Basket in front (+Z), handle toward player (-Z) for natural pushing
  const basket = softBox(0.55, 0.35, 0.42, 0x5a9fd4, {
    metalness: 0.35,
    roughness: 0.4,
    transparent: true,
    opacity: 0.88,
  });
  basket.position.set(0, 0.48, 0.12);
  const rim = softBox(0.58, 0.04, 0.45, 0x4a5568);
  rim.position.set(0, 0.66, 0.12);
  const postL = softBox(0.05, 0.55, 0.05, 0x4a5568);
  postL.position.set(-0.22, 0.55, -0.22);
  const postR = softBox(0.05, 0.55, 0.05, 0x4a5568);
  postR.position.set(0.22, 0.55, -0.22);
  const bar = softBox(0.5, 0.05, 0.05, 0x4a5568);
  bar.position.set(0, 0.82, -0.28);
  const grip = softBox(0.42, 0.06, 0.06, 0x2d3748);
  grip.position.set(0, 0.82, -0.32);
  [
    [-0.2, 0.08, 0.22],
    [0.2, 0.08, 0.22],
    [-0.2, 0.08, -0.12],
    [0.2, 0.08, -0.12],
  ].forEach(([x, y, z]) => {
    const w = cyl(0.07, 0.07, 0.05, 0x2d3748);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, y, z);
    g.add(w);
  });
  const i1 = softBox(0.12, 0.12, 0.1, 0xffb347);
  i1.position.set(-0.1, 0.55, 0.12);
  const i2 = softBox(0.1, 0.14, 0.1, 0xff6b8a);
  i2.position.set(0.1, 0.56, 0.15);
  g.add(basket, rim, postL, postR, bar, grip, i1, i2);
  return g;
}

export function createCheckoutCounter() {
  const g = new THREE.Group();
  const desk = softBox(2.4, 1.0, 1.0, 0x6a7588, { roughness: 0.45, metalness: 0.15 });
  desk.position.y = 0.55;
  const front = softBox(2.35, 0.9, 0.06, 0xef6b8a);
  front.position.set(0, 0.5, 0.52);
  const belt = softBox(1.4, 0.05, 0.45, 0x2d3748, { roughness: 0.4, metalness: 0.2 });
  belt.position.set(-0.2, 1.08, 0.05);
  const register = softBox(0.45, 0.35, 0.4, 0x1a2030, { roughness: 0.35 });
  register.position.set(0.75, 1.28, -0.08);
  const screen = softBox(0.38, 0.26, 0.04, 0x7ec8ff, {
    emissive: 0x335577,
    emissiveIntensity: 0.4,
  });
  screen.position.set(0.75, 1.52, 0.12);
  const scanner = cyl(0.08, 0.08, 0.12, 0x3a4555, { metalness: 0.4, roughness: 0.3 });
  scanner.position.set(0.2, 1.15, 0.25);
  g.add(desk, front, belt, register, screen, scanner);
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
  const top = cyl(1.15, 1.1, 0.08, 0xd4a574, { roughness: 0.55, segments: 36 });
  top.scale.set(1.25, 1, 0.7);
  top.position.y = 0.88;
  const apron = softBox(2.4, 0.08, 1.2, 0xc49060);
  apron.position.y = 0.8;
  [[-1.0, 0.4, -0.45], [1.0, 0.4, -0.45], [-1.0, 0.4, 0.45], [1.0, 0.4, 0.45]].forEach(([x, y, z]) => {
    const leg = cyl(0.045, 0.04, 0.78, 0x8a5a38, { roughness: 0.5 });
    leg.position.set(x, y, z);
    g.add(leg);
  });
  [-0.65, 0, 0.65].forEach((x) => {
    const matMesh = softBox(0.4, 0.015, 0.3, 0xffe8f0);
    matMesh.position.set(x, 0.93, 0);
    g.add(matMesh);
  });
  g.add(top, apron);
  return g;
}

export function createDiningChair() {
  const g = new THREE.Group();
  const seat = softBox(0.48, 0.06, 0.48, 0xe8c8a0, { roughness: 0.55 });
  seat.position.y = 0.48;
  const back = softBox(0.48, 0.5, 0.06, 0xe0c090, { roughness: 0.55 });
  back.position.set(0, 0.78, -0.2);
  [[-0.18, 0.24, 0.16], [0.18, 0.24, 0.16], [-0.18, 0.24, -0.16], [0.18, 0.24, -0.16]].forEach(([x, y, z]) => {
    const leg = cyl(0.025, 0.022, 0.48, 0x8a5a38, { roughness: 0.5 });
    leg.position.set(x, y, z);
    g.add(leg);
  });
  const cushion = softBox(0.4, 0.04, 0.4, 0xffb0c8, { roughness: 0.7 });
  cushion.position.y = 0.53;
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
  // Soft vanity desk with drawers + oval mirror
  const deskTop = softBox(2.2, 0.08, 0.7, 0xf8e0ea, { roughness: 0.55 });
  deskTop.position.y = 0.88;
  const cabinet = softBox(2.0, 0.7, 0.58, 0xffe8f0, { roughness: 0.6 });
  cabinet.position.y = 0.42;
  // Drawer fronts
  [-0.55, 0.55].forEach((x) => {
    const drawer = softBox(0.85, 0.22, 0.04, 0xffd0e0);
    drawer.position.set(x, 0.5, 0.3);
    const knob = sphere(0.025, 0xffe08a, { metalness: 0.4, roughness: 0.4, segments: 8 });
    knob.position.set(x, 0.5, 0.34);
    g.add(drawer, knob);
  });
  [[-0.9, 0.04, 0.25], [0.9, 0.04, 0.25], [-0.9, 0.04, -0.22], [0.9, 0.04, -0.22]].forEach(([x, y, z]) => {
    const leg = cyl(0.04, 0.035, 0.12, 0xd4a0b0);
    leg.position.set(x, y, z);
    g.add(leg);
  });
  // Oval mirror (scaled sphere flattened)
  const mirrorFrame = sphere(0.72, 0xffb0c8, { roughness: 0.5, segments: 28 });
  mirrorFrame.scale.set(1.05, 1.2, 0.08);
  mirrorFrame.position.set(0, 1.85, -0.32);
  const mirror = sphere(0.62, 0xb8d8f0, { metalness: 0.55, roughness: 0.12, segments: 28 });
  mirror.scale.set(1.05, 1.2, 0.06);
  mirror.position.set(0, 1.85, -0.28);
  const lipstick = cyl(0.025, 0.025, 0.1, 0xef6b8a);
  lipstick.position.set(0.55, 1.0, 0.12);
  const palette = softBox(0.22, 0.03, 0.16, 0xffd8e8);
  palette.position.set(0.25, 0.95, 0.15);
  const brush = cyl(0.012, 0.012, 0.18, 0xd4a06a);
  brush.position.set(0.4, 1.05, 0.18);
  const lamp = cyl(0.06, 0.08, 0.2, 0xfff0e0, { emissive: 0xffe8c0, emissiveIntensity: 0.25 });
  lamp.position.set(-0.7, 1.05, 0.1);
  g.add(deskTop, cabinet, mirrorFrame, mirror, lipstick, palette, brush, lamp);
  return g;
}

export function createStool() {
  const g = new THREE.Group();
  const seat = cyl(0.26, 0.28, 0.08, 0xffb0c8, { roughness: 0.55, segments: 24 });
  seat.position.y = 0.55;
  const cushion = sphere(0.22, 0xffc8d8, { roughness: 0.7, segments: 16 });
  cushion.scale.set(1.15, 0.35, 1.15);
  cushion.position.y = 0.6;
  const pole = cyl(0.04, 0.045, 0.48, 0xb0a090, { metalness: 0.25, roughness: 0.4 });
  pole.position.y = 0.28;
  const base = cyl(0.22, 0.24, 0.05, 0x6a6058, { roughness: 0.5, segments: 20 });
  base.position.y = 0.03;
  g.add(seat, cushion, pole, base);
  return g;
}

/** Soft cushion / pouf */
export function createCushion(color = 0xffc8d8) {
  const g = new THREE.Group();
  const c = softBox(0.55, 0.16, 0.55, color, { roughness: 0.85 });
  c.position.y = 0.08;
  const top = sphere(0.28, color, { roughness: 0.8, segments: 12 });
  top.scale.set(1, 0.35, 1);
  top.position.y = 0.16;
  g.add(c, top);
  return g;
}

/** Low cabinet / sideboard */
export function createCabinet(w = 1.6, color = 0xc9a882) {
  const g = new THREE.Group();
  const body = softBox(w, 0.85, 0.45, color, { roughness: 0.55 });
  body.position.y = 0.42;
  const top = softBox(w + 0.06, 0.06, 0.5, darkenHex(color, 0.12));
  top.position.y = 0.88;
  [-w * 0.22, w * 0.22].forEach((x) => {
    const knob = sphere(0.03, 0xffc94a, { segments: 8 });
    knob.position.set(x, 0.5, 0.24);
    g.add(knob);
  });
  g.add(body, top);
  return g;
}

function darkenHex(hex, amount) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(1 - amount);
  return c.getHex();
}

/** Wall picture frame */
export function createPicture(color = 0xffb0c8) {
  const g = new THREE.Group();
  const frame = softBox(0.7, 0.55, 0.04, 0xc9a06a);
  const pic = softBox(0.55, 0.4, 0.02, color);
  pic.position.z = 0.03;
  g.add(frame, pic);
  return g;
}

/** Floor vase with flowers */
export function createVase() {
  const g = new THREE.Group();
  const vase = cyl(0.08, 0.12, 0.35, 0xffffff, { roughness: 0.35 });
  vase.position.y = 0.2;
  const flowerColors = [0xff6b8a, 0xffc94a, 0xff9ec0];
  flowerColors.forEach((c, i) => {
    const f = sphere(0.06, c, { segments: 8 });
    const a = (i / 3) * Math.PI * 2;
    f.position.set(Math.cos(a) * 0.06, 0.48, Math.sin(a) * 0.06);
    g.add(f);
  });
  g.add(vase);
  return g;
}

/** Kitchen island / prep table */
export function createKitchenIsland() {
  const g = new THREE.Group();
  const top = softBox(1.8, 0.08, 0.9, 0xe8e0d4, { roughness: 0.4 });
  top.position.y = 0.95;
  const base = softBox(1.7, 0.9, 0.8, 0xd0d8e0, { roughness: 0.55 });
  base.position.y = 0.45;
  g.add(top, base);
  return g;
}

/** Wall shelf with jars */
export function createWallShelf() {
  const g = new THREE.Group();
  const board = softBox(1.4, 0.06, 0.28, 0xc9a882);
  board.position.y = 0;
  [-0.4, 0, 0.4].forEach((x, i) => {
    const jar = cyl(0.07, 0.08, 0.16, [0xff6b8a, 0x7ec8ff, 0xffe08a][i], { roughness: 0.3 });
    jar.position.set(x, 0.12, 0);
    g.add(jar);
  });
  g.add(board);
  return g;
}

/** Dining buffet / console */
export function createBuffet() {
  const g = new THREE.Group();
  const body = softBox(2.4, 0.9, 0.5, 0xb8956a, { roughness: 0.5 });
  body.position.y = 0.45;
  const top = softBox(2.5, 0.06, 0.55, 0xd4b090);
  top.position.y = 0.93;
  g.add(body, top);
  return g;
}

/** Small floor lamp / candle set */
export function createCandleSet() {
  const g = new THREE.Group();
  [-0.12, 0, 0.12].forEach((x, i) => {
    const stick = cyl(0.02, 0.02, 0.12 + i * 0.04, 0xfff8e0);
    stick.position.set(x, 0.08 + i * 0.02, 0);
    const flame = sphere(0.025, 0xffb347, { emissive: 0xff8800, emissiveIntensity: 0.4, segments: 6 });
    flame.position.set(x, 0.16 + i * 0.04, 0);
    g.add(stick, flame);
  });
  const tray = cyl(0.2, 0.2, 0.03, 0xc9a06a);
  tray.position.y = 0.02;
  g.add(tray);
  return g;
}

/** Corner coat rack */
export function createCoatRack() {
  const g = new THREE.Group();
  const pole = cyl(0.03, 0.03, 1.5, 0x8a5a38);
  pole.position.y = 0.75;
  const base = cyl(0.2, 0.22, 0.04, 0x6a4030);
  base.position.y = 0.02;
  [-0.15, 0.15].forEach((x) => {
    const hook = cyl(0.015, 0.015, 0.18, 0x8a5a38);
    hook.rotation.z = Math.PI / 2;
    hook.position.set(x * 0.5, 1.35, 0);
    g.add(hook);
  });
  g.add(pole, base);
  return g;
}

export { makeInteractable, makeLabelSprite, COLORS };
