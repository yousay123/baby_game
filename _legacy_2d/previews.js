/**
 * 蜜糖妆扮 · 道具样式预览组件库
 * 每个分类输出独立 SVG 缩略图，供工具箱卡片直接展示样式。
 */
window.MakeupPreview = (() => {
  const FACE = "#FFD2B8";
  const INK = "#2C2430";

  function svg(content, vb = "0 0 80 80") {
    return `<svg class="preview-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
  }

  function faceBase(skin = FACE) {
    return `
      <ellipse cx="40" cy="42" rx="28" ry="32" fill="${skin}"/>
      <ellipse cx="40" cy="42" rx="28" ry="32" fill="#fff" opacity="0.12"/>
    `;
  }

  function eyePair(iris = "#6B3F2A", pupil = "#2C1810") {
    return `
      <ellipse cx="30" cy="40" rx="8" ry="10" fill="#fff"/>
      <ellipse cx="50" cy="40" rx="8" ry="10" fill="#fff"/>
      <ellipse cx="31" cy="42" rx="5" ry="6" fill="${iris}"/>
      <ellipse cx="51" cy="42" rx="5" ry="6" fill="${iris}"/>
      <ellipse cx="31" cy="43" rx="2.5" ry="3" fill="${pupil}"/>
      <ellipse cx="51" cy="43" rx="2.5" ry="3" fill="${pupil}"/>
      <circle cx="29" cy="38" r="2" fill="#fff"/>
      <circle cx="49" cy="38" r="2" fill="#fff"/>
    `;
  }

  const Previews = {
    skin(item) {
      return svg(`
        ${faceBase(item.color)}
        ${eyePair()}
        <ellipse cx="28" cy="50" rx="5" ry="3" fill="#FFB0C0" opacity="0.35"/>
        <ellipse cx="52" cy="50" rx="5" ry="3" fill="#FFB0C0" opacity="0.35"/>
        <path d="M34 56 Q40 60 46 56" fill="none" stroke="#E89A9A" stroke-width="2" stroke-linecap="round"/>
      `);
    },

    blush(item) {
      const op = item.id === "none" ? 0 : item.opacity || 0.5;
      return svg(`
        ${faceBase()}
        ${eyePair()}
        <ellipse cx="26" cy="50" rx="8" ry="5" fill="${item.color || "transparent"}" opacity="${op}"/>
        <ellipse cx="54" cy="50" rx="8" ry="5" fill="${item.color || "transparent"}" opacity="${op}"/>
        <path d="M34 58 Q40 62 46 58" fill="none" stroke="#E89A9A" stroke-width="2" stroke-linecap="round"/>
        ${item.id === "none" ? `<path d="M22 22 L58 58 M58 22 L22 58" stroke="#c8b0b8" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>` : ""}
      `);
    },

    eyeshadow(item) {
      const c = item.color || "transparent";
      const show = item.id !== "none";
      return svg(`
        ${faceBase()}
        ${show ? `<ellipse cx="30" cy="38" rx="11" ry="8" fill="${c}" opacity="0.55"/><ellipse cx="50" cy="38" rx="11" ry="8" fill="${c}" opacity="0.55"/>` : ""}
        ${eyePair()}
        ${!show ? `<path d="M22 22 L58 58 M58 22 L22 58" stroke="#c8b0b8" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>` : ""}
      `);
    },

    eyecolor(item) {
      return svg(`
        <ellipse cx="40" cy="42" rx="26" ry="28" fill="#fff"/>
        <ellipse cx="42" cy="44" rx="18" ry="20" fill="${item.iris}"/>
        <ellipse cx="43" cy="46" rx="9" ry="11" fill="${item.pupil}"/>
        <circle cx="34" cy="36" r="7" fill="#fff"/>
        <circle cx="48" cy="48" r="3.5" fill="#fff" opacity="0.85"/>
        <path d="M16 34 Q40 18 64 34" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      `);
    },

    eyeliner(item) {
      const styles = {
        none: "",
        soft: `<path d="M20 36 Q30 28 40 38" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
        cat: `<path d="M20 38 Q30 26 42 40 L14 32 Z" fill="${INK}"/>`,
        doll: `<path d="M20 38 Q30 24 42 40" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M22 50 Q30 58 40 50" fill="none" stroke="${INK}" stroke-width="2"/>`,
        wing: `<path d="M20 36 Q30 28 40 40 L12 28" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`,
        heart: `<path d="M20 36 Q30 28 40 38" fill="none" stroke="${INK}" stroke-width="2"/><path d="M10 28 C10 22 18 22 18 28 C18 22 26 22 26 28 C26 36 18 42 18 42 C18 42 10 36 10 28 Z" fill="#FF6B8A"/>`,
        double: `<path d="M20 34 Q30 26 40 36" fill="none" stroke="${INK}" stroke-width="2"/><path d="M20 40 Q30 32 40 42" fill="none" stroke="${INK}" stroke-width="1.5"/>`,
        spark: `<path d="M20 36 Q30 28 40 38" fill="none" stroke="${INK}" stroke-width="2.2"/><circle cx="14" cy="28" r="2.5" fill="#FFC94A"/><circle cx="18" cy="22" r="1.5" fill="#fff"/>`,
      };
      return svg(`
        <rect width="80" height="80" rx="18" fill="#FFF5F8"/>
        <ellipse cx="40" cy="44" rx="18" ry="20" fill="#fff" stroke="#E8D0D8" stroke-width="1"/>
        <ellipse cx="42" cy="46" rx="10" ry="12" fill="#6B3F2A"/>
        <ellipse cx="43" cy="48" rx="5" ry="6" fill="#2C1810"/>
        <circle cx="36" cy="40" r="3.5" fill="#fff"/>
        ${styles[item.id] || ""}
        ${item.id === "none" ? `<path d="M18 18 L62 62 M62 18 L18 62" stroke="#c8b0b8" stroke-width="2.5" opacity="0.55"/>` : ""}
      `);
    },

    lashes(item) {
      const L = {
        none: "",
        short: `<path d="M22 32 L18 24" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M30 28 L30 20" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M38 30 L42 22" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
        long: `<path d="M20 32 L14 18" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M28 28 L26 14" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M36 28 L38 14" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M44 32 L50 18" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
        curl: `<path d="M20 34 Q14 20 18 14" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M30 28 Q28 14 32 10" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M40 30 Q46 16 50 12" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
        drama: `<path d="M18 32 L12 16" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M26 28 L24 12" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M34 26 L34 10" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M42 28 L48 14" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M22 54 L18 64" stroke="${INK}" stroke-width="2"/><path d="M32 58 L32 68" stroke="${INK}" stroke-width="2"/><path d="M42 54 L46 64" stroke="${INK}" stroke-width="2"/>`,
        bottom: `<path d="M22 32 L20 24" stroke="${INK}" stroke-width="2"/><path d="M32 28 L32 20" stroke="${INK}" stroke-width="2"/><path d="M22 54 L18 64" stroke="${INK}" stroke-width="2"/><path d="M32 58 L32 68" stroke="${INK}" stroke-width="2"/><path d="M42 54 L46 64" stroke="${INK}" stroke-width="2"/>`,
        star: `<path d="M20 32 L16 20" stroke="${INK}" stroke-width="2"/><path d="M30 28 L30 16" stroke="${INK}" stroke-width="2"/><path d="M40 30 L44 18" stroke="${INK}" stroke-width="2"/><polygon points="18,14 20,19 25,19 21,22 22,27 18,24 14,27 15,22 11,19 16,19" fill="#FFC94A"/>`,
        fairy: `<path d="M20 34 Q14 18 18 12" fill="none" stroke="${INK}" stroke-width="2.2"/><path d="M32 28 Q30 12 34 8" fill="none" stroke="${INK}" stroke-width="2.2"/><path d="M42 32 Q50 18 48 12" fill="none" stroke="${INK}" stroke-width="2.2"/><circle cx="16" cy="14" r="2" fill="#fff"/><circle cx="36" cy="8" r="1.5" fill="#FFC94A"/>`,
      };
      return svg(`
        <rect width="80" height="80" rx="18" fill="#FFF5F8"/>
        <ellipse cx="36" cy="44" rx="16" ry="18" fill="#fff"/>
        <ellipse cx="38" cy="46" rx="9" ry="11" fill="#6B3F2A"/>
        <ellipse cx="39" cy="48" rx="4.5" ry="5.5" fill="#2C1810"/>
        <circle cx="33" cy="40" r="3" fill="#fff"/>
        ${L[item.id] || ""}
        ${item.id === "none" ? `<path d="M18 18 L62 62" stroke="#c8b0b8" stroke-width="2.5" opacity="0.5"/>` : ""}
      `);
    },

    lips(item) {
      const c = item.color;
      let mouth = `<path d="M22 40 Q40 28 58 40 Q40 62 22 40 Z" fill="${c}"/>`;
      if (item.style === "heart") {
        mouth = `<path d="M24 36 C24 26 36 26 40 36 C44 26 56 26 56 36 C56 52 40 64 40 64 C40 64 24 52 24 36 Z" fill="${c}"/>`;
      } else if (item.style === "soft") {
        mouth = `<path d="M26 42 Q40 34 54 42 Q40 52 26 42 Z" fill="${c}" opacity="0.9"/>`;
      } else if (item.style === "gloss" || item.style === "ombre") {
        mouth = `<path d="M22 40 Q40 28 58 40 Q40 62 22 40 Z" fill="${c}"/><ellipse cx="32" cy="42" rx="5" ry="3" fill="#fff" opacity="0.65"/>`;
      }
      return svg(`
        <rect width="80" height="80" rx="18" fill="#FFF0F4"/>
        ${mouth}
        <path d="M28 42 Q40 36 52 42" fill="none" stroke="#fff" stroke-width="2" opacity="0.45"/>
      `);
    },

    nails(item) {
      const c = item.id === "french" ? "#FFE8F0" : item.color;
      return svg(`
        <rect width="80" height="80" rx="18" fill="#FFF5F8"/>
        <path d="M28 58 Q22 30 40 18 Q58 30 52 58 Z" fill="${FACE}"/>
        <ellipse cx="40" cy="28" rx="10" ry="14" fill="${c}"/>
        ${item.id === "french" ? `<ellipse cx="40" cy="20" rx="8" ry="5" fill="#fff"/>` : ""}
        <ellipse cx="36" cy="24" rx="3" ry="2" fill="#fff" opacity="0.45"/>
      `);
    },

    hairstyle(item) {
      const c = "#6B3F2A";
      const hl = "#9A6B4A";
      const styles = {
        bob: `<path d="M18 38 Q14 58 28 68 Q40 72 52 68 Q66 58 62 38 Q52 18 40 16 Q28 18 18 38 Z" fill="${c}"/>`,
        long: `<path d="M16 36 Q10 60 22 78 Q40 84 58 78 Q70 60 64 36 Q52 14 40 12 Q28 14 16 36 Z" fill="${c}"/>`,
        twin: `<path d="M20 36 Q16 55 28 64 Q40 68 52 64 Q64 55 60 36 Q50 16 40 14 Q30 16 20 36 Z" fill="${c}"/><path d="M18 48 Q8 58 10 78 Q20 82 28 70 Z" fill="${c}"/><path d="M62 48 Q72 58 70 78 Q60 82 52 70 Z" fill="${c}"/><circle cx="16" cy="50" r="4" fill="#FF6B8A"/><circle cx="64" cy="50" r="4" fill="#FF6B8A"/>`,
        bun: `<circle cx="40" cy="14" r="12" fill="${c}"/><path d="M20 38 Q16 55 28 64 Q40 68 52 64 Q64 55 60 38 Q50 18 40 16 Q30 18 20 38 Z" fill="${c}"/>`,
        curl: `<path d="M16 36 Q12 55 22 70 Q32 80 40 72 Q48 80 58 70 Q68 55 64 36 Q52 14 40 12 Q28 14 16 36 Z" fill="${c}"/><circle cx="22" cy="68" r="7" fill="${c}"/><circle cx="58" cy="68" r="7" fill="${c}"/>`,
        ponytail: `<path d="M20 36 Q16 55 28 64 Q40 68 52 64 Q64 55 60 36 Q50 16 40 14 Q30 16 20 36 Z" fill="${c}"/><path d="M50 28 Q70 32 72 70 Q58 78 50 58 Z" fill="${c}"/><circle cx="54" cy="28" r="4" fill="#FFC94A"/>`,
        hime: `<path d="M16 36 Q12 60 24 76 Q40 82 56 76 Q68 60 64 36 Q52 14 40 12 Q28 14 16 36 Z" fill="${c}"/><rect x="18" y="36" width="10" height="28" rx="5" fill="${c}"/><rect x="52" y="36" width="10" height="28" rx="5" fill="${c}"/>`,
        side: `<path d="M20 36 Q16 55 28 64 Q40 68 52 64 Q64 55 60 36 Q50 16 40 14 Q30 16 20 36 Z" fill="${c}"/><path d="M58 42 Q72 50 70 76 Q58 80 52 64 Z" fill="${c}"/>`,
        odango: `<circle cx="24" cy="18" r="10" fill="${c}"/><circle cx="56" cy="18" r="10" fill="${c}"/><path d="M20 38 Q16 55 28 64 Q40 68 52 64 Q64 55 60 38 Q50 18 40 16 Q30 18 20 38 Z" fill="${c}"/>`,
        wavy: `<path d="M16 36 Q10 55 20 70 Q30 82 40 72 Q50 82 60 70 Q70 55 64 36 Q52 14 40 12 Q28 14 16 36 Z" fill="${c}"/>`,
        short: `<path d="M22 38 Q18 52 30 60 Q40 64 50 60 Q62 52 58 38 Q50 20 40 18 Q30 20 22 38 Z" fill="${c}"/>`,
        braid: `<path d="M20 36 Q16 55 28 64 Q40 68 52 64 Q64 55 60 36 Q50 16 40 14 Q30 16 20 36 Z" fill="${c}"/><path d="M18 48 Q12 62 18 78 Q26 80 30 68 Z" fill="${c}"/><path d="M62 48 Q68 62 62 78 Q54 80 50 68 Z" fill="${c}"/><circle cx="20" cy="78" r="3" fill="#FFC94A"/><circle cx="60" cy="78" r="3" fill="#FFC94A"/>`,
      };
      return svg(`
        <rect width="80" height="80" rx="18" fill="#E8F7FF"/>
        ${styles[item.id] || styles.bob}
        <ellipse cx="40" cy="48" rx="16" ry="18" fill="${FACE}"/>
        <path d="M22 36 Q40 22 58 36 Q50 30 40 28 Q30 30 22 36 Z" fill="${c}"/>
        <path d="M28 30 Q34 26 38 32" fill="${hl}" opacity="0.4"/>
        ${eyePair("#5A3A28", "#2C1810")}
      `, "0 0 80 80");
    },

    haircolor(item) {
      return svg(`
        <rect width="80" height="80" rx="18" fill="#FFF5F8"/>
        <path d="M18 30 Q14 55 28 72 Q40 78 52 72 Q66 55 62 30 Q52 10 40 8 Q28 10 18 30 Z" fill="${item.color}"/>
        <path d="M28 18 Q40 12 48 22" fill="${item.hl}" opacity="0.45"/>
        <ellipse cx="40" cy="48" rx="15" ry="17" fill="${FACE}"/>
        <path d="M24 34 Q40 20 56 34 Q48 28 40 26 Q32 28 24 34 Z" fill="${item.color}"/>
      `);
    },

    dress(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><ellipse cx="40" cy="16" rx="9" ry="10" fill="${FACE}"/><path d="M30 28 Q40 34 50 28 L52 45 Q40 50 28 45 Z" fill="${FACE}" opacity="0.5"/><path d="M22 22 L58 58" stroke="#c8b0b8" stroke-width="2.5" opacity="0.5"/>`);
      }
      const c = item.color;
      const a = item.accent;
      const d = item.detail || a;
      let gown = `<path d="M30 26 Q40 34 50 26 L64 74 Q40 82 16 74 Z" fill="${c}"/><path d="M30 26 Q40 34 50 26 L54 48 Q40 54 26 48 Z" fill="${a}" opacity="0.7"/><circle cx="40" cy="32" r="3" fill="${d}"/>`;
      if (item.style === "fairy") {
        gown = `<path d="M10 28 Q2 42 14 52 Q26 40 22 30 Z" fill="${a}" opacity="0.5"/><path d="M70 28 Q78 42 66 52 Q54 40 58 30 Z" fill="${a}" opacity="0.5"/><path d="M30 26 Q40 34 50 26 L58 68 Q40 76 22 68 Z" fill="${c}"/>`;
      } else if (item.style === "lolita") {
        gown = `<path d="M32 24 Q40 32 48 24 L52 42 Q40 48 28 42 Z" fill="${a}"/><path d="M28 40 Q40 48 52 40 L60 68 Q40 78 20 68 Z" fill="${c}"/><circle cx="40" cy="30" r="4" fill="${d}"/>`;
      }
      return svg(`<rect width="80" height="80" rx="18" fill="#FFF0F6"/><ellipse cx="40" cy="14" rx="9" ry="10" fill="${FACE}"/>${gown}`);
    },

    top(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><ellipse cx="40" cy="18" rx="9" ry="10" fill="${FACE}"/><path d="M30 30 Q40 38 50 30 L52 58 Q40 64 28 58 Z" fill="${FACE}" opacity="0.45"/><path d="M22 22 L58 58" stroke="#c8b0b8" stroke-width="2.5" opacity="0.5"/>`);
      }
      const c = item.color;
      const a = item.accent;
      const d = item.detail || a;
      let body = `<path d="M28 28 Q40 38 52 28 L56 62 Q40 70 24 62 Z" fill="${c}"/><path d="M34 30 Q40 38 46 30 L44 48 Q40 52 36 48 Z" fill="${a}" opacity="0.8"/>`;
      if (item.style === "sailor") {
        body = `<path d="M28 28 Q40 38 52 28 L56 62 Q40 70 24 62 Z" fill="${c}"/><path d="M28 28 L40 42 L52 28 L46 36 L40 46 L34 36 Z" fill="${a}"/><rect x="32" y="50" width="16" height="4" fill="${a}"/>`;
      } else if (item.style === "hoodie") {
        body = `<path d="M26 28 Q40 38 54 28 L58 64 Q40 72 22 64 Z" fill="${c}"/><path d="M34 30 Q40 40 46 30 L44 52 Q40 56 36 52 Z" fill="${a}"/><ellipse cx="40" cy="26" rx="14" ry="6" fill="${c}"/>`;
      } else if (item.style === "puff") {
        body = `<path d="M28 28 Q40 38 52 28 L56 60 Q40 68 24 60 Z" fill="${c}"/><circle cx="20" cy="36" r="10" fill="${a}"/><circle cx="60" cy="36" r="10" fill="${a}"/><circle cx="40" cy="36" r="3" fill="${d}"/>`;
      } else if (item.style === "cami") {
        body = `<path d="M32 34 Q40 42 48 34 L52 60 Q40 68 28 60 Z" fill="${c}"/><path d="M34 28 L38 40 M46 28 L42 40" stroke="${d}" stroke-width="3"/>`;
      }
      return svg(`<rect width="80" height="80" rx="18" fill="#F5FBFF"/><ellipse cx="40" cy="14" rx="9" ry="10" fill="${FACE}"/>${body}`);
    },

    skirt(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><path d="M30 30 H50 L58 70 Q40 78 22 70 Z" fill="#eee"/><path d="M22 22 L58 58" stroke="#c8b0b8" stroke-width="2.5" opacity="0.5"/>`);
      }
      const c = item.color;
      const a = item.accent;
      let s = `<path d="M28 28 H52 L62 70 Q40 78 18 70 Z" fill="${c}"/>`;
      if (item.style === "tutu") {
        s = `<ellipse cx="40" cy="52" rx="30" ry="18" fill="${c}"/><ellipse cx="40" cy="50" rx="20" ry="12" fill="${a}" opacity="0.8"/><rect x="32" y="24" width="16" height="16" rx="4" fill="${FACE}"/>`;
      } else if (item.style === "pleat") {
        s = `<path d="M28 28 H52 L60 68 Q40 76 20 68 Z" fill="${c}"/><path d="M34 28 V68 M40 28 V72 M46 28 V68" stroke="${a}" stroke-width="2" opacity="0.7"/>`;
      } else if (item.style === "mermaid") {
        s = `<path d="M30 28 H50 L54 50 Q40 56 26 50 Z" fill="${c}"/><path d="M26 48 Q40 58 54 48 L64 74 Q40 82 16 74 Z" fill="${c}"/>`;
      } else if (item.style === "tiered") {
        s = `<path d="M30 24 H50 L54 40 Q40 46 26 40 Z" fill="${c}"/><path d="M24 38 H56 L62 56 Q40 64 18 56 Z" fill="${a}"/><path d="M18 54 H62 L70 74 Q40 82 10 74 Z" fill="${c}"/>`;
      }
      return svg(`<rect width="80" height="80" rx="18" fill="#FFF8FC"/>${s}`);
    },

    pants(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><path d="M28 24 H38 L40 72 H26 Z" fill="#eee"/><path d="M42 24 H52 L54 72 H40 Z" fill="#eee"/><path d="M22 22 L58 58" stroke="#c8b0b8" stroke-width="2.5" opacity="0.5"/>`);
      }
      const c = item.color;
      const a = item.accent;
      let p = `<path d="M28 24 H38 L40 72 H26 Z" fill="${c}"/><path d="M42 24 H52 L54 72 H40 Z" fill="${c}"/>`;
      if (item.style === "shorts") {
        p = `<path d="M26 24 H54 L60 52 Q40 58 20 52 Z" fill="${c}"/><path d="M26 48 Q40 56 54 48" fill="none" stroke="${a}" stroke-width="3"/>`;
      } else if (item.style === "wide") {
        p = `<path d="M28 24 H38 L48 72 H12 Z" fill="${c}"/><path d="M42 24 H52 L68 72 H32 Z" fill="${c}"/>`;
      } else if (item.style === "puffy") {
        p = `<path d="M28 24 H38 Q50 48 46 72 H24 Q20 48 28 24 Z" fill="${c}"/><path d="M42 24 H52 Q60 48 56 72 H34 Q38 48 42 24 Z" fill="${c}"/>`;
      }
      return svg(`<rect width="80" height="80" rx="18" fill="#F3F8FF"/>${p}`);
    },

    shoes(item) {
      const c = item.color;
      const a = item.accent || "#fff";
      const style = item.style || item.id;
      let shoe = `<ellipse cx="40" cy="52" rx="28" ry="12" fill="${c}"/>`;
      if (style === "heel") {
        shoe = `<ellipse cx="36" cy="48" rx="22" ry="9" fill="${c}"/><rect x="46" y="48" width="4" height="16" fill="${c}"/><ellipse cx="30" cy="44" rx="5" ry="3" fill="${a}" opacity="0.7"/>`;
      } else if (style === "boot") {
        shoe = `<path d="M24 20 L20 64 H52 L48 20 Z" fill="${c}"/><path d="M24 40 H48" stroke="${a}" stroke-width="2" opacity="0.5"/>`;
      } else if (style === "sneaker") {
        shoe = `<ellipse cx="40" cy="52" rx="28" ry="11" fill="${c}" stroke="${a}" stroke-width="3"/><ellipse cx="28" cy="50" rx="10" ry="7" fill="${a}" opacity="0.5"/>`;
      } else if (style === "sandal") {
        shoe = `<ellipse cx="40" cy="54" rx="24" ry="8" fill="${c}" opacity="0.85"/><path d="M28 42 Q40 50 52 42" fill="none" stroke="${c}" stroke-width="4"/><circle cx="40" cy="46" r="3" fill="${a}"/>`;
      } else if (style === "rain") {
        shoe = `<path d="M22 28 Q18 64 40 64 Q58 64 54 28 Z" fill="${c}"/><circle cx="40" cy="40" r="5" fill="${a}"/>`;
      } else if (style === "ballet") {
        shoe = `<ellipse cx="40" cy="52" rx="26" ry="10" fill="${c}"/><path d="M28 42 Q40 50 52 42" fill="none" stroke="${a}" stroke-width="2"/><path d="M40 48 Q40 30 32 22" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>`;
      } else if (style === "mary") {
        shoe = `<ellipse cx="40" cy="52" rx="26" ry="11" fill="${c}"/><path d="M24 42 H56" stroke="${a}" stroke-width="3"/><circle cx="40" cy="42" r="3" fill="${a}"/>`;
      } else if (style === "loafer") {
        shoe = `<ellipse cx="40" cy="52" rx="26" ry="10" fill="${c}"/><ellipse cx="40" cy="46" rx="10" ry="5" fill="${a}"/>`;
      } else if (style === "slipper") {
        shoe = `<ellipse cx="40" cy="52" rx="24" ry="12" fill="${c}"/><ellipse cx="40" cy="46" rx="14" ry="7" fill="${a}" opacity="0.7"/>`;
      }
      return svg(`<rect width="80" height="80" rx="18" fill="#E8FFF7"/>${shoe}`);
    },

    bag(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><path d="M22 22 L58 58 M58 22 L22 58" stroke="#c8b0b8" stroke-width="3" opacity="0.55"/>`);
      }
      const c = item.color;
      const a = item.accent;
      const map = {
        clutch: `<rect x="18" y="28" width="44" height="32" rx="8" fill="${c}" stroke="${a}" stroke-width="2"/><circle cx="28" cy="40" r="2.5" fill="${a}"/><circle cx="40" cy="38" r="2.5" fill="${a}"/><circle cx="52" cy="40" r="2.5" fill="${a}"/>`,
        heart: `<path d="M20 30 C20 16 40 16 40 30 C40 16 60 16 60 30 C60 48 40 62 40 62 C40 62 20 48 20 30 Z" fill="${c}"/><circle cx="40" cy="34" r="5" fill="${a}"/>`,
        basket: `<ellipse cx="40" cy="24" rx="18" ry="8" fill="none" stroke="${c}" stroke-width="3"/><path d="M24 26 L28 58 Q40 66 52 58 L56 26" fill="${c}"/><circle cx="34" cy="40" r="4" fill="${a}"/><circle cx="46" cy="38" r="4" fill="#FFC94A"/>`,
        ribbon: `<rect x="18" y="30" width="44" height="34" rx="8" fill="${c}"/><path d="M40 30 Q26 14 40 22 Q54 14 40 30 Z" fill="${a}"/><circle cx="40" cy="26" r="4" fill="${a}"/>`,
        backpack: `<rect x="18" y="22" width="44" height="48" rx="10" fill="${c}"/><rect x="26" y="32" width="28" height="18" rx="5" fill="${a}" opacity="0.85"/><path d="M26 22 Q40 8 54 22" fill="none" stroke="${c}" stroke-width="4"/>`,
        tote: `<path d="M22 28 L18 62 Q40 70 62 62 L58 28 Z" fill="${c}"/><path d="M26 28 Q26 10 40 10 Q54 10 54 28" fill="none" stroke="${a}" stroke-width="3"/>`,
        cross: `<path d="M20 16 Q50 40 30 70" fill="none" stroke="${a}" stroke-width="3"/><rect x="36" y="36" width="30" height="24" rx="6" fill="${c}"/><circle cx="51" cy="48" r="4" fill="${a}"/>`,
        star: `<polygon points="40,10 46,28 66,28 50,40 56,60 40,48 24,60 30,40 14,28 34,28" fill="${c}"/><circle cx="40" cy="36" r="5" fill="${a}"/>`,
        crown: `<rect x="16" y="34" width="48" height="30" rx="8" fill="${c}"/><path d="M20 34 L28 14 L36 30 L40 10 L44 30 L52 14 L60 34 Z" fill="${c}"/><circle cx="28" cy="16" r="3" fill="${a}"/><circle cx="40" cy="12" r="3" fill="#7EC8FF"/><circle cx="52" cy="16" r="3" fill="${a}"/>`,
      };
      return svg(`<rect width="80" height="80" rx="18" fill="#FFF8E8"/>${map[item.style] || map.clutch}`);
    },

    accessory(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><path d="M22 22 L58 58 M58 22 L22 58" stroke="#c8b0b8" stroke-width="3" stroke-linecap="round" opacity="0.55"/>`);
      }
      const map = {
        bow: `<path d="M20 40 Q8 20 24 34 Q40 20 28 40 Z" fill="#FF6B8A"/><path d="M52 40 Q40 20 56 34 Q72 20 60 40 Z" fill="#FF6B8A"/><circle cx="40" cy="36" r="8" fill="#FFC94A"/>`,
        bowMini: `<path d="M40 42 Q28 28 40 36 Q52 28 40 42 Z" fill="#FF8FB3"/><circle cx="40" cy="36" r="5" fill="#FFC94A"/>`,
        crown: `<path d="M16 52 L24 22 L34 44 L40 16 L46 44 L56 22 L64 52 Z" fill="#FFC94A"/><circle cx="24" cy="22" r="4" fill="#FF6B8A"/><circle cx="40" cy="16" r="5" fill="#7EC8FF"/><circle cx="56" cy="22" r="4" fill="#3ECFAD"/>`,
        tiara: `<path d="M16 52 Q40 18 64 52" fill="none" stroke="#B8D0FF" stroke-width="5"/><circle cx="40" cy="24" r="6" fill="#fff"/><circle cx="28" cy="36" r="3" fill="#7EC8FF"/><circle cx="52" cy="36" r="3" fill="#FF8FB3"/>`,
        flower: `<circle cx="40" cy="28" r="8" fill="#FF8FB3"/><circle cx="52" cy="42" r="8" fill="#FF8FB3"/><circle cx="28" cy="42" r="8" fill="#FF8FB3"/><circle cx="40" cy="40" r="6" fill="#FFC94A"/>`,
        flowerCrown: `<ellipse cx="40" cy="40" rx="28" ry="10" fill="none" stroke="#7BCFB3" stroke-width="5"/><circle cx="20" cy="38" r="6" fill="#FF8FB3"/><circle cx="40" cy="32" r="6" fill="#FFC94A"/><circle cx="60" cy="38" r="6" fill="#FF8FB3"/>`,
        star: `<polygon points="40,14 45,30 62,30 48,40 53,56 40,46 27,56 32,40 18,30 35,30" fill="#FFC94A"/>`,
        hearts: `<path d="M24 28 C24 16 40 16 40 28 C40 16 56 16 56 28 C56 46 40 58 40 58 C40 58 24 46 24 28 Z" fill="#FF6B8A"/>`,
        cat: `<path d="M20 55 L12 18 L40 42 Z" fill="#6B3F2A"/><path d="M60 55 L68 18 L40 42 Z" fill="#6B3F2A"/><path d="M22 42 L16 26 L32 38" fill="#FFB0C4"/><path d="M58 42 L64 26 L48 38" fill="#FFB0C4"/>`,
        bunny: `<ellipse cx="28" cy="28" rx="8" ry="24" fill="#fff" stroke="#E8E0E8" transform="rotate(-12 28 28)"/><ellipse cx="52" cy="28" rx="8" ry="24" fill="#fff" stroke="#E8E0E8" transform="rotate(12 52 28)"/><ellipse cx="28" cy="28" rx="3" ry="16" fill="#FFB0C4" transform="rotate(-12 28 28)"/><ellipse cx="52" cy="28" rx="3" ry="16" fill="#FFB0C4" transform="rotate(12 52 28)"/>`,
        bear: `<circle cx="26" cy="36" r="16" fill="#C88962"/><circle cx="54" cy="36" r="16" fill="#C88962"/><circle cx="26" cy="36" r="7" fill="#E8B888"/><circle cx="54" cy="36" r="7" fill="#E8B888"/>`,
        hat: `<ellipse cx="40" cy="52" rx="28" ry="8" fill="#4A3040"/><rect x="26" y="18" width="28" height="34" rx="6" fill="#4A3040"/><rect x="26" y="42" width="28" height="6" fill="#FF6B8A"/>`,
        beret: `<ellipse cx="40" cy="42" rx="28" ry="16" fill="#FF6B8A"/><circle cx="28" cy="32" r="6" fill="#FF6B8A"/><circle cx="50" cy="36" r="4" fill="#FFC94A"/>`,
        halo: `<ellipse cx="40" cy="40" rx="26" ry="10" fill="none" stroke="#FFE08A" stroke-width="6"/><ellipse cx="40" cy="40" rx="26" ry="10" fill="none" stroke="#fff" stroke-width="2"/>`,
        horns: `<path d="M24 55 Q16 15 34 40" fill="none" stroke="#4A3040" stroke-width="8" stroke-linecap="round"/><path d="M56 55 Q64 15 46 40" fill="none" stroke="#4A3040" stroke-width="8" stroke-linecap="round"/><path d="M24 55 Q16 15 34 40" fill="none" stroke="#FF6B8A" stroke-width="3"/><path d="M56 55 Q64 15 46 40" fill="none" stroke="#FF6B8A" stroke-width="3"/>`,
      };
      return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/>${map[item.id] || map.bow}`);
    },

    glasses(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><ellipse cx="40" cy="42" rx="18" ry="20" fill="#fff"/><ellipse cx="42" cy="44" rx="10" ry="12" fill="#6B3F2A"/><circle cx="36" cy="38" r="3.5" fill="#fff"/><path d="M18 18 L62 62 M62 18 L18 62" stroke="#c8b0b8" stroke-width="2.5" opacity="0.55"/>`);
      }
      const eye = `<ellipse cx="28" cy="42" rx="8" ry="9" fill="#fff"/><ellipse cx="52" cy="42" rx="8" ry="9" fill="#fff"/><ellipse cx="29" cy="44" rx="4.5" ry="5" fill="#6B3F2A"/><ellipse cx="53" cy="44" rx="4.5" ry="5" fill="#6B3F2A"/><circle cx="27" cy="40" r="2" fill="#fff"/><circle cx="51" cy="40" r="2" fill="#fff"/>`;
      const map = {
        round: `${eye}<circle cx="28" cy="42" r="14" fill="rgba(255,255,255,0.1)" stroke="#5A3A28" stroke-width="3"/><circle cx="52" cy="42" r="14" fill="rgba(255,255,255,0.1)" stroke="#5A3A28" stroke-width="3"/><path d="M42 42 H38" stroke="#5A3A28" stroke-width="2.5"/>`,
        thin: `${eye}<circle cx="28" cy="42" r="13" fill="none" stroke="#8B7355" stroke-width="2"/><circle cx="52" cy="42" r="13" fill="none" stroke="#8B7355" stroke-width="2"/><path d="M41 42 H39" stroke="#8B7355" stroke-width="2"/>`,
        sunnies: `<ellipse cx="28" cy="42" rx="14" ry="10" fill="#2C2430"/><ellipse cx="52" cy="42" rx="14" ry="10" fill="#2C2430"/><path d="M42 42 H38" stroke="#2C2430" stroke-width="3"/><ellipse cx="24" cy="38" rx="4" ry="2" fill="#fff" opacity="0.2"/>`,
        pinkSun: `<ellipse cx="28" cy="42" rx="14" ry="10" fill="#FF6B8A" opacity="0.85"/><ellipse cx="52" cy="42" rx="14" ry="10" fill="#FF6B8A" opacity="0.85"/><path d="M42 42 H38" stroke="#C44A68" stroke-width="3"/>`,
        heart: `<path d="M14 36 C14 24 28 24 28 36 C28 24 42 24 42 36 C42 50 28 58 28 58 C28 58 14 50 14 36 Z" fill="rgba(255,107,138,0.25)" stroke="#FF6B8A" stroke-width="2.5"/><path d="M38 36 C38 24 52 24 52 36 C52 24 66 24 66 36 C66 50 52 58 52 58 C52 58 38 50 38 36 Z" fill="rgba(255,107,138,0.25)" stroke="#FF6B8A" stroke-width="2.5"/>`,
        catEye: `${eye}<path d="M14 50 Q14 30 28 30 Q42 30 44 40 L48 34 Q42 26 28 26 Q12 26 10 50 Z" fill="none" stroke="#4A3040" stroke-width="2.8"/><path d="M36 40 Q38 30 52 30 Q66 30 66 50 Q68 26 52 26 Q38 26 32 34 Z" fill="none" stroke="#4A3040" stroke-width="2.8"/>`,
        square: `${eye}<rect x="14" y="32" width="28" height="22" rx="5" fill="rgba(180,200,255,0.12)" stroke="#3A5080" stroke-width="2.8"/><rect x="38" y="32" width="28" height="22" rx="5" fill="rgba(180,200,255,0.12)" stroke="#3A5080" stroke-width="2.8"/>`,
        star: `${eye}<circle cx="28" cy="42" r="13" fill="none" stroke="#E0A020" stroke-width="2.5"/><circle cx="52" cy="42" r="13" fill="none" stroke="#E0A020" stroke-width="2.5"/><polygon points="28,28 30,33 35,33 31,36 32,41 28,38 24,41 25,36 21,33 26,33" fill="#FFC94A"/><polygon points="52,28 54,33 59,33 55,36 56,41 52,38 48,41 49,36 45,33 50,33" fill="#FFC94A"/>`,
        clear: `${eye}<circle cx="28" cy="42" r="14" fill="rgba(200,230,255,0.2)" stroke="#A8C8E8" stroke-width="2.8"/><circle cx="52" cy="42" r="14" fill="rgba(200,230,255,0.2)" stroke="#A8C8E8" stroke-width="2.8"/><path d="M42 42 H38" stroke="#A8C8E8" stroke-width="2.5"/>`,
      };
      return svg(`<rect width="80" height="80" rx="18" fill="#E8F7FF"/>${map[item.id] || map.round}`);
    },

    earrings(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><path d="M22 22 L58 58 M58 22 L22 58" stroke="#c8b0b8" stroke-width="3" opacity="0.55"/>`);
      }
      const pair = (one) => `<g transform="translate(8,8) scale(0.8)">${one}</g><g transform="translate(40,8) scale(0.8)">${one}</g>`;
      const map = {
        pearl: pair(`<circle cx="20" cy="30" r="12" fill="#fff" stroke="#E0D8D0" stroke-width="2"/>`),
        heart: pair(`<path d="M8 24 C8 12 24 12 24 24 C24 12 40 12 40 24 C40 40 24 50 24 50 C24 50 8 40 8 24 Z" fill="#FF6B8A"/>`),
        star: pair(`<polygon points="24,8 28,20 40,20 30,28 34,40 24,32 14,40 18,28 8,20 20,20" fill="#FFC94A"/>`),
        drop: pair(`<circle cx="24" cy="16" r="5" fill="#7EC8FF"/><ellipse cx="24" cy="36" rx="10" ry="16" fill="#7EC8FF"/>`),
        hoop: pair(`<circle cx="24" cy="28" r="14" fill="none" stroke="#FFC94A" stroke-width="5"/>`),
        bow: pair(`<path d="M24 30 Q10 14 24 24 Q38 14 24 30 Z" fill="#FF8FB3"/>`),
        candy: pair(`<ellipse cx="24" cy="28" rx="14" ry="10" fill="#FF8FB3"/><path d="M8 28 L0 18 M8 28 L0 38 M40 28 L48 18 M40 28 L48 38" stroke="#FFC94A" stroke-width="3"/>`),
        flower: pair(`<circle cx="24" cy="20" r="7" fill="#FF8FB3"/><circle cx="16" cy="32" r="7" fill="#FF8FB3"/><circle cx="32" cy="32" r="7" fill="#FF8FB3"/><circle cx="24" cy="28" r="5" fill="#FFC94A"/>`),
        diamond: pair(`<polygon points="24,8 36,24 24,48 12,24" fill="#B8E0FF" stroke="#7EC8FF" stroke-width="2"/>`),
      };
      return svg(`<rect width="80" height="80" rx="18" fill="#E8F7FF"/>${map[item.id] || map.pearl}`);
    },

    necklace(item) {
      if (item.id === "none") {
        return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/><path d="M22 22 L58 58 M58 22 L22 58" stroke="#c8b0b8" stroke-width="3" opacity="0.55"/>`);
      }
      const map = {
        pearl: `<path d="M16 28 Q40 55 64 28" fill="none" stroke="#E8E0D8" stroke-width="3"/><circle cx="28" cy="42" r="5" fill="#fff" stroke="#E0D8D0"/><circle cx="40" cy="48" r="6" fill="#fff" stroke="#E0D8D0"/><circle cx="52" cy="42" r="5" fill="#fff" stroke="#E0D8D0"/>`,
        heart: `<path d="M16 28 Q40 52 64 28" fill="none" stroke="#FF8FB3" stroke-width="2.5"/><path d="M30 46 C30 38 40 38 40 46 C40 38 50 38 50 46 C50 58 40 66 40 66 C40 66 30 58 30 46 Z" fill="#FF6B8A"/>`,
        star: `<path d="M16 28 Q40 52 64 28" fill="none" stroke="#FFC94A" stroke-width="2.5"/><polygon points="40,42 43,50 52,50 45,56 48,64 40,58 32,64 35,56 28,50 37,50" fill="#FFC94A"/>`,
        candy: `<path d="M16 28 Q40 52 64 28" fill="none" stroke="#7EC8FF" stroke-width="2.5"/><ellipse cx="40" cy="52" rx="12" ry="8" fill="#FF8FB3"/>`,
        choker: `<path d="M14 34 Q40 50 66 34" fill="none" stroke="#FF6B8A" stroke-width="8" stroke-linecap="round"/><circle cx="40" cy="46" r="5" fill="#FFC94A"/>`,
        locket: `<path d="M16 28 Q40 52 64 28" fill="none" stroke="#FFC94A" stroke-width="2.5"/><circle cx="40" cy="54" r="10" fill="#FFC94A"/><circle cx="40" cy="54" r="5" fill="#FF8FB3"/>`,
        bead: `<circle cx="22" cy="34" r="5" fill="#FF6B8A"/><circle cx="32" cy="44" r="5" fill="#FFC94A"/><circle cx="40" cy="48" r="5" fill="#3ECFAD"/><circle cx="48" cy="44" r="5" fill="#7EC8FF"/><circle cx="58" cy="34" r="5" fill="#B89BE8"/>`,
        ribbon: `<path d="M16 30 Q40 48 64 30" fill="none" stroke="#FF8FB3" stroke-width="3"/><path d="M28 48 Q40 68 52 48" fill="#FF6B8A"/><path d="M32 54 Q24 72 36 60" fill="#FF8FB3"/><path d="M48 54 Q56 72 44 60" fill="#FF8FB3"/>`,
        key: `<path d="M16 28 Q40 52 64 28" fill="none" stroke="#FFC94A" stroke-width="2.5"/><circle cx="40" cy="48" r="8" fill="none" stroke="#FFC94A" stroke-width="3"/><rect x="38" y="55" width="4" height="14" fill="#FFC94A"/>`,
      };
      return svg(`<rect width="80" height="80" rx="18" fill="#FFF5F8"/>${map[item.id] || map.pearl}`);
    },

    background(item) {
      return `<div class="preview-bg" style="background:${item.css}"></div>`;
    },
  };

  /** 根据分类与条目生成预览组件 HTML */
  function render(category, item) {
    const fn = Previews[category];
    if (!fn) {
      return `<div class="preview-fallback" style="background:${item.color || "#ddd"}"></div>`;
    }
    return `<div class="preview-frame">${fn(item)}</div>`;
  }

  return { render, Previews };
})();
