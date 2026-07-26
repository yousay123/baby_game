import * as THREE from "three";

const KEYS = new Set();

window.addEventListener("keydown", (e) => {
  KEYS.add(e.code);
  if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) e.preventDefault();
});
window.addEventListener("keyup", (e) => KEYS.delete(e.code));

/**
 * Third-person orbit — camera ALWAYS stays inside the room.
 * Drag UP raises view; wheel zooms. Never see outside walls.
 */
export class ThirdPersonControls {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.yaw = 0;
    this.pitch = 0.4;
    this.sensitivity = 0.0055;
    this.moveSpeed = 4.0;
    this.distance = 6.5;
    this.minDist = 3.0;
    this.maxDist = 10;
    this.basePitch = 0.4;
    this.baseDist = 6.5;
    this.minPitch = 0.15;
    this.maxPitch = 0.95;
    this.dragging = false;
    this.enabled = true;
    this.inspectMode = false;
    this.userLock = false;
    this.snapNext = false;
    this._ideal = new THREE.Vector3();
    this._look = new THREE.Vector3();
    this._moved = false;
    /** 虚拟摇杆：x 左右，z 前后（上为负） */
    this.stick = { x: 0, z: 0 };

    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("pointerdown", (e) => {
      if (e.button === 2 || e.button === 0) {
        this.dragging = true;
        this._moved = false;
        canvas.setPointerCapture?.(e.pointerId);
      }
    });
    canvas.addEventListener("pointerup", () => {
      this.dragging = false;
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!this.enabled || !this.dragging) return;
      if (Math.abs(e.movementX) + Math.abs(e.movementY) > 0) this._moved = true;
      this.yaw -= e.movementX * this.sensitivity;
      this.pitch -= e.movementY * this.sensitivity;
      this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
      this.basePitch = this.pitch;
      this.baseDist = this.distance;
      this.userLock = true;
      this.inspectMode = false;
    });
    canvas.addEventListener(
      "wheel",
      (e) => {
        this.distance = Math.max(
          this.minDist,
          Math.min(this.maxDist, this.distance + e.deltaY * 0.014)
        );
        this.baseDist = this.distance;
        this.userLock = true;
      },
      { passive: true }
    );

    // 手机双指缩放远近
    this._pinch = null;
    canvas.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          this._pinch = { dist: Math.hypot(dx, dy), startCam: this.distance };
          this.dragging = false;
        }
      },
      { passive: true }
    );
    canvas.addEventListener(
      "touchmove",
      (e) => {
        if (!this._pinch || e.touches.length !== 2) return;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const d = Math.hypot(dx, dy);
        const scale = this._pinch.dist / Math.max(40, d);
        this.distance = Math.max(
          this.minDist,
          Math.min(this.maxDist, this._pinch.startCam * scale)
        );
        this.baseDist = this.distance;
        this.userLock = true;
      },
      { passive: true }
    );
    canvas.addEventListener(
      "touchend",
      () => {
        this._pinch = null;
      },
      { passive: true }
    );
  }

  resetLook(yaw = 0, pitch = 0.4, bounds = null) {
    // Mid third-person — see character + room ahead, not bird's-eye empty floor
    this.yaw = yaw;
    this.pitch = Math.max(this.minPitch, Math.min(0.55, pitch));
    this.basePitch = this.pitch;
    const span = bounds ? Math.min(bounds.halfW, bounds.halfD) : 6;
    const portrait = typeof window !== "undefined" && window.innerHeight > window.innerWidth * 1.1;
    // 竖屏手机拉远一点，避免角色占满屏挡住房间
    const minD = portrait ? 6.2 : 5.2;
    const maxD = portrait ? 8.4 : 7.2;
    this.distance = Math.min(maxD, Math.max(minD, span * (portrait ? 1.05 : 0.85)));
    this.baseDist = this.distance;
    this.maxDist = Math.min(11, Math.max(7.5, span * 1.25));
    this.minDist = portrait ? 4.2 : 3.0;
    this.maxPitch = 0.95;
    this.inspectMode = false;
    this.userLock = false;
    this.snapNext = true;
  }

  setBodyVisible(player, visible = true) {
    if (!player) return;
    player.traverse((c) => {
      if (c.isMesh || c.isSprite) c.visible = visible;
    });
  }

  updateInspect(nearestDist) {
    if (this.dragging || this.userLock) {
      if (!this.dragging && (nearestDist == null || nearestDist > 4)) this.userLock = false;
      return;
    }
    const close = nearestDist != null && nearestDist < 1.5;
    this.inspectMode = close;
    if (!close) {
      this.pitch += (this.basePitch - this.pitch) * 0.03;
      this.distance += (this.baseDist - this.distance) * 0.03;
      return;
    }
    const targetPitch = Math.max(0.35, Math.min(this.basePitch, 0.55));
    const targetDist = Math.max(this.minDist, Math.min(5.8, this.baseDist * 0.78));
    this.pitch += (targetPitch - this.pitch) * 0.04;
    this.distance += (targetDist - this.distance) * 0.04;
  }

  syncCamera(player, bounds = null) {
    if (!player || !this.enabled) return;
    const px = player.position.x;
    const pz = player.position.z;
    const py = 0.75;
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);

    // Strict room box — never leave the room
    const inset = 0.35;
    const hw = bounds ? bounds.halfW - inset : 20;
    const hd = bounds ? bounds.halfD - inset : 20;
    const hMax = (bounds?.height || 5.5) - 0.35;
    const hMin = 1.15;

    let dist = Math.max(this.distance, this.minDist);

    for (let i = 0; i < 18; i++) {
      const x = px + sinY * cosP * dist;
      const y = py + sinP * dist + 0.45;
      const z = pz + cosY * cosP * dist;
      const inside =
        !bounds ||
        (x >= -hw && x <= hw && z >= -hd && z <= hd && y >= hMin && y <= hMax);
      this._ideal.set(
        THREE.MathUtils.clamp(x, -hw, hw),
        THREE.MathUtils.clamp(y, hMin, hMax),
        THREE.MathUtils.clamp(z, -hd, hd)
      );
      if (inside || dist <= this.minDist + 0.05) break;
      dist = Math.max(this.minDist, dist * 0.86);
    }

    // Final hard clamp inside room
    if (bounds) {
      this._ideal.x = THREE.MathUtils.clamp(this._ideal.x, -hw, hw);
      this._ideal.z = THREE.MathUtils.clamp(this._ideal.z, -hd, hd);
      this._ideal.y = THREE.MathUtils.clamp(this._ideal.y, hMin, hMax);
    }

    if (this.snapNext) {
      this.camera.position.copy(this._ideal);
      this.snapNext = false;
    } else {
      this.camera.position.lerp(this._ideal, 0.2);
      // Keep lerp result inside too
      if (bounds) {
        this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -hw, hw);
        this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -hd, hd);
        this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, hMin, hMax);
      }
    }
    this._look.set(px, 1.05, pz);
    this.camera.lookAt(this._look);

    // Overhead cam sits near head → sprite billboards explode; hide early
    const showTags = this.pitch < 0.62;
    player.traverse((c) => {
      if (c.isSprite && c.name === "playerTag") c.visible = showTags;
    });
  }

  getMoveVector(dt) {
    const stickX = this.stick?.x || 0;
    const stickZ = this.stick?.z || 0;
    const stickActive = Math.hypot(stickX, stickZ) > 0.08;
    const forward =
      (KEYS.has("KeyW") || KEYS.has("ArrowUp") ? 1 : 0) -
      (KEYS.has("KeyS") || KEYS.has("ArrowDown") ? 1 : 0) -
      (stickActive ? stickZ : 0);
    const strafe =
      (KEYS.has("KeyD") || KEYS.has("ArrowRight") ? 1 : 0) -
      (KEYS.has("KeyA") || KEYS.has("ArrowLeft") ? 1 : 0) +
      (stickActive ? stickX : 0);
    if (Math.abs(forward) < 0.05 && Math.abs(strafe) < 0.05) return null;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    let dx = -forward * sin + strafe * cos;
    let dz = -forward * cos - strafe * sin;
    const len = Math.hypot(dx, dz) || 1;
    // 摇杆力度影响速度
    const stickMag = stickActive ? Math.min(1, Math.hypot(stickX, stickZ)) : 1;
    const keyMag = KEYS.has("KeyW") || KEYS.has("KeyA") || KEYS.has("KeyS") || KEYS.has("KeyD") ||
      KEYS.has("ArrowUp") || KEYS.has("ArrowDown") || KEYS.has("ArrowLeft") || KEYS.has("ArrowRight")
      ? 1
      : stickMag;
    dx = (dx / len) * this.moveSpeed * dt * keyMag;
    dz = (dz / len) * this.moveSpeed * dt * keyMag;
    return { dx, dz, faceYaw: Math.atan2(dx, dz) };
  }
}

export { ThirdPersonControls as FirstPersonControls };
