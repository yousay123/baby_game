import * as THREE from "three";

export class InputController {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this._onClick = null;

    canvas.addEventListener("pointerdown", (e) => this.handlePointer(e));
  }

  onClick(fn) {
    this._onClick = fn;
  }

  handlePointer(e) {
    if (e.button != null && e.button !== 0) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (this._onClick) this._onClick(this.pointer, e);
  }

  pick(scene, objects) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const list = objects || scene.children;
    const hits = this.raycaster.intersectObjects(list, true);
    return hits;
  }

  pickFloorPoint(scene) {
    const hits = this.pick(scene);
    for (const h of hits) {
      let o = h.object;
      while (o) {
        if (o.userData?.walkable) {
          return { x: h.point.x, y: 0, z: h.point.z, hit: h };
        }
        o = o.parent;
      }
    }
    // fallback: plane y=0
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(plane, point)) {
      return { x: point.x, y: 0, z: point.z };
    }
    return null;
  }

  pickInteractive(scene) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    // 触屏更容易点偏，放宽拾取范围
    this.raycaster.params.Sprite = { threshold: 0.35 };
    const hits = this.raycaster.intersectObjects(scene.children, true);
    for (const h of hits) {
      let o = h.object;
      while (o) {
        if (o.userData?.interactive) return { object: o, hit: h, data: o.userData };
        o = o.parent;
      }
    }
    return null;
  }
}
