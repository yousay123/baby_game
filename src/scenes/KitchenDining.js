import * as THREE from "three";
import { box, makeInteractable, makeLabelSprite } from "../core/builders.js";
import { COLORS, APPLIANCE_NAMES } from "../core/constants.js";
import { BaseScene } from "./WorldScenes.js";
import { washPrep } from "../ui/HUD.js";
import { isPowerOn, getPowerMode, placeOnTable, setMealPhase, claimMealBonus } from "../gameplay/systems.js";
import {
  createNPC,
  moveToward,
  updateWalkAnim,
  createPlateOrBowl,
  setSitPose,
  setLiePose,
  setPlayerSit,
} from "../characters/Avatar.js";
import {
  createFridge,
  setFridgeDoorsOpen,
  updateFridgeDoors,
  createSinkUnit,
  setSinkWater,
  updateSinkWater,
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
  createKitchenIsland,
  createWallShelf,
  createCabinet,
  createCushion,
  createVase,
  createPicture,
  createBuffet,
  createCandleSet,
  createRug,
  softBox,
} from "../core/props.js";

export class KitchenScene extends BaseScene {
  constructor() {
    super("kitchen");
    this.spawn = { x: 0, z: 2.2, yaw: Math.PI };
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 12,
      depth: 9,
      wallColor: 0xf2f6fa,
      floorColor: 0xd0d8e0,
      accent: 0xffffff,
      style: "kitchen",
      bg: 0xeef2f6,
      doors: [
        { wall: "left", along: 2.2, to: "home", label: "客厅", color: 0x8a5a38 },
        { wall: "right", along: 2.2, to: "dining", label: "餐厅", color: 0xc48a5a },
      ],
    });

    const splash = box(9.2, 0.75, 0.08, 0xe8f4ff);
    splash.position.set(0, 1.45, -3.35);
    this.threeScene.add(splash);

    // —— Straight counter line along back wall (even spacing) ——
    const counter = createKitchenCounter(9.2);
    counter.position.set(0, 0, -2.85);
    this.threeScene.add(counter);
    this.addColliderAt(0, -2.85, 4.6, 0.55);

    const uppers = createUpperCabinets(6);
    uppers.position.set(0.6, -0.3, -3.05);
    uppers.scale.set(1, 0.85, 1);
    this.threeScene.add(uppers);

    const rowZ = -2.75;
    const place = (mesh, x, label, yLabel = 1.55) => {
      mesh.position.set(x, 0, rowZ);
      if (label) {
        const spr = makeLabelSprite(label, { scaleX: 0.72, scaleY: 0.18, fontSize: 30 });
        spr.position.set(x, yLabel, rowZ);
        // 标签也可点，方便手机点击
        if (mesh.userData?.interactive) {
          spr.userData.interactive = true;
          Object.assign(spr.userData, {
            type: mesh.userData.type,
            key: mesh.userData.key,
            cook: mesh.userData.cook,
            power: mesh.userData.power,
            sit: mesh.userData.sit,
            seat: mesh.userData.seat,
            to: mesh.userData.to,
          });
        }
        this.threeScene.add(spr);
      }
      this.threeScene.add(mesh);
    };

    this.fridge = createFridge();
    this.fridge.scale.set(0.95, 0.9, 0.95);
    makeInteractable(this.fridge, { type: "appliance", key: "fridge" });
    place(this.fridge, -4.4, "冰箱", 2.35);
    this.addColliderAt(-4.4, rowZ, 0.7, 0.55);

    this.sink = createSinkUnit();
    makeInteractable(this.sink, { type: "sink" });
    place(this.sink, -2.4, "洗菜池");
    this.addColliderAt(-2.4, rowZ, 0.75, 0.5);
    this._sinkTime = 0;

    this.stove = createStove();
    makeInteractable(this.stove, { type: "cook", cook: "stirfry", power: "stove" });
    place(this.stove, -0.4, "燃气灶");

    const hood = createHood();
    hood.position.set(-0.4, 2.05, -2.9);
    makeInteractable(hood, { type: "appliance", key: "hood" });
    this.hood = hood;
    this.threeScene.add(hood);

    const rice = createRiceCooker();
    makeInteractable(rice, { type: "cook", cook: "rice", power: "rice" });
    place(rice, 1.4, "电饭煲");

    this.oven = createOven();
    makeInteractable(this.oven, { type: "cook", cook: "bread", power: "oven" });
    place(this.oven, 3.0, "烤箱", 1.25);

    const mw = createMicrowave();
    mw.position.set(4.2, 1.2, -2.8);
    makeInteractable(mw, { type: "appliance", key: "microwave" });
    this.mw = mw;
    this.threeScene.add(mw);

    const dw = createDishwasher();
    dw.position.set(4.3, 0, -2.75);
    makeInteractable(dw, { type: "appliance", key: "dishwasher" });
    const dwLabel = makeLabelSprite("洗碗机");
    dwLabel.position.set(4.3, 1.15, -2.75);
    this.threeScene.add(dw, dwLabel);

    // Prep island in front of stove (aligned)
    const pot = box(0.4, 0.32, 0.4, 0xc0c8d0, { metalness: 0.4, roughness: 0.35 });
    pot.position.set(-0.4, 1.18, -2.15);
    makeInteractable(pot, { type: "cook", cook: "porridge", power: "stove" });
    const potLabel = makeLabelSprite("汤锅");
    potLabel.position.set(-0.4, 1.55, -2.15);
    this.threeScene.add(pot, potLabel);

    const board = box(0.42, 0.04, 0.26, 0xd4a574);
    board.position.set(1.4, 1.08, -2.35);
    this.threeScene.add(board);

    // Plate station — right side, tidy block
    const plateStation = box(1.4, 0.95, 0.8, COLORS.wood);
    plateStation.position.set(3.6, 0.48, 1.8);
    const plateTop = box(1.45, 0.08, 0.85, 0xe8d8c0);
    plateTop.position.set(3.6, 0.98, 1.8);
    makeInteractable(plateStation, { type: "plateStation" });
    makeInteractable(plateTop, { type: "plateStation" });
    const plateLabel = makeLabelSprite("装盘台");
    plateLabel.position.set(3.6, 1.45, 1.8);
    this.threeScene.add(plateStation, plateTop, plateLabel);

    const emptyPlate = createPlateOrBowl("plate", null);
    emptyPlate.position.set(3.3, 1.05, 1.9);
    emptyPlate.scale.setScalar(0.7);
    const emptyBowl = createPlateOrBowl("bowl", null);
    emptyBowl.position.set(3.9, 1.05, 1.7);
    emptyBowl.scale.setScalar(0.7);
    this.threeScene.add(emptyPlate, emptyBowl);

    this.platedGroup = new THREE.Group();
    this.platedGroup.position.set(3.6, 1.08, 1.8);
    this.threeScene.add(this.platedGroup);

    // —— Kitchen décor ——
    const island = createKitchenIsland();
    island.position.set(-1.2, 0, 0.6);
    this.threeScene.add(island);
    this.addColliderAt(-1.2, 0.6, 1.0, 0.5);

    const wallShelf = createWallShelf();
    wallShelf.position.set(-2.5, 2.0, -3.2);
    this.threeScene.add(wallShelf);

    const kitCab = createCabinet(1.4, 0xe8eef4);
    kitCab.position.set(-4.2, 0, 1.5);
    this.threeScene.add(kitCab);

    this.threeScene.add(createPlant(4.5, 2.5));
    this.threeScene.add(createPlant(-4.6, 2.8));

    const kitMat = softBox(2.2, 0.03, 1.2, 0xfff0e8, { roughness: 0.9 });
    kitMat.position.set(0, 0.02, 1.5);
    this.threeScene.add(kitMat);

    const spice = softBox(0.35, 0.12, 0.2, 0xc9a06a);
    spice.position.set(1.4, 1.12, -2.4);
    this.threeScene.add(spice);

    [-1.5, 1.5].forEach((x, i) => {
      const pic = createPicture([0xa8d8ff, 0xffe08a][i]);
      pic.position.set(x, 2.35, -4.2);
      this.threeScene.add(pic);
    });

    this.refreshPlatedVisuals(game);
    this.applyPower(game.state);
  }

  applyPower(state) {
    const stoveOn = isPowerOn(state, "stove");
    const stovePaused = getPowerMode(state, "stove") === "paused";
    const burner = this.stove?.userData?.burner || this.stove?.getObjectByName?.("burner");
    if (burner?.material) {
      burner.material.emissive = new THREE.Color(stoveOn ? 0xff4400 : stovePaused ? 0xaa3300 : 0x000000);
      burner.material.emissiveIntensity = stoveOn ? 0.8 : stovePaused ? 0.25 : 0;
      burner.material.color.set(stoveOn ? 0xff6633 : stovePaused ? 0x663322 : 0x222228);
    }
    if (this.hood?.userData?.light) {
      const hood = getPowerMode(state, "hood");
      this.hood.userData.light.material.emissiveIntensity = hood === "on" ? 0.9 : hood === "paused" ? 0.3 : 0;
    }
    if (this.oven?.userData?.window) {
      const oven = getPowerMode(state, "oven");
      this.oven.userData.window.material.color.set(oven === "on" ? 0xffb347 : oven === "paused" ? 0x886633 : 0x1a2030);
      this.oven.userData.window.material.emissive = new THREE.Color(oven === "on" ? 0xaa5522 : oven === "paused" ? 0x553311 : 0x000000);
      this.oven.userData.window.material.emissiveIntensity = oven === "on" ? 0.5 : oven === "paused" ? 0.2 : 0;
    }
    if (this.mw?.userData?.window) {
      const mw = getPowerMode(state, "microwave");
      this.mw.userData.window.material.color.set(mw === "on" ? 0xffe08a : mw === "paused" ? 0x887744 : 0x2a3038);
    }
    // 冰箱电源开→开门，关/暂停→关门
    if (this.fridge) {
      setFridgeDoorsOpen(this.fridge, isPowerOn(state, "fridge"));
    }
  }

  update(dt, game) {
    super.update(dt, game);
    if (this.fridge) updateFridgeDoors(this.fridge, dt);
    this._sinkTime = (this._sinkTime || 0) + dt;
    if (this.sink) updateSinkWater(this.sink, this._sinkTime);
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

    const run = () => {
      if (d.type === "appliance" && d.key === "fridge") {
        const doorsOpen = (this.fridge?.userData?.doorTarget ?? 0) > 0.5;
        game.ui.openApplianceModal("fridge", APPLIANCE_NAMES.fridge, () => this.applyPower(game.state), {
          extra: [
            {
              label: doorsOpen ? "关门" : "开门",
              className: "btn-coral",
              onClick: () => {
                const open = !((this.fridge?.userData?.doorTarget ?? 0) > 0.5);
                setFridgeDoorsOpen(this.fridge, open);
                game.toast(open ? "冰箱门打开了～" : "冰箱门关上了");
              },
            },
            {
              label: "打开冷藏（取放）",
              className: "btn-coral",
              onClick: () => {
                if (!isPowerOn(game.state, "fridge")) {
                  game.toast("请先打开冰箱电源");
                  return;
                }
                setFridgeDoorsOpen(this.fridge, true);
                game.ui.openFridgeModal(game.state);
              },
            },
          ],
        });
        return;
      }
      if (d.type === "appliance") {
        game.ui.openApplianceModal(d.key, APPLIANCE_NAMES[d.key] || d.key, () => this.applyPower(game.state));
        return;
      }
      if (d.type === "sink") {
        const on = !this.sink?.userData?.waterOn;
        setSinkWater(this.sink, on);
        if (on) {
          const washed = washPrep(game.state);
          game.toast(washed ? "哗啦啦～蔬菜洗干净啦" : "水龙头打开了～哗哗流水");
        } else {
          game.toast("关掉水龙头啦");
        }
        return;
      }
      if (d.type === "plateStation") {
        if (game.state.cooked.length) game.ui.openPlateModal(game.state);
        else game.toast("还没有做好的菜");
        return;
      }
      if (d.type === "cook") {
        const station = d.power === "rice" ? "rice" : d.power === "oven" ? "oven" : "stove";
        game.ui.openCookRecipeModal(station);
        return;
      }
    };

    // 走到台前空地；够近则立刻交互（避免被台面碰撞挡住导致没反应）
    const t = interactive.object.getWorldPosition(new THREE.Vector3());
    const approach = { x: t.x, z: Math.min(t.z + 1.35, -1.35) };
    const dx = approach.x - (this.player?.position.x || 0);
    const dz = approach.z - (this.player?.position.z || 0);
    if (Math.hypot(dx, dz) < 1.8) {
      run();
    } else {
      this.walkTo(approach, run);
    }
  }
}

export class DiningScene extends BaseScene {
  constructor() {
    super("dining");
    this.familyMoving = [];
    this.spawn = { x: 0, z: 2.6, yaw: Math.PI };
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 11,
      depth: 10,
      wallColor: 0xfff4e8,
      floorColor: 0xc9a882,
      accent: 0xffe0c0,
      style: "dining",
      bg: 0xf5ebe0,
      doors: [
        { wall: "left", along: 1.5, to: "kitchen", label: "厨房", color: 0xd0d8e0 },
        { wall: "right", along: 1.5, to: "home", label: "客厅", color: COLORS.wood },
      ],
    });
    this.familyMoving = [];

    this.threeScene.add(createWindow(-2.5, 1.7, -4.85));
    this.threeScene.add(createWindow(2.5, 1.7, -4.85));

    const roomLight = new THREE.PointLight(0xffe8d0, 0.85, 14);
    roomLight.position.set(0, 2.8, 0);
    this.threeScene.add(roomLight);

    this.table = createDiningTable();
    this.table.position.set(0, 0, 0);
    makeInteractable(this.table, { type: "table" });
    const tableLabel = makeLabelSprite("餐桌");
    tableLabel.position.set(0, 1.55, 0);
    this.threeScene.add(this.table, tableLabel);

    // Four chairs around table — chair front is local +Z, must face table center
    this.chairDad = createDiningChair();
    this.chairDad.position.set(-1.65, 0, 0);
    this.chairDad.rotation.y = Math.PI / 2; // face +X → table
    makeInteractable(this.chairDad, { type: "furn", key: "chair", sit: true, seat: "dad" });
    this.chairMom = createDiningChair();
    this.chairMom.position.set(1.65, 0, 0);
    this.chairMom.rotation.y = -Math.PI / 2; // face −X → table
    makeInteractable(this.chairMom, { type: "furn", key: "chair", sit: true, seat: "mom" });
    this.chairGirl = createDiningChair();
    this.chairGirl.position.set(0, 0, 1.35);
    this.chairGirl.rotation.y = Math.PI; // face −Z → table
    makeInteractable(this.chairGirl, { type: "furn", key: "chair", sit: true, seat: "girl" });
    const chairGuest = createDiningChair();
    chairGuest.position.set(0, 0, -1.35);
    chairGuest.rotation.y = 0; // face +Z → table
    makeInteractable(chairGuest, { type: "furn", key: "chair", sit: true, seat: "guest" });
    this.threeScene.add(this.chairDad, this.chairMom, this.chairGirl, chairGuest);
    // Seat yaw matches chair facing (toward table)
    this.chairSeats = {
      dad: { x: -1.35, z: 0, yaw: Math.PI / 2 },
      mom: { x: 1.35, z: 0, yaw: -Math.PI / 2 },
      girl: { x: 0, z: 1.05, yaw: Math.PI },
      guest: { x: 0, z: -1.05, yaw: 0 },
    };

    this.foodRoot = new THREE.Group();
    this.foodRoot.position.set(0, 0.98, 0);
    this.threeScene.add(this.foodRoot);

    // Family only appear after player calls them to eat
    this.dad = createNPC("dad");
    this.mom = createNPC("mom");
    this.dog = createNPC("dog");
    this.dad.visible = false;
    this.mom.visible = false;
    this.dog.visible = false;
    this.threeScene.add(this.dad, this.mom, this.dog);

    this.anchors = {
      dadEnter: { x: -0.5, z: 3.6 },
      momEnter: { x: 0.5, z: 3.6 },
      dogEnter: { x: 0, z: 3.6 },
      dadSeat: { x: -1.5, z: 0 },
      momSeat: { x: 1.5, z: 0 },
      dogUnder: { x: 0.9, z: 0.9 },
      tableFront: { x: 0, z: 1.5 },
    };

    // —— Dining décor ——
    const buffet = createBuffet();
    buffet.position.set(0, 0, -4.0);
    this.threeScene.add(buffet);

    const vase2 = createVase();
    vase2.position.set(-0.5, 0.95, -4.0);
    const candles2 = createCandleSet();
    candles2.position.set(0.55, 0.95, -4.0);
    this.threeScene.add(vase2, candles2);

    const diningRug = createRug();
    diningRug.scale.set(1.4, 1, 1.1);
    diningRug.position.set(0, 0, 0);
    this.threeScene.add(diningRug);

    this.threeScene.add(createPlant(-4.2, -3.5), createPlant(4.2, -3.5));
    this.threeScene.add(createPlant(-4.0, 3.2), createPlant(4.0, 3.2));

    [-2.0, 2.0].forEach((x, i) => {
      const pic = createPicture([0xffc8d8, 0xc9b6ff][i]);
      pic.position.set(x, 2.25, -4.7);
      this.threeScene.add(pic);
    });

    const cushD = createCushion(0xffe0c0);
    cushD.position.set(3.5, 0, 2.5);
    this.threeScene.add(cushD);

    const sideCab = createCabinet(1.2, 0xc9a882);
    sideCab.position.set(4.3, 0, 0);
    sideCab.rotation.y = -Math.PI / 2;
    this.threeScene.add(sideCab);

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
    // Appear at dining entrance, then walk to seats
    this.dad.visible = true;
    this.mom.visible = true;
    this.dog.visible = true;
    setSitPose(this.dad, false);
    setSitPose(this.mom, false);
    setLiePose(this.dog, false);
    this.dad.position.set(this.anchors.dadEnter.x, 0, this.anchors.dadEnter.z);
    this.mom.position.set(this.anchors.momEnter.x, 0, this.anchors.momEnter.z);
    this.dog.position.set(this.anchors.dogEnter.x, 0, this.anchors.dogEnter.z);
    this.dog.scale.set(1, 1, 1);
    game.toast("爸爸妈妈带着旺旺过来啦～");
    this.familyMoving = [
      { npc: this.dad, target: this.anchors.dadSeat, done: false, sit: true },
      { npc: this.mom, target: this.anchors.momSeat, done: false, sit: true },
      { npc: this.dog, target: this.anchors.dogUnder, done: false, underTable: true },
    ];
  }

  seatFamilyImmediate() {
    this.dad.visible = true;
    this.mom.visible = true;
    this.dog.visible = true;
    this.dad.position.set(this.anchors.dadSeat.x, 0.32, this.anchors.dadSeat.z);
    this.mom.position.set(this.anchors.momSeat.x, 0.32, this.anchors.momSeat.z);
    this.dad.rotation.y = Math.PI / 2;
    this.mom.rotation.y = -Math.PI / 2;
    setSitPose(this.dad, true);
    setSitPose(this.mom, true);
    this.dog.position.set(this.anchors.dogUnder.x, 0.05, this.anchors.dogUnder.z);
    this.dog.scale.set(0.9, 0.75, 0.9);
    setLiePose(this.dog, true);
  }

  onInteract(game, interactive) {
    const d = interactive.data;
    if (d.type === "door") {
      if (game.player?.userData.sitting) setPlayerSit(game.player, false);
      game.go(d.to);
      return;
    }
    if (d.type === "furn" && d.sit) {
      const seat = this.chairSeats?.[d.seat] || { x: 0, z: 1.05, yaw: 0 };
      game.ui.openModal("餐椅", "要坐下吗？", [
        {
          label: game.player?.userData.sitting ? "站起来" : "坐下",
          className: "btn-coral",
          onClick: () => {
            if (game.player?.userData.sitting) {
              setPlayerSit(game.player, false);
              game.toast("站起来啦～");
            } else {
              this.walkTo({ x: seat.x, z: seat.z }, () => {
                if (!game.player) return;
                game.player.position.set(seat.x, 0, seat.z);
                game.player.rotation.y = seat.yaw;
                setPlayerSit(game.player, true);
                // 坐下后锁定朝向餐桌，避免被走动动画带偏
                game.player.rotation.y = seat.yaw;
                game.toast("坐到餐椅上啦～");
                if (game.fp) game.fp.syncCamera(game.player, this.roomBounds);
              });
            }
          },
        },
        { label: "取消", className: "btn-ghost" },
      ]);
      return;
    }
    const t = interactive.object.getWorldPosition
      ? interactive.object.getWorldPosition(new THREE.Vector3())
      : interactive.object.position;
    this.walkTo({ x: t.x, z: t.z + (d.type === "table" ? 1.0 : 0.8) }, () => {
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
        if (m.sit) {
          m.npc.position.y = 0.32;
          setSitPose(m.npc, true);
          m.npc.rotation.y = m.npc === this.dad ? Math.PI / 2 : -Math.PI / 2;
        }
        if (m.underTable) {
          m.npc.position.y = 0.05;
          m.npc.scale.set(0.9, 0.72, 0.9);
          setLiePose(m.npc, true);
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
          const bonus = claimMealBonus(game.state);
          if (bonus.ok) {
            game.toast(`吃饱啦！爸爸妈妈给了你 ¥${bonus.amount} 奖励～ 钱包 ¥${bonus.money}`);
          } else {
            game.toast("吃饱啦！小蜜糖真能干～");
          }
        }
      }, 4000);
      this.familyMoving = [];
    }
  }
}
