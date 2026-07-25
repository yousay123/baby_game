/**
 * 最早风格 2D SVG 化妆镜 + 发型/脸型/五官 + 多风格差异
 */
import { MAKEUP, CHAR_STYLES } from "../core/constants.js";
import { findMakeupOption } from "../gameplay/GameState.js";

const SKIN = "#FFD2B8";
const GOLD = "#FFC94A";

function $(id, root) {
  return (root || document).querySelector(`#${id}`);
}

function drawPropSVG(prop, color, slot = "hand") {
  const c = color || "#FF6B8A";
  // slot: hand=右手握持 / arm=挂在左小臂 / none
  const origin =
    slot === "arm"
      ? "translate(78 420)"
      : slot === "hand"
        ? "translate(268 470)"
        : "translate(268 470)";

  switch (prop) {
    case "wand":
      return `<g transform="${origin}">
        <rect x="-5" y="-90" width="10" height="100" rx="4" fill="${GOLD}"/>
        <polygon points="0,-116 9,-95 30,-95 12,-83 19,-62 0,-75 -19,-62 -12,-83 -30,-95 -9,-95" fill="${GOLD}"/>
      </g>`;
    case "bouquet":
      return `<g transform="${origin}">
        <ellipse cx="0" cy="-20" rx="36" ry="44" fill="${c}"/>
        <ellipse cx="-14" cy="-28" rx="12" ry="18" fill="#9B7EC8"/>
        <ellipse cx="12" cy="-26" rx="11" ry="16" fill="#C9A7FF"/>
        <rect x="-5" y="18" width="10" height="40" rx="3" fill="#6B8F5E"/>
      </g>`;
    case "balloon":
      return `<g transform="${origin}">
        <ellipse cx="8" cy="-70" rx="28" ry="36" fill="${c}"/>
        <path d="M8 -34 Q14 -10 8 20" fill="none" stroke="#888" stroke-width="2"/>
      </g>`;
    case "teddy":
      return `<g transform="${origin}">
        <circle cx="-16" cy="-36" r="12" fill="${c}"/><circle cx="16" cy="-36" r="12" fill="${c}"/>
        <ellipse cx="0" cy="-8" rx="30" ry="34" fill="${c}"/>
        <circle cx="0" cy="-28" r="20" fill="${c}"/>
      </g>`;
    case "parasol":
      return `<g transform="${origin}">
        <path d="M0 -80 Q-60 -80 -60 -55 Q0 -95 60 -55 Q60 -80 0 -80" fill="${c}"/>
        <line x1="0" y1="-80" x2="0" y2="30" stroke="#C89878" stroke-width="5"/>
      </g>`;
    case "cake":
      return `<g transform="${origin}">
        <rect x="-32" y="-10" width="64" height="22" rx="4" fill="#FFE0EC"/>
        <rect x="-26" y="-28" width="52" height="20" rx="4" fill="#FFB0C8"/>
        <rect x="-20" y="-44" width="40" height="18" rx="4" fill="#FFF5F8"/>
      </g>`;
    case "bag":
      // 手提包挂在小胳膊上
      return `<g transform="translate(78 400)">
        <path d="M-22 -8 L-26 48 Q0 58 26 48 L22 -8 Z" fill="${c}"/>
        <path d="M-16 -8 Q-16 -32 0 -32 Q16 -32 16 -8" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      </g>`;
    case "lantern":
      return `<g transform="${origin}">
        <rect x="-16" y="-40" width="32" height="42" rx="6" fill="${c}"/>
        <rect x="-11" y="-32" width="22" height="28" rx="3" fill="#FFF8E0" opacity="0.85"/>
      </g>`;
    case "lollipop":
      return `<g transform="${origin}">
        <circle cx="0" cy="-50" r="28" fill="${c}"/>
        <rect x="-4" y="-22" width="8" height="70" rx="3" fill="#FFE08A"/>
      </g>`;
    case "violin":
      return `<g transform="${origin}">
        <ellipse cx="0" cy="-10" rx="16" ry="40" fill="${c}"/>
        <rect x="-3" y="-55" width="6" height="40" fill="#A07040"/>
      </g>`;
    case "book":
      return `<g transform="${origin}">
        <rect x="-24" y="-36" width="48" height="64" rx="3" fill="${c}"/>
        <rect x="-18" y="-30" width="36" height="52" rx="2" fill="#FFF8F0"/>
      </g>`;
    default:
      return "";
  }
}

function drawBabySVG(kind, color, wrap) {
  if (!kind || kind === "none") return "";
  const c = color || "#ffb0c8";
  const w = wrap || "#ffe0ec";
  // 抱在胸前偏左臂弯
  if (kind === "babyBear") {
    return `<g transform="translate(150 390)" id="m2dBabyFig">
      <circle cx="-12" cy="-18" r="10" fill="${c}"/><circle cx="12" cy="-18" r="10" fill="${c}"/>
      <ellipse cx="0" cy="6" rx="28" ry="32" fill="${c}"/>
      <circle cx="0" cy="-14" r="18" fill="${c}"/>
      <circle cx="-6" cy="-16" r="2.5" fill="#3A2820"/><circle cx="6" cy="-16" r="2.5" fill="#3A2820"/>
    </g>`;
  }
  if (kind === "babyBunny") {
    return `<g transform="translate(150 390)">
      <ellipse cx="-10" cy="-40" rx="7" ry="18" fill="${c}"/>
      <ellipse cx="10" cy="-40" rx="7" ry="18" fill="${c}"/>
      <ellipse cx="0" cy="8" rx="26" ry="30" fill="${w}"/>
      <circle cx="0" cy="-16" r="18" fill="${c}"/>
      <circle cx="-6" cy="-18" r="2.5" fill="#3A2820"/><circle cx="6" cy="-18" r="2.5" fill="#3A2820"/>
      <ellipse cx="0" cy="-8" rx="5" ry="3" fill="#FFB0C0"/>
    </g>`;
  }
  // 普通宝宝
  return `<g transform="translate(150 390)">
    <ellipse cx="0" cy="14" rx="30" ry="34" fill="${w}"/>
    <circle cx="0" cy="-16" r="20" fill="${SKIN}"/>
    <ellipse cx="0" cy="8" rx="22" ry="18" fill="${c}"/>
    <circle cx="-7" cy="-18" r="2.8" fill="#3A2820"/><circle cx="7" cy="-18" r="2.8" fill="#3A2820"/>
    <path d="M-6 -6 Q0 -1 6 -6" fill="none" stroke="#E88" stroke-width="2" stroke-linecap="round"/>
  </g>`;
}

function drawHatSVG(hat) {
  if (!hat?.kind) return "";
  const kind = hat.kind;
  if (kind === "crown") {
    return `<path d="M145 100 L155 130 L180 110 L205 130 L215 100 L200 133 L180 123 L160 133 Z" fill="${GOLD}"/>
      <circle cx="155" cy="103" r="5" fill="#FF6B8A"/><circle cx="180" cy="95" r="6" fill="#7EC8FF"/><circle cx="205" cy="103" r="5" fill="#FF9EC0"/>`;
  }
  if (kind === "beret") {
    const bcol = hat.color || "#ef6b8a";
    return `<ellipse cx="195" cy="112" rx="50" ry="18" fill="${bcol}"/><circle cx="222" cy="100" r="7" fill="${bcol}"/>`;
  }
  if (kind === "cap") {
    const c = hat.color || "#ff8ab0";
    return `<path d="M120 130 Q180 95 240 130 Q235 155 180 158 Q125 155 120 130 Z" fill="${c}"/>
      <path d="M175 150 Q230 145 255 155 Q230 168 180 162 Z" fill="${c}"/>`;
  }
  if (kind === "flower") {
    return `<circle cx="250" cy="148" r="11" fill="#FF6B8A"/><circle cx="260" cy="142" r="9" fill="#FF9EC0"/><circle cx="242" cy="140" r="9" fill="#FFE0EC"/>
      <circle cx="180" cy="108" r="8" fill="#FF9EC0"/><circle cx="200" cy="102" r="7" fill="#FF6B8A"/>`;
  }
  if (kind === "star") return `<circle cx="118" cy="148" r="9" fill="${GOLD}"/>`;
  if (kind === "butterfly") {
    return `<ellipse cx="248" cy="155" rx="15" ry="11" fill="#A78BFA"/><ellipse cx="268" cy="155" rx="15" ry="11" fill="#A78BFA"/>`;
  }
  if (kind === "catEar") {
    return `<path d="M125 125 L140 88 L155 125 Z" fill="#FFB6C1"/><path d="M205 125 L220 88 L235 125 Z" fill="#FFB6C1"/>
      <path d="M132 122 L140 100 L148 122 Z" fill="#FFDEE8"/><path d="M212 122 L220 100 L228 122 Z" fill="#FFDEE8"/>`;
  }
  return "";
}

function hairSVG(style, hc) {
  const bow = `#FF6B8A`;
  switch (style) {
    case "pony":
      return {
        back: `
          <ellipse cx="180" cy="175" rx="95" ry="100" fill="${hc}"/>
          <path d="M200 200 Q260 280 240 400 Q210 360 195 280 Z" fill="${hc}"/>
          <circle cx="235" cy="405" r="24" fill="${hc}"/>
          <circle cx="210" cy="195" r="12" fill="${bow}"/>`,
        front: `
          <path d="M95 140 Q180 65 265 140 Q255 175 235 160 Q200 145 180 158 Q160 145 125 160 Q105 175 95 140 Z" fill="${hc}"/>
          <path d="M120 150 Q150 128 168 152" fill="none" stroke="${hc}" stroke-width="16" stroke-linecap="round"/>
          <path d="M192 152 Q215 128 240 150" fill="none" stroke="${hc}" stroke-width="16" stroke-linecap="round"/>`,
      };
    case "bob":
      return {
        back: `<ellipse cx="180" cy="185" rx="100" ry="95" fill="${hc}"/>
          <path d="M80 200 Q70 280 95 320 Q130 290 110 230 Z" fill="${hc}"/>
          <path d="M280 200 Q290 280 265 320 Q230 290 250 230 Z" fill="${hc}"/>`,
        front: `
          <path d="M90 145 Q180 70 270 145 Q265 200 240 210 Q200 175 180 185 Q160 175 120 210 Q95 200 90 145 Z" fill="${hc}"/>
          <path d="M125 155 Q155 135 175 158" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/>
          <path d="M185 158 Q210 135 235 155" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/>`,
      };
    case "long":
      return {
        back: `
          <ellipse cx="180" cy="180" rx="98" ry="105" fill="${hc}"/>
          <path d="M85 180 Q55 320 80 460 Q110 400 105 280 Z" fill="${hc}"/>
          <path d="M275 180 Q305 320 280 460 Q250 400 255 280 Z" fill="${hc}"/>`,
        front: `
          <path d="M95 135 Q180 60 265 135 Q258 185 240 175 Q205 155 180 168 Q155 155 120 175 Q102 185 95 135 Z" fill="${hc}"/>
          <path d="M130 148 Q158 125 175 150" fill="none" stroke="${hc}" stroke-width="13" stroke-linecap="round"/>
          <path d="M185 150 Q208 125 230 148" fill="none" stroke="${hc}" stroke-width="13" stroke-linecap="round"/>`,
      };
    case "bun":
      return {
        back: `
          <ellipse cx="180" cy="185" rx="92" ry="95" fill="${hc}"/>
          <circle cx="180" cy="95" r="32" fill="${hc}"/>
          <circle cx="180" cy="95" r="18" fill="${bow}"/>`,
        front: `
          <path d="M100 145 Q180 75 260 145 Q250 175 230 165 Q200 150 180 160 Q160 150 130 165 Q110 175 100 145 Z" fill="${hc}"/>
          <path d="M128 155 Q152 138 170 156" fill="none" stroke="${hc}" stroke-width="12" stroke-linecap="round"/>
          <path d="M190 156 Q212 138 232 155" fill="none" stroke="${hc}" stroke-width="12" stroke-linecap="round"/>`,
      };
    case "wave":
      return {
        back: `
          <ellipse cx="180" cy="175" rx="100" ry="105" fill="${hc}"/>
          <path d="M75 190 Q40 280 70 380 Q100 340 95 260 Q110 220 90 195 Z" fill="${hc}"/>
          <path d="M285 190 Q320 280 290 380 Q260 340 265 260 Q250 220 270 195 Z" fill="${hc}"/>
          <circle cx="65" cy="385" r="20" fill="${hc}"/><circle cx="295" cy="385" r="20" fill="${hc}"/>`,
        front: `
          <path d="M92 138 Q180 55 268 138 Q262 190 245 178 Q210 150 180 165 Q150 150 115 178 Q98 190 92 138 Z" fill="${hc}"/>
          <path d="M118 152 Q148 120 172 155" fill="none" stroke="${hc}" stroke-width="15" stroke-linecap="round"/>
          <path d="M188 155 Q218 120 242 152" fill="none" stroke="${hc}" stroke-width="15" stroke-linecap="round"/>`,
      };
    case "twin":
    default:
      return {
        back: `
          <path d="M88 152 Q78 232 95 280 Q120 250 110 200 Q105 165 88 152 Z" fill="${hc}"/>
          <path d="M272 152 Q282 232 265 280 Q240 250 250 200 Q255 165 272 152 Z" fill="${hc}"/>
          <path d="M95 208 Q50 262 70 340 Q95 300 105 250 Z" fill="${hc}"/>
          <path d="M265 208 Q310 262 290 340 Q265 300 255 250 Z" fill="${hc}"/>
          <circle cx="68" cy="345" r="22" fill="${hc}"/><circle cx="292" cy="345" r="22" fill="${hc}"/>
          <circle cx="72" cy="200" r="14" fill="${bow}"/><circle cx="288" cy="200" r="14" fill="${bow}"/>`,
        front: `
          <path d="M100 130 Q180 70 260 130 Q250 175 230 165 Q200 155 180 168 Q160 155 130 165 Q110 175 100 130 Z" fill="${hc}"/>
          <path d="M115 145 Q145 125 165 148" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/>
          <path d="M195 148 Q215 125 245 145" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/>
          <path d="M155 155 Q180 170 205 155" fill="none" stroke="${hc}" stroke-width="10" stroke-linecap="round" opacity="0.85"/>`,
      };
  }
}

function featuresSVG(look, lip, blush, eye, eyeScale, hc) {
  const es = eyeScale || 1;
  const er = Math.round(24 * es);
  const ir = Math.round(14 * es);
  const pr = Math.round(7 * es);
  const y = 198;
  const lx = 142;
  const rx = 218;

  let eyes = `
    <circle cx="${lx}" cy="${y}" r="${er}" fill="#fff" stroke="#3A2820" stroke-width="2"/>
    <circle cx="${rx}" cy="${y}" r="${er}" fill="#fff" stroke="#3A2820" stroke-width="2"/>
    <circle cx="${lx + 2}" cy="${y + 2}" r="${ir}" fill="#6B3F2A"/>
    <circle cx="${rx - 2}" cy="${y + 2}" r="${ir}" fill="#6B3F2A"/>
    <circle cx="${lx + 2}" cy="${y + 2}" r="${pr}" fill="#1A1008"/>
    <circle cx="${rx - 2}" cy="${y + 2}" r="${pr}" fill="#1A1008"/>
    <circle cx="${lx + 8}" cy="${y - 8}" r="6" fill="#fff"/>
    <circle cx="${rx + 6}" cy="${y - 8}" r="6" fill="#fff"/>`;

  let lashes = `
    <path d="M118 178 Q142 168 166 178" fill="none" stroke="#2C2430" stroke-width="3" stroke-linecap="round"/>
    <path d="M194 178 Q218 168 242 178" fill="none" stroke="#2C2430" stroke-width="3" stroke-linecap="round"/>`;
  let lips = `<path d="M155 242 Q180 230 205 242 Q180 272 155 242 Z" fill="${lip.color}"/>
    <ellipse cx="180" cy="238" rx="10" ry="3" fill="#fff" opacity="0.4"/>`;
  let brows = { l: "M122 155 Q148 142 170 154", r: "M190 154 Q212 142 238 155", w: 4.2 };

  if (look === "cool") {
    eyes = `
      <ellipse cx="${lx}" cy="${y}" rx="${er + 4}" ry="${er - 4}" fill="#fff" stroke="#3A2820" stroke-width="2"/>
      <ellipse cx="${rx}" cy="${y}" rx="${er + 4}" ry="${er - 4}" fill="#fff" stroke="#3A2820" stroke-width="2"/>
      <ellipse cx="${lx + 2}" cy="${y + 1}" rx="${ir}" ry="${ir - 2}" fill="#4A3028"/>
      <ellipse cx="${rx - 2}" cy="${y + 1}" rx="${ir}" ry="${ir - 2}" fill="#4A3028"/>
      <circle cx="${lx + 2}" cy="${y + 1}" r="${pr - 1}" fill="#1A1008"/>
      <circle cx="${rx - 2}" cy="${y + 1}" r="${pr - 1}" fill="#1A1008"/>
      <circle cx="${lx + 7}" cy="${y - 5}" r="4" fill="#fff"/>
      <circle cx="${rx + 5}" cy="${y - 5}" r="4" fill="#fff"/>`;
    lips = `<path d="M158 245 Q180 238 202 245" fill="none" stroke="${lip.color}" stroke-width="5" stroke-linecap="round"/>`;
    brows = { l: "M118 158 Q145 148 168 158", r: "M192 158 Q215 148 242 158", w: 5 };
  } else if (look === "shy") {
    lips = `<path d="M162 248 Q180 242 198 248" fill="none" stroke="${lip.color}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="180" cy="252" rx="6" ry="3" fill="${lip.color}" opacity="0.5"/>`;
  } else if (look === "lively") {
    lips = `<path d="M150 238 Q180 228 210 238 Q180 278 150 238 Z" fill="${lip.color}"/>
      <ellipse cx="180" cy="248" rx="14" ry="6" fill="#fff" opacity="0.9"/>`;
    lashes = `
      <path d="M115 175 Q142 162 168 178" fill="none" stroke="#2C2430" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M192 178 Q218 162 245 175" fill="none" stroke="#2C2430" stroke-width="3.5" stroke-linecap="round"/>`;
  } else if (look === "gentle") {
    lips = `<path d="M158 244 Q180 236 202 244 Q180 258 158 244 Z" fill="${lip.color}"/>`;
    brows = { l: "M124 158 Q148 148 168 156", r: "M192 156 Q212 148 236 158", w: 3.5 };
  }

  const blushR = look === "shy" ? 26 : look === "cool" ? 16 : 22;
  const blushOp = look === "shy" ? 0.55 : 0.42;

  return {
    blush: `<circle cx="118" cy="220" r="${blushR}" fill="${blush.color}" opacity="${blushOp}"/>
      <circle cx="242" cy="220" r="${blushR}" fill="${blush.color}" opacity="${blushOp}"/>`,
    eyeshadow: `<ellipse cx="142" cy="188" rx="28" ry="12" fill="${eye.color}" opacity="0.38"/>
      <ellipse cx="218" cy="188" rx="28" ry="12" fill="${eye.color}" opacity="0.38"/>`,
    eyes,
    lashes,
    lips,
    brows,
  };
}

export class Makeup2D {
  constructor() {
    this.root = document.getElementById("makeup2d");
    this._built = false;
  }

  ensureDOM() {
    if (this._built || !this.root) return;
    this.root.innerHTML = `
      <section class="m2d-mirror" aria-label="化妆镜">
        <div class="m2d-frame">
          <div class="m2d-glass" id="m2dCapture">
            <div class="m2d-bg" id="m2dBg"></div>
            <svg id="m2dChar" viewBox="0 0 360 620" role="img" aria-label="公主小蜜糖">
              <defs>
                <linearGradient id="m2dFaceShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
                  <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="100%" stop-color="#000000" stop-opacity="0.06"/>
                </linearGradient>
                <filter id="m2dSoft" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#c48" flood-opacity="0.18"/>
                </filter>
              </defs>
              <g id="m2dHairBack"></g>
              <g id="m2dLegs"></g>
              <g id="m2dDress"></g>
              <g id="m2dArms"></g>
              <g id="m2dSleeves"></g>
              <g id="m2dWatch"></g>
              <g id="m2dBracelet"></g>
              <!-- 脖子与下巴衔接：上缘埋进脸底 -->
              <path id="m2dNeck" d="M164 278 C160 300 166 328 180 336 C194 328 200 300 196 278
                Q180 286 164 278 Z" fill="${SKIN}"/>
              <g id="m2dNecklace"></g>
              <ellipse id="m2dEarL" cx="94" cy="205" rx="16" ry="22" fill="${SKIN}"/>
              <ellipse id="m2dEarR" cx="266" cy="205" rx="16" ry="22" fill="${SKIN}"/>
              <ellipse id="m2dFace" cx="180" cy="200" rx="88" ry="96" fill="${SKIN}"/>
              <ellipse id="m2dFaceShadeEl" cx="180" cy="200" rx="88" ry="96" fill="url(#m2dFaceShade)"/>
              <g id="m2dBlush"></g>
              <g id="m2dEyeshadow"></g>
              <g id="m2dEyes"></g>
              <g id="m2dLashes"></g>
              <path id="m2dBrowL" d="M122 162 Q148 148 170 160" fill="none" stroke="#5B3A2E" stroke-width="4.2" stroke-linecap="round"/>
              <path id="m2dBrowR" d="M190 160 Q212 148 238 162" fill="none" stroke="#5B3A2E" stroke-width="4.2" stroke-linecap="round"/>
              <ellipse cx="180" cy="228" rx="4.5" ry="3" fill="#F0A890" opacity="0.5"/>
              <g id="m2dLips"></g>
              <g id="m2dHairFront"></g>
              <g id="m2dGlasses"></g>
              <g id="m2dEarrings"></g>
              <g id="m2dAccessory"></g>
              <g id="m2dBaby"></g>
              <g id="m2dProp"></g>
              <g id="m2dShoes"></g>
            </svg>
            <div class="m2d-name" id="m2dName">小蜜糖</div>
          </div>
        </div>
        <p class="m2d-hint">化好妆、换好装，就可以去超市买菜啦～</p>
      </section>
    `;
    this._built = true;
  }

  show() {
    this.ensureDOM();
    if (this.root) this.root.hidden = false;
    document.body.classList.add("makeup-2d-active");
  }

  hide() {
    if (this.root) this.root.hidden = true;
    document.body.classList.remove("makeup-2d-active");
  }

  render(state) {
    this.ensureDOM();
    if (!state || !this.root) return;

    const lip = findMakeupOption("lipstick", state.makeup.lipstick);
    const blush = findMakeupOption("blush", state.makeup.blush);
    const eye = findMakeupOption("eyeshadow", state.makeup.eyeshadow);
    const hairOpt = findMakeupOption("hair", state.makeup.hair);
    const hs = findMakeupOption("hairstyle", state.makeup.hairstyle || "hsTwin");
    const face = findMakeupOption("faceShape", state.makeup.faceShape || "faceRound");
    const feat = findMakeupOption("features", state.makeup.features || "featSweet");
    const top = findMakeupOption("top", state.makeup.top);
    const bottom = findMakeupOption("bottom", state.makeup.bottom);
    const hat = findMakeupOption("hat", state.makeup.hat || "hat0");
    const jew = findMakeupOption("jewelry", state.makeup.jewelry || "jew0");
    const baby = findMakeupOption("baby", state.makeup.baby || "baby0");
    const propOpt = findMakeupOption("prop", state.makeup.prop || "prop0");
    const bgOpt = findMakeupOption("bg", state.makeup.bg || "bgRose");
    const hc = hairOpt.color;
    const tc = top.color;
    const bc = bottom.color;

    const style = CHAR_STYLES.find((s) => s.id === state.charStyle) || CHAR_STYLES[0];
    const nameEl = $("m2dName");
    if (nameEl) nameEl.textContent = style.name;

    // 背景切换
    const bgEl = $("m2dBg");
    if (bgEl) {
      bgEl.className = `m2d-bg ${bgOpt.css || "bg-rose"}`;
    }

    // Face shape
    const faceEl = $("m2dFace");
    const shadeEl = $("m2dFaceShadeEl");
    if (faceEl) {
      faceEl.setAttribute("rx", String(face.rx || 88));
      faceEl.setAttribute("ry", String(face.ry || 96));
    }
    if (shadeEl) {
      shadeEl.setAttribute("rx", String(face.rx || 88));
      shadeEl.setAttribute("ry", String(face.ry || 96));
    }

    // Body — 加长可见腿部；上衣覆盖整段躯干（避免被脖子挡住）
    $("m2dLegs").innerHTML = `
      <path d="M150 400 C144 455 146 520 152 575 L176 575 C180 520 178 455 176 400 Z" fill="#FFD0DC"/>
      <path d="M184 400 C182 455 180 520 184 575 L208 575 C214 520 212 455 210 400 Z" fill="#FFD0DC"/>
    `;
    $("m2dShoes").innerHTML = `
      <ellipse cx="164" cy="582" rx="26" ry="12" fill="${bc}"/>
      <ellipse cx="196" cy="582" rx="26" ry="12" fill="${bc}"/>
    `;

    // 完整上衣躯干：从脖子下缘到腰
    const topBody = `
      <path d="M128 320
        Q180 300 232 320
        L242 348
        Q248 400 238 418
        Q180 430 122 418
        Q112 400 118 348
        Z" fill="${tc}"/>
      <circle cx="180" cy="348" r="8" fill="${GOLD}"/>
    `;

    if (bottom.skirt) {
      $("m2dDress").innerHTML = `
        ${topBody}
        <path d="M122 405 Q70 445 78 490 Q180 525 282 490 Q290 445 238 405
          Q210 398 180 400 Q150 398 122 405 Z" fill="${bc}" filter="url(#m2dSoft)"/>
        <path d="M135 420 Q155 470 132 500" fill="none" stroke="#fff" stroke-width="10" opacity="0.22"/>
      `;
    } else {
      // 裤子：腰到膝下，留出小腿
      $("m2dDress").innerHTML = `
        ${topBody}
        <path d="M138 412 L132 505 L176 505 L180 420 Z" fill="${bc}"/>
        <path d="M180 420 L184 505 L228 505 L222 412 Z" fill="${bc}"/>
        <path d="M132 412 Q180 422 228 412 Q232 418 180 424 Q128 418 132 412 Z" fill="${tc}" opacity="0.9"/>
      `;
    }

    // 肩膀略低于脖子底
    $("m2dSleeves").innerHTML = `
      <ellipse cx="112" cy="350" rx="34" ry="26" fill="${tc}"/>
      <ellipse cx="248" cy="350" rx="34" ry="26" fill="${tc}"/>
    `;
    $("m2dArms").innerHTML = `
      <path d="M95 358 C85 405 82 455 92 505" fill="none" stroke="${SKIN}" stroke-width="28" stroke-linecap="round"/>
      <path d="M265 358 C275 405 278 455 268 505" fill="none" stroke="${SKIN}" stroke-width="28" stroke-linecap="round"/>
      <circle cx="92" cy="512" r="16" fill="${SKIN}"/>
      <circle cx="268" cy="512" r="16" fill="${SKIN}"/>
    `;

    const featDraw = featuresSVG(feat.look, lip, blush, eye, feat.eyeScale, hc);
    $("m2dBlush").innerHTML = featDraw.blush;
    $("m2dEyeshadow").innerHTML = featDraw.eyeshadow;
    $("m2dEyes").innerHTML = featDraw.eyes;
    $("m2dLashes").innerHTML = featDraw.lashes;
    $("m2dLips").innerHTML = featDraw.lips;
    $("m2dBrowL").setAttribute("d", featDraw.brows.l);
    $("m2dBrowR").setAttribute("d", featDraw.brows.r);
    $("m2dBrowL").setAttribute("stroke", hc);
    $("m2dBrowR").setAttribute("stroke", hc);
    $("m2dBrowL").setAttribute("stroke-width", String(featDraw.brows.w));
    $("m2dBrowR").setAttribute("stroke-width", String(featDraw.brows.w));

    const hair = hairSVG(hs.style || "twin", hc);
    $("m2dHairBack").innerHTML = hair.back;
    $("m2dHairFront").innerHTML = hair.front;

    $("m2dGlasses").innerHTML = jew.glasses
      ? `<ellipse cx="142" cy="198" rx="30" ry="26" fill="none" stroke="#3a3040" stroke-width="3"/>
         <ellipse cx="218" cy="198" rx="30" ry="26" fill="none" stroke="#3a3040" stroke-width="3"/>
         <path d="M172 198 H188" stroke="#3a3040" stroke-width="3"/>`
      : "";
    // 耳环贴耳垂
    $("m2dEarrings").innerHTML = jew.earrings
      ? `<circle cx="90" cy="228" r="8" fill="#FFF8F0" stroke="${GOLD}" stroke-width="1.5"/>
         <circle cx="270" cy="228" r="8" fill="#FFF8F0" stroke="${GOLD}" stroke-width="1.5"/>
         <circle cx="90" cy="238" r="3" fill="${GOLD}"/><circle cx="270" cy="238" r="3" fill="${GOLD}"/>`
      : "";
    // 项链绕脖子
    $("m2dNecklace").innerHTML = jew.necklace
      ? `<path d="M155 312 Q180 338 205 312" fill="none" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>
         <circle cx="172" cy="328" r="6" fill="#FF6B8A"/><circle cx="188" cy="328" r="6" fill="#FF6B8A"/>
         <circle cx="180" cy="336" r="7" fill="#FF6B8A"/>`
      : "";
    // 手表在左手腕
    $("m2dWatch").innerHTML = jew.watch
      ? `<g transform="translate(92 478)">
           <rect x="-14" y="-6" width="28" height="14" rx="4" fill="${jew.color || "#ff6b8a"}"/>
           <rect x="-10" y="-3" width="20" height="8" rx="2" fill="#FFF8F0"/>
           <circle cx="0" cy="1" r="2" fill="#3a3040"/>
         </g>`
      : "";
    // 手链在右手腕
    $("m2dBracelet").innerHTML = jew.bracelet
      ? `<g transform="translate(268 478)">
           <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="${jew.color || GOLD}" stroke-width="4"/>
           <circle cx="12" cy="0" r="4" fill="${jew.color || GOLD}"/>
         </g>`
      : "";

    $("m2dAccessory").innerHTML = drawHatSVG(hat);
    $("m2dBaby").innerHTML = drawBabySVG(baby.kind, baby.color, baby.wrap);
    // 抱宝宝时右手道具可并存；包挂左臂
    const slot = propOpt.slot || "hand";
    $("m2dProp").innerHTML =
      propOpt.prop && propOpt.prop !== "none" ? drawPropSVG(propOpt.prop, propOpt.color, slot) : "";
  }
}

export const makeup2d = new Makeup2D();
