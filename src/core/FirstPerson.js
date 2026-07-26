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
    /** 进场默认俯仰：与超市「正后方高视角」一致 */
    this.pitch = 0.58;
    this.sensitivity = 0.0055;
    this.moveSpeed = 4.0;
    this.distance = 10.5;
    this.minDist = 5;
    this.maxDist = 18;
    this.basePitch = 0.58;
    this.baseDist = 10.5;
    this.minPitch = 0.22;
    this.maxPitch = 0.88;
    this.dragging = false;
    this.enabled = true;
    this.inspectMode = false;
    this.userLock = false;
    this.snapNext = false;
    this._preferRoomCenter = false;
    this._preferFrontView = false;
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

  /** 吸附到正前/正后/正左/正右，避免进场斜角 */
  snapYawCardinal(yaw) {
    const step = Math.PI / 2;
    return Math.round(yaw / step) * step;
  }

  /**
   * 进场镜头：角色正后方 + 超市同款高俯视
   * pitch 默认 0.58（与蜜糖超市截图一致），各场景勿再改高度
   */
  resetLook(yaw = 0, pitch = 0.58, bounds = null) {
    this.yaw = this.snapYawCardinal(yaw);
    this.pitch = Math.max(this.minPitch, Math.min(0.72, pitch ?? 0.58));
    this.basePitch = this.pitch;
    const span = bounds ? Math.min(bounds.halfW, bounds.halfD) : 7;
    const roomDiag = bounds ? Math.hypot(bounds.halfW * 2, bounds.halfD * 2) : 14;
    const portrait =
      typeof window !== "undefined" && window.innerHeight > window.innerWidth * 1.1;
    // 与超市进场相近的远近：略远一点以看清全屋
    const minD = portrait ? 9.5 : 8.5;
    const maxD = portrait ? 14.5 : 13.5;
    this.distance = Math.min(
      maxD,
      Math.max(minD, span * (portrait ? 1.75 : 1.55), roomDiag * 0.5)
    );
    this.baseDist = this.distance;
    this.maxDist = Math.min(20, Math.max(14, span * 2.3, roomDiag * 0.75));
    this.minDist = portrait ? 6 : 5;
    this.maxPitch = 0.88;
    this.inspectMode = false;
    this.userLock = false;
    this.snapNext = true;
    this._preferFrontView = true;
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
    const targetPitch = Math.max(0.42, Math.min(this.basePitch, 0.62));
    const targetDist = Math.max(this.minDist, Math.min(9.5, this.baseDist * 0.9));
    this.pitch += (targetPitch - this.pitch) * 0.04;
    this.distance += (targetDist - this.distance) * 0.04;
  }

  _camPos(px, pz, yaw, pitch, dist, py = 1.1, lift = 0.7) {
    const sinY = Math.sin(yaw);
    const cosY = Math.cos(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    return {
      x: px + sinY * cosP * dist,
      y: py + sinP * dist + lift,
      z: pz + cosY * cosP * dist,
    };
  }

  syncCamera(player, bounds = null) {
    if (!player || !this.enabled) return;
    const px = player.position.x;
    const pz = player.position.z;

    const inset = 0.15;
    const hw = bounds ? bounds.halfW - inset : 20;
    const hd = bounds ? bounds.halfD - inset : 20;
    const hMax = Math.max(3.2, (bounds?.height || 7) - 0.15);
    const hMin = 2.2;

    const fits = (x, y, z) =>
      !bounds || (x >= -hw && x <= hw && z >= -hd && z <= hd && y >= hMin && y <= hMax);

    // 进场：只在 0/90/180/270° 正面方位里选，高度(pitch)不变
    if (bounds && this._preferFrontView && !this.userLock && !this.dragging) {
      const preferred = this.snapYawCardinal(this.yaw);
      const tryYaws = [preferred, preferred + Math.PI, preferred + Math.PI / 2, preferred - Math.PI / 2].map(
        (y) => this.snapYawCardinal(y)
      );
      const pitch = this.basePitch; // 锁定进场高度
      let best = null;
      for (let yi = 0; yi < tryYaws.length; yi++) {
        const y = tryYaws[yi];
        let dist = Math.max(this.distance, this.minDist);
        for (let i = 0; i < 22; i++) {
          const p = this._camPos(px, pz, y, pitch, dist);
          if (fits(p.x, p.y, p.z)) {
            // 优先：原定正面方位 > 更远距离
            const score = dist + (yi === 0 ? 40 : yi === 1 ? 8 : 0);
            if (!best || score > best.score) best = { score, yaw: y, dist, ...p };
            break;
          }
          dist = Math.max(this.minDist, dist * 0.92);
        }
      }
      if (best) {
        this.yaw = best.yaw;
        this.pitch = pitch;
        this.basePitch = pitch;
        this.distance = Math.max(best.dist, this.minDist);
        this.baseDist = this.distance;
        this._ideal.set(best.x, best.y, best.z);
      }
      this._preferFrontView = false;
      this._preferRoomCenter = false;
    }

    let dist = Math.max(this.distance, this.minDist);
    let pitch = this.pitch;
    for (let i = 0; i < 22; i++) {
      const p = this._camPos(px, pz, this.yaw, pitch, dist);
      this._ideal.set(
        THREE.MathUtils.clamp(p.x, -hw, hw),
        THREE.MathUtils.clamp(p.y, hMin, hMax),
        THREE.MathUtils.clamp(p.z, -hd, hd)
      );
      if (fits(p.x, p.y, p.z) || dist <= this.minDist + 0.05) {
        this.pitch = pitch;
        break;
      }
      if (pitch > 0.36 && p.y > hMax) pitch = Math.max(0.36, pitch - 0.035);
      else dist = Math.max(this.minDist, dist * 0.92);
    }

    if (bounds) {
      this._ideal.x = THREE.MathUtils.clamp(this._ideal.x, -hw, hw);
      this._ideal.z = THREE.MathUtils.clamp(this._ideal.z, -hd, hd);
      this._ideal.y = THREE.MathUtils.clamp(this._ideal.y, hMin, hMax);
    }

    if (this.snapNext) {
      this.camera.position.copy(this._ideal);
      this.snapNext = false;
    } else {
      this.camera.position.lerp(this._ideal, 0.18);
      if (bounds) {
        this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -hw, hw);
        this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -hd, hd);
        this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, hMin, hMax);
      }
    }

    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    // 看向角色前方一点，便于看见屋内陈设
    this._look.set(px - sinY * 0.8, 1.0, pz - cosY * 0.8);
    this.camera.lookAt(this._look);

    const showTags = this.pitch < 0.85;
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
    const stickMag = stickActive ? Math.min(1, Math.hypot(stickX, stickZ)) : 1;
    const keyMag =
      KEYS.has("KeyW") ||
      KEYS.has("KeyA") ||
      KEYS.has("KeyS") ||
      KEYS.has("KeyD") ||
      KEYS.has("ArrowUp") ||
      KEYS.has("ArrowDown") ||
      KEYS.has("ArrowLeft") ||
      KEYS.has("ArrowRight")
        ? 1
        : stickMag;
    dx = (dx / len) * this.moveSpeed * dt * keyMag;
    dz = (dz / len) * this.moveSpeed * dt * keyMag;
    return { dx, dz, faceYaw: Math.atan2(dx, dz) };
  }
}

export { ThirdPersonControls as FirstPersonControls };
