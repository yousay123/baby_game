import * as THREE from "three";
import { box, makeInteractable, makeLabelSprite, setPlayCamera } from "../core/builders.js";
import { COLORS } from "../core/constants.js";
import {
  createNPC,
  moveToward,
  updateWalkAnim,
  createPlateOrBowl,
} from "../characters/Avatar.js";
import { BaseScene } from "./WorldScenes.js";
import { washPrep, togglePower, startCook } from "../ui/HUD.js";
import { placeOnTable, setMealPhase } from "../gameplay/systems.js";
import {
  createFridge,
  createSinkUnit,
  createStove,
  createRiceCooker,
  createOven,
  createHood,
  createMicrowave,
  createDishwasher,
  createKitchenCounter,
  createUpperCabinets,
  createDiningTable,
  createDiningChair,
  createPlant,
  createWindow,
} from "../core/props.js";

export class KitchenScene extends BaseScene {
  constructor() {
    super("kitchen");
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 12,
      depth: 9,
      wallColor: 0xf0f4f8,
      floorColor: 0xd0d8e0,
      accent: 0xffffff,
      style: "kitchen",
      bg: 0x1e2830,
    });
    this.walkHalfW = 5;
    this.walkHalfD = 3.5;
    setPlayCamera(game.camera, { y: 13, z: 10.5, lookY: 0, lookZ: -0.8, fov: 36 });

    // backsplash along rear counter line
    const splash = box(8.5, 0.75, 0.08, 0xe8f4ff);
    splash.position.set(0.3, 1.45, -2.85);
    this.threeScene.add(splash);

    const counter = createKitchenCounter(8);
    counter.position.set(0.3, 0, -2.35);
    this.threeScene.add(counter);

    const uppers = createUpperCabinets(5.5);
    uppers.position.set(0.8, -0.35, -2.55);
    uppers.scale.set(1, 0.85, 1);
    this.threeScene.add(uppers);

    this.fridge = createFridge();
    this.fridge.position.set(-4.5, 0, -2.1);
    this.fridge.scale.set(0.95, 0.9, 0.95);
    makeInteractable(this.fridge, { type: "appliance", key: "fridge" });
    const fridgeLabel = makeLabelSprite("冰箱");
    fridgeLabel.position.set(-4.5, 0, -2.1);
    fridgeLabel.position.y = 2.35;
    this.threeScene.add(this.fridge, fridgeLabel);

    const sink = createSinkUnit();
    sink.position.set(-2.0, 0, -2.2);
    makeInteractable(sink, { type: "sink" });
    const sinkLabel = makeLabelSprite("洗菜池");
    sinkLabel.position.set(-2.0, 0, -2.2);
    sinkLabel.position.y = 1.55;
    this.threeScene.add(sink, sinkLabel);

    this.stove = createStove();
    this.stove.position.set(0.3, 0, -2.2);
    makeInteractable(this.stove, { type: "cook", cook: "stirfry", power: "stove" });
    const stoveLabel = makeLabelSprite("燃气灶");
    stoveLabel.position.set(0.3, 0, -2.2);
    stoveLabel.position.y = 1.55;
    this.threeScene.add(this.stove, stoveLabel);

    const hood = createHood();
    hood.position.set(0.3, 2.05, -2.35);
    makeInteractable(hood, { type: "appliance", key: "hood" });
    this.hood = hood;
    this.threeScene.add(hood);

    const rice = createRiceCooker();
    rice.position.set(2.0, 0, -2.15);
    makeInteractable(rice, { type: "cook", cook: "rice", power: "rice" });
    const riceLabel = makeLabelSprite("电饭煲");
    riceLabel.position.set(2.0, 0, -2.15);
    riceLabel.position.y = 1.55;
    this.threeScene.add(rice, riceLabel);

    this.oven = createOven();
    this.oven.position.set(3.5, 0, -2.0);
    makeInteractable(this.oven, { type: "cook", cook: "bread", power: "oven" });
    const ovenLabel = makeLabelSprite("烤箱");
    ovenLabel.position.set(3.5, 0, -2.0);
    ovenLabel.position.y = 1.25;
    this.threeScene.add(this.oven, ovenLabel);

    const pot = box(0.45, 0.35, 0.45, 0xc0c8d0, { metalness: 0.4, roughness: 0.35 });
    pot.position.set(1.15, 1.2, -1.95);
    makeInteractable(pot, { type: "cook", cook: "porridge", power: "stove" });
    const potLabel = makeLabelSprite("汤锅");
    potLabel.position.set(1.15, 0, -1.95);
    potLabel.position.y = 1.55;
    this.threeScene.add(pot, potLabel);

    const mw = createMicrowave();
    mw.position.set(4.5, 1.25, -2.2);
    makeInteractable(mw, { type: "appliance", key: "microwave" });
    this.mw = mw;
    this.threeScene.add(mw);

    const dw = createDishwasher();
    dw.position.set(4.4, 0, 0.6);
    makeInteractable(dw, { type: "appliance", key: "dishwasher" });
    const dwLabel = makeLabelSprite("洗碗机");
    dwLabel.position.set(4.4, 0, 0.6);
    dwLabel.position.y = 1.15;
    this.threeScene.add(dw, dwLabel);

    const plateStation = box(1.3, 0.95, 0.75, COLORS.wood);
    plateStation.position.set(4.3, 0.48, 2.0);
    const plateTop = box(1.35, 0.08, 0.8, 0xe8d8c0);
    plateTop.position.set(4.3, 0.98, 2.0);
    makeInteractable(plateStation, { type: "plateStation" });
    makeInteractable(plateTop, { type: "plateStation" });
    const plateLabel = makeLabelSprite("装盘台");
    plateLabel.position.set(4.3, 0, 2.0);
    plateLabel.position.y = 1.45;
    this.threeScene.add(plateStation, plateTop, plateLabel);

    const emptyPlate = createPlateOrBowl("plate", null);
    emptyPlate.position.set(4.0, 1.05, 2.1);
    emptyPlate.scale.setScalar(0.7);
    const emptyBowl = createPlateOrBowl("bowl", null);
    emptyBowl.position.set(4.5, 1.05, 1.9);
    emptyBowl.scale.setScalar(0.7);
    this.threeScene.add(emptyPlate, emptyBowl);

    this.makeDoor("dining", "餐厅", 5.2, 2.4, 0xc48a5a);
    this.makeDoor("home", "客厅", -5.2, 2.4, 0x8a5a38);

    this.platedGroup = new THREE.Group();
    this.platedGroup.position.set(4.3, 1.08, 2.0);
    this.threeScene.add(this.platedGroup);

    this.player.position.set(-1, 0, 2.2);
    this.refreshPlatedVisuals(game);
    this.applyPower(game.state);
  }

  applyPower(state) {
    const burner = this.stove?.userData?.burner || this.stove?.getObjectByName?.("burner");
    if (burner?.material) {
      burner.material.emissive = new THREE.Color(state.power.stove ? 0xff4400 : 0x000000);
      burner.material.emissiveIntensity = state.power.stove ? 0.8 : 0;
      burner.material.color.set(state.power.stove ? 0xff6633 : 0x222228);
    }
    if (this.hood?.userData?.light) {
      this.hood.userData.light.material.emissiveIntensity = state.power.hood ? 0.9 : 0;
    }
    if (this.oven?.userData?.window) {
      this.oven.userData.window.material.color.set(state.power.oven ? 0xffb347 : 0x1a2030);
      this.oven.userData.window.material.emissive = new THREE.Color(state.power.oven ? 0xaa5522 : 0x000000);
      this.oven.userData.window.material.emissiveIntensity = state.power.oven ? 0.5 : 0;
    }
    if (this.mw?.userData?.window) {
      this.mw.userData.window.material.color.set(state.power.microwave ? 0xffe08a : 0x2a3038);
    }
  }

  refreshPlatedVisuals(game) {
    for (const s of this.steams) s.dispose();
    this.steams = [];
    while (this.platedGroup.children.length) {
      this.platedGroup.remove(this.platedGroup.children[0]);
    }
    game.state.plated.forEach((p, i) => {
      const mesh = createPlateOrBowl(p.vessel, p.dish);
      mesh.position.set((i % 3) * 0.4 - 0.4, 0, Math.floor(i / 3) * 0.4);
      this.platedGroup.add(mesh);
      if (p.hot) this.attachSteam(mesh, 0.12);
    });
  }

  onPlated(game) {
    this.refreshPlatedVisuals(game);
  }

  onInteract(game, interactive) {
    const d = interactive.data;
    const t = interactive.object.position;
    this.walkTo({ x: t.x, z: Math.min(t.z + 1.3, 3) }, () => {
      if (d.type === "door") {
        if (
          d.to === "dining" &&
          game.state.cooked.length &&
          !game.state.carrying &&
          !game.state.plated.length &&
          !game.state.tableFood.length
        ) {
          game.toast("做好的菜记得先装盘再端过去哦");
        }
        game.go(d.to);
        return;
      }
      if (d.type === "appliance" && d.key === "fridge") {
        game.ui.openFridgeModal(game.state);
        return;
      }
      if (d.type === "appliance") {
        const on = togglePower(game.state, d.key);
        this.applyPower(game.state);
        const names = {
          hood: "抽油烟机",
          microwave: "微波炉",
          dishwasher: "洗碗机",
          fridge: "冰箱",
        };
        game.toast(`${names[d.key] || d.key}已${on ? "打开" : "关闭"}`);
        return;
      }
      if (d.type === "sink") {
        if (washPrep(game.state)) game.toast("哗啦啦～蔬菜洗干净啦");
        else game.toast("没有需要洗的蔬菜");
        return;
      }
      if (d.type === "plateStation") {
        if (game.state.cooked.length) game.ui.openPlateModal(game.state);
        else game.toast("还没有做好的菜");
        return;
      }
      if (d.type === "cook") {
        if (d.power && !game.state.power[d.power]) {
          togglePower(game.state, d.power);
          this.applyPower(game.state);
          game.toast("电源已打开，再点一次开始做饭");
          return;
        }
        const res = startCook(game.state, d.cook, (recipe) => {
          game.toast(recipe.dish + "做好啦！去装盘台装盘/装碗～");
        });
        game.toast(res.msg);
      }
    });
  }
}

export class DiningScene extends BaseScene {
  constructor() {
    super("dining");
    this.familyMoving = [];
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 11,
      depth: 10,
      wallColor: 0xfff4e8,
      floorColor: 0xc9a882,
      accent: 0xffe0c0,
      style: "dining",
      bg: 0x2a2018,
    });
    this.walkHalfW = 4.5;
    this.walkHalfD = 4;
    setPlayCamera(game.camera, { y: 13, z: 11, lookY: 0, lookZ: -0.4, fov: 36 });
    this.familyMoving = [];

    this.threeScene.add(createWindow(-2.5, 1.7, -4.85));
    this.threeScene.add(createWindow(2.5, 1.7, -4.85));

    const roomLight = new THREE.PointLight(0xffe8d0, 0.85, 14);
    roomLight.position.set(0, 2.8, 0);
    this.threeScene.add(roomLight);

    this.table = createDiningTable();
    this.table.position.set(0, 0, -0.2);
    makeInteractable(this.table, { type: "table" });
    const tableLabel = makeLabelSprite("餐桌");
    tableLabel.position.set(0, 0, -0.2);
    tableLabel.position.y = 1.55;
    this.threeScene.add(this.table, tableLabel);

    this.chairDad = createDiningChair();
    this.chairDad.position.set(-1.7, 0, -0.2);
    this.chairDad.rotation.y = Math.PI / 2;
    this.chairMom = createDiningChair();
    this.chairMom.position.set(1.7, 0, -0.2);
    this.chairMom.rotation.y = -Math.PI / 2;
    this.chairGirl = createDiningChair();
    this.chairGirl.position.set(0, 0, 1.15);
    this.threeScene.add(this.chairDad, this.chairMom, this.chairGirl);

    this.foodRoot = new THREE.Group();
    this.foodRoot.position.set(0, 0.98, -0.2);
    this.threeScene.add(this.foodRoot);

    const sideboard = box(2.2, 0.85, 0.5, COLORS.wood);
    sideboard.position.set(-3.6, 0.42, -3.5);
    const vase = box(0.15, 0.35, 0.15, 0xffffff);
    vase.position.set(-3.6, 1.05, -3.5);
    this.threeScene.add(sideboard, vase, createPlant(4.0, -3.2));

    this.dad = createNPC("dad");
    this.dad.position.set(-3.2, 0, 2.2);
    this.mom = createNPC("mom");
    this.mom.position.set(3.2, 0, 2.2);
    this.dog = createNPC("dog");
    this.dog.position.set(2.2, 0, 1.8);
    this.threeScene.add(this.dad, this.mom, this.dog);

    this.makeDoor("kitchen", "厨房", -5.0, 1.5, 0xd0d8e0);
    this.makeDoor("home", "客厅", 5.0, 1.5, COLORS.wood);

    this.anchors = {
      dadSeat: { x: -1.55, z: -0.2 },
      momSeat: { x: 1.55, z: -0.2 },
      dogUnder: { x: 0, z: -0.25 },
      tableFront: { x: 0, z: 1.3 },
    };

    this.player.position.set(0, 0, 2.8);
    this.refreshTableFood(game);

    if (game.state.mealPhase === "calling" || game.state.mealPhase === "seating") {
      this.onCallFamily(game);
    } else if (game.state.mealPhase === "eating" || game.state.mealPhase === "done") {
      this.seatFamilyImmediate();
    }
  }

  refreshTableFood(game) {
    for (const s of this.steams) s.dispose();
    this.steams = [];
    while (this.foodRoot.children.length) {
      this.foodRoot.remove(this.foodRoot.children[0]);
    }
    game.state.tableFood.forEach((p, i) => {
      const mesh = createPlateOrBowl(p.vessel, p.dish);
      const col = i % 3;
      const row = Math.floor(i / 3);
      mesh.position.set((col - 1) * 0.55, 0, (row - 0.3) * 0.4);
      this.foodRoot.add(mesh);
      if (p.hot) this.attachSteam(mesh, 0.14);
    });
  }

  onFoodPlaced(game) {
    this.refreshTableFood(game);
  }

  onCallFamily(game) {
    setMealPhase(game.state, "seating");
    this.familyMoving = [
      { npc: this.dad, target: this.anchors.dadSeat, done: false },
      { npc: this.mom, target: this.anchors.momSeat, done: false },
      { npc: this.dog, target: this.anchors.dogUnder, done: false, underTable: true },
    ];
  }

  seatFamilyImmediate() {
    this.dad.position.set(this.anchors.dadSeat.x, 0, this.anchors.dadSeat.z);
    this.mom.position.set(this.anchors.momSeat.x, 0, this.anchors.momSeat.z);
    this.dog.position.set(this.anchors.dogUnder.x, 0.05, this.anchors.dogUnder.z);
    this.dog.scale.set(0.9, 0.75, 0.9);
  }

  onInteract(game, interactive) {
    const d = interactive.data;
    const t = interactive.object.position;
    this.walkTo({ x: t.x, z: t.z + (d.type === "table" ? 1.1 : 1) }, () => {
      if (d.type === "door") {
        game.go(d.to);
        return;
      }
      if (d.type === "table") {
        if (game.state.carrying) {
          if (placeOnTable(game.state)) {
            game.toast("菜上桌啦，热气腾腾～");
            this.onFoodPlaced(game);
            game.syncCarryVisual();
          }
        } else if (game.state.tableFood.length) {
          game.ui.refresh(game.state);
          game.toast("点右侧按钮喊家人吃饭吧");
        } else {
          game.toast("先去厨房做饭装盘再端过来");
        }
      }
    });
  }

  update(dt, game) {
    super.update(dt, game);
    if (!this.familyMoving?.length) return;

    let allDone = true;
    for (const m of this.familyMoving) {
      if (m.done) continue;
      const moving = moveToward(m.npc, m.target, m.npc.userData.speed || 2.4, dt);
      updateWalkAnim(m.npc, dt, moving);
      if (!moving) {
        m.done = true;
        if (m.underTable) {
          m.npc.position.y = 0.05;
          m.npc.scale.set(0.9, 0.72, 0.9);
          game.toast("旺旺蹲到桌子底下啦～");
        }
      } else {
        allDone = false;
      }
    }
    if (allDone && game.state.mealPhase === "seating") {
      setMealPhase(game.state, "eating");
      game.toast("全家开吃！热气腾腾好幸福～");
      setTimeout(() => {
        if (game.state.mealPhase === "eating") {
          setMealPhase(game.state, "done");
          game.toast("吃饱啦！小蜜糖真能干～");
        }
      }, 4000);
      this.familyMoving = [];
    }
  }
}
