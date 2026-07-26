/**
 * 左下角虚拟摇杆：前后左右移动，减少点地误触
 */
export class VirtualStick {
  constructor(rootEl, onChange) {
    this.root = rootEl;
    this.onChange = onChange;
    this.active = false;
    this.pointerId = null;
    this.base = rootEl.querySelector(".virtual-stick-base");
    this.knob = rootEl.querySelector(".virtual-stick-knob");
    this.maxR = 42;
    this._x = 0;
    this._z = 0;

    const bind = (el, type, fn) => el.addEventListener(type, fn, { passive: false });
    bind(this.root, "pointerdown", (e) => this._down(e));
    bind(window, "pointermove", (e) => this._move(e));
    bind(window, "pointerup", (e) => this._up(e));
    bind(window, "pointercancel", (e) => this._up(e));
  }

  setVisible(show) {
    if (!this.root) return;
    this.root.hidden = !show;
    this.root.setAttribute("aria-hidden", show ? "false" : "true");
    if (!show) this._reset();
  }

  _down(e) {
    if (this.root.hidden) return;
    e.preventDefault();
    this.active = true;
    this.pointerId = e.pointerId;
    this.root.classList.add("is-active");
    this.root.setPointerCapture?.(e.pointerId);
    this._move(e);
  }

  _move(e) {
    if (!this.active || e.pointerId !== this.pointerId) return;
    e.preventDefault();
    const rect = this.base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const len = Math.hypot(dx, dy) || 1;
    if (len > this.maxR) {
      dx = (dx / len) * this.maxR;
      dy = (dy / len) * this.maxR;
    }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    // 上为前进（-z 屏幕），右为右移（+x）
    this._x = dx / this.maxR;
    this._z = dy / this.maxR;
    this.onChange?.({ x: this._x, z: this._z });
  }

  _up(e) {
    if (!this.active) return;
    if (e && this.pointerId != null && e.pointerId !== this.pointerId) return;
    this._reset();
  }

  _reset() {
    this.active = false;
    this.pointerId = null;
    this.root.classList.remove("is-active");
    if (this.knob) this.knob.style.transform = "translate(0px, 0px)";
    this._x = 0;
    this._z = 0;
    this.onChange?.({ x: 0, z: 0 });
  }
}
