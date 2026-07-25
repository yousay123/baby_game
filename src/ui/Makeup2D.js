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

function drawPropSVG(prop, color) {
  const c = color || "#FF6B8A";
  switch (prop) {
    case "wand":
      return `<g transform="translate(275 310)">
        <rect x="-5" y="0" width="10" height="100" rx="4" fill="${GOLD}"/>
        <polygon points="0,-26 9,-5 30,-5 12,7 19,28 0,15 -19,28 -12,7 -30,-5 -9,-5" fill="${GOLD}"/>
      </g>`;
    case "bouquet":
      return `<g transform="translate(278 350)">
        <ellipse cx="0" cy="0" rx="40" ry="48" fill="${c}"/>
        <ellipse cx="-16" cy="-8" rx="14" ry="20" fill="#9B7EC8"/>
        <ellipse cx="14" cy="-6" rx="12" ry="18" fill="#C9A7FF"/>
        <rect x="-6" y="38" width="12" height="48" rx="4" fill="#6B8F5E"/>
      </g>`;
    case "balloon":
      return `<g transform="translate(282 290)">
        <ellipse cx="0" cy="0" rx="34" ry="42" fill="${c}"/>
        <path d="M0 42 Q6 68 0 96" fill="none" stroke="#888" stroke-width="2"/>
      </g>`;
    case "teddy":
      return `<g transform="translate(272 365)">
        <circle cx="-20" cy="-26" r="15" fill="${c}"/><circle cx="20" cy="-26" r="15" fill="${c}"/>
        <ellipse cx="0" cy="8" rx="36" ry="40" fill="${c}"/>
        <circle cx="0" cy="-16" r="26" fill="${c}"/>
        <circle cx="-9" cy="-20" r="3.5" fill="#3A2820"/><circle cx="9" cy="-20" r="3.5" fill="#3A2820"/>
      </g>`;
    case "parasol":
      return `<g transform="translate(272 210)">
        <path d="M0 18 Q-68 18 -68 38 Q0 6 68 38 Q68 18 0 18" fill="${c}"/>
        <line x1="0" y1="18" x2="0" y2="150" stroke="#C89878" stroke-width="5"/>
      </g>`;
    case "cake":
      return `<g transform="translate(272 385)">
        <rect x="-38" y="18" width="76" height="26" rx="5" fill="#FFE0EC"/>
        <rect x="-30" y="-4" width="60" height="24" rx="5" fill="#FFB0C8"/>
        <rect x="-22" y="-26" width="44" height="22" rx="5" fill="#FFF5F8"/>
      </g>`;
    case "bag":
      return `<g transform="translate(278 365)">
        <path d="M-34 0 L-38 66 Q0 78 38 66 L34 0 Z" fill="${c}"/>
        <path d="M-26 0 Q-26 -26 0 -26 Q26 -26 26 0" fill="none" stroke="${c}" stroke-width="7"/>
      </g>`;
    case "lantern":
      return `<g transform="translate(278 345)">
        <rect x="-20" y="0" width="40" height="52" rx="7" fill="${c}"/>
        <rect x="-14" y="8" width="28" height="36" rx="4" fill="#FFF8E0" opacity="0.85"/>
      </g>`;
    case "lollipop":
      return `<g transform="translate(278 325)">
        <circle cx="0" cy="0" r="34" fill="${c}"/>
        <rect x="-5" y="32" width="10" height="85" rx="4" fill="#FFE08A"/>
      </g>`;
    case "violin":
      return `<g transform="translate(278 345)">
        <ellipse cx="0" cy="18" rx="20" ry="48" fill="${c}"/>
        <rect x="-4" y="-48" width="8" height="52" fill="#A07040"/>
      </g>`;
    case "book":
      return `<g transform="translate(272 385)">
        <rect x="-28" y="-38" width="56" height="76" rx="4" fill="${c}"/>
        <rect x="-22" y="-32" width="44" height="64" rx="2" fill="#FFF8F0"/>
      </g>`;
    default:
      return "";
  }
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
              <path id="m2dNeck" d="M158 308 C156 328 162 342 180 345 C198 342 204 328 202 308 Z" fill="${SKIN}"/>
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
    const acc = findMakeupOption("accessory", state.makeup.accessory);
    const propOpt = findMakeupOption("prop", state.makeup.prop || "prop0");
    const hc = hairOpt.color;
    const tc = top.color;
    const bc = bottom.color;

    const style = CHAR_STYLES.find((s) => s.id === state.charStyle) || CHAR_STYLES[0];
    const nameEl = $("m2dName");
    if (nameEl) nameEl.textContent = style.name;

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

    // 完整上衣躯干：从锁骨下到腰，保证运动服等非裙子款也有上半身
    const topBody = `
      <path d="M128 332
        Q180 312 232 332
        L242 355
        Q248 400 238 418
        Q180 430 122 418
        Q112 400 118 355
        Z" fill="${tc}"/>
      <circle cx="180" cy="360" r="8" fill="${GOLD}"/>
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

    $("m2dGlasses").innerHTML = acc.glasses
      ? `<ellipse cx="142" cy="198" rx="30" ry="26" fill="none" stroke="#3a3040" stroke-width="3"/>
         <ellipse cx="218" cy="198" rx="30" ry="26" fill="none" stroke="#3a3040" stroke-width="3"/>
         <path d="M172 198 H188" stroke="#3a3040" stroke-width="3"/>`
      : "";
    $("m2dEarrings").innerHTML = acc.earrings
      ? `<circle cx="94" cy="232" r="7" fill="#FFF8F0" stroke="${GOLD}" stroke-width="1.5"/>
         <circle cx="266" cy="232" r="7" fill="#FFF8F0" stroke="${GOLD}" stroke-width="1.5"/>`
      : "";
    $("m2dNecklace").innerHTML = acc.necklace
      ? `<path d="M152 318 Q180 340 208 318" fill="none" stroke="${GOLD}" stroke-width="3"/>
         <circle cx="172" cy="334" r="6" fill="#FF6B8A"/><circle cx="188" cy="334" r="6" fill="#FF6B8A"/>
         <circle cx="180" cy="342" r="5" fill="#FF6B8A"/>`
      : "";

    let accHtml = "";
    if (acc.crown) {
      accHtml += `<path d="M145 100 L155 130 L180 110 L205 130 L215 100 L200 133 L180 123 L160 133 Z" fill="${GOLD}"/>
        <circle cx="155" cy="103" r="5" fill="#FF6B8A"/><circle cx="180" cy="95" r="6" fill="#7EC8FF"/><circle cx="205" cy="103" r="5" fill="#FF9EC0"/>`;
    }
    if (acc.flower) {
      accHtml += `<circle cx="250" cy="155" r="10" fill="#FF6B8A"/><circle cx="258" cy="150" r="8" fill="#FF9EC0"/><circle cx="242" cy="150" r="8" fill="#FFE0EC"/>`;
    }
    if (acc.beret) {
      const bcol = acc.color || "#ef6b8a";
      accHtml += `<ellipse cx="195" cy="118" rx="48" ry="18" fill="${bcol}"/><circle cx="220" cy="108" r="6" fill="${bcol}"/>`;
    }
    if (acc.star) accHtml += `<circle cx="120" cy="150" r="8" fill="${GOLD}"/>`;
    if (acc.butterfly) {
      accHtml += `<ellipse cx="250" cy="160" rx="14" ry="10" fill="#A78BFA"/><ellipse cx="268" cy="160" rx="14" ry="10" fill="#A78BFA"/>`;
    }
    if (acc.catEar) {
      accHtml += `<path d="M125 125 L140 90 L155 125 Z" fill="#FFB6C1"/><path d="M205 125 L220 90 L235 125 Z" fill="#FFB6C1"/>`;
    }
    $("m2dAccessory").innerHTML = accHtml;
    $("m2dProp").innerHTML = drawPropSVG(propOpt.prop, propOpt.color);
  }
}

export const makeup2d = new Makeup2D();
