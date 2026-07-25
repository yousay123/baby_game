import * as THREE from "three";
import { createRenderer, createCamera, SceneManager } from "./core/SceneManager.js";
import { InputController } from "./core/Input.js";
import { createGameState, emit, subscribe } from "./gameplay/GameState.js";
import { HUD } from "./ui/HUD.js";
import { MakeupScene, MarketScene, HomeScene } from "./scenes/WorldScenes.js";
import { KitchenScene, DiningScene } from "./scenes/KitchenDining.js";
import {
  setHoldingMesh,
  createPlateOrBowl,
  createBagMesh,
  createCartHoldMesh,
} from "./characters/Avatar.js";
import { box } from "./core/builders.js";

class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.renderer = createRenderer(this.canvas);
    this.camera = createCamera();
    this.input = new InputController(this.canvas, this.camera);
    this.scenes = new SceneManager(this.renderer, this.camera);
    this.state = createGameState();
    this.ui = new HUD(this);
    this.ui.bindState(this.state);
    this.player = null;
    this.clock = new THREE.Clock();

    this.scenes.register("makeup", new MakeupScene());
    this.scenes.register("market", new MarketScene());
    this.scenes.register("home", new HomeScene());
    this.scenes.register("kitchen", new KitchenScene());
    this.scenes.register("dining", new DiningScene());

    this.input.onClick((pointer, e) => {
      // ignore UI clicks
      if (e.target !== this.canvas) return;
      const scene = this.scenes.threeScene;
      if (!scene) return;
      const interactive = this.input.pickInteractive(scene);
      if (interactive) {
        this.scenes.current.handleClick(this, null, interactive);
        return;
      }
      const point = this.input.pickFloorPoint(scene);
      this.scenes.current.handleClick(this, point, null);
    });

    window.addEventListener("resize", () => this.onResize());
    subscribe(this.state, () => {
      this.ui.refresh(this.state);
    });
  }

  emit() {
    emit(this.state);
  }

  toast(msg) {
    this.ui.toast(msg);
  }

  async go(id) {
    await this.scenes.show(id, this);
  }

  syncCarryVisual() {
    if (!this.player) return;
    if (this.state.carrying) {
      const mesh = createPlateOrBowl(this.state.carrying.vessel, this.state.carrying.dish);
      mesh.scale.setScalar(0.85);
      setHoldingMesh(this.player, mesh);
      return;
    }
    if (this.state.bag.length) {
      setHoldingMesh(this.player, createBagMesh());
      return;
    }
    if (this.state.hasCart && this.scenes.currentId === "market") {
      setHoldingMesh(this.player, createCartHoldMesh());
      return;
    }
    if (this.state.holding) {
      const item = box(0.15, 0.15, 0.15, 0x6ecf7a);
      setHoldingMesh(this.player, item);
      return;
    }
    setHoldingMesh(this.player, null);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  start() {
    this.go("makeup");
    this.renderer.setAnimationLoop(() => this.frame());
  }

  frame() {
    const dt = Math.min(0.05, this.clock.getDelta());
    this.scenes.update(dt, this);
    this.scenes.render();
  }
}

const game = new Game();
game.start();

// debug helpers for phase1 kitchen bridge
window.HoneyLife3D = {
  game,
  debugCook() {
    game.state.cooked.push(
      { dish: "炒蔬菜", icon: "菜", vesselDefault: "plate" },
      { dish: "米饭", icon: "饭", vesselDefault: "bowl" }
    );
    emit(game.state);
    game.toast("调试：已生成热菜，去厨房装盘台或点装盘按钮");
  },
  debugFillFridge() {
    game.state.fridge.push(
      { id: "tomato", name: "番茄", tag: "veg", icon: "茄", washed: false },
      { id: "oil", name: "食用油", tag: "oil", icon: "油", washed: false },
      { id: "rice", name: "大米", tag: "rice", icon: "米", washed: false },
      { id: "flour", name: "面粉", tag: "flour", icon: "粉", washed: false }
    );
    emit(game.state);
    game.toast("调试：冰箱已装满基础食材");
  },
};
