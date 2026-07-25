import * as THREE from "three";
import { buildRoom, addWarmLights, makeInteractable, makeLabelSprite, setPlayCamera } from "../core/builders.js";
import { COLORS, MARKET_GOODS } from "../core/constants.js";
import {
  createPlayerAvatar,
  createNPC,
  moveToward,
  updateWalkAnim,
  applyMakeup,
  attachNpcCart,
  setSitPose,
  setLiePose,
  setPlayerSit,
} from "../characters/Avatar.js";
import { SteamEmitter } from "../fx/SteamEmitter.js";
import { addToCart } from "../ui/HUD.js";
import {
  isPowerOn,
  getPowerMode,
  claimAllowance,
  claimChore,
} from "../gameplay/systems.js";
import { APPLIANCE_NAMES } from "../core/constants.js";
import { makeBoxCollider, tryMove } from "../core/collision.js";
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
  softBox,
  createCushion,
  createCabinet,
  createPicture,
  createVase,
  createCandleSet,
  createCoatRack,
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
    this.threeScene.background = new THREE.Color(0x87b8e0);
    this.player = null;
    this.steams = [];
    this.anchors = {};
    this.spawn = { x: 0, z: 2, yaw: Math.PI };
    this.roomBounds = null;
    this.colliders = [];
    this.walkRadius = 0.32;
    this.npcs = [];
  }

  clearColliders() {
    this.colliders = [];
  }

  addColliderAt(x, z, halfX, halfZ) {
    this.colliders.push(makeBoxCollider(x, z, halfX, halfZ));
  }

  addColliderFor(obj, halfX, halfZ) {
    this.addColliderAt(obj.position.x, obj.position.z, halfX, halfZ);
  }

  getWalkHalf() {
    return {
      halfW: this.walkHalfW ?? this.roomBounds?.halfW ?? this.roomSize?.halfW ?? 5,
      halfD: this.walkHalfD ?? this.roomBounds?.halfD ?? this.roomSize?.halfD ?? 4,
    };
  }

  clampPlayerInRoom() {
    if (!this.player) return;
    const { halfW, halfD } = this.getWalkHalf();
    const p = clampWalk(this.player.position.x, this.player.position.z, halfW, halfD);
    this.player.position.x = p.x;
    this.player.position.z = p.z;
  }

  setupCommon(game, roomOpts) {
    this.threeScene.clear();
    this.steams = [];
    this.colliders = [];
    this.npcs = [];
    // Interior ambient — soft warm, not dark void
    this.threeScene.background = new THREE.Color(roomOpts.bg || 0xf5ebe3);
    this.threeScene.fog = new THREE.Fog(roomOpts.bg || 0xf5ebe3, 14, 32);
    addWarmLights(this.threeScene, {
      intensity: roomOpts.lightIntensity || 1.25,
      style: roomOpts.style || "home",
    });

    const width = roomOpts.width || 12;
    const depth = roomOpts.depth || 10;
    const height = roomOpts.height || 5.5;
    const room = buildRoom({
      ...roomOpts,
      height,
    });
    this.threeScene.add(room);
    this.floor = room.getObjectByName("floor");
    // Keep player well inside walls (doors are interact portals, not exits to void)
    const inset = 0.95;
    this.roomBounds = {
      halfW: width / 2 - inset,
      halfD: depth / 2 - inset,
      height,
      width,
      depth,
    };
    this.roomSize = { halfW: this.roomBounds.halfW, halfD: this.roomBounds.halfD };
    this.walkHalfW = this.roomBounds.halfW;
    this.walkHalfD = this.roomBounds.halfD;

    this.player = createPlayerAvatar(game.state);
    applyMakeup(this.player, game.state);
    const spawn = clampWalk(this.spawn.x, this.spawn.z, this.walkHalfW, this.walkHalfD);
    this.player.position.set(spawn.x, 0, spawn.z);
    // Face spawn yaw; camera sits behind the player
    this.player.rotation.y =
      this.spawn.yaw != null ? this.spawn.yaw : Math.PI;
    this.threeScene.add(this.player);
    game.player = this.player;
    game.syncCarryVisual();

    setPlayCamera(game.camera, { fov: 52 });
    if (game.fp) {
      game.fp.enabled = true;
      const face = this.player.rotation.y;
      game.fp.resetLook(face + Math.PI, 0.4, this.roomBounds);
      game.fp.setBodyVisible(this.player, true);
      game.fp.syncCamera(this.player, this.roomBounds);
    }
  }

  handleClick(game, point, interactive) {
    if (interactive) {
      const d = interactive.data || {};
      const canWhileSit =
        d.sit || d.key === "sofa" || d.key === "stool" || d.type === "door";
      if (this.player?.userData.sitting && !canWhileSit) {
        game.toast("先站起来再走～");
        return;
      }
      this.onInteract(game, interactive);
      return;
    }
    if (point) {
      if (this.player?.userData.sitting) {
        game.toast("先站起来再走～");
        return;
      }
      const { halfW, halfD } = this.getWalkHalf();
      const p = clampWalk(point.x, point.z, halfW, halfD);
      this.player.userData.target = new THREE.Vector3(p.x, 0, p.z);
      this.player.userData.walking = true;
      this.player.userData.onArrive = null;
      this.player.userData._arrived = false;
    }
  }

  walkTo(pos, onArrive) {
    if (this.player?.userData.sitting) {
      return;
    }
    const { halfW, halfD } = this.getWalkHalf();
    const p = clampWalk(pos.x, pos.z, halfW, halfD);
    this.player.userData.target = new THREE.Vector3(p.x, 0, p.z);
    this.player.userData.walking = true;
    this.player.userData.onArrive = onArrive || null;
    this.player.userData._arrived = false;
  }

  onInteract() {}

  update(dt, game) {
    if (!this.player) return;
    const { halfW, halfD } = this.getWalkHalf();
    const r = this.walkRadius;

    // 坐着时强制取消寻路目标，避免点地后自动走
    if (this.player.userData.sitting) {
      this.player.userData.target = null;
      this.player.userData.onArrive = null;
      this.player.userData._arrived = false;
      this.player.userData.walking = false;
    }

    // WASD third-person move (relative to camera)
    if (game?.fp) {
      const mv = game.fp.getMoveVector(dt);
      if (mv) {
        // 坐着时不能走动，需先站起来
        if (this.player.userData.sitting) {
          this._sitMoveToastAt = this._sitMoveToastAt || 0;
          const now = performance.now();
          if (now - this._sitMoveToastAt > 1600) {
            this._sitMoveToastAt = now;
            game.toast?.("先站起来再走～");
          }
          updateWalkAnim(this.player, dt, false);
        } else {
          this.player.userData.target = null;
          this.player.userData.onArrive = null;
          this.player.userData._arrived = false;
          const next = tryMove(
            this.player.position.x,
            this.player.position.z,
            mv.dx,
            mv.dz,
            r,
            this.colliders,
            halfW,
            halfD
          );
          this.player.position.x = next.x;
          this.player.position.z = next.z;
          this.player.rotation.y = mv.faceYaw;
          updateWalkAnim(this.player, dt, true);
        }
      } else if (!this.player.userData.target) {
        updateWalkAnim(this.player, dt, false);
      }
      // Only shelf buy-plates trigger mild inspect zoom (not every appliance)
      let nearest = null;
      this.threeScene.traverse((o) => {
        if (!o.isMesh || !o.userData?.interactive) return;
        if (o.userData.type !== "shelf") return;
        const wp = new THREE.Vector3();
        o.getWorldPosition(wp);
        const d = Math.hypot(wp.x - this.player.position.x, wp.z - this.player.position.z);
        if (nearest == null || d < nearest) nearest = d;
      });
      game.fp.updateInspect?.(nearest);
      game.fp.syncCamera(this.player, this.roomBounds);
      game.fp.setBodyVisible(this.player, true);
    }

    // Click-to-walk with collision (step then resolve)
    const target = this.player.userData.target;
    let walking = false;
    if (target && !this.player.userData.sitting) {
      const dx = target.x - this.player.position.x;
      const dz = target.z - this.player.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.1) {
        this.player.position.x = target.x;
        this.player.position.z = target.z;
        walking = false;
        this.player.userData._arrived = true;
      } else {
        const speed = this.player.userData.speed || 3.2;
        const step = Math.min(dist, speed * dt);
        const next = tryMove(
          this.player.position.x,
          this.player.position.z,
          (dx / dist) * step,
          (dz / dist) * step,
          r,
          this.colliders,
          halfW,
          halfD
        );
        // If blocked completely, cancel path — 但靠近目标时仍触发到达回调
        if (next.x === this.player.position.x && next.z === this.player.position.z) {
          const near = Math.hypot(target.x - this.player.position.x, target.z - this.player.position.z) < 1.35;
          if (near && this.player.userData.onArrive) {
            this.player.userData._arrived = true;
          } else {
            this.player.userData.onArrive = null;
          }
          this.player.userData.target = null;
          walking = false;
        } else {
          this.player.position.x = next.x;
          this.player.position.z = next.z;
          this.player.rotation.y = Math.atan2(dx, dz);
          walking = true;
        }
      }
    }
    this.clampPlayerInRoom();
    this.player.userData.walking = walking;
    if (walking) updateWalkAnim(this.player, dt, true);
    if (!walking && this.player.userData.onArrive && this.player.userData._arrived) {
      const cb = this.player.userData.onArrive;
      this.player.userData.onArrive = null;
      this.player.userData.target = null;
      this.player.userData._arrived = false;
      cb();
    } else if (!walking) {
      this.player.userData._arrived = false;
    }

    this.updateNpcs(dt);
    for (const s of this.steams) s.update(dt);
  }

  updateNpcs(dt) {
    const { halfW, halfD } = this.getWalkHalf();
    for (const npc of this.npcs) {
      const ud = npc.userData;
      if (!ud.waypoints?.length) continue;
      if (!ud.target) {
        ud.wp = ((ud.wp || 0) + 1) % ud.waypoints.length;
        const w = ud.waypoints[ud.wp];
        ud.target = new THREE.Vector3(w.x, 0, w.z);
      }
      const dx = ud.target.x - npc.position.x;
      const dz = ud.target.z - npc.position.z;
      const dist = Math.hypot(dx, dz);
      let moving = false;
      if (dist < 0.12) {
        ud.target = null;
      } else {
        const step = Math.min(dist, (ud.speed || 1.4) * dt);
        const next = tryMove(
          npc.position.x,
          npc.position.z,
          (dx / dist) * step,
          (dz / dist) * step,
          0.3,
          this.colliders,
          halfW,
          halfD
        );
        if (next.x === npc.position.x && next.z === npc.position.z) {
          ud.target = null; // pick new waypoint if stuck
        } else {
          npc.position.x = next.x;
          npc.position.z = next.z;
          npc.rotation.y = Math.atan2(dx, dz);
          moving = true;
        }
      }
      updateWalkAnim(npc, dt, moving);
    }
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
}

export class MakeupScene extends BaseScene {
  constructor() {
    super("makeup");
    this.spawn = { x: 0, z: 0.4, yaw: 0 };
  }

  async onEnter(game) {
    // Minimal empty room — 2D mirror handles visuals
    this.setupCommon(game, {
      width: 8,
      depth: 8,
      wallColor: 0xffe4ec,
      floorColor: 0xf0d4c8,
      accent: 0xffc0d8,
      style: "home",
      bg: 0xfff0f5,
      doors: [{ wall: "front", along: 0, to: "market", label: "去超市", color: 0xc48a5a }],
    });
    this.spawn = { x: 0, z: 1.5, yaw: Math.PI };
    this.player.position.set(0, 0, 1.5);
    this.player.rotation.y = Math.PI;
    this.player.visible = false;
    if (game.fp) {
      game.fp.enabled = false;
      game.fp.resetLook(0, 0.4, this.roomBounds);
    }
  }

  onLeave(game) {
    if (this.player) this.player.visible = true;
    if (game.fp) game.fp.enabled = true;
  }

  update() {
    /* 2D makeup — no 3D walk */
  }

  onInteract(game, interactive) {
    const d = interactive.data;
    if (d.type === "door") game.go(d.to);
  }
}

export class MarketScene extends BaseScene {
  constructor() {
    super("market");
    // Open entrance plaza — easy to spot, facing into aisles
    this.spawn = { x: -2.2, z: 6.0, yaw: Math.PI };
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 18,
      depth: 16,
      wallColor: 0xf7f2ea,
      floorColor: 0xd8c4a4,
      accent: 0xffe08a,
      style: "market",
      bg: 0xf0ebe3,
      lightIntensity: 1.3,
      doors: [{ wall: "front", along: 6, to: "home", label: "出口回家", color: 0x88b0d0 }],
    });
    // walk bounds come from setupCommon
    this.walkRadius = 0.38; // account for push cart

    // Face into the store (−Z); camera stays behind at +Z
    this.player.position.set(-2.2, 0, 6.0);
    this.player.rotation.y = Math.PI;
    if (game.fp) {
      game.fp.enabled = true;
      game.fp.resetLook(0, 0.4, this.roomBounds);
      game.fp.syncCamera(this.player, this.roomBounds);
    }
    // Keep nameplate tiny — never enlarge in market
    const tag = this.player.getObjectByName("playerTag");
    if (tag) {
      tag.position.y = 1.68;
      tag.scale.set(0.38, 0.1, 1);
    }
    const labels = { veg: "蔬菜", drinks: "饮料", daily: "粮油", snack: "零食" };
    const cats = Object.keys(MARKET_GOODS);

    // Back wall cold cases — even 3.6m grid
    cats.forEach((cat, i) => {
      const wallShelf = createMarketShelf(cat, i === 0 ? "冷柜区" : labels[cat], {
        doubleSided: false,
      });
      wallShelf.position.set(-5.4 + i * 3.6, 0, -6.2);
      this.threeScene.add(wallShelf);
      this.addColliderFor(wallShelf, 1.15, 0.45);
    });

    // Center island row
    cats.forEach((cat, i) => {
      const shelf = createMarketShelf(cat, labels[cat], { doubleSided: true });
      shelf.position.set(-5.4 + i * 3.6, 0, -2.2);
      this.threeScene.add(shelf);
      this.addColliderFor(shelf, 1.2, 0.7);
    });

    // Front island row (3 shelves, same grid)
    ["veg", "drinks", "snack"].forEach((cat, i) => {
      const shelf = createMarketShelf(cat, labels[cat], { doubleSided: true });
      shelf.position.set(-5.4 + i * 3.6, 0, 2.2);
      this.threeScene.add(shelf);
      this.addColliderFor(shelf, 1.2, 0.7);
    });

    // Carts near entrance (left), checkout (right) — clear plaza
    const cart1 = createShoppingCart();
    cart1.position.set(-6.2, 0, 5.5);
    const cart2 = createShoppingCart();
    cart2.position.set(-5.2, 0, 5.5);
    makeInteractable(cart1, { type: "carts" });
    makeInteractable(cart2, { type: "carts" });
    const cartLabel = makeLabelSprite("购物车");
    cartLabel.position.set(-5.7, 1.3, 5.5);
    this.threeScene.add(cart1, cart2, cartLabel);
    this.addColliderAt(-5.7, 5.5, 0.9, 0.6);

    const checkout = createCheckoutCounter();
    checkout.position.set(6.2, 0, 5.0);
    makeInteractable(checkout, { type: "checkout" });
    const checkLabel = makeLabelSprite("收银台");
    checkLabel.position.set(6.2, 2.15, 5.0);
    this.addColliderFor(checkout, 1.3, 0.65);

    const cashier = createNPC("cashier");
    cashier.position.set(6.2, 0, 4.0);
    cashier.rotation.y = 0;
    makeInteractable(cashier, { type: "cashier" });
    const cashLabel = makeLabelSprite("收银员");
    cashLabel.position.set(6.2, 1.9, 4.0);
    this.threeScene.add(checkout, checkLabel, cashier, cashLabel);
    this.addColliderAt(6.2, 4.0, 0.35, 0.35);

    // Other shoppers — keep away from player spawn plaza
    const shopperA = createNPC("mom");
    shopperA.position.set(-2.5, 0, -0.8);
    shopperA.userData.waypoints = [
      { x: -2.5, z: -0.8 },
      { x: 1.5, z: 0.4 },
      { x: 1.2, z: 3.2 },
      { x: -3.0, z: 3.0 },
    ];
    shopperA.userData.speed = 1.35;
    shopperA.userData.wp = 0;
    attachNpcCart(shopperA);

    const shopperB = createNPC("dad");
    shopperB.position.set(3.5, 0, -0.5);
    shopperB.userData.waypoints = [
      { x: 3.5, z: -0.5 },
      { x: 5.0, z: 1.5 },
      { x: 2.0, z: 3.5 },
      { x: 4.0, z: -3.5 },
    ];
    shopperB.userData.speed = 1.2;
    shopperB.userData.wp = 0;
    attachNpcCart(shopperB);

    const shopperC = createNPC("mom");
    shopperC.scale.setScalar(0.95);
    shopperC.position.set(-1.0, 0, -4.0);
    shopperC.rotation.y = Math.PI * 0.2;
    shopperC.userData.waypoints = [
      { x: -1.0, z: -4.0 },
      { x: 2.5, z: -4.2 },
      { x: 3.0, z: -3.0 },
      { x: -2.0, z: -3.5 },
    ];
    shopperC.userData.speed = 1.15;
    shopperC.userData.wp = 0;
    attachNpcCart(shopperC);

    this.npcs.push(shopperA, shopperB, shopperC);
    this.threeScene.add(shopperA, shopperB, shopperC);

    game.toast("你在入口广场 · 头顶粉色「小蜜糖」就是你 · 点地板就能走");

    // Promo island — center aisle, not on spawn
    const promo = softBox(1.6, 0.7, 1.0, 0xffe08a);
    promo.position.set(1.5, 0.35, 4.2);
    const promoTop = softBox(1.5, 0.08, 0.9, 0xfff8e0);
    promoTop.position.set(1.5, 0.72, 4.2);
    const promoSign = makeLabelSprite("今日特价");
    promoSign.position.set(1.5, 1.2, 4.2);
    this.threeScene.add(promo, promoTop, promoSign);
    this.addColliderAt(1.5, 4.2, 0.9, 0.6);

    this.threeScene.add(createPlant(7.5, -4));
    this.threeScene.add(createPlant(-7.5, -4));
    this.threeScene.add(createPlant(7.2, 5.5));
  }

  onInteract(game, interactive) {
    const { type, cat, to } = interactive.data;
    if (type === "door" || to === "home") {
      if (game.state.cart.length) {
        game.toast("还没结账哦");
        return;
      }
      game.go(to || "home");
      game.toast(game.state.bag.length ? "提着购物袋到家啦" : "到家啦");
      return;
    }
    if (type === "carts") {
      game.state.hasCart = true;
      game.emit();
      game.toast("拿到购物车啦，去货架选购吧");
      game.syncCarryVisual();
      return;
    }
    if (type === "shelf") {
      this.openShelf(game, cat);
      return;
    }
    if (type === "cashier") {
      const wrap = document.createElement("div");
      wrap.innerHTML = `<p style="margin:0 0 10px;line-height:1.5">欢迎光临蜜糖超市～需要结账的话点柜台，或者跟我说「结账」哦！</p>`;
      game.ui.openModal("收银员小桃", wrap, [
        {
          label: "去结账",
          className: "btn-coral",
          onClick: () => game.ui.doCheckout(game.state),
        },
        { label: "随便看看", className: "btn-ghost" },
      ]);
      return;
    }
    if (type === "checkout") {
      game.ui.doCheckout(game.state);
    }
  }

  openShelf(game, cat) {
    const goods = MARKET_GOODS[cat] || [];
    const hint = new Set(game.state.shoppingHint || []);
    const wrap = document.createElement("div");
    wrap.innerHTML = goods
      .map((g) => {
        const need = hint.has(g.id);
        return `<div style="display:flex;justify-content:space-between;margin:6px 0;align-items:center;padding:6px 8px;border-radius:10px;${need ? "background:#fff0f3;outline:1px solid #ef6b8a" : ""}">
            <span>${g.icon || ""} ${g.name} ¥${g.price}${need ? " ·菜谱需要" : ""}</span>
            <button type="button" class="btn btn-coral" data-gid="${g.id}">放入购物车</button>
          </div>`;
      })
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
    // 茶几旁出生，面向沙发上的爸妈（+Z）
    this.spawn = { x: 0, z: 0.05, yaw: 0 };
  }

  async onEnter(game) {
    this.setupCommon(game, {
      width: 12,
      depth: 10,
      wallColor: 0xfff0ea,
      floorColor: 0xd4b090,
      accent: 0xffd0e0,
      style: "home",
      bg: 0xf8efe6,
      doors: [
        { wall: "left", along: -1, to: "kitchen", label: "厨房", color: 0x8a5a38 },
        { wall: "right", along: -1, to: "dining", label: "餐厅", color: 0xc48a5a },
        { wall: "front", along: 0, to: "market", label: "出门", color: 0x88b0d0 },
      ],
    });

    const win = createWindow(0, 1.7, -4.85);
    this.threeScene.add(win);

    // —— Neat living-room layout: sofa facing TV, clear center aisle ——
    const rug = createRug();
    rug.scale.set(1.15, 1, 0.9);
    rug.position.set(0, 0, 0.4);
    this.threeScene.add(rug);

    // Sofa along +Z, facing TV; parents sit slightly forward so calves hang in front
    const sofa = createSofa();
    sofa.position.set(0, 0, 2.35);
    sofa.rotation.y = Math.PI;
    makeInteractable(sofa, { type: "furn", key: "sofa", sit: true });
    this.threeScene.add(sofa);
    this.sofaSeat = { x: 0, z: 1.75, yaw: Math.PI };

    this.dad = createNPC("dad");
    this.dad.position.set(-0.65, 0.38, 1.85);
    this.dad.rotation.y = Math.PI;
    setSitPose(this.dad, true);
    this.mom = createNPC("mom");
    this.mom.position.set(0.65, 0.38, 1.85);
    this.mom.rotation.y = Math.PI;
    setSitPose(this.mom, true);
    this.dog = createNPC("dog");
    this.dog.position.set(1.7, 0, 2.5);
    this.dog.rotation.y = -Math.PI * 0.6;
    setLiePose(this.dog, true);
    makeInteractable(this.dad, { type: "npc", key: "dad" });
    makeInteractable(this.mom, { type: "npc", key: "mom" });
    makeInteractable(this.dog, { type: "npc", key: "dog" });
    this.threeScene.add(this.dad, this.mom, this.dog);

    const table = createCoffeeTable();
    table.position.set(0, 0, 0.6);
    makeInteractable(table, { type: "furn", key: "table" });
    this.threeScene.add(table);

    // TV wall (−Z)
    const tvStand = createTVStand();
    tvStand.position.set(0, 0, -3.8);
    makeInteractable(tvStand, { type: "furn", key: "tv" });
    this.tvScreen = tvStand.userData.screen;
    this.threeScene.add(tvStand);

    // Left wall column: shelf → lamp → side table
    const shelf = createBookshelf();
    shelf.position.set(-4.6, 0, -2.8);
    shelf.scale.set(0.9, 0.85, 0.9);
    makeInteractable(shelf, { type: "furn", key: "shelf" });
    this.threeScene.add(shelf);

    const lamp = createFloorLamp();
    lamp.position.set(-4.4, 0, 0.2);
    makeInteractable(lamp, { type: "furn", key: "lamp" });
    this.lampMesh = lamp;
    this.lampGlow = new THREE.PointLight(0xffe0a0, 0, 5);
    this.lampGlow.position.set(-4.4, 1.6, 0.2);
    this.threeScene.add(lamp, this.lampGlow);

    const side = createSideTable();
    side.position.set(-4.3, 0, 2.0);
    makeInteractable(side, { type: "furn", key: "stool", sit: true });
    this.threeScene.add(side);
    this.sideSeat = { x: -3.9, z: 2.0, yaw: Math.PI / 2 };

    // Right wall: plant + dogbed
    const plant = createPlant(4.5, -3.2);
    makeInteractable(plant, { type: "furn", key: "plant" });
    this.threeScene.add(plant);
    this.threeScene.add(createPlant(4.5, 2.8));

    const dogbed = createDogBed();
    dogbed.position.set(3.6, 0, 2.2);
    makeInteractable(dogbed, { type: "furn", key: "dogbed" });
    this.threeScene.add(dogbed);

    const ac = createAC();
    ac.position.set(2.8, 2.35, -4.8);
    makeInteractable(ac, { type: "furn", key: "ac" });
    this.acMesh = ac;
    this.threeScene.add(ac);

    const ceilLamp = createCeilingLamp();
    ceilLamp.position.set(0, 2.7, 0);
    makeInteractable(ceilLamp, { type: "furn", key: "light" });
    this.ceilLampMesh = ceilLamp;
    this.ceilLight = new THREE.PointLight(0xfff0e0, 0.9, 14);
    this.ceilLight.position.set(0, 2.5, 0);
    this.threeScene.add(ceilLamp, this.ceilLight);

    // —— Soft décor: fill empty space ——
    const cush1 = createCushion(0xffc8d8);
    cush1.position.set(2.2, 0, 1.2);
    const cush2 = createCushion(0xc9b6ff);
    cush2.position.set(2.8, 0, 1.8);
    cush2.rotation.y = 0.4;
    this.threeScene.add(cush1, cush2);

    const cabinet = createCabinet(1.8, 0xd4b090);
    cabinet.position.set(4.2, 0, -1.2);
    cabinet.rotation.y = -Math.PI / 2;
    makeInteractable(cabinet, { type: "furn", key: "shelf" });
    this.threeScene.add(cabinet);

    const vase = createVase();
    vase.position.set(4.0, 0.9, -1.2);
    this.threeScene.add(vase);

    [-2.2, 0, 2.2].forEach((x, i) => {
      const pic = createPicture([0xffb0c8, 0x7ec8ff, 0xffe08a][i]);
      pic.position.set(x, 2.2, -4.7);
      this.threeScene.add(pic);
    });

    const candles = createCandleSet();
    candles.position.set(0.35, 0.55, 0.55);
    this.threeScene.add(candles);

    const rack = createCoatRack();
    rack.position.set(4.6, 0, 3.2);
    this.threeScene.add(rack);

    const mat = softBox(1.2, 0.04, 0.7, 0xffe0ec, { roughness: 0.9 });
    mat.position.set(0, 0.03, 3.6);
    this.threeScene.add(mat);

    this.applyPowerVisuals(game.state);
  }

  applyPowerVisuals(state) {
    const tvOn = isPowerOn(state, "tv");
    const tvPaused = getPowerMode(state, "tv") === "paused";
    if (this.tvScreen) {
      this.tvScreen.material.color.set(tvOn ? 0x7ec8ff : tvPaused ? 0x4a6080 : 0x1a2030);
      this.tvScreen.material.emissive = new THREE.Color(tvOn ? 0x446688 : tvPaused ? 0x223344 : 0x000000);
      this.tvScreen.material.emissiveIntensity = tvOn ? 0.6 : tvPaused ? 0.25 : 0;
    }
    const lampOn = isPowerOn(state, "lamp");
    if (this.lampGlow) this.lampGlow.intensity = lampOn ? 1.3 : getPowerMode(state, "lamp") === "paused" ? 0.35 : 0;
    if (this.lampMesh?.userData.bulb) {
      this.lampMesh.userData.bulb.material.emissiveIntensity = lampOn ? 0.9 : getPowerMode(state, "lamp") === "paused" ? 0.3 : 0.1;
    }
    const lightOn = isPowerOn(state, "light");
    if (this.ceilLight) this.ceilLight.intensity = lightOn ? 0.9 : getPowerMode(state, "light") === "paused" ? 0.35 : 0.2;
    if (this.ceilLampMesh?.userData.bulb) {
      this.ceilLampMesh.userData.bulb.material.emissiveIntensity = lightOn ? 0.8 : getPowerMode(state, "light") === "paused" ? 0.25 : 0.05;
    }
    if (this.acMesh?.userData.led) {
      const ac = getPowerMode(state, "ac");
      this.acMesh.userData.led.material.color.set(ac === "on" ? 0x4ade80 : ac === "paused" ? 0xfbbf24 : 0x666666);
    }
  }

  onInteract(game, interactive) {
    const d = interactive.data;
    if (d.type === "door") {
      if (game.player?.userData.sitting) setPlayerSit(game.player, false);
      game.go(d.to);
      return;
    }
    if (d.type === "furn") {
      // Sit-able furniture
      if (d.sit || d.key === "sofa" || d.key === "stool") {
        const seat =
          d.key === "sofa"
            ? this.sofaSeat || { x: 0, z: 1.75, yaw: Math.PI }
            : this.sideSeat || { x: -3.9, z: 2.0, yaw: Math.PI / 2 };
        game.ui.openModal(d.key === "sofa" ? "沙发" : "小凳子", "要坐下休息一下吗？", [
          {
            label: game.player?.userData.sitting ? "站起来" : "坐下",
            className: "btn-coral",
            onClick: () => {
              if (game.player?.userData.sitting) {
                setPlayerSit(game.player, false);
                game.toast("站起来啦～");
              } else {
                // 先走到家具再坐下，不能原地坐下
                this.walkTo({ x: seat.x, z: seat.z }, () => {
                  if (!game.player) return;
                  game.player.position.set(seat.x, 0, seat.z);
                  game.player.rotation.y = seat.yaw;
                  setPlayerSit(game.player, true);
                  game.toast(d.key === "sofa" ? "坐在沙发上好舒服～" : "坐在小凳子上休息～");
                  if (game.fp) game.fp.syncCamera(game.player, this.roomBounds);
                });
              }
            },
          },
          { label: "取消", className: "btn-ghost" },
        ]);
        return;
      }
      if (d.key === "table") {
        game.ui.openModal("茶几", "桌上有遥控器，要开电视吗？", [
          {
            label: "开/关电视",
            className: "btn-coral",
            onClick: () => {
              game.ui.openApplianceModal("tv", "电视", () => this.applyPowerVisuals(game.state));
            },
          },
          { label: "取消", className: "btn-ghost" },
        ]);
        return;
      }
      if (d.key === "shelf") {
        const res = claimChore(game.state, "shelf");
        game.toast(res.ok ? `整理书架，赚到 ¥${res.amount}！` : res.msg);
        return;
      }
      if (d.key === "plant") {
        const res = claimChore(game.state, "plant");
        game.toast(res.ok ? `浇了花，赚到 ¥${res.amount}！` : "绿植绿油油的～" + (res.msg || ""));
        return;
      }
      if (d.key === "dogbed") {
        const res = claimChore(game.state, "dogbed");
        game.toast(res.ok ? `整理狗窝，赚到 ¥${res.amount}！` : "这是旺旺的小窝～");
        return;
      }
      if (d.key in game.state.power) {
        game.ui.openApplianceModal(d.key, APPLIANCE_NAMES[d.key] || d.key, () => {
          this.applyPowerVisuals(game.state);
        });
        return;
      }
      return;
    }
    if (d.type === "npc") {
      if (d.key === "dad" || d.key === "mom") {
        const who = d.key === "dad" ? "爸爸" : "妈妈";
        game.ui.openModal(who, `${who}：小蜜糖辛苦啦～要不要领今天的零花钱？`, [
          {
            label: "领零花钱 +¥50",
            className: "btn-coral",
            onClick: () => {
              const res = claimAllowance(game.state);
              game.toast(res.ok ? `${who}给了你 ¥${res.amount}！钱包 ¥${res.money}` : res.msg);
            },
          },
          {
            label: "聊聊天",
            className: "btn-ghost",
            onClick: () => {
              game.toast(
                d.key === "dad"
                  ? "爸爸：去做饭给我们吃吧，做完有奖励哦～"
                  : "妈妈：抱抱～厨房和餐厅都准备好了"
              );
            },
          },
          { label: "关闭", className: "btn-ghost" },
        ]);
        return;
      }
      if (d.key === "dog") game.toast("旺旺：汪汪！");
    }
  }
}
