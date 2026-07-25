import * as THREE from "three";

export class SceneManager {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;
    this.scenes = new Map();
    this.current = null;
    this.currentId = null;
  }

  register(id, sceneObj) {
    this.scenes.set(id, sceneObj);
  }

  async show(id, game) {
    if (this.currentId === id) return;
    if (this.current?.onLeave) this.current.onLeave(game);
    const next = this.scenes.get(id);
    if (!next) throw new Error("Unknown scene: " + id);
    this.current = next;
    this.currentId = id;
    if (next.onEnter) await next.onEnter(game);
    if (game.ui) game.ui.onSceneChange(id, game);
  }

  update(dt, game) {
    if (this.current?.update) this.current.update(dt, game);
  }

  render() {
    if (!this.current) return;
    this.renderer.render(this.current.threeScene, this.camera);
  }

  get threeScene() {
    return this.current?.threeScene;
  }
}

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 7.5, 10);
  camera.lookAt(0, 0.5, 0);
  return camera;
}
