import * as THREE from "three";
import { box, cyl, sphere, mat } from "../core/builders.js";
import { COLORS } from "../core/constants.js";
import { findMakeupOption } from "../gameplay/GameState.js";
import { createPlateSet, createShoppingCart, softBox } from "../core/props.js";

function limbCyl(color, r, h) {
  const m = cyl(r, r * 0.95, h, color, { segments: 12 });
  return m;
}

/** Cute chibi-style girl with layered hair and expressive face */
export function createPlayerAvatar(state) {
  const root = new THREE.Group();
  root.name = "player";
  const body = new THREE.Group();
  body.name = "body";
  root.add(body);

  // Legs
  const legL = limbCyl(0xffd2b8, 0.09, 0.42);
  legL.position.set(-0.11, 0.28, 0);
  legL.name = "legL";
  const legR = limbCyl(0xffd2b8, 0.09, 0.42);
  legR.position.set(0.11, 0.28, 0);
  legR.name = "legR";
  body.add(legL, legR);

  // Shoes with strap
  const shoeL = softBox(0.18, 0.1, 0.28, 0xff6b8a);
  shoeL.position.set(-0.11, 0.06, 0.04);
  const shoeR = softBox(0.18, 0.1, 0.28, 0xff6b8a);
  shoeR.position.set(0.11, 0.06, 0.04);
  body.add(shoeL, shoeR);

  // Bottom / skirt
  const pelvis = softBox(0.38, 0.18, 0.26, 0xff6b8a);
  pelvis.position.y = 0.55;
  pelvis.name = "bottom";
  body.add(pelvis);

  const skirt = cyl(0.32, 0.2, 0.32, 0xff6b8a, { segments: 20 });
  skirt.position.y = 0.48;
  skirt.name = "skirt";
  body.add(skirt);

  // Torso with collar
  const torso = softBox(0.36, 0.4, 0.24, 0xff8fb3);
  torso.position.y = 0.85;
  torso.name = "top";
  body.add(torso);
  const collar = softBox(0.38, 0.06, 0.26, 0xfff0f5);
  collar.position.y = 1.05;
  body.add(collar);

  // Arms
  const armL = limbCyl(COLORS.skin, 0.07, 0.38);
  armL.position.set(-0.26, 0.82, 0);
  armL.name = "armL";
  const armR = limbCyl(COLORS.skin, 0.07, 0.38);
  armR.position.set(0.26, 0.82, 0);
  armR.name = "armR";
  const handL = sphere(0.07, COLORS.skin);
  handL.position.set(-0.26, 0.6, 0);
  const handR = sphere(0.07, COLORS.skin);
  handR.position.set(0.26, 0.6, 0);
  body.add(armL, armR, handL, handR);

  // Head (slightly oversized chibi)
  const head = sphere(0.26, COLORS.skin, { roughness: 0.55 });
  head.position.y = 1.35;
  head.name = "head";
  body.add(head);

  // Ears
  const earL = sphere(0.06, COLORS.skin);
  earL.position.set(-0.24, 1.35, 0);
  const earR = sphere(0.06, COLORS.skin);
  earR.position.set(0.24, 1.35, 0);
  body.add(earL, earR);

  // Face texture plane
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = 256;
  faceCanvas.height = 256;
  const faceTex = new THREE.CanvasTexture(faceCanvas);
  faceTex.colorSpace = THREE.SRGBColorSpace;
  const facePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.42),
    new THREE.MeshBasicMaterial({ map: faceTex, transparent: true })
  );
  facePlane.position.set(0, 1.35, 0.22);
  facePlane.name = "face";
  body.add(facePlane);

  // Layered hair
  const hairGroup = new THREE.Group();
  hairGroup.name = "hair";
  const hairCap = sphere(0.28, COLORS.hair, { roughness: 0.7 });
  hairCap.position.y = 1.42;
  hairCap.scale.set(1.08, 0.9, 1.05);
  hairCap.name = "hairCap";
  const bang = softBox(0.42, 0.12, 0.12, COLORS.hair);
  bang.position.set(0, 1.48, 0.2);
  bang.name = "bang";
  const sideL = sphere(0.12, COLORS.hair);
  sideL.position.set(-0.28, 1.25, 0.05);
  sideL.scale.set(0.7, 1.3, 0.7);
  const sideR = sphere(0.12, COLORS.hair);
  sideR.position.set(0.28, 1.25, 0.05);
  sideR.scale.set(0.7, 1.3, 0.7);
  const pony = sphere(0.14, COLORS.hair);
  pony.position.set(0, 1.55, -0.2);
  pony.scale.set(1, 1.2, 0.8);
  const bow = softBox(0.14, 0.08, 0.06, 0xff6b8a);
  bow.position.set(0.18, 1.55, 0.1);
  hairGroup.add(hairCap, bang, sideL, sideR, pony, bow);
  body.add(hairGroup);

  // Hold point
  const hold = new THREE.Group();
  hold.name = "hold";
  hold.position.set(0.42, 0.72, 0.18);
  body.add(hold);

  root.userData = {
    speed: 3.2,
    target: null,
    walking: false,
    faceCanvas,
    faceTex,
    hold,
    hairMeshes: [hairCap, bang, sideL, sideR, pony],
  };

  applyMakeup(root, state);
  return root;
}

export function applyMakeup(avatar, state) {
  const lip = findMakeupOption("lipstick", state.makeup.lipstick);
  const blush = findMakeupOption("blush", state.makeup.blush);
  const eye = findMakeupOption("eyeshadow", state.makeup.eyeshadow);
  const hairOpt = findMakeupOption("hair", state.makeup.hair);
  const top = findMakeupOption("top", state.makeup.top);
  const bottom = findMakeupOption("bottom", state.makeup.bottom);

  const hairMeshes = avatar.userData.hairMeshes || [];
  hairMeshes.forEach((m) => {
    if (m?.material) m.material.color.set(hairOpt.color);
  });

  const topMesh = avatar.getObjectByName("top");
  if (topMesh) topMesh.material.color.set(top.color);

  const bottomMesh = avatar.getObjectByName("bottom");
  const skirt = avatar.getObjectByName("skirt");
  if (bottomMesh) bottomMesh.material.color.set(bottom.color);
  if (skirt) {
    skirt.material.color.set(bottom.color);
    skirt.visible = !!bottom.skirt;
    if (bottomMesh) bottomMesh.visible = !bottom.skirt;
  }

  const canvas = avatar.userData.faceCanvas;
  const ctx = canvas.getContext("2d");
  const W = 256;
  ctx.clearRect(0, 0, W, W);

  // soft face oval
  ctx.fillStyle = "#f5c9a8";
  ctx.beginPath();
  ctx.ellipse(128, 130, 95, 105, 0, 0, Math.PI * 2);
  ctx.fill();

  // eyeshadow
  ctx.fillStyle = eye.color;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.ellipse(88, 115, 28, 14, -0.15, 0, Math.PI * 2);
  ctx.ellipse(168, 115, 28, 14, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // big cute eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(88, 120, 22, 26, 0, 0, Math.PI * 2);
  ctx.ellipse(168, 120, 22, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a2820";
  ctx.beginPath();
  ctx.ellipse(90, 122, 12, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(166, 122, 12, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(96, 112, 5, 0, Math.PI * 2);
  ctx.arc(172, 112, 5, 0, Math.PI * 2);
  ctx.fill();

  // brows
  ctx.strokeStyle = "#5a3a28";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(68, 95);
  ctx.quadraticCurveTo(88, 88, 108, 95);
  ctx.moveTo(148, 95);
  ctx.quadraticCurveTo(168, 88, 188, 95);
  ctx.stroke();

  // blush
  ctx.fillStyle = blush.color;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.ellipse(55, 155, 22, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(201, 155, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // nose hint
  ctx.strokeStyle = "#e0a090";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(128, 140);
  ctx.lineTo(124, 150);
  ctx.stroke();

  // lips
  ctx.fillStyle = lip.color;
  ctx.beginPath();
  ctx.ellipse(128, 175, 18, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.ellipse(128, 172, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  avatar.userData.faceTex.needsUpdate = true;
}

export function createNPC(kind) {
  const root = new THREE.Group();
  root.name = kind;

  if (kind === "dog") {
    const body = cyl(0.2, 0.22, 0.55, 0xd4a06a, { segments: 14 });
    body.rotation.z = Math.PI / 2;
    body.position.set(0, 0.3, 0);
    const belly = sphere(0.18, 0xe8c090);
    belly.position.set(0, 0.28, 0);
    belly.scale.set(1.1, 0.8, 0.9);
    const head = sphere(0.2, 0xd4a06a);
    head.position.set(0.32, 0.4, 0);
    const snout = sphere(0.08, 0xc08050);
    snout.position.set(0.48, 0.35, 0);
    const earL = softBox(0.08, 0.14, 0.04, 0xc08050);
    earL.position.set(0.28, 0.55, 0.1);
    const earR = softBox(0.08, 0.14, 0.04, 0xc08050);
    earR.position.set(0.28, 0.55, -0.1);
    const eyeL = sphere(0.03, 0x2a2020);
    eyeL.position.set(0.42, 0.45, 0.1);
    const eyeR = sphere(0.03, 0x2a2020);
    eyeR.position.set(0.42, 0.45, -0.1);
    const tail = cyl(0.04, 0.02, 0.3, 0xd4a06a);
    tail.position.set(-0.35, 0.4, 0);
    tail.rotation.z = 0.6;
    const paw1 = sphere(0.07, 0xc08050);
    paw1.position.set(0.15, 0.08, 0.12);
    const paw2 = sphere(0.07, 0xc08050);
    paw2.position.set(0.15, 0.08, -0.12);
    const paw3 = sphere(0.07, 0xc08050);
    paw3.position.set(-0.2, 0.08, 0.12);
    const paw4 = sphere(0.07, 0xc08050);
    paw4.position.set(-0.2, 0.08, -0.12);
    root.add(body, belly, head, snout, earL, earR, eyeL, eyeR, tail, paw1, paw2, paw3, paw4);
    root.userData = { sitY: 0.15, speed: 2.8, kind: "dog" };
    return root;
  }

  const skin = kind === "mom" ? 0xffd2b8 : 0xe8b888;
  const shirt = kind === "mom" ? 0xff8fb3 : 0x3d6fbf;
  const pants = kind === "mom" ? 0xb57edc : 0x5a6a88;
  const hairC = kind === "mom" ? 0x6b3f2a : 0x3a3038;

  const legL = limbCyl(pants, 0.09, 0.48);
  legL.position.set(-0.11, 0.28, 0);
  legL.name = "legL";
  const legR = limbCyl(pants, 0.09, 0.48);
  legR.position.set(0.11, 0.28, 0);
  legR.name = "legR";
  const shoeL = softBox(0.16, 0.08, 0.24, 0x2c2430);
  shoeL.position.set(-0.11, 0.05, 0.03);
  const shoeR = softBox(0.16, 0.08, 0.24, 0x2c2430);
  shoeR.position.set(0.11, 0.05, 0.03);

  const torso = softBox(0.38, 0.45, 0.24, shirt);
  torso.position.y = 0.9;
  if (kind === "mom") {
    const skirt = cyl(0.32, 0.22, 0.4, pants, { segments: 16 });
    skirt.position.y = 0.55;
    root.add(skirt);
  } else {
    const belt = softBox(0.4, 0.06, 0.26, 0x2a3040);
    belt.position.y = 0.68;
    root.add(belt);
  }

  const armL = limbCyl(skin, 0.07, 0.4);
  armL.position.set(-0.28, 0.88, 0);
  armL.name = "armL";
  const armR = limbCyl(skin, 0.07, 0.4);
  armR.position.set(0.28, 0.88, 0);
  armR.name = "armR";

  const head = sphere(0.22, skin, { roughness: 0.55 });
  head.position.y = 1.3;
  const hair = sphere(0.24, hairC);
  hair.position.y = 1.4;
  hair.scale.set(1.05, 0.85, 1.05);
  if (kind === "mom") {
    const bun = sphere(0.1, hairC);
    bun.position.set(0, 1.55, -0.1);
    root.add(bun);
  }

  // simple face dots
  const eyeL = sphere(0.03, 0x2a2020);
  eyeL.position.set(-0.07, 1.32, 0.18);
  const eyeR = sphere(0.03, 0x2a2020);
  eyeR.position.set(0.07, 1.32, 0.18);

  root.add(legL, legR, shoeL, shoeR, torso, armL, armR, head, hair, eyeL, eyeR);
  root.userData = { target: null, walking: false, speed: 2.6, kind };
  return root;
}

export function setHoldingMesh(avatar, mesh) {
  const hold = avatar.userData.hold;
  while (hold.children.length) hold.remove(hold.children[0]);
  if (mesh) {
    mesh.position.set(0, 0, 0);
    hold.add(mesh);
  }
}

export function createPlateOrBowl(vessel, dish) {
  return createPlateSet(vessel, dish);
}

export function createBagMesh() {
  const g = new THREE.Group();
  const b1 = softBox(0.2, 0.28, 0.12, 0xf0c050);
  const b2 = softBox(0.18, 0.24, 0.1, 0xff9bb8);
  b2.position.set(0.12, -0.02, 0.05);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.015, 8, 12, Math.PI),
    mat(0x8a5a28)
  );
  handle.position.set(0, 0.14, 0);
  handle.rotation.x = Math.PI;
  g.add(b1, b2, handle);
  return g;
}

export function createCartHoldMesh() {
  const cart = createShoppingCart();
  cart.scale.setScalar(0.55);
  return cart;
}

export function updateWalkAnim(avatar, dt, moving) {
  const legL = avatar.getObjectByName("legL");
  const legR = avatar.getObjectByName("legR");
  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  if (!legL) return;
  if (!moving) {
    legL.rotation.x = 0;
    legR.rotation.x = 0;
    if (armL) armL.rotation.x = 0;
    if (armR) armR.rotation.x = 0;
    return;
  }
  avatar.userData.phase = (avatar.userData.phase || 0) + dt * 10;
  const s = Math.sin(avatar.userData.phase) * 0.55;
  legL.rotation.x = s;
  legR.rotation.x = -s;
  if (armL) armL.rotation.x = -s * 0.6;
  if (armR) armR.rotation.x = s * 0.6;
}

export function moveToward(obj, target, speed, dt) {
  if (!target) return false;
  const pos = obj.position;
  const dx = target.x - pos.x;
  const dz = target.z - pos.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.08) {
    pos.x = target.x;
    pos.z = target.z;
    return false;
  }
  const step = Math.min(dist, speed * dt);
  pos.x += (dx / dist) * step;
  pos.z += (dz / dist) * step;
  obj.rotation.y = Math.atan2(dx, dz);
  return true;
}
