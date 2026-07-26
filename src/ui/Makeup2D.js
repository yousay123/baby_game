/**
 * 2D SVG 化妆镜：角色底模 + 发型/脸型/睫毛/眼球/墨镜/衣鞋包
 */
import { MAKEUP, CHAR_STYLES, CHAR_MODELS } from "../core/constants.js";
import { findMakeupOption } from "../gameplay/GameState.js";

const GOLD = "#FFC94A";

function $(id, root) {
  return (root || document).querySelector(`#${id}`);
}

function drawPropSVG(prop, color, slot = "hand") {
  const c = color || "#FF6B8A";
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
      // 右手提着（与独立包包同一握法）
      return `<g transform="translate(268 528)">
        <path d="M-20 8 L-24 58 Q0 70 24 58 L20 8 Z" fill="${c}"/>
        <path d="M-12 8 Q-12 -18 0 -18 Q12 -18 12 8" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
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

/** 张开手：五指清晰可见。side: left | right */
function drawHandOpen(cx, cy, skin, side = "right") {
  const f = side === "left" ? -1 : 1;
  const nail = "#FFB0C0";
  return `<g transform="translate(${cx} ${cy}) scale(${f} 1)">
    <ellipse cx="0" cy="2" rx="13" ry="11" fill="${skin}"/>
    <!-- 拇指 -->
    <path d="M-12 0 Q-22 -6 -20 8 Q-16 14 -10 10 Z" fill="${skin}"/>
    <ellipse cx="-18" cy="6" rx="3.2" ry="2.6" fill="${nail}" opacity="0.75"/>
    <!-- 食指～小指 -->
    <rect x="-7" y="-18" width="5.5" height="18" rx="2.8" fill="${skin}"/>
    <rect x="-1" y="-20" width="5.5" height="20" rx="2.8" fill="${skin}"/>
    <rect x="5" y="-18" width="5.2" height="18" rx="2.6" fill="${skin}"/>
    <rect x="11" y="-14" width="4.8" height="15" rx="2.4" fill="${skin}"/>
    <ellipse cx="-4.2" cy="-16" rx="2.4" ry="2" fill="${nail}" opacity="0.8"/>
    <ellipse cx="1.8" cy="-18" rx="2.4" ry="2" fill="${nail}" opacity="0.8"/>
    <ellipse cx="7.6" cy="-16" rx="2.2" ry="1.8" fill="${nail}" opacity="0.8"/>
    <ellipse cx="13.4" cy="-12" rx="2" ry="1.6" fill="${nail}" opacity="0.8"/>
    <path d="M-5 4 Q0 8 6 4" fill="none" stroke="#E8A090" stroke-width="1.2" opacity="0.45"/>
  </g>`;
}

/** 握提手：手指扣住提手 */
function drawHandGrip(cx, cy, skin, side = "right") {
  const f = side === "left" ? -1 : 1;
  const nail = "#FFB0C0";
  return `<g transform="translate(${cx} ${cy}) scale(${f} 1)">
    <ellipse cx="0" cy="4" rx="12" ry="10" fill="${skin}"/>
    <!-- 拇指扣在提手外侧 -->
    <path d="M-11 2 Q-20 -4 -18 10 Q-14 16 -8 12 Z" fill="${skin}"/>
    <ellipse cx="-16" cy="8" rx="3" ry="2.4" fill="${nail}" opacity="0.75"/>
    <!-- 四指弯曲扣住提手 -->
    <path d="M-8 -2 Q-10 -14 -4 -16 Q2 -14 0 -2 Z" fill="${skin}"/>
    <path d="M-2 -4 Q-2 -18 4 -20 Q10 -16 6 -2 Z" fill="${skin}"/>
    <path d="M4 -2 Q6 -16 12 -16 Q16 -12 12 0 Z" fill="${skin}"/>
    <path d="M10 0 Q14 -12 18 -10 Q20 -4 14 4 Z" fill="${skin}"/>
    <ellipse cx="-2" cy="-14" rx="2.2" ry="1.8" fill="${nail}" opacity="0.75"/>
    <ellipse cx="5" cy="-16" rx="2.2" ry="1.8" fill="${nail}" opacity="0.75"/>
    <ellipse cx="12" cy="-13" rx="2" ry="1.6" fill="${nail}" opacity="0.75"/>
    <ellipse cx="16" cy="-8" rx="1.8" ry="1.5" fill="${nail}" opacity="0.75"/>
  </g>`;
}

/** 包包：默认右手提着；双肩包仍背在身后 */
function drawBagSVG(bag) {
  if (!bag?.kind || bag.kind === "none") return "";
  const c = bag.color || "#FF6B8A";
  // 右手握点附近：提手在手心，包体垂下
  const hold = "translate(268 528)";
  if (bag.kind === "backpack") {
    return `<g transform="translate(180 390)">
      <rect x="-34" y="-8" width="68" height="78" rx="14" fill="${c}"/>
      <rect x="-24" y="8" width="48" height="36" rx="8" fill="#fff" opacity="0.22"/>
      <path d="M-28 -4 Q-48 20 -28 50" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      <path d="M28 -4 Q48 20 28 50" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
    </g>`;
  }
  if (bag.kind === "tote") {
    return `<g transform="${hold}">
      <path d="M-22 10 L-26 62 Q0 74 26 62 L22 10 Z" fill="${c}"/>
      <path d="M-12 10 Q-12 -16 0 -16 Q12 -16 12 10" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="0" cy="28" rx="10" ry="6" fill="#fff" opacity="0.25"/>
    </g>`;
  }
  if (bag.kind === "mini") {
    return `<g transform="${hold}">
      <rect x="-20" y="8" width="40" height="34" rx="8" fill="${c}"/>
      <path d="M-10 8 Q-10 -14 0 -14 Q10 -14 10 8" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="0" cy="22" r="4" fill="${GOLD}"/>
    </g>`;
  }
  if (bag.kind === "heart") {
    return `<g transform="${hold}">
      <path d="M0 52 C-28 28 -24 2 -10 2 C-2 2 0 10 0 10 C0 10 2 2 10 2 C24 2 28 28 0 52 Z" fill="${c}"/>
      <path d="M-8 6 Q-8 -10 0 -10 Q8 -10 8 6" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
    </g>`;
  }
  if (bag.kind === "pearl") {
    return `<g transform="${hold}">
      <rect x="-18" y="10" width="36" height="28" rx="6" fill="${c}" stroke="#e8d8e0" stroke-width="2"/>
      <path d="M-10 10 Q-10 -12 0 -12 Q10 -12 10 10" fill="none" stroke="#f0e8f0" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 5"/>
      <circle cx="0" cy="22" r="5" fill="${GOLD}"/>
    </g>`;
  }
  if (bag.kind === "basket") {
    return `<g transform="${hold}">
      <ellipse cx="0" cy="40" rx="26" ry="14" fill="${c}"/>
      <path d="M-24 16 Q-26 36 0 44 Q26 36 24 16 Z" fill="${c}"/>
      <path d="M-14 14 Q-14 -10 0 -10 Q14 -10 14 14" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-14 22 H14 M-12 30 H12" stroke="#fff" stroke-width="2" opacity="0.3"/>
    </g>`;
  }
  return "";
}

function drawShoesSVG(shoe, skin) {
  const c = shoe?.color || "#FF6B8A";
  const kind = shoe?.kind || "maryjane";
  if (kind === "sneaker") {
    return `
      <ellipse cx="164" cy="586" rx="28" ry="11" fill="#2a243018"/>
      <ellipse cx="196" cy="586" rx="28" ry="11" fill="#2a243018"/>
      <path d="M140 568 Q164 558 188 568 L186 582 Q164 590 142 582 Z" fill="${c}"/>
      <path d="M172 568 Q196 558 220 568 L218 582 Q196 590 174 582 Z" fill="${c}"/>
      <path d="M148 572 H180 M180 572 H212" stroke="#fff" stroke-width="3" opacity="0.55"/>
      <ellipse cx="164" cy="580" rx="22" ry="6" fill="#fff" opacity="0.35"/>
      <ellipse cx="196" cy="580" rx="22" ry="6" fill="#fff" opacity="0.35"/>`;
  }
  if (kind === "boot") {
    return `
      <path d="M148 520 Q146 560 150 582 L178 582 Q176 555 174 520 Z" fill="${c}"/>
      <path d="M182 520 Q180 560 184 582 L212 582 Q210 555 208 520 Z" fill="${c}"/>
      <ellipse cx="164" cy="584" rx="20" ry="7" fill="#1a1520" opacity="0.35"/>
      <ellipse cx="196" cy="584" rx="20" ry="7" fill="#1a1520" opacity="0.35"/>`;
  }
  if (kind === "heel") {
    return `
      <path d="M148 568 Q164 560 180 568 L178 580 Q164 586 150 580 Z" fill="${c}"/>
      <path d="M180 568 Q196 560 212 568 L210 580 Q196 586 182 580 Z" fill="${c}"/>
      <rect x="160" y="580" width="5" height="14" rx="2" fill="${c}"/>
      <rect x="192" y="580" width="5" height="14" rx="2" fill="${c}"/>
      <ellipse cx="162" cy="594" rx="8" ry="3" fill="${c}"/>
      <ellipse cx="194" cy="594" rx="8" ry="3" fill="${c}"/>`;
  }
  if (kind === "sandal") {
    return `
      <ellipse cx="164" cy="582" rx="24" ry="9" fill="${c}" opacity="0.9"/>
      <ellipse cx="196" cy="582" rx="24" ry="9" fill="${c}" opacity="0.9"/>
      <path d="M150 568 Q164 574 178 568" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <path d="M182 568 Q196 574 210 568" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="164" cy="575" r="3" fill="${skin}"/>
      <circle cx="196" cy="575" r="3" fill="${skin}"/>`;
  }
  if (kind === "flat") {
    return `
      <ellipse cx="164" cy="584" rx="26" ry="10" fill="${c}"/>
      <ellipse cx="196" cy="584" rx="26" ry="10" fill="${c}"/>
      <ellipse cx="164" cy="578" rx="18" ry="6" fill="#fff" opacity="0.35"/>
      <ellipse cx="196" cy="578" rx="18" ry="6" fill="#fff" opacity="0.35"/>
      <circle cx="150" cy="576" r="4" fill="${GOLD}"/>
      <circle cx="182" cy="576" r="4" fill="${GOLD}"/>`;
  }
  // maryjane default
  return `
    <ellipse cx="164" cy="585" rx="25" ry="10" fill="#2a243012"/>
    <ellipse cx="196" cy="585" rx="25" ry="10" fill="#2a243012"/>
    <path d="M142 566 Q164 556 186 566 L184 582 Q164 590 144 582 Z" fill="${c}"/>
    <path d="M174 566 Q196 556 218 566 L216 582 Q196 590 176 582 Z" fill="${c}"/>
    <path d="M150 568 Q164 576 178 568" fill="none" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M182 568 Q196 576 210 568" fill="none" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="164" cy="570" r="3.5" fill="${GOLD}"/>
    <circle cx="196" cy="570" r="3.5" fill="${GOLD}"/>`;
}

function drawSunglassesSVG(sun) {
  if (!sun?.kind || sun.kind === "none") return "";
  const frame = sun.color || "#2a2430";
  const lens = sun.lens || "#3a304088";
  if (sun.kind === "heart") {
    return `<g id="m2dSunFig">
      <path d="M118 188 C108 168 128 158 142 172 C156 158 176 168 166 188 C156 204 142 214 142 214 C142 214 128 204 118 188 Z" fill="${lens}" stroke="${frame}" stroke-width="3"/>
      <path d="M194 188 C184 168 204 158 218 172 C232 158 252 168 242 188 C232 204 218 214 218 214 C218 214 204 204 194 188 Z" fill="${lens}" stroke="${frame}" stroke-width="3"/>
      <path d="M166 190 H194" stroke="${frame}" stroke-width="3"/>
    </g>`;
  }
  if (sun.kind === "cat") {
    return `<g>
      <path d="M108 200 Q112 168 148 172 Q168 176 172 198 Q168 222 142 224 Q112 222 108 200 Z" fill="${lens}" stroke="${frame}" stroke-width="3.2"/>
      <path d="M188 198 Q192 176 212 172 Q248 168 252 200 Q248 222 218 224 Q192 222 188 198 Z" fill="${lens}" stroke="${frame}" stroke-width="3.2"/>
      <path d="M172 198 H188" stroke="${frame}" stroke-width="3"/>
      <path d="M108 198 Q90 192 82 200" fill="none" stroke="${frame}" stroke-width="2.5"/>
      <path d="M252 198 Q270 192 278 200" fill="none" stroke="${frame}" stroke-width="2.5"/>
    </g>`;
  }
  if (sun.kind === "aviator") {
    return `<g>
      <path d="M112 190 Q142 168 170 192 Q168 220 142 226 Q114 220 112 190 Z" fill="${lens}" stroke="${frame}" stroke-width="2.8"/>
      <path d="M190 192 Q218 168 248 190 Q246 220 218 226 Q190 220 190 192 Z" fill="${lens}" stroke="${frame}" stroke-width="2.8"/>
      <path d="M170 198 H190" stroke="${frame}" stroke-width="2.5"/>
      <circle cx="180" cy="198" r="3" fill="${frame}"/>
    </g>`;
  }
  if (sun.kind === "star") {
    return `<g>
      <polygon points="142,168 152,190 176,192 158,208 164,232 142,218 120,232 126,208 108,192 132,190" fill="${lens}" stroke="${frame}" stroke-width="2.5"/>
      <polygon points="218,168 228,190 252,192 234,208 240,232 218,218 196,232 202,208 184,192 208,190" fill="${lens}" stroke="${frame}" stroke-width="2.5"/>
      <path d="M176 198 H184" stroke="${frame}" stroke-width="2.5"/>
    </g>`;
  }
  // round
  return `<g>
    <circle cx="142" cy="198" r="30" fill="${lens}" stroke="${frame}" stroke-width="3.5"/>
    <circle cx="218" cy="198" r="30" fill="${lens}" stroke="${frame}" stroke-width="3.5"/>
    <path d="M172 198 H188" stroke="${frame}" stroke-width="3"/>
    <path d="M112 198 Q96 192 88 200" fill="none" stroke="${frame}" stroke-width="2.5"/>
    <path d="M248 198 Q264 192 272 200" fill="none" stroke="${frame}" stroke-width="2.5"/>
  </g>`;
}

function drawBabySVG(kind, color, wrap, skin) {
  if (!kind || kind === "none") return "";
  const c = color || "#ffb0c8";
  const w = wrap || "#ffe0ec";
  const sk = skin || "#FFD2B8";
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
  return `<g transform="translate(150 390)">
    <ellipse cx="0" cy="14" rx="30" ry="34" fill="${w}"/>
    <circle cx="0" cy="-16" r="20" fill="${sk}"/>
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
  const shine = "opacity=\"0.22\"";
  switch (style) {
    case "pony":
      return {
        back: `
          <ellipse cx="180" cy="175" rx="95" ry="100" fill="${hc}"/>
          <path d="M200 200 Q260 280 240 400 Q210 360 195 280 Z" fill="${hc}"/>
          <circle cx="235" cy="405" r="24" fill="${hc}"/>
          <circle cx="210" cy="195" r="12" fill="${bow}"/>
          <ellipse cx="160" cy="150" rx="18" ry="28" fill="#fff" ${shine}/>`,
        front: `
          <path d="M95 140 Q180 65 265 140 Q255 175 235 160 Q200 145 180 158 Q160 145 125 160 Q105 175 95 140 Z" fill="${hc}"/>
          <path d="M120 150 Q150 128 168 152" fill="none" stroke="${hc}" stroke-width="16" stroke-linecap="round"/>
          <path d="M192 152 Q215 128 240 150" fill="none" stroke="${hc}" stroke-width="16" stroke-linecap="round"/>`,
      };
    case "bob":
      return {
        back: `<ellipse cx="180" cy="185" rx="100" ry="95" fill="${hc}"/>
          <path d="M80 200 Q70 280 95 320 Q130 290 110 230 Z" fill="${hc}"/>
          <path d="M280 200 Q290 280 265 320 Q230 290 250 230 Z" fill="${hc}"/>
          <ellipse cx="155" cy="155" rx="16" ry="24" fill="#fff" ${shine}/>`,
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
          <path d="M275 180 Q305 320 280 460 Q250 400 255 280 Z" fill="${hc}"/>
          <ellipse cx="150" cy="148" rx="18" ry="30" fill="#fff" ${shine}/>`,
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
          <circle cx="180" cy="95" r="18" fill="${bow}"/>
          <ellipse cx="168" cy="88" rx="8" ry="10" fill="#fff" ${shine}/>`,
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
          <circle cx="65" cy="385" r="20" fill="${hc}"/><circle cx="295" cy="385" r="20" fill="${hc}"/>
          <ellipse cx="155" cy="150" rx="20" ry="32" fill="#fff" ${shine}/>`,
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
          <circle cx="72" cy="200" r="14" fill="${bow}"/><circle cx="288" cy="200" r="14" fill="${bow}"/>
          <ellipse cx="155" cy="145" rx="16" ry="26" fill="#fff" ${shine}/>`,
        front: `
          <path d="M100 130 Q180 70 260 130 Q250 175 230 165 Q200 155 180 168 Q160 155 130 165 Q110 175 100 130 Z" fill="${hc}"/>
          <path d="M115 145 Q145 125 165 148" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/>
          <path d="M195 148 Q215 125 245 145" fill="none" stroke="${hc}" stroke-width="14" stroke-linecap="round"/>
          <path d="M155 155 Q180 170 205 155" fill="none" stroke="${hc}" stroke-width="10" stroke-linecap="round" opacity="0.85"/>`,
      };
  }
}

function lashesSVG(style, lx, rx, y, er) {
  const top = y - er + 2;
  if (style === "none") {
    return `<path d="M${lx - er + 4} ${top + 6} Q${lx} ${top} ${lx + er - 4} ${top + 6}" fill="none" stroke="#2C2430" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M${rx - er + 4} ${top + 6} Q${rx} ${top} ${rx + er - 4} ${top + 6}" fill="none" stroke="#2C2430" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  if (style === "doll") {
    return `
      <path d="M${lx - er} ${top + 8} Q${lx} ${top - 6} ${lx + er} ${top + 8}" fill="none" stroke="#1A1220" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M${rx - er} ${top + 8} Q${rx} ${top - 6} ${rx + er} ${top + 8}" fill="none" stroke="#1A1220" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M${lx - er + 2} ${top + 4} L${lx - er - 4} ${top - 10}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${lx} ${top - 2} L${lx} ${top - 14}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${lx + er - 2} ${top + 4} L${lx + er + 4} ${top - 10}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${rx - er + 2} ${top + 4} L${rx - er - 4} ${top - 10}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${rx} ${top - 2} L${rx} ${top - 14}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${rx + er - 2} ${top + 4} L${rx + er + 4} ${top - 10}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${lx - er + 6} ${y + er - 4} Q${lx} ${y + er + 4} ${lx + er - 6} ${y + er - 4}" fill="none" stroke="#1A1220" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
      <path d="M${rx - er + 6} ${y + er - 4} Q${rx} ${y + er + 4} ${rx + er - 6} ${y + er - 4}" fill="none" stroke="#1A1220" stroke-width="2" stroke-linecap="round" opacity="0.55"/>`;
  }
  if (style === "curl") {
    return `
      <path d="M${lx - er} ${top + 10} Q${lx - 4} ${top - 8} ${lx + er} ${top + 4}" fill="none" stroke="#1A1220" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M${rx - er} ${top + 4} Q${rx + 4} ${top - 8} ${rx + er} ${top + 10}" fill="none" stroke="#1A1220" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M${lx - er + 4} ${top + 2} Q${lx - er - 2} ${top - 12} ${lx - er + 8} ${top - 14}" fill="none" stroke="#1A1220" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${lx + 4} ${top - 4} Q${lx + 2} ${top - 16} ${lx + 10} ${top - 14}" fill="none" stroke="#1A1220" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${rx - 4} ${top - 4} Q${rx - 2} ${top - 16} ${rx - 10} ${top - 14}" fill="none" stroke="#1A1220" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${rx + er - 4} ${top + 2} Q${rx + er + 2} ${top - 12} ${rx + er - 8} ${top - 14}" fill="none" stroke="#1A1220" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  if (style === "cat") {
    return `
      <path d="M${lx - er + 2} ${top + 8} Q${lx} ${top - 2} ${lx + er + 6} ${top - 2}" fill="none" stroke="#1A1220" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M${rx - er - 6} ${top - 2} Q${rx} ${top - 2} ${rx + er - 2} ${top + 8}" fill="none" stroke="#1A1220" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M${lx + er} ${top} L${lx + er + 12} ${top - 8}" stroke="#1A1220" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M${rx - er} ${top} L${rx - er - 12} ${top - 8}" stroke="#1A1220" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M${lx + er - 4} ${top + 6} L${lx + er + 10} ${top + 2}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${rx - er + 4} ${top + 6} L${rx - er - 10} ${top + 2}" stroke="#1A1220" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  if (style === "thick") {
    return `
      <path d="M${lx - er} ${top + 10} Q${lx} ${top - 4} ${lx + er} ${top + 10}" fill="none" stroke="#120c18" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M${rx - er} ${top + 10} Q${rx} ${top - 4} ${rx + er} ${top + 10}" fill="none" stroke="#120c18" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M${lx - er} ${top + 4} L${lx - er - 6} ${top - 8}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${lx - 8} ${top} L${lx - 10} ${top - 12}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${lx + 8} ${top} L${lx + 10} ${top - 12}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${lx + er} ${top + 4} L${lx + er + 6} ${top - 8}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${rx - er} ${top + 4} L${rx - er - 6} ${top - 8}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${rx - 8} ${top} L${rx - 10} ${top - 12}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${rx + 8} ${top} L${rx + 10} ${top - 12}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M${rx + er} ${top + 4} L${rx + er + 6} ${top - 8}" stroke="#120c18" stroke-width="2.8" stroke-linecap="round"/>`;
  }
  // natural
  return `
    <path d="M${lx - er + 2} ${top + 8} Q${lx} ${top - 2} ${lx + er - 2} ${top + 8}" fill="none" stroke="#2C2430" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M${rx - er + 2} ${top + 8} Q${rx} ${top - 2} ${rx + er - 2} ${top + 8}" fill="none" stroke="#2C2430" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M${lx - er + 6} ${top + 2} L${lx - er} ${top - 6}" stroke="#2C2430" stroke-width="2" stroke-linecap="round"/>
    <path d="M${lx + er - 6} ${top + 2} L${lx + er} ${top - 6}" stroke="#2C2430" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx - er + 6} ${top + 2} L${rx - er} ${top - 6}" stroke="#2C2430" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx + er - 6} ${top + 2} L${rx + er} ${top - 6}" stroke="#2C2430" stroke-width="2" stroke-linecap="round"/>`;
}

function featuresSVG(look, lip, blush, eye, eyeScale, iris, lashStyle, cheekY) {
  const es = eyeScale || 1;
  const er = Math.round(26 * es);
  const ir = Math.round(16 * es);
  const pr = Math.round(8 * es);
  const y = 196;
  const lx = 142;
  const rx = 218;
  const irisC = iris?.iris || "#6B3F2A";
  const ringC = iris?.ring || "#3A2218";
  const cy = cheekY || 220;

  const eyeBall = (cx, flip = 1) => `
    <ellipse cx="${cx}" cy="${y}" rx="${er + (look === "cool" ? 4 : 0)}" ry="${er - (look === "cool" ? 4 : 0)}" fill="#fff" stroke="#3A2820" stroke-width="2.2"/>
    <ellipse cx="${cx + 2 * flip}" cy="${y + 2}" rx="${ir}" ry="${ir - (look === "cool" ? 2 : 0)}" fill="${irisC}"/>
    <ellipse cx="${cx + 2 * flip}" cy="${y + 2}" rx="${ir - 3}" ry="${ir - 4}" fill="${ringC}" opacity="0.35"/>
    <circle cx="${cx + 2 * flip}" cy="${y + 2}" r="${pr}" fill="#120c18"/>
    <circle cx="${cx + 7 * flip}" cy="${y - 7}" r="${Math.max(5, Math.round(6 * es))}" fill="#fff" opacity="0.95"/>
    <circle cx="${cx - 4 * flip}" cy="${y + 6}" r="${Math.max(2, Math.round(2.5 * es))}" fill="#fff" opacity="0.55"/>`;

  let eyes = `${eyeBall(lx, 1)}${eyeBall(rx, -1)}`;
  let lips = `<path d="M156 244 Q180 232 204 244 Q192 262 180 266 Q168 262 156 244 Z" fill="${lip.color}"/>
    <ellipse cx="180" cy="240" rx="11" ry="3.5" fill="#fff" opacity="0.45"/>
    <path d="M168 250 Q180 256 192 250" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.35"/>`;
  let brows = { l: "M120 152 Q148 138 172 152", r: "M188 152 Q212 138 240 152", w: 4.4 };

  if (look === "cool") {
    lips = `<path d="M158 248 Q180 240 202 248" fill="none" stroke="${lip.color}" stroke-width="5.5" stroke-linecap="round"/>`;
    brows = { l: "M116 156 Q145 146 170 156", r: "M190 156 Q215 146 244 156", w: 5 };
  } else if (look === "shy") {
    lips = `<path d="M162 250 Q180 244 198 250" fill="none" stroke="${lip.color}" stroke-width="4.2" stroke-linecap="round"/>
      <ellipse cx="180" cy="254" rx="7" ry="3.5" fill="${lip.color}" opacity="0.45"/>`;
  } else if (look === "lively") {
    lips = `<path d="M150 240 Q180 228 210 240 Q180 280 150 240 Z" fill="${lip.color}"/>
      <ellipse cx="180" cy="250" rx="15" ry="7" fill="#fff" opacity="0.92"/>`;
  } else if (look === "gentle") {
    lips = `<path d="M158 246 Q180 236 202 246 Q180 260 158 246 Z" fill="${lip.color}"/>
      <ellipse cx="180" cy="242" rx="9" ry="2.5" fill="#fff" opacity="0.4"/>`;
    brows = { l: "M122 156 Q148 146 170 154", r: "M190 154 Q212 146 238 156", w: 3.6 };
  }

  const blushR = look === "shy" ? 28 : look === "cool" ? 18 : 24;
  const blushOp = look === "shy" ? 0.5 : 0.4;

  return {
    blush: `<circle cx="114" cy="${cy}" r="${blushR}" fill="${blush.color}" opacity="${blushOp}"/>
      <circle cx="246" cy="${cy}" r="${blushR}" fill="${blush.color}" opacity="${blushOp}"/>
      <circle cx="118" cy="${cy - 4}" r="${Math.round(blushR * 0.45)}" fill="#fff" opacity="0.18"/>
      <circle cx="242" cy="${cy - 4}" r="${Math.round(blushR * 0.45)}" fill="#fff" opacity="0.18"/>`,
    eyeshadow: `<ellipse cx="142" cy="${y - 10}" rx="30" ry="14" fill="${eye.color}" opacity="0.36"/>
      <ellipse cx="218" cy="${y - 10}" rx="30" ry="14" fill="${eye.color}" opacity="0.36"/>
      <ellipse cx="142" cy="${y - 14}" rx="18" ry="7" fill="#fff" opacity="0.12"/>
      <ellipse cx="218" cy="${y - 14}" rx="18" ry="7" fill="#fff" opacity="0.12"/>`,
    eyes,
    lashes: lashesSVG(lashStyle || "natural", lx, rx, y, er),
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
            <div class="m2d-name" id="m2dName">小公主</div>
            <div class="m2d-bg" id="m2dBg"></div>
            <svg id="m2dChar" viewBox="0 0 360 620" role="img" aria-label="公主小蜜糖">
              <defs>
                <linearGradient id="m2dFaceShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.42"/>
                  <stop offset="45%" stop-color="#ffffff" stop-opacity="0.08"/>
                  <stop offset="100%" stop-color="#000000" stop-opacity="0.07"/>
                </linearGradient>
                <radialGradient id="m2dCheekLit" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </radialGradient>
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
              <path id="m2dNeck" d="M164 278 C160 300 166 328 180 336 C194 328 200 300 196 278
                Q180 286 164 278 Z" fill="#FFD2B8"/>
              <g id="m2dNecklace"></g>
              <ellipse id="m2dEarL" cx="94" cy="205" rx="16" ry="22" fill="#FFD2B8"/>
              <ellipse id="m2dEarR" cx="266" cy="205" rx="16" ry="22" fill="#FFD2B8"/>
              <ellipse id="m2dFace" cx="180" cy="200" rx="88" ry="96" fill="#FFD2B8"/>
              <ellipse id="m2dFaceShadeEl" cx="180" cy="200" rx="88" ry="96" fill="url(#m2dFaceShade)"/>
              <ellipse id="m2dFaceLit" cx="160" cy="180" rx="40" ry="36" fill="url(#m2dCheekLit)"/>
              <g id="m2dBlush"></g>
              <g id="m2dEyeshadow"></g>
              <g id="m2dEyes"></g>
              <g id="m2dLashes"></g>
              <path id="m2dBrowL" d="M122 162 Q148 148 170 160" fill="none" stroke="#5B3A2E" stroke-width="4.2" stroke-linecap="round"/>
              <path id="m2dBrowR" d="M190 160 Q212 148 238 162" fill="none" stroke="#5B3A2E" stroke-width="4.2" stroke-linecap="round"/>
              <ellipse id="m2dNose" cx="180" cy="226" rx="5" ry="3.5" fill="#F0A890" opacity="0.45"/>
              <g id="m2dLips"></g>
              <g id="m2dHairFront"></g>
              <g id="m2dGlasses"></g>
              <g id="m2dSunglasses"></g>
              <g id="m2dEarrings"></g>
              <g id="m2dAccessory"></g>
              <g id="m2dBaby"></g>
              <g id="m2dBag"></g>
              <g id="m2dProp"></g>
              <g id="m2dHands"></g>
              <g id="m2dShoes"></g>
            </svg>
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

    const model =
      CHAR_MODELS.find((m) => m.id === state.charModel) || CHAR_MODELS[0];
    const skin = model.skin || "#FFD2B8";

    const lip = findMakeupOption("lipstick", state.makeup.lipstick);
    const blush = findMakeupOption("blush", state.makeup.blush);
    const eye = findMakeupOption("eyeshadow", state.makeup.eyeshadow);
    const hairOpt = findMakeupOption("hair", state.makeup.hair);
    const hs = findMakeupOption("hairstyle", state.makeup.hairstyle || "hsTwin");
    const face = findMakeupOption("faceShape", state.makeup.faceShape || "faceRound");
    const feat = findMakeupOption("features", state.makeup.features || "featSweet");
    const iris = findMakeupOption("eyeball", state.makeup.eyeball || "irisBrown");
    const lash = findMakeupOption("lashes", state.makeup.lashes || "lashNatural");
    const top = findMakeupOption("top", state.makeup.top);
    const bottom = findMakeupOption("bottom", state.makeup.bottom);
    const shoe = findMakeupOption("shoes", state.makeup.shoes || "shoeMary");
    const bagOpt = findMakeupOption("bag", state.makeup.bag || "bag0");
    const sun = findMakeupOption("sunglasses", state.makeup.sunglasses || "sun0");
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

    const bgEl = $("m2dBg");
    if (bgEl) bgEl.className = `m2d-bg ${bgOpt.css || "bg-rose"}`;

    const rx = Math.round((face.rx || 88) * (model.faceMul?.rx || 1));
    const ry = Math.round((face.ry || 96) * (model.faceMul?.ry || 1));
    const faceEl = $("m2dFace");
    const shadeEl = $("m2dFaceShadeEl");
    const litEl = $("m2dFaceLit");
    if (faceEl) {
      faceEl.setAttribute("rx", String(rx));
      faceEl.setAttribute("ry", String(ry));
      faceEl.setAttribute("fill", skin);
    }
    if (shadeEl) {
      shadeEl.setAttribute("rx", String(rx));
      shadeEl.setAttribute("ry", String(ry));
    }
    if (litEl) {
      litEl.setAttribute("rx", String(Math.round(rx * 0.45)));
      litEl.setAttribute("ry", String(Math.round(ry * 0.38)));
    }
    $("m2dNeck")?.setAttribute("fill", skin);
    $("m2dEarL")?.setAttribute("fill", skin);
    $("m2dEarR")?.setAttribute("fill", skin);
    $("m2dNose")?.setAttribute("fill", "#E89880");

    $("m2dLegs").innerHTML = `
      <path d="M150 400 C144 455 146 520 152 568 L176 568 C180 520 178 455 176 400 Z" fill="${skin}"/>
      <path d="M184 400 C182 455 180 520 184 568 L208 568 C214 520 212 455 210 400 Z" fill="${skin}"/>
      <path d="M156 430 Q162 480 158 530" fill="none" stroke="#fff" stroke-width="6" opacity="0.18"/>
      <path d="M190 430 Q196 480 192 530" fill="none" stroke="#fff" stroke-width="6" opacity="0.18"/>
    `;
    $("m2dShoes").innerHTML = drawShoesSVG(shoe, skin);

    const topBody = `
      <path d="M128 320
        Q180 300 232 320
        L242 348
        Q248 400 238 418
        Q180 430 122 418
        Q112 400 118 348
        Z" fill="${tc}"/>
      <ellipse cx="168" cy="340" rx="22" ry="14" fill="#fff" opacity="0.18"/>
      <circle cx="180" cy="348" r="7" fill="${GOLD}"/>
    `;

    if (bottom.skirt) {
      $("m2dDress").innerHTML = `
        ${topBody}
        <path d="M122 405 Q70 445 78 490 Q180 525 282 490 Q290 445 238 405
          Q210 398 180 400 Q150 398 122 405 Z" fill="${bc}" filter="url(#m2dSoft)"/>
        <path d="M135 420 Q155 470 132 500" fill="none" stroke="#fff" stroke-width="10" opacity="0.22"/>
        <path d="M225 418 Q205 465 230 498" fill="none" stroke="#fff" stroke-width="8" opacity="0.15"/>
        <ellipse cx="180" cy="455" rx="48" ry="16" fill="#fff" opacity="0.1"/>
      `;
    } else {
      $("m2dDress").innerHTML = `
        ${topBody}
        <path d="M138 412 L132 505 L176 505 L180 420 Z" fill="${bc}"/>
        <path d="M180 420 L184 505 L228 505 L222 412 Z" fill="${bc}"/>
        <path d="M132 412 Q180 422 228 412 Q232 418 180 424 Q128 418 132 412 Z" fill="${tc}" opacity="0.9"/>
        <path d="M148 430 Q152 470 150 500" fill="none" stroke="#fff" stroke-width="5" opacity="0.15"/>
        <path d="M210 430 Q214 470 212 500" fill="none" stroke="#fff" stroke-width="5" opacity="0.15"/>
      `;
    }

    $("m2dSleeves").innerHTML = `
      <ellipse cx="112" cy="350" rx="34" ry="26" fill="${tc}"/>
      <ellipse cx="248" cy="350" rx="34" ry="26" fill="${tc}"/>
      <ellipse cx="100" cy="342" rx="12" ry="8" fill="#fff" opacity="0.2"/>
      <ellipse cx="236" cy="342" rx="12" ry="8" fill="#fff" opacity="0.2"/>
    `;
    const holdingBag = bagOpt.kind && bagOpt.kind !== "none" && bagOpt.kind !== "backpack";
    const holdingHandProp =
      propOpt.prop &&
      propOpt.prop !== "none" &&
      (propOpt.slot || "hand") === "hand" &&
      !(propOpt.prop === "bag" && holdingBag);
    // 提包时右手臂略外展下垂，更像提着东西
    const rightArm = holdingBag
      ? `<path d="M265 358 C280 400 292 455 278 508" fill="none" stroke="${skin}" stroke-width="28" stroke-linecap="round"/>`
      : `<path d="M265 358 C275 405 278 455 268 505" fill="none" stroke="${skin}" stroke-width="28" stroke-linecap="round"/>`;
    $("m2dArms").innerHTML = `
      <path d="M95 358 C85 405 82 455 92 505" fill="none" stroke="${skin}" stroke-width="28" stroke-linecap="round"/>
      ${rightArm}
    `;

    const eyeScale = (feat.eyeScale || 1) * (model.eyeBoost || 1);
    const featDraw = featuresSVG(
      feat.look,
      lip,
      blush,
      eye,
      eyeScale,
      iris,
      lash.style,
      model.cheekY
    );
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

    // 普通眼镜：有墨镜时隐藏
    const hasSun = sun.kind && sun.kind !== "none";
    $("m2dGlasses").innerHTML =
      !hasSun && jew.glasses
        ? `<ellipse cx="142" cy="198" rx="30" ry="26" fill="#ffffff22" stroke="#3a3040" stroke-width="3"/>
         <ellipse cx="218" cy="198" rx="30" ry="26" fill="#ffffff22" stroke="#3a3040" stroke-width="3"/>
         <path d="M172 198 H188" stroke="#3a3040" stroke-width="3"/>`
        : "";
    $("m2dSunglasses").innerHTML = drawSunglassesSVG(sun);

    $("m2dEarrings").innerHTML = jew.earrings
      ? `<circle cx="90" cy="228" r="8" fill="#FFF8F0" stroke="${GOLD}" stroke-width="1.5"/>
         <circle cx="270" cy="228" r="8" fill="#FFF8F0" stroke="${GOLD}" stroke-width="1.5"/>
         <circle cx="90" cy="238" r="3" fill="${GOLD}"/><circle cx="270" cy="238" r="3" fill="${GOLD}"/>`
      : "";
    $("m2dNecklace").innerHTML = jew.necklace
      ? `<path d="M155 312 Q180 338 205 312" fill="none" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>
         <circle cx="172" cy="328" r="6" fill="#FF6B8A"/><circle cx="188" cy="328" r="6" fill="#FF6B8A"/>
         <circle cx="180" cy="336" r="7" fill="#FF6B8A"/>`
      : "";
    $("m2dWatch").innerHTML = jew.watch
      ? `<g transform="translate(92 478)">
           <rect x="-14" y="-6" width="28" height="14" rx="4" fill="${jew.color || "#ff6b8a"}"/>
           <rect x="-10" y="-3" width="20" height="8" rx="2" fill="#FFF8F0"/>
           <circle cx="0" cy="1" r="2" fill="#3a3040"/>
         </g>`
      : "";
    $("m2dBracelet").innerHTML = jew.bracelet
      ? `<g transform="translate(268 478)">
           <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="${jew.color || GOLD}" stroke-width="4"/>
           <circle cx="12" cy="0" r="4" fill="${jew.color || GOLD}"/>
         </g>`
      : "";

    $("m2dAccessory").innerHTML = drawHatSVG(hat);
    $("m2dBaby").innerHTML = drawBabySVG(baby.kind, baby.color, baby.wrap, skin);
    $("m2dBag").innerHTML = drawBagSVG(bagOpt);
    // 若已选独立包包，道具里的手提包不再重复
    const slot = propOpt.slot || "hand";
    const skipPropBag = propOpt.prop === "bag" && bagOpt.kind && bagOpt.kind !== "none";
    $("m2dProp").innerHTML =
      !skipPropBag && propOpt.prop && propOpt.prop !== "none"
        ? drawPropSVG(propOpt.prop, propOpt.color, slot)
        : "";

    // 手在包/道具之上，五指清晰（旧 DOM 无该节点时补建）
    let handsEl = $("m2dHands");
    if (!handsEl) {
      const svg = $("m2dChar");
      if (svg) {
        handsEl = document.createElementNS("http://www.w3.org/2000/svg", "g");
        handsEl.id = "m2dHands";
        const shoes = $("m2dShoes");
        if (shoes) svg.insertBefore(handsEl, shoes);
        else svg.appendChild(handsEl);
      }
    }
    if (handsEl) {
      const rightGrip = holdingBag || holdingHandProp;
      const rightY = holdingBag ? 520 : 512;
      handsEl.innerHTML = `
        ${drawHandOpen(92, 512, skin, "left")}
        ${rightGrip ? drawHandGrip(268, rightY, skin, "right") : drawHandOpen(268, rightY, skin, "right")}
      `;
    }
  }
}

export const makeup2d = new Makeup2D();
