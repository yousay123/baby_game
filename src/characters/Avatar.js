import * as THREE from "three";
import { cyl, sphere, capsule, lathe, makeLabelSprite } from "../core/builders.js";
import { createPlateSet, createShoppingCart, softBox } from "../core/props.js";
import { ANIME_PRESETS, makeupToAnimeOpt } from "./AnimeArt.js";

const SKIN_OPT = { roughness: 0.92, metalness: 0, emissiveIntensity: 0.08 };
const CLOTH_OPT = { roughness: 0.78, metalness: 0 };

const NPC_LABELS = {
  dad: { text: "爸爸", bg: "rgba(70,110,180,0.92)", scaleX: 0.52, scaleY: 0.15, fontSize: 40 },
  mom: { text: "妈妈", bg: "rgba(239,107,138,0.92)", scaleX: 0.52, scaleY: 0.15, fontSize: 40 },
  cashier: { text: "收银员", bg: "rgba(239,107,138,0.92)", scaleX: 0.48, scaleY: 0.13, fontSize: 34 },
  dog: { text: "旺旺", bg: "rgba(200,120,60,0.9)", scaleX: 0.36, scaleY: 0.1, fontSize: 28 },
  kidGirl: { text: "小美", bg: "rgba(255,140,180,0.92)", scaleX: 0.42, scaleY: 0.12, fontSize: 34 },
  kidBoy: { text: "小明", bg: "rgba(100,170,230,0.92)", scaleX: 0.42, scaleY: 0.12, fontSize: 34 },
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

  /** 大腿 Group(leg*) → 小腿 Group(calf*) → 鞋，走路可屈膝；静止腿距更近 */
  const makeLeg = (side) => {
    const x = side * 0.038;
    const thigh = new THREE.Group();
    thigh.name = side < 0 ? "legL" : "legR";
    thigh.position.set(x, 0.74, 0);

    const thighMesh = capsule(0.055, 0.3, 0xffd0dc, skinOpt);
    thighMesh.position.set(0, -0.17, 0);
    thighMesh.name = side < 0 ? "thighMeshL" : "thighMeshR";
    thigh.add(thighMesh);

    const calf = new THREE.Group();
    calf.name = side < 0 ? "calfL" : "calfR";
    calf.position.set(0, -0.36, 0);

    const calfSkin = capsule(0.048, 0.28, skin, skinOpt);
    calfSkin.position.set(0, -0.16, 0);
    calfSkin.name = side < 0 ? "calfSkinL" : "calfSkinR";
    calf.add(calfSkin);

    const calfPants = capsule(0.052, 0.28, 0x4a6a9a, CLOTH_OPT);
    calfPants.position.set(0, -0.16, 0);
    calfPants.name = side < 0 ? "calfPantsL" : "calfPantsR";
    calfPants.visible = false;
    calf.add(calfPants);

    const shoe = sphere(0.07, dress, { ...CLOTH_OPT, segments: 14 });
    shoe.scale.set(1.15, 0.48, 1.4);
    shoe.position.set(0, -0.34, 0.04);
    shoe.name = side < 0 ? "shoeL" : "shoeR";
    calf.add(shoe);

    thigh.add(calf);
    return thigh;
  };
  body.add(makeLeg(-1), makeLeg(1));

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

  // 裤装覆盖大腿，避免粉腿穿出
  const bottom = capsule(0.12, 0.5, 0x4a6a9a, CLOTH_OPT);
  bottom.position.y = 0.55;
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

  /**
   * 手臂：袖子挂在肩关节上与胳膊一体，上臂再套一截衣袖，避免「裸胳膊/掉袖子」
   */
  const makeArm = (side) => {
    const arm = new THREE.Group();
    arm.name = side < 0 ? "armL" : "armR";
    arm.position.set(side * 0.22, 1.36, 0.02);

    const sleeve = sphere(0.07, dress, { ...CLOTH_OPT, segments: 16 });
    sleeve.scale.set(1.15, 0.95, 1.05);
    sleeve.position.set(0, -0.02, 0);
    sleeve.name = side < 0 ? "sleeveL" : "sleeveR";
    arm.add(sleeve);

    // 上臂衣袖（衣服颜色）
    const sleeveTube = capsule(0.05, 0.2, dress, CLOTH_OPT);
    sleeveTube.position.set(0, -0.16, 0);
    sleeveTube.name = side < 0 ? "sleeveTubeL" : "sleeveTubeR";
    arm.add(sleeveTube);

    const upper = capsule(0.038, 0.12, skin, skinOpt);
    upper.position.set(0, -0.32, 0);
    upper.name = side < 0 ? "upperArmL" : "upperArmR";
    arm.add(upper);

    const lower = capsule(0.036, 0.18, skin, skinOpt);
    lower.position.set(0, -0.48, 0);
    lower.name = side < 0 ? "lowerArmL" : "lowerArmR";
    arm.add(lower);

    const hand = sphere(0.042, skin, { ...skinOpt, segments: 10 });
    hand.position.set(0, -0.6, 0.02);
    hand.name = side < 0 ? "handL" : "handR";
    arm.add(hand);

    arm.rotation.z = side * 0.08;
    return arm;
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);
  body.add(armL, armR);
  const sleeveL = armL.getObjectByName("sleeveL");
  const sleeveR = armR.getObjectByName("sleeveR");
  const sleeveTubeL = armL.getObjectByName("sleeveTubeL");
  const sleeveTubeR = armR.getObjectByName("sleeveTubeR");

  // Neck — 加长并与头部重叠，消除断裂感
  const neck = capsule(0.055, 0.14, skin, skinOpt);
  neck.position.y = 1.5;
  neck.name = "neck";
  body.add(neck);

  // Head group — 略下移，下巴盖住脖子上缘
  const headG = new THREE.Group();
  headG.name = "headG";
  headG.position.y = 1.58;
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
    const e = sphere(0.02, 0xfff8f0, { segments: 8 });
    e.position.set(dir * 0.148, -0.05, 0.05);
    const drop = sphere(0.012, accent, { segments: 6 });
    drop.position.set(dir * 0.148, -0.08, 0.05);
    earrings.add(e, drop);
  });
  headG.add(earrings);

  const necklace = new THREE.Group();
  necklace.name = "necklace";
  const nCord = cyl(0.002, 0.002, 0.14, accent, CLOTH_OPT);
  nCord.rotation.z = Math.PI / 2;
  nCord.position.set(0, 1.42, 0.08);
  const bead = sphere(0.022, dress, { segments: 8 });
  bead.position.set(0, 1.38, 0.1);
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

  const cap = new THREE.Group();
  cap.name = "cap";
  const capDome = sphere(0.1, 0xff8ab0, { segments: 12 });
  capDome.scale.set(1.15, 0.55, 1.1);
  capDome.position.set(0, 0.12, -0.02);
  const brim = softBox(0.14, 0.02, 0.1, 0xff8ab0);
  brim.position.set(0, 0.08, 0.1);
  cap.add(capDome, brim);
  cap.visible = false;
  headG.add(cap);

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

  // 手表 — 左臂腕部
  const watch = softBox(0.05, 0.035, 0.04, 0xff6b8a, CLOTH_OPT);
  watch.position.set(0, -0.55, 0.04);
  watch.name = "watch";
  watch.visible = false;
  const armLRef = body.getObjectByName("armL");
  if (armLRef) armLRef.add(watch);

  // 手链 — 右臂腕部
  const bracelet = cyl(0.035, 0.035, 0.02, accent, { metalness: 0.4, roughness: 0.3, segments: 12 });
  bracelet.position.set(0, -0.55, 0.02);
  bracelet.name = "bracelet";
  bracelet.visible = false;
  const armRRef = body.getObjectByName("armR");
  if (armRRef) armRRef.add(bracelet);

  const hold = new THREE.Group();
  hold.name = "hold";
  hold.position.set(0.02, -0.58, 0.08);
  if (armRRef) armRRef.add(hold);
  else {
    hold.position.set(0.28, 0.82, 0.1);
    body.add(hold);
  }

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
    sleeveMeshes: [sleeveL, sleeveR, sleeveTubeL, sleeveTubeR, chest, top],
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
  // 裤装时用裤管盖住小腿，避免腿穿出衣服
  const pantsMode = opt.skirt === false;
  ["calfPantsL", "calfPantsR"].forEach((n) => {
    const m = avatar.getObjectByName(n);
    if (m) {
      m.visible = pantsMode;
      if (pantsMode) setMatColor(m, opt.dress2 || opt.dress);
    }
  });
  ["calfSkinL", "calfSkinR"].forEach((n) => {
    const m = avatar.getObjectByName(n);
    if (m) m.visible = !pantsMode;
  });
  ["thighMeshL", "thighMeshR"].forEach((n) => {
    const m = avatar.getObjectByName(n);
    if (m) {
      if (pantsMode) setMatColor(m, opt.dress2 || opt.dress);
      else setMatColor(m, "#ffd0dc");
    }
  });
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
  const cap = avatar.getObjectByName("cap");
  const starClip = avatar.getObjectByName("starClip");
  const butterfly = avatar.getObjectByName("butterfly");
  const catEar = avatar.getObjectByName("catEar");
  const watch = avatar.getObjectByName("watch");
  const bracelet = avatar.getObjectByName("bracelet");
  if (crown) crown.visible = !!opt.crown;
  if (earrings) earrings.visible = !!opt.earrings;
  if (necklace) necklace.visible = !!opt.necklace;
  if (glasses) glasses.visible = !!opt.glasses;
  if (flower) flower.visible = !!opt.flower;
  if (beret) {
    beret.visible = !!opt.beret;
    if (opt.beretColor) setMatColor(beret, opt.beretColor);
  }
  if (cap) {
    cap.visible = !!opt.cap;
    if (opt.capColor) {
      cap.traverse((c) => {
        if (c.isMesh) setMatColor(c, opt.capColor);
      });
    }
  }
  if (starClip) starClip.visible = !!opt.star;
  if (butterfly) butterfly.visible = !!opt.butterfly;
  if (catEar) catEar.visible = !!opt.catEar;
  if (watch) {
    watch.visible = !!opt.watch;
    if (opt.watchColor) setMatColor(watch, opt.watchColor);
  }
  if (bracelet) {
    bracelet.visible = !!opt.bracelet;
    if (opt.braceletColor) setMatColor(bracelet, opt.braceletColor);
  }

  syncDressHold(avatar, opt);
}

/** 3D 手持：宝宝 / 道具按槽位挂到胳膊或手上 */
function syncDressHold(avatar, opt) {
  const hold = avatar.getObjectByName("hold");
  if (!hold) return;
  while (hold.children.length) hold.remove(hold.children[0]);

  const onArm = hold.parent?.name === "armL" || hold.parent?.name === "armR";
  const hasBaby = opt.babyKind && opt.babyKind !== "none";
  if (hasBaby) {
    hold.position.set(onArm ? 0.02 : 0.08, onArm ? -0.5 : 0.88, onArm ? 0.12 : 0.2);
    hold.add(createBabyHoldMesh(opt));
    return;
  }

  const prop = opt.prop;
  if (!prop || prop === "none") {
    hold.position.set(onArm ? 0.02 : 0.28, onArm ? -0.58 : 0.82, onArm ? 0.08 : 0.1);
    return;
  }
  hold.position.set(onArm ? 0.02 : 0.28, onArm ? -0.58 : 0.82, onArm ? 0.08 : 0.1);
  hold.add(createDressPropMesh(prop, opt.propColor));
}

function createBabyHoldMesh(opt) {
  const g = new THREE.Group();
  const c = hex3(opt.babyColor || "#ffb0c8");
  if (opt.babyKind === "babyBear" || opt.babyKind === "babyBunny") {
    const body = softBox(0.14, 0.16, 0.12, c);
    body.position.y = 0.02;
    const head = sphere(0.07, c, { segments: 10 });
    head.position.y = 0.12;
    g.add(body, head);
  } else {
    const wrap = softBox(0.14, 0.16, 0.12, hex3(opt.babyWrap || "#ffe0ec"));
    const head = sphere(0.065, hex3("#FFD2B8"), { segments: 10 });
    head.position.y = 0.12;
    g.add(wrap, head);
  }
  return g;
}

function createDressPropMesh(prop, color) {
  const c = hex3(color || "#FF6B8A");
  const g = new THREE.Group();
  if (prop === "bag") {
    const bag = softBox(0.12, 0.14, 0.06, c);
    g.add(bag);
  } else if (prop === "wand") {
    const stick = cyl(0.012, 0.012, 0.28, hex3("#FFC94A"));
    stick.position.y = 0.1;
    const tip = sphere(0.04, hex3("#FFC94A"), { segments: 8 });
    tip.position.y = 0.28;
    g.add(stick, tip);
  } else if (prop === "lollipop") {
    const stick = cyl(0.01, 0.01, 0.18, hex3("#FFE08A"));
    const candy = sphere(0.06, c, { segments: 10 });
    candy.position.y = 0.12;
    g.add(stick, candy);
  } else if (prop === "book") {
    g.add(softBox(0.12, 0.16, 0.04, c));
  } else if (prop === "bouquet") {
    g.add(sphere(0.09, c, { segments: 10 }));
  } else if (prop === "teddy") {
    g.add(sphere(0.08, c, { segments: 10 }));
  } else {
    g.add(softBox(0.1, 0.12, 0.08, c));
  }
  return g;
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

  const makeNpcLeg = (side) => {
    const x = side * 0.045;
    const thigh = new THREE.Group();
    thigh.name = side < 0 ? "legL" : "legR";
    thigh.position.set(x, 0.78, 0);

    const thighMesh = capsule(0.052, 0.34, pants, { roughness: 0.55 });
    thighMesh.position.set(0, -0.18, 0);
    thigh.add(thighMesh);

    const calf = new THREE.Group();
    calf.name = side < 0 ? "calfL" : "calfR";
    calf.position.set(0, -0.38, 0);

    const calfMesh = capsule(0.048, 0.3, pants, { roughness: 0.55 });
    calfMesh.position.set(0, -0.16, 0);
    calf.add(calfMesh);

    const shoe = sphere(0.068, male ? 0x2c2430 : 0xff6b8a, { segments: 10 });
    shoe.scale.set(1.1, 0.5, 1.3);
    shoe.position.set(0, -0.34, 0.04);
    shoe.name = side < 0 ? "shoeL" : "shoeR";
    calf.add(shoe);

    thigh.add(calf);
    return thigh;
  };
  const legL = makeNpcLeg(-1);
  const legR = makeNpcLeg(1);

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
    const jeans = softBox(0.24, 0.36, 0.14, pants, { roughness: 0.6 });
    jeans.position.set(0, 0.62, 0);
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
  if (kind === "kidGirl") {
    [-1, 1].forEach((side) => {
      const bun = sphere(0.055, hairC, { roughness: 0.68, segments: 10 });
      bun.position.set(side * 0.1, 0.12, -0.02);
      headG.add(bun);
    });
  }
  if (kind === "kidBoy") {
    const cap = softBox(0.2, 0.05, 0.18, hex3(preset.accent || "#4A90C8"), { roughness: 0.55 });
    cap.position.set(0, 0.14, 0.02);
    const brim = softBox(0.16, 0.02, 0.08, hex3(preset.accent || "#4A90C8"));
    brim.position.set(0, 0.12, 0.12);
    headG.add(cap, brim);
  }

  const face3d = createFace3D({
    lip: preset.lip,
    blush: preset.blush,
    hair: preset.hair,
  });
  headG.add(face3d);

  /** NPC 手臂：肩袖 + 衣袖管与胳膊一体 */
  const makeNpcArm = (side) => {
    const arm = new THREE.Group();
    arm.name = side < 0 ? "armL" : "armR";
    arm.position.set(side * 0.22, 1.34, 0.02);

    const shoulder = sphere(male ? 0.055 : 0.062, shirt, { roughness: 0.5, segments: 12 });
    shoulder.scale.set(1.1, 0.9, 1.0);
    shoulder.position.set(0, -0.02, 0);
    shoulder.name = side < 0 ? "npcShoulderL" : "npcShoulderR";
    arm.add(shoulder);

    const sleeveTube = capsule(0.048, 0.22, shirt, { roughness: 0.5 });
    sleeveTube.position.set(0, -0.18, 0);
    arm.add(sleeveTube);

    const forearm = capsule(0.038, 0.18, skin, skinOpt);
    forearm.position.set(0, -0.4, 0);
    arm.add(forearm);

    const hand = sphere(0.038, skin, { ...skinOpt, segments: 8 });
    hand.position.set(0, -0.52, 0);
    hand.name = side < 0 ? "handL" : "handR";
    arm.add(hand);
    arm.rotation.z = side * 0.06;
    return arm;
  };
  const armL = makeNpcArm(-1);
  const armR = makeNpcArm(1);

  root.add(legL, legR, torso, neck, headG, armL, armR);

  const label = NPC_LABELS[kind];
  if (label) {
    const tag = makeLabelSprite(label.text, {
      bg: label.bg,
      scaleX: label.scaleX ?? 0.42,
      scaleY: label.scaleY ?? 0.12,
      fontSize: label.fontSize ?? 34,
    });
    // 贴在头顶稍上方（坐下时由 setSitPose 再压低）
    tag.position.set(0, kind.startsWith("kid") ? 1.65 : 1.78, 0);
    tag.name = "npcTag";
    root.add(tag);
  }

  if (kind === "kidGirl" || kind === "kidBoy") {
    root.scale.setScalar(0.72);
  }

  root.userData = {
    target: null,
    walking: false,
    speed: kind.startsWith("kid") ? 1.8 : 2.6,
    kind,
    pose: "stand",
    face3d,
    pauseT: 0,
  };
  return root;
}

export function setSitPose(npc, sitting = true, opts = {}) {
  if (!npc || npc.userData.kind === "dog") return;
  const legL = npc.getObjectByName("legL");
  const legR = npc.getObjectByName("legR");
  const calfL = npc.getObjectByName("calfL");
  const calfR = npc.getObjectByName("calfR");
  const armL = npc.getObjectByName("armL");
  const armR = npc.getObjectByName("armR");
  const torso = npc.getObjectByName("torso");
  const headG = npc.getObjectByName("headG");
  const neckMesh = npc.getObjectByName("neck");
  const jeans = npc.getObjectByName("jeans");
  const skirt = npc.getObjectByName("npcSkirt");
  const seatY = opts.seatY != null ? opts.seatY : 0.48;

  npc.userData.sitting = !!sitting;
  npc.userData.pose = sitting ? "sit" : "stand";
  const npcTag = npc.getObjectByName("npcTag");

  if (sitting) {
    // 屁股落在椅面；大腿朝前水平，小腿自然下垂
    npc.position.y = seatY;
    if (legL) {
      legL.rotation.x = -Math.PI / 2.05;
      legL.position.set(-0.08, 0.1, 0.04);
    }
    if (legR) {
      legR.rotation.x = -Math.PI / 2.05;
      legR.position.set(0.08, 0.1, 0.04);
    }
    if (calfL) {
      calfL.rotation.x = Math.PI / 2.05;
      calfL.position.set(0, -0.36, 0);
    }
    if (calfR) {
      calfR.rotation.x = Math.PI / 2.05;
      calfR.position.set(0, -0.36, 0);
    }
    if (torso) torso.position.y = 0.42;
    if (neckMesh) neckMesh.position.y = 0.68;
    if (headG) headG.position.y = 0.8;
    // 名牌贴在坐下后的头顶，避免漂很高
    if (npcTag) npcTag.position.y = 1.05;
    if (armL) {
      armL.position.set(-0.22, 0.56, 0.08);
      armL.rotation.x = -0.45;
      armL.rotation.z = 0.06;
      armL.rotation.y = 0;
    }
    if (armR) {
      armR.position.set(0.22, 0.56, 0.08);
      armR.rotation.x = -0.45;
      armR.rotation.z = -0.06;
      armR.rotation.y = 0;
    }
    if (jeans) jeans.position.y = 0.12;
    if (skirt) skirt.position.y = 0.08;
  } else {
    npc.position.y = 0;
    if (npcTag) npcTag.position.y = 1.78;
    if (legL) {
      legL.rotation.x = 0;
      legL.position.set(-0.045, 0.78, 0);
    }
    if (legR) {
      legR.rotation.x = 0;
      legR.position.set(0.045, 0.78, 0);
    }
    if (calfL) {
      calfL.rotation.x = 0;
      calfL.position.set(0, -0.38, 0);
    }
    if (calfR) {
      calfR.rotation.x = 0;
      calfR.position.set(0, -0.38, 0);
    }
    if (torso) torso.position.y = 1.2;
    if (neckMesh) neckMesh.position.y = 1.46;
    if (headG) headG.position.y = 1.58;
    if (armL) {
      armL.position.set(-0.22, 1.34, 0.02);
      armL.rotation.set(0, 0, -0.06);
    }
    if (armR) {
      armR.position.set(0.22, 1.34, 0.02);
      armR.rotation.set(0, 0, 0.06);
    }
    if (jeans) jeans.position.y = 0.62;
    if (skirt) skirt.position.y = 0.58;
  }
}

export function setPlayerSit(avatar, sitting = true, opts = {}) {
  if (!avatar) return;
  const body = avatar.getObjectByName("body") || avatar;
  const legL = avatar.getObjectByName("legL");
  const legR = avatar.getObjectByName("legR");
  const calfL = avatar.getObjectByName("calfL");
  const calfR = avatar.getObjectByName("calfR");
  const skirt = avatar.getObjectByName("skirt");
  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  const headG = avatar.getObjectByName("headG");
  const top = avatar.getObjectByName("top");
  const neck = avatar.getObjectByName("neck");
  const hips = avatar.getObjectByName("hips");
  const chest = avatar.getObjectByName("chest");
  const sleeveL = avatar.getObjectByName("sleeveL");
  const sleeveR = avatar.getObjectByName("sleeveR");
  const hem = avatar.getObjectByName("hem");
  const bottom = avatar.getObjectByName("bottom");
  const seatY = opts.seatY != null ? opts.seatY : 0.48;

  avatar.userData.sitting = !!sitting;

  if (sitting) {
    avatar.position.y = seatY;
    if (legL) {
      legL.rotation.x = -Math.PI / 2.05;
      legL.position.set(-0.08, 0.1, 0.05);
    }
    if (legR) {
      legR.rotation.x = -Math.PI / 2.05;
      legR.position.set(0.08, 0.1, 0.05);
    }
    if (calfL) {
      calfL.rotation.x = Math.PI / 2.05;
      calfL.position.set(0, -0.34, 0);
    }
    if (calfR) {
      calfR.rotation.x = Math.PI / 2.05;
      calfR.position.set(0, -0.34, 0);
    }
    if (skirt) skirt.position.y = 0.02;
    if (hem) hem.position.y = 0.02;
    if (hips) hips.position.y = 0.2;
    if (bottom) bottom.position.y = 0.08;
    if (top) top.position.y = 0.42;
    if (chest) chest.position.y = 0.48;
    // 袖子已挂在手臂上，只调肩关节
    if (neck) neck.position.y = 0.66;
    if (headG) headG.position.y = 0.78;
    if (armL) {
      armL.rotation.set(-0.45, 0, -0.06);
      armL.position.set(-0.2, 0.56, 0.08);
    }
    if (armR) {
      armR.rotation.set(-0.45, 0, 0.06);
      armR.position.set(0.2, 0.56, 0.08);
    }
  } else {
    avatar.position.y = 0;
    resetIdleStance(avatar);
    if (skirt) skirt.position.y = 0.5;
    if (hem) hem.position.y = 0.5;
    if (hips) hips.position.y = 1.02;
    if (bottom) bottom.position.y = 0.55;
    if (top) top.position.y = 1.3;
    if (chest) chest.position.y = 1.34;
    if (neck) neck.position.y = 1.5;
    if (headG) headG.position.y = 1.58;
    if (armL) {
      armL.rotation.set(0, 0, -0.08);
      armL.position.set(-0.22, 1.36, 0.02);
    }
    if (armR) {
      armR.rotation.set(0, 0, 0.08);
      armR.position.set(0.22, 1.36, 0.02);
    }
  }
  void body;
  void sleeveL;
  void sleeveR;
}

/** 站立静止：双腿并拢复位 */
export function resetIdleStance(avatar) {
  if (!avatar || avatar.userData.sitting) return;
  const isPlayer = !!avatar.getObjectByName("body");
  const legL = avatar.getObjectByName("legL");
  const legR = avatar.getObjectByName("legR");
  const calfL = avatar.getObjectByName("calfL");
  const calfR = avatar.getObjectByName("calfR");
  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  const hipY = isPlayer ? 0.74 : 0.78;
  const calfY = isPlayer ? -0.36 : -0.38;
  // NPC 静止时双腿更并拢，避免像卡住叉开
  const hipX = isPlayer ? 0.038 : 0.028;
  if (legL) {
    legL.rotation.set(0, 0, 0);
    legL.position.set(-hipX, hipY, 0);
  }
  if (legR) {
    legR.rotation.set(0, 0, 0);
    legR.position.set(hipX, hipY, 0);
  }
  if (calfL) {
    calfL.rotation.set(0, 0, 0);
    calfL.position.set(0, calfY, 0);
  }
  if (calfR) {
    calfR.rotation.set(0, 0, 0);
    calfR.position.set(0, calfY, 0);
  }
  if (!avatar.userData.pushingCart) {
    if (armL) {
      armL.rotation.x = 0;
      armL.rotation.z = isPlayer ? -0.08 : -0.06;
    }
    if (armR) {
      armR.rotation.x = 0;
      armR.rotation.z = isPlayer ? 0.08 : 0.06;
    }
  }
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

  if (!enabled) {
    if (armL) {
      armL.position.set(-0.22, 1.36, 0.02);
      armL.rotation.set(0, 0, -0.08);
    }
    if (armR) {
      armR.position.set(0.22, 1.36, 0.02);
      armR.rotation.set(0, 0, 0.08);
    }
    return;
  }

  mount.position.set(0, 0, 0.58);
  const cart = createShoppingCart();
  cart.name = "pushCart";
  cart.scale.setScalar(0.88);
  mount.add(cart);

  if (armL) {
    armL.position.set(-0.22, 1.2, 0.12);
    armL.rotation.set(-0.75, 0, 0.1);
  }
  if (armR) {
    armR.position.set(0.22, 1.2, 0.12);
    armR.rotation.set(-0.75, 0, -0.1);
  }
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

/** 立体走路：大腿摆动 + 小腿屈膝 + 手臂摆动 */
export function updateWalkAnim(avatar, dt, moving) {
  const legL = avatar.getObjectByName("legL");
  const legR = avatar.getObjectByName("legR");
  const calfL = avatar.getObjectByName("calfL");
  const calfR = avatar.getObjectByName("calfR");
  const armL = avatar.getObjectByName("armL");
  const armR = avatar.getObjectByName("armR");
  if (!legL) return;

  const pushing = avatar.userData.pushingCart;
  if (avatar.userData.sitting) return;

  if (!moving) {
    resetIdleStance(avatar);
    if (pushing) {
      if (armL) armL.rotation.x = -0.75;
      if (armR) armR.rotation.x = -0.75;
    }
    avatar.userData.walking = false;
    avatar.userData.phase = 0;
    return;
  }

  avatar.userData.walking = true;
  avatar.userData.phase = (avatar.userData.phase || 0) + dt * 10;
  const s = Math.sin(avatar.userData.phase) * 0.5;
  legL.rotation.x = s;
  if (legR) legR.rotation.x = -s;
  // 摆到后方时屈膝，小腿跟着动
  if (calfL) calfL.rotation.x = Math.max(0, -s) * 0.9;
  if (calfR) calfR.rotation.x = Math.max(0, s) * 0.9;
  if (pushing) {
    if (armL) armL.rotation.x = -0.75 + s * 0.06;
    if (armR) armR.rotation.x = -0.75 - s * 0.06;
  } else {
    if (armL) armL.rotation.x = -s * 0.55;
    if (armR) armR.rotation.x = s * 0.55;
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
