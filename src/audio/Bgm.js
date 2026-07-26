/**
 * 轻柔背景氛围音（Web Audio 合成，无需外部音频文件）
 * 用户手势后才可播放；静音状态写入 localStorage
 */
export class BgmPlayer {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.timers = [];
    this.playing = false;
    this.muted = localStorage.getItem("honeyBgmMuted") === "1";
    this._started = false;
    this._step = 0;
  }

  async ensureCtx() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    return this.ctx;
  }

  async start() {
    if (this.muted) return;
    const ctx = await this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") await ctx.resume();
    if (this.playing) return;
    this._buildGraph(ctx);
    this.playing = true;
    this._started = true;
  }

  _buildGraph(ctx) {
    this.stop(false);
    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    // 淡入
    const now = ctx.currentTime;
    master.gain.linearRampToValueAtTime(0.14, now + 1.2);

    // 低层氛围垫底
    const padFreqs = [130.81, 196.0, 261.63];
    padFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.05 + i * 0.01;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.02;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.012;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      osc.connect(g);
      g.connect(master);
      osc.start();
      lfo.start();
      this.nodes.push(osc, lfo, g, lfoG);
    });

    // 轻柔旋律（五声音阶循环）
    const melody = ctx.createGain();
    melody.gain.value = 0.09;
    melody.connect(master);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    filter.connect(melody);

    const notes = [523.25, 587.33, 659.25, 784.0, 659.25, 587.33, 523.25, 392.0];
    const beat = 0.55;
    let i = 0;
    const tick = () => {
      if (!this.playing || this.muted) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = notes[i % notes.length];
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 0.9);
      osc.connect(g);
      g.connect(filter);
      osc.start(t);
      osc.stop(t + beat);
      i += 1;
      const id = setTimeout(tick, beat * 1000);
      this.timers.push(id);
    };
    tick();
    this.nodes.push(master, melody, filter);
  }

  stop(clearStarted = true) {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers = [];
    this.nodes.forEach((n) => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch {
        /* ignore */
      }
    });
    this.nodes = [];
    this.playing = false;
    if (clearStarted) this._started = false;
  }

  async toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("honeyBgmMuted", this.muted ? "1" : "0");
    if (this.muted) {
      this.stop(false);
    } else {
      await this.start();
    }
    return !this.muted;
  }

  /** 首次用户手势后尝试开播（若未静音） */
  async unlock() {
    if (this.muted || this.playing) return;
    await this.start();
  }

  isMuted() {
    return this.muted;
  }
}

export const bgm = new BgmPlayer();
