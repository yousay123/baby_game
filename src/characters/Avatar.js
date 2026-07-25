import * as THREE from "three";
import { cyl, sphere, capsule, lathe, makeLabelSprite } from "../core/builders.js";
import { createPlateSet, createShoppingCart, softBox } from "../core/props.js";
import { ANIME_PRESETS, makeupToAnimeOpt } from "./AnimeArt.js";

const SKIN_OPT = { roughness: 0.92, metalness: 0, emissiveIntensity: 0.08 };
const CLOTH_OPT = { roughness: 0.78, metalness: 0 };

const NPC_LABELS = {
  dad: { text: "爸爸", bg: "rgba(70,110,180,0.92)" },
  mom: { text: "妈妈", bg: "rgba(239,107,138,0.92)" },
  cashier: { text: "收银员", bg: "rgba(239,107,138,0.92)" },
  dog: { text: "旺旺", bg: "rgba(200,120,60,0.9)" },
};

function hex3(hex) {
  const h = String(hex || "#ffffff").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return parseInt(full, 16) || 0xffffff;
}

function setMatColor(mesh, hex) {
  if (!mesh?.material?.color) return;
  mesh.material.color.set(hex3(hex));
  if (mesh.material.emissive && mesh.material.emissiveIntensity > 0) {
    mesh.material.emissive.set(hex3(hex));
  }
}

/**
 * 立体卡通五官（球体拼装）— 正面可爱，不吓人
 */
function createFace3D(opt = {}) {
  const g = new THREE.Group();
  g.name = "face3d";
  const z = 0.118;
  const eyeY = 0.018;
  const eyeDx = 0.044;
  const lipC = hex3(opt.lip || "#FF7FA3");
  const blushC = hex3(opt.blush || "#FF8AA8");
  const browC = hex3(opt.hair || "#5A3A28");

  [-1, 1].forEach((dir) => {
    const blush = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 12, 10),
      new THREE.MeshStandardMaterial({
        color: blushC,
        roughness: 0.95,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      })
    );
    blush.scale.set(1.15, 0.65, 0.35);
    blush.position.set(dir * 0.072, -0.018, z - 0.02);
    blush.name = "blush3d";
    g.add(blush);
  });

  [-1, 1].forEach((dir) => {
    const white = sphere(0.027, 0xffffff, { roughness: 0.35, segments: 14 });
    white.position.set(dir * eyeDx, eyeY, z);
    white.name = "eyeWhite";
    const iris = sphere(0.016, 0x5a3828, { roughness: 0.4, segments: 12 });
    iris.position.set(dir * eyeDx + dir * 0.002, eyeY - 0.002, z + 0.014);
    iris.name = "iris";
    const pupil = sphere(0.008, 0x1a1008, { roughness: 0.3, segments: 8 });
    pupil.position.set(dir * eyeDx + dir * 0.002, eyeY - 0.002, z + 0.022);
    const shine = sphere(0.007, 0xffffff, { roughness: 0.2, segments: 8 });
    shine.position.set(dir * eyeDx + 0.008, eyeY + 0.01, z + 0.026);
    g.add(white, iris, pupil, shine);
  });

  [-1, 1].forEach((dir) => {
    const brow = softBox(0.038, 0.007, 0.01, browC, { roughness: 0.75 });
    brow.position.set(dir * eyeDx, eyeY + 0.04, z + 0.01);
    brow.rotation.z = dir * -0.18;
    brow.name = "brow3d";
    g.add(brow);
  });

  const nose = sphere(0.01, 0xf0a890, { roughness: 0.9, segments: 8 });
  nose.scale.set(0.85, 0.55, 0.5);
  nose.position.set(0, -0.012, z + 0.015);
  g.add(nose);

  const mouth = sphere(0.02, lipC, { roughness: 0.55, segments: 12 });
  mouth.scale.set(1.35, 0.42, 0.4);
  mouth.position.set(0, -0.048, z + 0.012);
  mouth.name = "mouth3d";
  g.add(mouth);

  const smileHi = sphere(0.008, 0xffffff, { roughness: 0.3, segments: 6 });
  smileHi.scale.set(1.4, 0.5, 0.4);
  smileHi.position.set(0, -0.042, z + 0.02);
  g.add(smileHi);

  return g;
}

function updateFace3DColors(faceG, opt) {
  if (!faceG) return;
  faceG.traverse((o) => {
    if (o.name === "mouth3d") setMatColor(o, opt.lip || "#FF7FA3");
    if (o.name === "blush3d" && o.material) {
      o.material.color.set(hex3(opt.blush || "#FF8AA8"));
    }
    if (o.name === "brow3d") setMatColor(o, opt.hair || "#5A3A28");
  });
}

/**
 * 立体卡通「小蜜糖」— 有体积，正面脸 / 背面头发不同
 */
export function createPlayerAvatar(state) {
  const root = new THREE.Group();
  root.name = "player";
  const body = new THREE.Group();
  body.name = "body";
  root.add(body);

  const opt = makeupToAnimeOpt(state);
  const skin = hex3(opt.skin);
  const dress = hex3(opt.dress);
  const dress2 = hex3(opt.dress2);
  const hairC = hex3(opt.hair);
  const accent = hex3(opt.accent);

  const skinOpt = { ...SKIN_OPT, emissive: skin };

  // Legs — longer so lower body matches upper body
  const legL = capsule(0.056, 0.56, 0xffd0dc, skinOpt);
  legL.position.set(-0.09, 0.42, 0);
  legL.name = "legL";
  const legR = capsule(0.056, 0.56, 0xffd0dc, skinOpt);
  legR.position.set(0.09, 0.42, 0);
  legR.name = "legR";
  body.add(legL, legR);

  const mkShoe = (x, name) => {
    const s = sphere(0.072, dress, { ...CLOTH_OPT, segments: 14 });
    s.scale.set(1.15, 0.48, 1.4);
    s.position.set(x, 0.05, 0.04);
    s.name = name;
    return s;
  };
  body.add(mkShoe(-0.09, "shoeL"), mkShoe(0.09, "shoeR"));

  // Hips + ball skirt
  const hips = capsule(0.13, 0.12, dress, CLOTH_OPT);
  hips.position.y = 1.02;
  hips.name = "hips";
  body.add(hips);

  const dressPts = [
    new THREE.Vector2(0.34, 0),
    new THREE.Vector2(0.32, 0.1),
    new THREE.Vector2(0.26, 0.24),
    new THREE.Vector2(0.17, 0.4),
    new THREE.Vector2(0.12, 0.52),
  ];
  const skirt = lathe(dressPts, dress, { ...CLOTH_OPT, segments: 36 });
  skirt.position.y = 0.5;
  skirt.name = "skirt";
  body.add(skirt);

  const bottom = capsule(0.11, 0.36, 0x4a6a9a, CLOTH_OPT);
  bottom.position.y = 0.8;
  bottom.name = "bottom";
  bottom.visible = false;
  body.add(bottom);

  const hem = cyl(0.34, 0.32, 0.03, dress2, { ...CLOTH_OPT, segments: 28 });
  hem.position.y = 0.5;
  hem.name = "hem";
  body.add(hem);

  // Bodice
  const top = capsule(0.12, 0.2, dress, CLOTH_OPT);
  top.position.y = 1.3;
  top.name = "top";
  body.add(top);

  const chest = sphere(0.125, dress, { ...CLOTH_OPT, segments: 20 });
  chest.scale.set(1.12, 0.78, 0.9);
  chest.position.set(0, 1.34, 0.02);
  chest.name = "chest";
  body.add(chest);

  // Puff sleeves
  const sleeveL = sphere(0.09, dress, { ...CLOTH_OPT, segments: 14 });
  sleeveL.scale.set(1.15, 0.95, 1.05);
  sleeveL.position.set(-0.2, 1.3, 0);
  sleeveL.name = "sleeveL";
  const sleeveR = sleeveL.clone();
  sleeveR.position.x = 0.2;
  sleeveR.name = "sleeveR";
  body.add(sleeveL, sleeveR);

  // Arms
  const armL = capsule(0.05, 0.26, skin, skinOpt);
  armL.position.set(-0.22, 1.08, 0);
  armL.name = "armL";
  const armR = capsule(0.05, 0.26, skin, skinOpt);
  armR.position.set(0.22, 1.08, 0);
  armR.name = "armR";
  body.add(armL, armR);

  const handL = sphere(0.048, skin, { ...skinOpt, segments: 10 });
  handL.position.set(-0.22, 0.8, 0.02);
  handL.name = "handL";
  const handR = sphere(0.048, skin, { ...skinOpt, segments: 10 });
  handR.position.set(0.22, 0.8, 0.02);
  handR.name = "handR";
  body.add(handL, handR);

  // Neck
  const neck = capsule(0.048, 0.08, skin, skinOpt);
  neck.position.y = 1.46;
  neck.name = "neck";
  body.add(neck);

  // Head group
  const headG = new THREE.Group();
  headG.name = "headG";
  headG.position.y = 1.62;
  body.add(headG);

  const headR = 0.145;
  const head = sphere(headR, skin, { ...skinOpt, segments: 28 });
  head.name = "head";
  headG.add(head);

  // Hair cap (covers top + back — visible from behind)
  const hairCap = sphere(0.152, hairC, { roughness: 0.7, segments: 22 });
  hairCap.scale.set(1.08, 0.88, 1.05);
  hairCap.position.set(0, 0.04, -0.02);
  hairCap.name = "hairCap";
  headG.add(hairCap);

  const bang = sphere(0.095, hairC, { roughness: 0.7, segments: 14 });
  bang.scale.set(1.45, 0.5, 0.55);
  bang.position.set(0, 0.1, 0.06);
  bang.name = "bang";
  headG.add(bang);

  const bangL = sphere(0.05, hairC, { roughness: 0.7, segments: 10 });
  bangL.position.set(-0.1, 0.04, 0.06);
  bangL.name = "bangL";
  const bangR = bangL.clone();
  bangR.position.x = 0.1;
  bangR.name = "bangR";
  headG.add(bangL, bangR);

  // Twin tails (back)
  const twinL = capsule(0.045, 0.28, hairC, { roughness: 0.7 });
  twinL.position.set(-0.16, -0.08, -0.1);
  twinL.rotation.z = 0.45;
  twinL.rotation.x = 0.35;
  twinL.name = "twinL";
  const twinR = twinL.clone();
  twinR.position.x = 0.16;
  twinR.rotation.z = -0.45;
  twinR.name = "twinR";
  headG.add(twinL, twinR);

  const twinTipL = sphere(0.055, hairC, { roughness: 0.7, segments: 10 });
  twinTipL.position.set(-0.22, -0.28, -0.14);
  twinTipL.name = "twinTipL";
  const twinTipR = twinTipL.clone();
  twinTipR.position.x = 0.22;
  twinTipR.name = "twinTipR";
  headG.add(twinTipL, twinTipR);

  const bowL = sphere(0.035, 0xff6b8a, { roughness: 0.6, segments: 8 });
  bowL.position.set(-0.14, 0.0, -0.02);
  bowL.name = "bowL";
  const bowR = bowL.clone();
  bowR.position.x = 0.14;
  bowR.name = "bowR";
  headG.add(bowL, bowR);

  // 立体五官（正面）
  const face3d = createFace3D(opt);
  headG.add(face3d);

  // Crown
  const crown = new THREE.Group();
  crown.name = "crown";
  const crownBase = cyl(0.08, 0.09, 0.04, accent, CLOTH_OPT);
  crownBase.position.y = 0.14;
  crown.add(crownBase);
  [-0.05, 0, 0.05].forEach((x, i) => {
    const tip = sphere(0.02, [0xff6b8a, 0x7ec8ff, 0xff9ec0][i], { segments: 8 });
    tip.position.set(x, 0.2, 0);
    crown.add(tip);
  });
  headG.add(crown);

  const earrings = new THREE.Group();
  earrings.name = "earrings";
  [-1, 1].forEach((dir) => {
    const e = sphere(0.018, 0xfff8f0, { segments: 8 });
    e.position.set(dir * 0.14, -0.02, 0.04);
    earrings.add(e);
  });
  headG.add(earrings);

  const necklace = new THREE.Group();
  necklace.name = "necklace";
  const nCord = cyl(0.002, 0.002, 0.12, accent, CLOTH_OPT);
  nCord.rotation.z = Math.PI / 2;
  nCord.position.set(0, 1.14, 0.06);
  const bead = sphere(0.02, dress, { segments: 8 });
  bead.position.set(0, 1.1, 0.08);
  necklace.add(nCord, bead);
  body.add(necklace);

  const glasses = new THREE.Group();
  glasses.name = "glasses";
  [-1, 1].forEach((dir) => {
    const r = cyl(0.045, 0.045, 0.008, 0x3a3040, { roughness: 0.4, segments: 16 });
    r.rotation.x = Math.PI / 2;
    r.position.set(dir * 0.055, 0.0, 0.13);
    glasses.add(r);
  });
  headG.add(glasses);

  // Extra accessories (toggled)
  const flower = sphere(0.04, 0xff6b8a, { segments: 8 });
  flower.position.set(0.12, 0.08, 0.08);
  flower.name = "flower";
  flower.visible = false;
  headG.add(flower);

  const beret = sphere(0.1, 0xef6b8a, { roughness: 0.65, segments: 12 });
  beret.scale.set(1.2, 0.4, 1.1);
  beret.position.set(0.02, 0.16, 0);
  beret.name = "beret";
  beret.visible = false;
  headG.add(beret);

  const starClip = sphere(0.03, accent, { segments: 8 });
  starClip.position.set(-0.1, 0.1, 0.1);
  starClip.name = "starClip";
  starClip.visible = false;
  headG.add(starClip);

  const butterfly = softBox(0.08, 0.05, 0.02, 0xa78bfa);
  butterfly.position.set(0.12, 0.06, 0.1);
  butterfly.name = "butterfly";
  butterfly.visible = false;
  headG.add(butterfly);

  const catEar = new THREE.Group();
  catEar.name = "catEar";
  [-1, 1].forEach((dir) => {
    const ear = sphere(0.05, 0xffb6c1, { segments: 8 });
    ear.scale.set(0.7, 1.2, 0.5);
    ear.position.set(dir * 0.1, 0.16, 0);
    catEar.add(ear);
  });
  catEar.visible = false;
  headG.add(catEar);

  const hold = new THREE.Group();
  hold.name = "hold";
  hold.position.set(0.28, 0.82, 0.1);
  body.add(hold);

  const cartMount = new THREE.Group();
  cartMount.name = "cartMount";
  cartMount.position.set(0, 0, 0.62);
  root.add(cartMount);

  const nameTag = makeLabelSprite("小蜜糖", {
    bg: "rgba(239,107,138,0.9)",
    scaleX: 0.32,
    scaleY: 0.085,
    fontSize: 20,
  });
  nameTag.position.set(0, 1.98, 0);
  nameTag.name = "playerTag";
  root.add(nameTag);

  root.userData = {
    speed: 3.2,
    target: null,
    walking: false,
    hold,
    cartMount,
    face3d,
    hairMeshes: [hairCap, bang, bangL, bangR, twinL, twinR, twinTipL, twinTipR],
    sleeveMeshes: [sleeveL, sleeveR, chest, top],
    shoeMeshes: [body.getObjectByName("shoeL"), body.getObjectByName("shoeR")],
    pushingCart: false,
    sitting: false,
    kind: "player",
    animeOpt: opt,
  };

  applyMakeup(root, state);
  return root;
}

export function applyMakeup(avatar, state) {
  if (!avatar || avatar.userData?.kind === "dog") return;
  const opt = makeupToAnimeOpt(state);
  avatar.userData.animeOpt = opt;

  updateFace3DColors(avatar.getObjectByName("face3d") || avatar.userData.face3d, {
    lip: opt.lip,
    blush: opt.blush,
    hair: opt.hair,
  });

  (avatar.userData.hairMeshes || []).forEach((m) => setMatColor(m, opt.hair));

  setMatColor(avatar.getObjectByName("top"), opt.dress2 || opt.dress);
  setMatColor(avatar.getObjectByName("chest"), opt.dress);
  (avatar.userData.sleeveMeshes || []).forEach((m) => {
    if (m && m.name !== "top") setMatColor(m, opt.dress);
  });
  (avatar.userData.shoeMeshes || []).forEach((m) => setMatColor(m, opt.dress));

  const bottomMesh = avatar.getObjectByName("bottom");
  const skirt = avatar.getObjectByName("skirt");
  const hem = avatar.getObjectByName("hem");
  const hips = avatar.getObjectByName("hips");
  if (bottomMesh) setMatColor(bottomMesh, opt.dress2 || opt.dress);
  if (skirt) {
    setMatColor(skirt, opt.dress);
    skirt.visible = opt.skirt !== false;
    if (bottomMesh) bottomMesh.visible = opt.skirt === false;
  }
  if (hem) {
    hem.visible = opt.skirt !== false;
    setMatColor(hem, opt.dress2 || opt.dress);
  }
  if (hips) {
    hips.visible = opt.skirt !== false;
    setMatColor(hips, opt.dress);
  }

  const crown = avatar.getObjectByName("crown");
  const earrings = avatar.getObjectByName("earrings");
  const necklace = avatar.getObjectByName("necklace");
  const glasses = avatar.getObjectByName("glasses");
  const flower = avatar.getObjectByName("flower");
  const beret = avatar.getObjectByName("beret");
  const starClip = avatar.getObjectByName("starClip");
  const butterfly = avatar.getObjectByName("butterfly");
  const catEar = avatar.getObjectByName("catEar");
  if (crown) crown.visible = !!opt.crown;
  if (earrings) earrings.visible = !!opt.earrings;
  if (necklace) necklace.visible = !!opt.necklace;
  if (glasses) glasses.visible = !!opt.glasses;
  if (flower) flower.visible = !!opt.flower;
  if (beret) {
    beret.visible = !!opt.beret;
    if (opt.beretColor) setMatColor(beret, opt.beretColor);
  }
  if (starClip) starClip.visible = !!opt.star;
  if (butterfly) butterfly.visible = !!opt.butterfly;
  if (catEar) catEar.visible = !!opt.catEar;
}

export function createNPC(kind) {
  const root = new THREE.Group();
  root.name = kind;

  if (kind === "dog") {
    const body = capsule(0.14, 0.28, 0xd4a06a, { roughness: 0.6 });
    body.rotation.z = Math.PI / 2;
    body.position.set(0, 0.22, 0);
    body.name = "dogBody";
    const head = sphere(0.14, 0xd4a06a, { roughness: 0.6, segments: 16 });
    head.position.set(0.24, 0.3, 0);
    head.name = "dogHead";
    const snout = sphere(0.06, 0xc08050, { segments: 10 });
    snout.position.set(0.36, 0.26, 0);
    const earL = sphere(0.05, 0xb07840, { segments: 8 });
    earL.scale.set(0.7, 1.2, 0.5);
    earL.position.set(0.2, 0.4, 0.08);
    const earR = earL.clone();
    earR.position.z = -0.08;
    const eyeL = sphere(0.025, 0x2a1810, { segments: 6 });
    eyeL.position.set(0.32, 0.34, 0.07);
    const eyeR = eyeL.clone();
    eyeR.position.z = -0.07;
    root.add(body, head, snout, earL, earR, eyeL, eyeR);
    const paws = [];
    [
      [0.1, 0.06, 0.09],
      [0.1, 0.06, -0.09],
      [-0.12, 0.06, 0.09],
      [-0.12, 0.06, -0.09],
    ].forEach(([x, y, z]) => {
      const paw = sphere(0.05, 0xc08050, { segments: 8 });
      paw.position.set(x, y, z);
      paws.push(paw);
      root.add(paw);
    });
    const tag = makeLabelSprite("旺旺", {
      bg: "rgba(200,120,60,0.9)",
      scaleX: 0.28,
      scaleY: 0.08,
    });
    tag.position.set(0, 0.48, 0);
    tag.name = "npcTag";
    root.add(tag);
    root.userData = { sitY: 0.12, speed: 2.8, kind: "dog", paws, pose: "stand" };
    return root;
  }

  const preset = ANIME_PRESETS[kind] || ANIME_PRESETS.mom;
  const skin = hex3(preset.skin);
  const shirt = hex3(preset.dress);
  const pants = hex3(preset.dress2);
  const hairC = hex3(preset.hair);
  const skinOpt = { ...SKIN_OPT, emissive: skin };
  const male = !!preset.male;

  const legL = capsule(0.052, 0.4, pants, { roughness: 0.55 });
  legL.position.set(-0.09, 0.6, 0);
  legL.name = "legL";
  const legR = capsule(0.052, 0.4, pants, { roughness: 0.55 });
  legR.position.set(0.09, 0.6, 0);
  legR.name = "legR";
  const calfL = capsule(0.048, 0.34, pants, { roughness: 0.55 });
  calfL.position.set(-0.09, 0.24, 0);
  calfL.name = "calfL";
  const calfR = capsule(0.048, 0.34, pants, { roughness: 0.55 });
  calfR.position.set(0.09, 0.24, 0);
  calfR.name = "calfR";
  const shoeL = sphere(0.068, male ? 0x2c2430 : 0xff6b8a, { segments: 10 });
  shoeL.scale.set(1.1, 0.5, 1.3);
  shoeL.position.set(-0.09, 0.05, 0.04);
  shoeL.name = "shoeL";
  const shoeR = shoeL.clone();
  shoeR.position.x = 0.09;
  shoeR.name = "shoeR";

  const torso = capsule(0.12, 0.28, shirt, { roughness: 0.5 });
  torso.position.y = 1.2;
  torso.name = "torso";

  if (!male) {
    const pts = [
      new THREE.Vector2(0.24, 0),
      new THREE.Vector2(0.2, 0.12),
      new THREE.Vector2(0.13, 0.3),
    ];
    const skirtMesh = lathe(pts, pants, { roughness: 0.5, segments: 22 });
    skirtMesh.position.y = 0.58;
    skirtMesh.name = "npcSkirt";
    root.add(skirtMesh);
    if (kind === "cashier") {
      const apron = softBox(0.26, 0.3, 0.04, 0xffffff);
      apron.position.set(0, 1.12, 0.12);
      root.add(apron);
    }
  } else {
    const jeans = softBox(0.24, 0.22, 0.13, pants, { roughness: 0.6 });
    jeans.position.set(0, 0.76, 0);
    jeans.name = "jeans";
    root.add(jeans);
  }

  const neck = capsule(0.048, 0.08, skin, skinOpt);
  neck.position.y = 1.46;
  neck.name = "neck";

  const headG = new THREE.Group();
  headG.name = "headG";
  headG.position.y = 1.58;
  const headR = 0.14;
  const head = sphere(headR, skin, { ...skinOpt, segments: 24 });
  head.name = "head";

  const hair = sphere(0.148, hairC, { roughness: 0.68, segments: 18 });
  hair.position.set(0, 0.04, -0.02);
  hair.scale.set(1.08, 0.85, 1.02);
  hair.name = "npcHair";
  headG.add(head, hair);

  if (kind === "mom") {
    const bun = sphere(0.07, hairC, { roughness: 0.68, segments: 10 });
    bun.position.set(0, 0.16, -0.05);
    headG.add(bun);
  }
  if (kind === "dad") {
    const fringe = sphere(0.055, hairC, { roughness: 0.68, segments: 10 });
    fringe.scale.set(1.5, 0.4, 0.45);
    fringe.position.set(0, 0.1, 0.05);
    headG.add(fringe);
  }
  if (kind === "cashier") {
    const pony = capsule(0.04, 0.14, hairC, { roughness: 0.68 });
    pony.position.set(0, -0.04, -0.12);
    pony.rotation.x = 0.4;
    headG.add(pony);
  }

  const face3d = createFace3D({
    lip: preset.lip,
    blush: preset.blush,
    hair: preset.hair,
  });
  headG.add(face3d);

  const armL = capsule(0.042, 0.24, skin, skinOpt);
  armL.position.set(-0.2, 1.12, 0);
  armL.name = "armL";
  const armR = capsule(0.042, 0.24, skin, skinOpt);
  armR.position.set(0.2, 1.12, 0);
  armR.name = "armR";
  const handL = sphere(0.04, skin, { ...skinOpt, segments: 8 });
  handL.position.set(-0.2, 0.86, 0);
  handL.name = "handL";
  const handR = sphere(0.04, skin, { ...skinOpt, segments: 8 });
  handR.position.set(0.2, 0.86, 0);
  handR.name = "handR";

  root.add(legL, legR, calfL, calfR, shoeL, shoeR, torso, neck, headG, armL, armR, handL, handR);

  const label = NPC_LABELS[kind];
  if (label) {
    const tag = makeLabelSprite(label.text, {
      bg: label.bg,
      scaleX: 0.2,
      scaleY: 0.06,
      fontSize: 20,
    });
    // 贴在头顶稍上方，避免漂太远
    tag.position.set(0, 1.68, 0);
    tag.name = "npcTag";
    root.add(tag);
  }

  root.userData = {
    target: null,
    walking: false,
    speed: 2.6,
    kind,
    pose: "stand",
    face3d,
  };
  return root;
}

export function setSitPose(npc, sitting = true) {
  if (!npc || npc.userData.kind === "dog") return;
  const legL = npc.getObjectByName("legL");
  const legR = npc.getObjectByName("legR");
  const calfL = npc.getObjectByName("calfL");
  const calfR = npc.getObjectByName("calfR");
  const shoeL = npc.getObjectByName("shoeL");
  const shoeR = npc.getObjectByName("shoeR");
  const armL = npc.getObjectByName("armL");
  const armR = npc.getObjectByName("armR");
  const handL = npc.getObjectByName("handL");
  const handR = npc.getObjectByName("handR");
  const torso = npc.getObjectByName("torso");
  const headG = npc.getObjectByName("headG");
  const neckMesh = npc.getObjectByName("neck");
  const jeans = npc.getObjectByName("jeans");
  const skirt = npc.getObjectByName("npcSkirt");

  npc.userData.sitting = !!sitting;
  npc.userData.pose = sitting ? "sit" : "stand";

  if (sitting) {
    if (legL) {
      legL.rotation.x = Math.PI / 2.2;
      legL.position.set(-0.09, 0.55, 0.08);
    }
    if (legR) {
      legR.rotation.x = Math.PI / 2.2;
      legR.position.set(0.09, 0.55, 0.08);
    }
    if (calfL) {
      calfL.rotation.x = 0.15;
      calfL.position.set(-0.09, 0.3, 0.24);
    }
    if (calfR) {
      calfR.rotation.x = 0.15;
      calfR.position.set(0.09, 0.3, 0.24);
    }
    if (shoeL) shoeL.position.set(-0.09, 0.12, 0.34);
    if (shoeR) shoeR.position.set(0.09, 0.12, 0.34);
    if (torso) torso.position.y = 0.86;
    if (neckMesh) neckMesh.position.y = 1.12;
    if (headG) headG.position.y = 1.24;
    if (armL) {
      // 坐下时手臂自然垂放在腿上
      armL.position.set(-0.22, 0.7, 0.1);
      armL.rotation.x = 1.15;
      armL.rotation.z = 0.12;
    }
    if (armR) {
      armR.position.set(0.22, 0.7, 0.1);
      armR.rotation.x = 1.15;
      armR.rotation.z = -0.12;
    }
    if (handL) handL.position.set(-0.18, 0.48, 0.3);
    if (handR) handR.position.set(0.18, 0.48, 0.3);
    if (jeans) jeans.position.y = 0.52;
    if (skirt) skirt.position.y = 0.4;
  } else {
    if (legL) {
      legL.rotation.x = 0;
      legL.position.set(-0.09, 0.6, 0);
    }
    if (legR) {
      legR.rotation.x = 0;
      legR.position.set(0.09, 0.6, 0);
    }
    if (calfL) {
      calfL.rotation.x = 0;
      calfL.position.set(-0.09, 0.24, 0);
    }
    if (calfR) {
      calfR.rotation.x = 0;
      calfR.position.set(0.09, 0.24, 0);
    }
    if (shoeL) shoeL.position.set(-0.09, 0.05, 0.04);
    if (shoeR) shoeR.position.set(0.09, 0.05, 0.04);
    if (torso) torso.position.y = 1.2;
    if (neckMesh) neckMesh.position.y = 1.46;
    if (headG) headG.position.y = 1.58;
    if (armL) {
      armL.position.set(-0.2, 1.12, 0);
      armL.rotation.x = 0;
      armL.rotation.z = 0;
    }
    if (armR) {
      armR.position.set(0.2, 1.12, 0);
      armR.rotation.x = 0;
      armR.rotation.z = 0;
    }
    if (handL) handL.position.set(-0.2, 0.86, 0);
    if (handR) handR.position.set(0.2, 0.86, 0);
    if (jeans) jeans.position.y = 0.76;
    if (skirt) skirt.position.y = 0.58;
  }
}

export function setPlayerSit(avatar, sitting = true) {
  if (!avatar) return;
  const body = avatar.getObjectByName("body") || avatar;
  const legL = avatar.getObjectByName("legL");
  const legR = avatar.getObjectByName("legR");
  const shoeL = avatar.getObjectByName("shoeL");
  const shoeR = avatar.getObjectByName("shoeR");
  const skirt = avatar.getObjectByName("skirt");
  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  const handL = avatar.getObjectByName("handL");
  const handR = avatar.getObjectByName("handR");
  const headG = avatar.getObjectByName("headG");
  const top = avatar.getObjectByName("top");
  const neck = avatar.getObjectByName("neck");
  const hips = avatar.getObjectByName("hips");
  const chest = avatar.getObjectByName("chest");
  const sleeveL = avatar.getObjectByName("sleeveL");
  const sleeveR = avatar.getObjectByName("sleeveR");
  const hem = avatar.getObjectByName("hem");

  avatar.userData.sitting = !!sitting;

  if (sitting) {
    if (legL) {
      legL.rotation.x = Math.PI / 2.3;
      legL.position.set(-0.09, 0.55, 0.1);
    }
    if (legR) {
      legR.rotation.x = Math.PI / 2.3;
      legR.position.set(0.09, 0.55, 0.1);
    }
    if (shoeL) shoeL.position.set(-0.09, 0.2, 0.3);
    if (shoeR) shoeR.position.set(0.09, 0.2, 0.3);
    if (skirt) skirt.position.y = 0.32;
    if (hem) hem.position.y = 0.32;
    if (hips) hips.position.y = 0.7;
    if (top) top.position.y = 0.96;
    if (chest) chest.position.y = 1.0;
    if (sleeveL) sleeveL.position.y = 0.96;
    if (sleeveR) sleeveR.position.y = 0.96;
    if (neck) neck.position.y = 1.12;
    if (headG) headG.position.y = 1.28;
    if (armL) {
      armL.rotation.x = 0.35;
      armL.position.set(-0.22, 0.8, 0.05);
    }
    if (armR) {
      armR.rotation.x = 0.35;
      armR.position.set(0.22, 0.8, 0.05);
    }
    if (handL) handL.position.set(-0.22, 0.58, 0.12);
    if (handR) handR.position.set(0.22, 0.58, 0.12);
  } else {
    if (legL) {
      legL.rotation.x = 0;
      legL.position.set(-0.09, 0.42, 0);
    }
    if (legR) {
      legR.rotation.x = 0;
      legR.position.set(0.09, 0.42, 0);
    }
    if (shoeL) shoeL.position.set(-0.09, 0.05, 0.04);
    if (shoeR) shoeR.position.set(0.09, 0.05, 0.04);
    if (skirt) skirt.position.y = 0.5;
    if (hem) hem.position.y = 0.5;
    if (hips) hips.position.y = 1.02;
    if (top) top.position.y = 1.3;
    if (chest) chest.position.y = 1.34;
    if (sleeveL) sleeveL.position.y = 1.3;
    if (sleeveR) sleeveR.position.y = 1.3;
    if (neck) neck.position.y = 1.46;
    if (headG) headG.position.y = 1.62;
    if (armL) {
      armL.rotation.x = 0;
      armL.position.set(-0.22, 1.08, 0);
    }
    if (armR) {
      armR.rotation.x = 0;
      armR.position.set(0.22, 1.08, 0);
    }
    if (handL) handL.position.set(-0.22, 0.8, 0.02);
    if (handR) handR.position.set(0.22, 0.8, 0.02);
  }
  void body;
}

export function setLiePose(dog, lying = true) {
  if (!dog || dog.userData.kind !== "dog") return;
  const body = dog.getObjectByName("dogBody");
  const head = dog.getObjectByName("dogHead");
  if (lying) {
    if (body) {
      body.rotation.z = Math.PI / 2;
      body.position.set(0, 0.1, 0);
    }
    if (head) head.position.set(0.22, 0.16, 0.05);
    (dog.userData.paws || []).forEach((p, i) => {
      p.position.y = 0.04;
      p.position.z = i < 2 ? 0.12 : -0.02;
    });
    dog.userData.pose = "lie";
  } else {
    if (body) body.position.set(0, 0.22, 0);
    if (head) head.position.set(0.24, 0.3, 0);
    dog.userData.pose = "stand";
  }
}

export function setHoldingMesh(avatar, mesh) {
  const hold = avatar.userData.hold;
  if (!hold) return;
  while (hold.children.length) hold.remove(hold.children[0]);
  if (mesh) {
    mesh.position.set(0, 0, 0);
    hold.add(mesh);
  }
}

export function ensureCartMount(avatar) {
  if (!avatar) return null;
  if (avatar.userData.cartMount) return avatar.userData.cartMount;
  let mount = avatar.getObjectByName("cartMount");
  if (!mount) {
    mount = new THREE.Group();
    mount.name = "cartMount";
  }
  mount.position.set(0, 0, 0.62);
  avatar.add(mount);
  avatar.userData.cartMount = mount;
  return mount;
}

export function setPushCart(avatar, enabled) {
  ensureCartMount(avatar);
  const mount = avatar.userData.cartMount;
  while (mount.children.length) mount.remove(mount.children[0]);
  avatar.userData.pushingCart = !!enabled;

  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  const handL = avatar.getObjectByName("handL");
  const handR = avatar.getObjectByName("handR");

  if (!enabled) {
    if (armL) {
      armL.position.set(-0.22, 0.78, 0);
      armL.rotation.set(0, 0, 0);
    }
    if (armR) {
      armR.position.set(0.22, 0.78, 0);
      armR.rotation.set(0, 0, 0);
    }
    if (handL) handL.position.set(-0.22, 0.52, 0.02);
    if (handR) handR.position.set(0.22, 0.52, 0.02);
    return;
  }

  mount.position.set(0, 0, 0.58);
  const cart = createShoppingCart();
  cart.name = "pushCart";
  cart.scale.setScalar(0.88);
  mount.add(cart);

  if (armL) {
    armL.position.set(-0.12, 0.86, 0.18);
    armL.rotation.x = -0.75;
  }
  if (armR) {
    armR.position.set(0.12, 0.86, 0.18);
    armR.rotation.x = -0.75;
  }
  if (handL) handL.position.set(-0.12, 0.84, 0.35);
  if (handR) handR.position.set(0.12, 0.84, 0.35);
}

export function attachNpcCart(avatar) {
  ensureCartMount(avatar);
  setPushCart(avatar, true);
}

export function createPlateOrBowl(vessel, dish) {
  return createPlateSet(vessel, dish);
}

export function createBagMesh() {
  const g = new THREE.Group();
  const b1 = softBox(0.2, 0.28, 0.12, 0xf0c050);
  const b2 = softBox(0.18, 0.24, 0.1, 0xff9bb8);
  b2.position.set(0.12, -0.02, 0.05);
  g.add(b1, b2);
  return g;
}

export function createCartHoldMesh() {
  const cart = createShoppingCart();
  cart.scale.setScalar(0.55);
  return cart;
}

/** 立体走路：腿/臂绕关节摆动 */
export function updateWalkAnim(avatar, dt, moving) {
  const legL = avatar.getObjectByName("legL");
  const legR = avatar.getObjectByName("legR");
  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  if (!legL) return;

  const pushing = avatar.userData.pushingCart;
  if (avatar.userData.sitting) return;

  if (!moving) {
    legL.rotation.x = 0;
    if (legR) legR.rotation.x = 0;
    if (!pushing) {
      if (armL) armL.rotation.x = 0;
      if (armR) armR.rotation.x = 0;
    } else {
      if (armL) armL.rotation.x = -0.75;
      if (armR) armR.rotation.x = -0.75;
    }
    avatar.userData.walking = false;
    return;
  }

  avatar.userData.walking = true;
  avatar.userData.phase = (avatar.userData.phase || 0) + dt * 10;
  const s = Math.sin(avatar.userData.phase) * 0.55;
  legL.rotation.x = s;
  if (legR) legR.rotation.x = -s;
  if (pushing) {
    if (armL) armL.rotation.x = -0.75 + s * 0.04;
    if (armR) armR.rotation.x = -0.75 - s * 0.04;
  } else {
    if (armL) armL.rotation.x = -s * 0.5;
    if (armR) armR.rotation.x = s * 0.5;
  }
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
