import * as THREE from "three";
import { buildRoom, addWarmLights, box, makeInteractable, makeLabelSprite } from "../core/builders.js";
import { COLORS, MARKET_GOODS } from "../core/constants.js";
import {
  createPlayerAvatar,
  createNPC,
  moveToward,
  updateWalkAnim,
  applyMakeup,
} from "../characters/Avatar.js";
import { SteamEmitter } from "../fx/SteamEmitter.js";
import { togglePower, addToCart } from "../ui/HUD.js";
import {
  createVanity,
  createStool,
  createSofa,
  createCoffeeTable,
  createTVStand,
  createFloorLamp,
  createAC,
  createCeilingLamp,
  createBookshelf,
  createDogBed,
  createRug,
  createSideTable,
  createPlant,
  createWindow,
  createMarketShelf,
  createShoppingCart,
  createCheckoutCounter,
  createAutoDoor,
} from "../core/props.js";

function clampWalk(x, z, halfW = 5.2, halfD = 4.2) {
  return {
    x: Math.max(-halfW, Math.min(halfW, x)),
    z: Math.max(-halfD, Math.min(halfD, z)),
  };
}

export class BaseScene {
  constructor(id) {
    this.id = id;
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x2a1824);
    this.player = null;
    this.steams = [];
    this.anchors = {};
  }

  setupCommon(game, roomOpts) {
    this.threeScene.clear();
    this.steams = [];
    this.threeScene.background = new THREE.Color(roomOpts.bg || 0x2a1824);
    this.threeScene.fog = new THREE.Fog(roomOpts.bg || 0x2a1824, 16, 32);
    addWarmLights(this.threeScene, { intensity: roomOpts.lightIntensity || 1 });
    const room = buildRoom(roomOpts);
    this.threeScene.add(room);
    this.floor = room.getObjectByName("floor");

    this.player = createPlayerAvatar(game.state);
    applyMakeup(this.player, game.state);
    this.player.position.set(0, 0, 3);
    this.threeScene.add(this.player);
    game.player = this.player;
    game.syncCarryVisual();
  }

  handleClick(game, point, interactive) {
    if (interactive) {
      this.onInteract(game, interactive);
      return;
    }
    if (point) {
      const p = clampWalk(point.x, point.z, this.walkHalfW ?? 5.2, this.walkHalfD ?? 4.2);
      this.player.userData.target = new THREE.Vector3(p.x, 0, p.z);
      this.player.userData.walking = true;
      this.player.userData.onArrive = null;
    }
  }

  walkTo(pos, onArrive) {
    this.player.userData.target = new THREE.Vector3(pos.x, 0, pos.z);
    this.player.userData.walking = true;
    this.player.userData.onArrive = onArrive || null;
  }

  onInteract() {}

  update(dt) {
    if (!this.player) return;
    const walking = moveToward(
      this.player,
      this.player.userData.target,
      this.player.userData.speed,
      dt
    );
    this.player.userData.walking = walking;
    if (!walking && this.player.userData.onArrive) {
      const cb = this.player.userData.onArrive;
      this.player.userData.onArrive = null;
      this.player.userData.target = null;
      cb();
    }
    updateWalkAnim(this.player, dt, walking);
    for (const s of this.steams) s.update(dt);
  }

  onLeave() {
    for (const s of this.steams) s.dispose();
    this.steams = [];
  }

  attachSteam(parent, y = 0.15) {
    const steam = new SteamEmitter();
    steam.root.position.y = y;
    parent.add(steam.root);
    this.steams.push(steam);
    return steam;
  }

  makeDoor(to, label, x, z, color = COLORS.wood) {
    const door = box(1.15, 2.3, 0.18, color);
    door.position.set(x, 1.15, z);
    const panel = box(0.9, 1.8, 0.04, darkenDoor(color));
    panel.position.set(x, 1.15, z + 0.08);
    const knob = box(0.06, 0.06, 0.06, 0xe8d080);
    knob.position.set(x + 0.4, 1.1, z + 0.14);
    makeInteractable(door, { type: "door", to });
    makeInteractable(panel, { type: "door", to });
    const spr = makeLabelSprite(label);
    spr.position.set(x, 2.55, z);
    this.threeScene.add(door, panel, knob, spr);
    return door;
  }
}

function darkenDoor(hex) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(0.85);
  return c.getHex();
}

export class MakeupScene extends BaseScene {
  constructor() {
    super("makeup");
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 10,
      depth: 8,
      wallColor: 0xffe8f0,
      floorColor: 0xf0d0c8,
      accent: 0xffc0d8,
      style: "home",
      bg: 0x3a2030,
    });
    this.walkHalfW = 4;
    this.walkHalfD = 3;

    const vanity = createVanity();
    vanity.position.set(0, 0, -2.4);
    this.threeScene.add(vanity);

    const stool = createStool();
    stool.position.set(0, 0, -1.0);
    this.threeScene.add(stool);

    const lamp = createFloorLamp();
    lamp.position.set(2.8, 0, -2.2);
    this.threeScene.add(lamp);
    const glow = new THREE.PointLight(0xffe0b0, 0.9, 6);
    glow.position.set(2.8, 1.6, -2.2);
    this.threeScene.add(glow);

    this.threeScene.add(createPlant(-3.2, -2));
    const rug = createRug();
    rug.scale.set(0.7, 1, 0.6);
    rug.position.set(0, 0, 0.5);
    this.threeScene.add(rug);

    const wardrobe = createBookshelf();
    wardrobe.position.set(-3.5, 0, 1);
    this.threeScene.add(wardrobe);

    this.player.position.set(0, 0, 0.8);
    game.camera.position.set(0, 3.4, 5.8);
    game.camera.lookAt(0, 1.2, -1);
  }
}

export class MarketScene extends BaseScene {
  constructor() {
    super("market");
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 14,
      depth: 12,
      wallColor: 0xf8f4ee,
      floorColor: 0xdcc8a8,
      accent: 0xffe08a,
      style: "market",
      bg: 0x2a2430,
      lightIntensity: 1.1,
    });
    this.walkHalfW = 6;
    this.walkHalfD = 5;
    game.camera.position.set(0, 9.5, 12.5);
    game.camera.lookAt(0, 0.2, -1);

    for (let i = 0; i < 5; i++) {
      const fridge = box(2.2, 2.0, 0.7, 0xe8f4ff, { metalness: 0.2, roughness: 0.35 });
      fridge.position.set(-5 + i * 2.5, 1.1, -5.2);
      const glass = box(2.0, 1.6, 0.05, 0xa8d8ff, { transparent: true, opacity: 0.45 });
      glass.position.set(-5 + i * 2.5, 1.2, -4.85);
      this.threeScene.add(fridge, glass);
    }

    const labels = { veg: "蔬菜", drinks: "饮料", daily: "粮油", snack: "零食" };
    Object.keys(MARKET_GOODS).forEach((cat, i) => {
      const shelf = createMarketShelf(cat, labels[cat] || cat);
      shelf.position.set(-4.5 + i * 3.0, 0, -3.2);
      makeInteractable(shelf, { type: "shelf", cat });
      this.threeScene.add(shelf);
    });

    const cartPad = box(2.2, 0.05, 1.8, 0x3b82c4);
    cartPad.position.set(-5, 0.1, 3.5);
    makeInteractable(cartPad, { type: "carts" });
    const cart1 = createShoppingCart();
    cart1.position.set(-5.4, 0, 3.3);
    const cart2 = createShoppingCart();
    cart2.position.set(-4.6, 0, 3.7);
    cart2.rotation.y = 0.3;
    const cartLabel = makeLabelSprite("购物车");
    cartLabel.position.set(-5, 1.5, 3.5);
    this.threeScene.add(cartPad, cart1, cart2, cartLabel);

    const checkout = createCheckoutCounter();
    checkout.position.set(5, 0, 3.2);
    makeInteractable(checkout, { type: "checkout" });
    const checkLabel = makeLabelSprite("收银台");
    checkLabel.position.set(5, 2.2, 3.2);
    this.threeScene.add(checkout, checkLabel);

    const exit = createAutoDoor();
    exit.position.set(6.2, 0, -0.5);
    makeInteractable(exit, { type: "exitHome" });
    const exitLabel = makeLabelSprite("出口回家");
    exitLabel.position.set(6.2, 2.7, -0.5);
    this.threeScene.add(exit, exitLabel, createPlant(5.5, -3));

    this.player.position.set(-4, 0, 4);
  }

  onInteract(game, interactive) {
    const { type, cat } = interactive.data;
    const target = interactive.object.position;
    this.walkTo({ x: target.x, z: Math.min(target.z + 1.4, 5) }, () => {
      if (type === "carts") {
        game.state.hasCart = true;
        game.emit();
        game.toast("拿到购物车啦，去货架选购吧");
        game.syncCarryVisual();
      } else if (type === "shelf") {
        this.openShelf(game, cat);
      } else if (type === "checkout") {
        game.ui.doCheckout(game.state);
      } else if (type === "exitHome") {
        if (game.state.cart.length) {
          game.toast("还没结账哦");
          return;
        }
        game.go("home");
        game.toast(game.state.bag.length ? "提着购物袋到家啦" : "到家啦");
      }
    });
  }

  openShelf(game, cat) {
    const goods = MARKET_GOODS[cat] || [];
    const wrap = document.createElement("div");
    wrap.innerHTML = goods
      .map(
        (g) =>
          `<div style="display:flex;justify-content:space-between;margin:6px 0;align-items:center">
            <span>${g.icon || ""} ${g.name} ¥${g.price}</span>
            <button type="button" class="btn btn-coral" data-gid="${g.id}">放入购物车</button>
          </div>`
      )
      .join("");
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-gid]");
      if (!b) return;
      const g = goods.find((x) => x.id === b.dataset.gid);
      const res = addToCart(game.state, g);
      game.toast(res.msg);
    });
    game.ui.openModal("货架选购", wrap, [{ label: "关闭", className: "btn-ghost" }]);
  }
}

export class HomeScene extends BaseScene {
  constructor() {
    super("home");
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 12,
      depth: 10,
      wallColor: 0xfff5f0,
      floorColor: 0xd4b090,
      accent: 0xffd0e0,
      style: "home",
      bg: 0x2a1824,
    });
    this.walkHalfW = 5;
    this.walkHalfD = 4;
    game.camera.position.set(0, 8.2, 11.2);
    game.camera.lookAt(0, 0.5, 0);

    this.threeScene.add(createWindow(0, 2.3, -4.85));

    const rug = createRug();
    rug.position.set(-0.5, 0, 0.8);
    this.threeScene.add(rug);

    const sofa = createSofa();
    sofa.position.set(-2.2, 0, 1.2);
    sofa.rotation.y = 0.15;
    makeInteractable(sofa, { type: "furn", key: "sofa" });
    this.threeScene.add(sofa);

    const table = createCoffeeTable();
    table.position.set(-1.5, 0, 2.4);
    makeInteractable(table, { type: "furn", key: "table" });
    this.threeScene.add(table);

    const side = createSideTable();
    side.position.set(-4.2, 0, 0.8);
    this.threeScene.add(side);

    const tvStand = createTVStand();
    tvStand.position.set(3.6, 0, -3.6);
    makeInteractable(tvStand, { type: "furn", key: "tv" });
    this.tvScreen = tvStand.userData.screen;
    this.threeScene.add(tvStand);

    const lamp = createFloorLamp();
    lamp.position.set(-4.6, 0, -2.2);
    makeInteractable(lamp, { type: "furn", key: "lamp" });
    this.lampMesh = lamp;
    this.lampGlow = new THREE.PointLight(0xffe0a0, 0, 5);
    this.lampGlow.position.set(-4.6, 1.6, -2.2);
    this.threeScene.add(lamp, this.lampGlow);

    const shelf = createBookshelf();
    shelf.position.set(-4.8, 0, -3.5);
    makeInteractable(shelf, { type: "furn", key: "shelf" });
    this.threeScene.add(shelf);

    const plant = createPlant(5, -3.2);
    makeInteractable(plant, { type: "furn", key: "plant" });
    this.threeScene.add(plant);

    const dogbed = createDogBed();
    dogbed.position.set(1.2, 0, 2.8);
    makeInteractable(dogbed, { type: "furn", key: "dogbed" });
    this.threeScene.add(dogbed);

    const ac = createAC();
    ac.position.set(2.5, 3.3, -4.7);
    makeInteractable(ac, { type: "furn", key: "ac" });
    this.acMesh = ac;
    this.threeScene.add(ac);

    const ceilLamp = createCeilingLamp();
    ceilLamp.position.set(0, 3.85, 0);
    makeInteractable(ceilLamp, { type: "furn", key: "light" });
    this.ceilLampMesh = ceilLamp;
    this.ceilLight = new THREE.PointLight(0xfff0e0, 0.85, 14);
    this.ceilLight.position.set(0, 3.5, 0);
    this.threeScene.add(ceilLamp, this.ceilLight);

    this.makeDoor("kitchen", "厨房", -5.4, -1, 0x8a5a38);
    this.makeDoor("dining", "餐厅", 5.4, -1, 0xc48a5a);
    this.makeDoor("market", "出门", 0, 4.6, 0x88b0d0);

    this.dad = createNPC("dad");
    this.dad.position.set(1.5, 0, -1);
    this.mom = createNPC("mom");
    this.mom.position.set(2.4, 0, -0.4);
    this.dog = createNPC("dog");
    this.dog.position.set(1.2, 0, 2.5);
    makeInteractable(this.dad, { type: "npc", key: "dad" });
    makeInteractable(this.mom, { type: "npc", key: "mom" });
    makeInteractable(this.dog, { type: "npc", key: "dog" });
    this.threeScene.add(this.dad, this.mom, this.dog);

    this.player.position.set(0, 0, 3);
    this.applyPowerVisuals(game.state);
  }

  applyPowerVisuals(state) {
    if (this.tvScreen) {
      this.tvScreen.material.color.set(state.power.tv ? 0x7ec8ff : 0x1a2030);
      this.tvScreen.material.emissive = new THREE.Color(state.power.tv ? 0x446688 : 0x000000);
      this.tvScreen.material.emissiveIntensity = state.power.tv ? 0.6 : 0;
    }
    if (this.lampGlow) this.lampGlow.intensity = state.power.lamp ? 1.3 : 0;
    if (this.lampMesh?.userData.bulb) {
      this.lampMesh.userData.bulb.material.emissiveIntensity = state.power.lamp ? 0.9 : 0.1;
    }
    if (this.ceilLight) this.ceilLight.intensity = state.power.light ? 0.9 : 0.12;
    if (this.ceilLampMesh?.userData.bulb) {
      this.ceilLampMesh.userData.bulb.material.emissiveIntensity = state.power.light ? 0.8 : 0.05;
    }
    if (this.acMesh?.userData.led) {
      this.acMesh.userData.led.material.color.set(state.power.ac ? 0x4ade80 : 0x666666);
    }
  }

  onInteract(game, interactive) {
    const d = interactive.data;
    const target = interactive.object.position;
    this.walkTo({ x: target.x, z: Math.min(target.z + 1, 3.5) }, () => {
      if (d.type === "door") {
        game.go(d.to);
        return;
      }
      if (d.type === "furn") {
        if (d.key === "sofa") {
          game.toast("小蜜糖在沙发上坐了一会儿～");
          return;
        }
        if (d.key === "table") {
          game.toast("茶几上有遥控器，可以开电视～");
          return;
        }
        if (d.key === "shelf") {
          game.toast("书架上摆着全家福和故事书～");
          return;
        }
        if (d.key === "plant") {
          game.toast("绿植绿油油的，浇了一点水～");
          return;
        }
        if (d.key === "dogbed") {
          game.toast("这是旺旺的小窝～");
          return;
        }
        const on = togglePower(game.state, d.key);
        this.applyPowerVisuals(game.state);
        const names = { tv: "电视", ac: "空调", lamp: "落地灯", light: "吊灯" };
        game.toast(`${names[d.key] || d.key}已${on ? "打开" : "关闭"}`);
        return;
      }
      if (d.type === "npc") {
        const lines = {
          dad: "爸爸：小蜜糖回来啦！去做饭给我们吃吧～",
          mom: "妈妈：抱抱～厨房和餐厅都准备好了哦",
          dog: "旺旺：汪汪！",
        };
        game.toast(lines[d.key] || "……");
      }
    });
  }
}
