import * as THREE from "three";

/** Rising translucent steam puffs above hot dishes */
export class SteamEmitter {
  constructor({ count = 12, height = 0.9, radius = 0.12 } = {}) {
    this.count = count;
    this.height = height;
    this.radius = radius;
    this.root = new THREE.Group();
    this.root.name = "steam";
    this.puffs = [];
    const geo = new THREE.SphereGeometry(0.05, 8, 6);
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.t = Math.random();
      mesh.userData.speed = 0.35 + Math.random() * 0.35;
      mesh.userData.ox = (Math.random() - 0.5) * radius * 2;
      mesh.userData.oz = (Math.random() - 0.5) * radius * 2;
      this.root.add(mesh);
      this.puffs.push(mesh);
    }
  }

  update(dt) {
    for (const p of this.puffs) {
      p.userData.t += dt * p.userData.speed;
      if (p.userData.t > 1) p.userData.t -= 1;
      const t = p.userData.t;
      p.position.set(
        p.userData.ox * (1 - t * 0.3),
        t * this.height,
        p.userData.oz * (1 - t * 0.3)
      );
      const s = 0.6 + t * 1.4;
      p.scale.setScalar(s);
      p.material.opacity = 0.4 * (1 - t);
    }
  }

  dispose() {
    this.root.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
  }
}
