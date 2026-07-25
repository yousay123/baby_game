(() => {
  /* ========== 化妆换装数据 ========== */
  const SKINS = [
    { id: "peach", label: "蜜桃", color: "#FFD2B8", shadow: "#F0A890" },
    { id: "cream", label: "奶油", color: "#FFE0C8", shadow: "#F0B898" },
    { id: "porcelain", label: "瓷白", color: "#FFE8DC", shadow: "#F2C4B0" },
    { id: "warm", label: "暖棕", color: "#F0B890", shadow: "#D89870" },
    { id: "rose", label: "玫瑰", color: "#F8C4B8", shadow: "#E8A098" },
    { id: "honey", label: "蜂蜜", color: "#E8B888", shadow: "#C89868" },
    { id: "latte", label: "拿铁", color: "#D4A07A", shadow: "#B88058" },
    { id: "cocoa", label: "可可", color: "#C88962", shadow: "#A06848" },
    { id: "caramel", label: "焦糖", color: "#B87850", shadow: "#905838" },
  ];

  const BLUSHES = [
    { id: "none", label: "无", color: "transparent", opacity: 0 },
    { id: "pink", label: "粉嫩", color: "#FF8AA8", opacity: 0.55 },
    { id: "coral", label: "珊瑚", color: "#FF8F70", opacity: 0.5 },
    { id: "peach", label: "蜜桃", color: "#FFB087", opacity: 0.5 },
    { id: "berry", label: "莓果", color: "#E37BB8", opacity: 0.48 },
    { id: "rose", label: "玫瑰", color: "#FF6B88", opacity: 0.55 },
    { id: "soft", label: "淡粉", color: "#FFC1D1", opacity: 0.4 },
    { id: "apricot", label: "杏子", color: "#FFA878", opacity: 0.48 },
    { id: "lavender", label: "薰衣草", color: "#D4A8E8", opacity: 0.45 },
    { id: "sun", label: "阳光", color: "#FF9A6B", opacity: 0.42 },
    { id: "doll", label: "娃娃", color: "#FF5A8A", opacity: 0.62 },
  ];

  const EYESHADOWS = [
    { id: "none", label: "无", color: "transparent" },
    { id: "pink", label: "粉晶", color: "#FF9EC0" },
    { id: "lilac", label: "丁香", color: "#C9A7FF" },
    { id: "mint", label: "薄荷", color: "#7FE3C8" },
    { id: "gold", label: "金色", color: "#F2C86B" },
    { id: "sky", label: "天空", color: "#8EC8FF" },
    { id: "peach", label: "蜜桃", color: "#FFB07A" },
    { id: "brown", label: "大地", color: "#C89878" },
    { id: "sparkle", label: "闪光", color: "#D9E4FF" },
    { id: "rose", label: "玫瑰", color: "#E8A0B0" },
    { id: "coral", label: "珊瑚", color: "#FF8F8A" },
    { id: "teal", label: "青石", color: "#5EC8C0" },
    { id: "grape", label: "葡萄", color: "#A878D8" },
    { id: "sunset", label: "晚霞", color: "#FF8A6B" },
    { id: "ice", label: "冰蓝", color: "#C8E8FF" },
  ];

  const EYELINERS = [
    { id: "none", label: "无" },
    { id: "soft", label: "柔和" },
    { id: "cat", label: "猫眼" },
    { id: "doll", label: "娃娃" },
    { id: "wing", label: "眼线" },
    { id: "heart", label: "爱心" },
    { id: "double", label: "双线" },
    { id: "spark", label: "闪光" },
  ];

  const LASHES = [
    { id: "none", label: "无" },
    { id: "short", label: "短睫" },
    { id: "long", label: "长睫" },
    { id: "curl", label: "卷翘" },
    { id: "drama", label: "浓密" },
    { id: "bottom", label: "下睫" },
    { id: "star", label: "星星" },
    { id: "fairy", label: "精灵" },
  ];

  const EYECOLORS = [
    { id: "brown", label: "棕色", iris: "#6B3F2A", pupil: "#2C1810" },
    { id: "black", label: "黑色", iris: "#3A3038", pupil: "#151018" },
    { id: "hazel", label: "榛色", iris: "#8B6B3A", pupil: "#3A2810" },
    { id: "green", label: "绿色", iris: "#3A8B5A", pupil: "#1A3A28" },
    { id: "blue", label: "蓝色", iris: "#3A6BB8", pupil: "#1A2848" },
    { id: "violet", label: "紫色", iris: "#7A4AB0", pupil: "#2A1840" },
    { id: "pink", label: "粉色", iris: "#E878A0", pupil: "#6A2848" },
    { id: "aqua", label: "水色", iris: "#3AB8B0", pupil: "#184848" },
    { id: "gold", label: "金色", iris: "#C89830", pupil: "#483818" },
    { id: "gray", label: "灰色", iris: "#788898", pupil: "#283038" },
  ];

  const LIPS = [
    { id: "natural", label: "自然", color: "#E89A9A", style: "soft" },
    { id: "pink", label: "粉嫩", color: "#FF7FA3", style: "full" },
    { id: "coral", label: "珊瑚", color: "#FF7A6B", style: "full" },
    { id: "red", label: "正红", color: "#E83B4A", style: "full" },
    { id: "berry", label: "莓果", color: "#C44E8A", style: "full" },
    { id: "peach", label: "蜜桃", color: "#FF9A78", style: "full" },
    { id: "nude", label: "裸妆", color: "#E8A090", style: "soft" },
    { id: "cherry", label: "樱桃", color: "#FF4D6D", style: "full" },
    { id: "orange", label: "橘调", color: "#FF8A3D", style: "full" },
    { id: "gloss", label: "水光", color: "#FFB0C4", style: "gloss" },
    { id: "rose", label: "豆沙", color: "#C87888", style: "soft" },
    { id: "magenta", label: "玫红", color: "#E84A8A", style: "full" },
    { id: "wine", label: "酒红", color: "#A03048", style: "full" },
    { id: "candy", label: "糖果", color: "#FF6AB0", style: "gloss" },
    { id: "ombre", label: "渐变", color: "#FF6B8A", style: "ombre" },
    { id: "heart", label: "爱心", color: "#FF5A8A", style: "heart" },
  ];

  const HAIRSTYLES = [
    { id: "bob", label: "波波头", icon: "B" },
    { id: "long", label: "长直发", icon: "L" },
    { id: "twin", label: "双马尾", icon: "T" },
    { id: "bun", label: "丸子头", icon: "U" },
    { id: "curl", label: "大卷发", icon: "C" },
    { id: "ponytail", label: "高马尾", icon: "P" },
    { id: "hime", label: "姬发式", icon: "H" },
    { id: "side", label: "侧马尾", icon: "S" },
    { id: "odango", label: "双丸子", icon: "O" },
    { id: "wavy", label: "微卷", icon: "W" },
    { id: "short", label: "短发", icon: "K" },
    { id: "braid", label: "编发", icon: "R" },
  ];

  const HAIRCOLORS = [
    { id: "brown", label: "棕色", color: "#6B3F2A", hl: "#9A6B4A" },
    { id: "black", label: "黑色", color: "#2C2430", hl: "#5A4A58" },
    { id: "blonde", label: "金色", color: "#E0B45A", hl: "#F5D98A" },
    { id: "pink", label: "粉色", color: "#F4A0C0", hl: "#FFD0E0" },
    { id: "lavender", label: "香芋", color: "#B79BEE", hl: "#D8C8FF" },
    { id: "mint", label: "薄荷", color: "#7BCFB3", hl: "#B8F0DC" },
    { id: "orange", label: "橘色", color: "#E8884A", hl: "#FFB878" },
    { id: "blue", label: "蓝色", color: "#6FB4E8", hl: "#A8D8FF" },
    { id: "red", label: "红色", color: "#D05060", hl: "#F08090" },
    { id: "silver", label: "银色", color: "#C8D0D8", hl: "#F0F4F8" },
    { id: "strawberry", label: "草莓", color: "#E8A070", hl: "#FFD0A8" },
    { id: "galaxy", label: "星系", color: "#6A4A9A", hl: "#B088E8" },
  ];

  const ACCESSORIES = [
    { id: "none", label: "无头饰", icon: "-" },
    { id: "bow", label: "大蝴蝶结", icon: "B" },
    { id: "bowMini", label: "小蝴蝶结", icon: "b" },
    { id: "crown", label: "皇冠", icon: "C" },
    { id: "tiara", label: "发冠", icon: "T" },
    { id: "flower", label: "花朵", icon: "F" },
    { id: "flowerCrown", label: "花环", icon: "W" },
    { id: "star", label: "星星", icon: "S" },
    { id: "hearts", label: "爱心", icon: "H" },
    { id: "cat", label: "猫耳", icon: "M" },
    { id: "bunny", label: "兔耳", icon: "R" },
    { id: "bear", label: "熊耳", icon: "X" },
    { id: "hat", label: "礼帽", icon: "A" },
    { id: "beret", label: "贝雷帽", icon: "E" },
    { id: "halo", label: "天使光环", icon: "O" },
    { id: "horns", label: "小恶魔", icon: "D" },
  ];

  const GLASSES = [
    { id: "none", label: "无", icon: "-" },
    { id: "round", label: "圆框", color: "#5A3A28" },
    { id: "thin", label: "细框", color: "#8B7355" },
    { id: "sunnies", label: "墨镜", color: "#2C2430" },
    { id: "pinkSun", label: "粉墨镜", color: "#FF6B8A" },
    { id: "heart", label: "心形", color: "#FF6B8A" },
    { id: "catEye", label: "猫眼", color: "#4A3040" },
    { id: "square", label: "方框", color: "#3A5080" },
    { id: "star", label: "星星", color: "#FFC94A" },
    { id: "clear", label: "透明", color: "#A8C8E8" },
  ];

  const EARRINGS = [
    { id: "none", label: "无", icon: "-" },
    { id: "pearl", label: "珍珠", icon: "P" },
    { id: "heart", label: "爱心", icon: "H" },
    { id: "star", label: "星星", icon: "S" },
    { id: "drop", label: "水滴", icon: "D" },
    { id: "hoop", label: "圆环", icon: "O" },
    { id: "bow", label: "蝴蝶结", icon: "B" },
    { id: "candy", label: "糖果", icon: "C" },
    { id: "flower", label: "花朵", icon: "F" },
    { id: "diamond", label: "钻石", icon: "G" },
  ];

  const NECKLACES = [
    { id: "none", label: "无", icon: "-" },
    { id: "pearl", label: "珍珠", icon: "P" },
    { id: "heart", label: "爱心", icon: "H" },
    { id: "star", label: "星星", icon: "S" },
    { id: "candy", label: "糖果", icon: "C" },
    { id: "choker", label: "颈链", icon: "K" },
    { id: "locket", label: "相盒", icon: "L" },
    { id: "bead", label: "珠串", icon: "B" },
    { id: "ribbon", label: "丝带结", icon: "R" },
    { id: "key", label: "钥匙", icon: "Y" },
  ];

  const W = window.PrincessWardrobe;
  const DRESSES = W.DRESSES;
  const TOPS = W.TOPS;
  const SKIRTS = W.SKIRTS;
  const PANTS = W.PANTS;
  const SHOES = W.SHOES;
  const BAGS = W.BAGS;

  const NAILS = [
    { id: "none", label: "裸甲", color: "#F2C4B0" },
    { id: "pink", label: "粉色", color: "#FF8FB8" },
    { id: "red", label: "正红", color: "#E83B4A" },
    { id: "coral", label: "珊瑚", color: "#FF7A5C" },
    { id: "mint", label: "薄荷", color: "#5FD0B5" },
    { id: "lilac", label: "丁香", color: "#C3A4FF" },
    { id: "gold", label: "金色", color: "#F2C86B" },
    { id: "sky", label: "天空", color: "#7EC8FF" },
    { id: "white", label: "乳白", color: "#FFF5F8" },
    { id: "black", label: "黑色", color: "#3A3040" },
    { id: "candy", label: "糖果", color: "#FF6AB0" },
    { id: "french", label: "法式", color: "#FFE8F0" },
  ];

  const BACKGROUNDS = [
    { id: "candy", label: "糖果屋", css: "radial-gradient(circle at 50% 20%, rgba(255,255,255,.75), transparent 45%), linear-gradient(180deg,#b8e8ff 0%,#ffe6f2 55%,#ffe9c8 100%)" },
    { id: "garden", label: "花园", css: "radial-gradient(circle at 30% 20%, #fff7b8, transparent 35%), linear-gradient(180deg,#9be7ff 0%,#c8f7c4 50%,#ffe7a8 100%)" },
    { id: "castle", label: "公主城堡", css: "radial-gradient(circle at 70% 15%, #ffe0f2, transparent 40%), linear-gradient(180deg,#d7c4ff 0%,#ffd6ec 55%,#ffe8c8 100%)" },
    { id: "beach", label: "海边", css: "linear-gradient(180deg,#7ec8ff 0%,#c8ecff 40%,#ffe7b0 70%,#ffd18a 100%)" },
    { id: "starry", label: "星空", css: "radial-gradient(circle at 20% 20%, #fff8c8 0 2px, transparent 3px), radial-gradient(circle at 70% 30%, #fff 0 1.5px, transparent 3px), linear-gradient(180deg,#2a2450 0%,#6b4f9a 45%,#ff9ec0 100%)" },
    { id: "bakery", label: "烘焙坊", css: "radial-gradient(circle at 50% 0%, #fff, transparent 40%), linear-gradient(180deg,#ffd6e8 0%,#ffe8c4 50%,#ffc4d8 100%)" },
    { id: "classroom", label: "教室", css: "linear-gradient(180deg,#a8d8ff 0%,#e8f4ff 40%,#f5e6d3 40%,#e8d4b8 100%)" },
    { id: "snow", label: "雪景", css: "radial-gradient(circle at 20% 30%, #fff 0 2px, transparent 3px), linear-gradient(180deg,#d8e8ff 0%,#f0f6ff 50%,#fff 100%)" },
    { id: "rainbow", label: "彩虹", css: "linear-gradient(180deg,#ffb3c6 0%,#ffd6a5 20%,#fdffb6 40%,#caffbf 60%,#9bf6ff 80%,#bdb2ff 100%)" },
    { id: "stage", label: "舞台", css: "radial-gradient(ellipse at 50% 100%, #ffe08a 0%, transparent 50%), linear-gradient(180deg,#2a1848 0%,#6a3a8a 60%,#ff8fb3 100%)" },
  ];

  const MAKEUP_TABS = [
    { id: "skin", label: "肤色", items: SKINS, kind: "color" },
    { id: "blush", label: "腮红", items: BLUSHES, kind: "color" },
    { id: "eyeshadow", label: "眼影", items: EYESHADOWS, kind: "color" },
    { id: "eyecolor", label: "瞳色", items: EYECOLORS, kind: "eye" },
    { id: "eyeliner", label: "眼线", items: EYELINERS, kind: "text" },
    { id: "lashes", label: "睫毛", items: LASHES, kind: "text" },
    { id: "lips", label: "唇妆", items: LIPS, kind: "color" },
    { id: "nails", label: "美甲", items: NAILS, kind: "color" },
  ];

  const DRESS_TABS = [
    { id: "hairstyle", label: "发型", items: HAIRSTYLES, kind: "icon" },
    { id: "haircolor", label: "发色", items: HAIRCOLORS, kind: "color" },
    { id: "dress", label: "裙装", items: DRESSES, kind: "dress" },
    { id: "top", label: "上衣", items: TOPS, kind: "top" },
    { id: "skirt", label: "裙子", items: SKIRTS, kind: "skirt" },
    { id: "pants", label: "裤子", items: PANTS, kind: "pants" },
    { id: "shoes", label: "鞋子", items: SHOES, kind: "shoes" },
    { id: "bag", label: "包包", items: BAGS, kind: "bag" },
    { id: "glasses", label: "眼镜", items: GLASSES, kind: "glasses" },
    { id: "accessory", label: "头饰", items: ACCESSORIES, kind: "icon" },
    { id: "earrings", label: "耳环", items: EARRINGS, kind: "icon" },
    { id: "necklace", label: "项链", items: NECKLACES, kind: "icon" },
    { id: "background", label: "背景", items: BACKGROUNDS, kind: "bg" },
  ];

  const state = {
    skin: "peach",
    blush: "pink",
    eyeshadow: "pink",
    eyecolor: "brown",
    eyeliner: "soft",
    lashes: "long",
    lips: "pink",
    nails: "pink",
    hairstyle: "twin",
    haircolor: "brown",
    dress: "roseBall",
    top: "none",
    skirt: "none",
    pants: "none",
    shoes: "glass",
    bag: "pearl",
    accessory: "crown",
    glasses: "none",
    earrings: "pearl",
    necklace: "heart",
    background: "castle",
  };

  const history = [];
  let mode = "makeup";
  let activeTab = "lips";

  const $ = (sel) => document.querySelector(sel);
  const toastEl = $("#toast");
  const tabsEl = $("#tabs");
  const panelEl = $("#panel");
  const itemCountEl = $("#itemCount");

  function currentTabs() {
    return mode === "makeup" ? MAKEUP_TABS : DRESS_TABS;
  }

  function showToast(msg) {
    toastEl.hidden = false;
    toastEl.textContent = msg;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toastEl.hidden = true;
    }, 1800);
  }

  function pushHistory() {
    history.push({ ...state });
    if (history.length > 50) history.shift();
  }

  function skinTone() {
    return SKINS.find((x) => x.id === state.skin) || SKINS[0];
  }

  function hairTone() {
    return HAIRCOLORS.find((x) => x.id === state.haircolor) || HAIRCOLORS[0];
  }

  function eyeTone() {
    return EYECOLORS.find((x) => x.id === state.eyecolor) || EYECOLORS[0];
  }

  function applySkin() {
    const s = skinTone();
    ["face", "neck", "earL", "earR"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("fill", s.color);
    });
  }

  function renderBlush() {
    const g = $("#blush");
    const item = BLUSHES.find((x) => x.id === state.blush);
    g.innerHTML = "";
    if (!item || item.id === "none") return;
    g.innerHTML = `
      <ellipse cx="118" cy="222" rx="28" ry="16" fill="${item.color}" opacity="${item.opacity}" />
      <ellipse cx="242" cy="222" rx="28" ry="16" fill="${item.color}" opacity="${item.opacity}" />
    `;
  }

  function renderEyeshadow() {
    const g = $("#eyeshadow");
    const item = EYESHADOWS.find((x) => x.id === state.eyeshadow);
    g.innerHTML = "";
    if (!item || item.id === "none") return;
    g.innerHTML = `
      <ellipse cx="142" cy="190" rx="28" ry="18" fill="${item.color}" opacity="0.55" />
      <ellipse cx="218" cy="190" rx="28" ry="18" fill="${item.color}" opacity="0.55" />
    `;
  }

  function renderEyes() {
    const g = $("#eyes");
    const e = eyeTone();
    g.innerHTML = `
      <ellipse cx="142" cy="197" rx="26" ry="30" fill="#fff" />
      <ellipse cx="218" cy="197" rx="26" ry="30" fill="#fff" />
      <ellipse cx="144" cy="202" rx="18" ry="20" fill="${e.iris}" />
      <ellipse cx="220" cy="202" rx="18" ry="20" fill="${e.iris}" />
      <ellipse cx="145" cy="204" rx="9" ry="11" fill="${e.pupil}" />
      <ellipse cx="221" cy="204" rx="9" ry="11" fill="${e.pupil}" />
      <circle cx="138" cy="192" r="7" fill="#fff" />
      <circle cx="214" cy="192" r="7" fill="#fff" />
      <circle cx="152" cy="208" r="3.2" fill="#fff" opacity="0.9" />
      <circle cx="228" cy="208" r="3.2" fill="#fff" opacity="0.9" />
      <path d="M120 212 Q142 224 164 212" fill="none" stroke="#FFB0C0" stroke-width="3" stroke-linecap="round" opacity="0.55" />
      <path d="M196 212 Q218 224 240 212" fill="none" stroke="#FFB0C0" stroke-width="3" stroke-linecap="round" opacity="0.55" />
    `;
  }

  function renderEyeliner() {
    const g = $("#eyeliner");
    g.innerHTML = "";
    const style = state.eyeliner;
    if (style === "none") return;
    const maps = {
      soft: `<path d="M118 190 Q142 174 166 192" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" /><path d="M194 192 Q218 174 242 190" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />`,
      cat: `<path d="M116 194 Q142 172 168 196 L108 184 Z" fill="#2C2430" opacity="0.92" /><path d="M192 196 Q218 172 244 194 L252 184 Z" fill="#2C2430" opacity="0.92" />`,
      doll: `<path d="M116 196 Q142 170 168 198" fill="none" stroke="#2C2430" stroke-width="3.4" stroke-linecap="round" /><path d="M192 198 Q218 170 244 196" fill="none" stroke="#2C2430" stroke-width="3.4" stroke-linecap="round" />`,
      wing: `<path d="M118 190 Q142 174 166 196 L105 178" fill="none" stroke="#2C2430" stroke-width="3" stroke-linecap="round" /><path d="M194 196 Q218 174 242 190 L255 178" fill="none" stroke="#2C2430" stroke-width="3" stroke-linecap="round" />`,
      heart: `<path d="M118 190 Q142 174 166 196" fill="none" stroke="#2C2430" stroke-width="2.6" /><path d="M194 196 Q218 174 242 190" fill="none" stroke="#2C2430" stroke-width="2.6" /><path d="M100 180 C100 172 110 172 110 180 C110 172 120 172 120 180 C120 190 110 197 110 197 C110 197 100 190 100 180 Z" fill="#FF6B8A" /><path d="M240 180 C240 172 250 172 250 180 C250 172 260 172 260 180 C260 190 250 197 250 197 C250 197 240 190 240 180 Z" fill="#FF6B8A" />`,
      double: `<path d="M118 188 Q142 172 166 192" fill="none" stroke="#2C2430" stroke-width="2.2" /><path d="M118 194 Q142 180 166 198" fill="none" stroke="#2C2430" stroke-width="1.6" /><path d="M194 192 Q218 172 242 188" fill="none" stroke="#2C2430" stroke-width="2.2" /><path d="M194 198 Q218 180 242 194" fill="none" stroke="#2C2430" stroke-width="1.6" />`,
      spark: `<path d="M118 190 Q142 174 166 192" fill="none" stroke="#2C2430" stroke-width="2.4" /><path d="M194 192 Q218 174 242 190" fill="none" stroke="#2C2430" stroke-width="2.4" /><circle cx="112" cy="182" r="2.5" fill="#FFC94A" /><circle cx="248" cy="182" r="2.5" fill="#FFC94A" />`,
    };
    g.innerHTML = maps[style] || "";
  }

  function renderLashes() {
    const g = $("#lashes");
    g.innerHTML = "";
    const style = state.lashes;
    if (style === "none") return;
    const upper = (len = 14, w = 2.3) => `
      <path d="M122 182 L${122 - len * 0.4} ${182 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M134 176 L${134 - len * 0.15} ${176 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M146 174 L146 ${174 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M158 178 L${158 + len * 0.2} ${178 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M202 178 L${202 - len * 0.2} ${178 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M214 174 L214 ${174 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M226 176 L${226 + len * 0.15} ${176 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
      <path d="M238 182 L${238 + len * 0.4} ${182 - len}" stroke="#2C2430" stroke-width="${w}" stroke-linecap="round" />
    `;
    if (style === "short") g.innerHTML = upper(10, 2.1);
    if (style === "long") g.innerHTML = upper(16, 2.4);
    if (style === "curl") {
      g.innerHTML = `
        <path d="M122 184 Q112 164 118 156" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />
        <path d="M138 176 Q134 154 140 148" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />
        <path d="M152 174 Q156 152 162 148" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />
        <path d="M208 174 Q204 152 198 148" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />
        <path d="M222 176 Q226 154 220 148" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />
        <path d="M238 184 Q248 164 242 156" fill="none" stroke="#2C2430" stroke-width="2.4" stroke-linecap="round" />
      `;
    }
    if (style === "drama") g.innerHTML = upper(18, 2.6);
    if (style === "bottom") g.innerHTML = upper(8, 2);
    if (style === "star") {
      g.innerHTML = upper(14, 2.3) + `<polygon points="128,160 130,166 136,166 131,170 133,176 128,172 123,176 125,170 120,166 126,166" fill="#FFC94A" /><polygon points="232,160 234,166 240,166 235,170 237,176 232,172 227,176 229,170 224,166 230,166" fill="#FFC94A" />`;
    }
    if (style === "fairy") g.innerHTML = upper(15, 2.2) + `<circle cx="120" cy="162" r="2" fill="#fff" /><circle cx="240" cy="162" r="2" fill="#fff" />`;
  }

  function renderLips() {
    const g = $("#lips");
    const item = LIPS.find((x) => x.id === state.lips) || LIPS[0];
    const c = item.color;
    if (item.style === "heart") {
      g.innerHTML = `<path d="M158 244 C158 234 170 234 180 244 C190 234 202 234 202 244 C202 260 180 274 180 274 C180 274 158 260 158 244 Z" fill="${c}" />`;
    } else if (item.style === "ombre") {
      g.innerHTML = `<path d="M155 242 Q180 230 205 242 Q180 272 155 242 Z" fill="#FFB0C4" /><path d="M162 246 Q180 240 198 246 Q180 264 162 246 Z" fill="${c}" />`;
    } else if (item.style === "gloss") {
      g.innerHTML = `<path d="M155 242 Q180 230 205 242 Q180 272 155 242 Z" fill="${c}" /><ellipse cx="170" cy="250" rx="5" ry="3" fill="rgba(255,255,255,0.7)" />`;
    } else if (item.style === "soft") {
      g.innerHTML = `<path d="M160 246 Q180 238 200 246 Q180 260 160 246 Z" fill="${c}" opacity="0.85" />`;
    } else {
      g.innerHTML = `<path d="M155 242 Q180 230 205 242 Q180 272 155 242 Z" fill="${c}" /><path d="M162 246 Q180 240 198 246" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />`;
    }
  }

  function renderHair() {
    const back = $("#hairBack");
    const front = $("#hairFront");
    const h = hairTone();
    const c = h.color;
    const hl = h.hl;
    $("#browL").setAttribute("stroke", c);
    $("#browR").setAttribute("stroke", c);
    const bangs = `
      <path d="M95 148 Q180 62 265 148 Q235 110 180 104 Q125 110 95 148 Z" fill="${c}" />
      <path d="M108 142 Q135 178 148 212" fill="${c}" />
      <path d="M212 212 Q225 178 252 142" fill="${c}" />
      <path d="M155 108 Q180 142 205 108" fill="${c}" opacity="0.95" />
      <path d="M130 118 Q150 98 165 120" fill="${hl}" opacity="0.45" />
    `;
    const baseHead = `<path d="M88 152 Q78 232 105 288 Q140 312 180 308 Q220 312 255 288 Q282 232 272 152 Q235 80 180 74 Q125 80 88 152 Z" fill="${c}" />`;
    const style = state.hairstyle;
    if (style === "bob") {
      back.innerHTML = `<path d="M88 148 Q80 232 108 298 Q140 322 180 318 Q220 322 252 298 Q280 232 272 148 Q235 82 180 78 Q125 82 88 148 Z" fill="${c}" />`;
      front.innerHTML = bangs;
    } else if (style === "long") {
      back.innerHTML = `<path d="M85 148 Q70 272 95 412 Q140 452 180 438 Q220 452 265 412 Q290 272 275 148 Q235 78 180 72 Q125 78 85 148 Z" fill="${c}" />`;
      front.innerHTML = bangs;
    } else if (style === "twin") {
      back.innerHTML = `${baseHead}<path d="M95 208 Q50 262 55 392 Q85 422 115 372 Q125 272 118 222 Z" fill="${c}" /><path d="M265 208 Q310 262 305 392 Q275 422 245 372 Q235 272 242 222 Z" fill="${c}" /><circle cx="82" cy="218" r="14" fill="#FF6B8A" /><circle cx="278" cy="218" r="14" fill="#FF6B8A" />`;
      front.innerHTML = bangs;
    } else if (style === "bun") {
      back.innerHTML = `<circle cx="180" cy="70" r="38" fill="${c}" />${baseHead}<circle cx="180" cy="88" r="10" fill="#FFC94A" />`;
      front.innerHTML = bangs;
    } else if (style === "curl") {
      back.innerHTML = `<path d="M85 148 Q72 242 95 342 Q125 392 160 362 Q175 412 180 372 Q185 412 200 362 Q235 392 265 342 Q288 242 275 148 Q235 78 180 72 Q125 78 85 148 Z" fill="${c}" /><circle cx="105" cy="332" r="24" fill="${c}" /><circle cx="255" cy="332" r="24" fill="${c}" />`;
      front.innerHTML = bangs;
    } else if (style === "ponytail") {
      back.innerHTML = `${baseHead}<path d="M205 122 Q275 132 290 302 Q255 352 220 292 Q210 192 205 137 Z" fill="${c}" /><circle cx="220" cy="128" r="12" fill="#FFC94A" />`;
      front.innerHTML = bangs;
    } else if (style === "hime") {
      back.innerHTML = `<path d="M85 148 Q75 262 100 392 Q140 432 180 422 Q220 432 260 392 Q285 262 275 148 Q235 78 180 72 Q125 78 85 148 Z" fill="${c}" />`;
      front.innerHTML = `<path d="M95 148 Q180 68 265 148 Q240 118 180 112 Q120 118 95 148 Z" fill="${c}" /><rect x="108" y="142" width="28" height="95" rx="12" fill="${c}" /><rect x="224" y="142" width="28" height="95" rx="12" fill="${c}" />`;
    } else if (style === "side") {
      back.innerHTML = `${baseHead}<path d="M240 172 Q300 212 295 372 Q260 412 230 352 Q235 242 240 192 Z" fill="${c}" />`;
      front.innerHTML = bangs;
    } else if (style === "odango") {
      back.innerHTML = `<circle cx="118" cy="92" r="28" fill="${c}" /><circle cx="242" cy="92" r="28" fill="${c}" />${baseHead}`;
      front.innerHTML = bangs;
    } else if (style === "wavy") {
      back.innerHTML = `<path d="M85 148 Q70 242 90 332 Q110 382 140 352 Q155 402 180 362 Q205 402 220 352 Q250 382 270 332 Q290 242 275 148 Q235 78 180 72 Q125 78 85 148 Z" fill="${c}" />`;
      front.innerHTML = bangs;
    } else if (style === "short") {
      back.innerHTML = `<path d="M95 152 Q90 212 115 262 Q145 282 180 278 Q215 282 245 262 Q270 212 265 152 Q230 92 180 88 Q130 92 95 152 Z" fill="${c}" />`;
      front.innerHTML = `<path d="M100 148 Q180 78 260 148 Q230 118 180 112 Q130 118 100 148 Z" fill="${c}" />`;
    } else {
      back.innerHTML = `${baseHead}<path d="M100 212 Q75 272 90 392 Q110 412 125 372 Q130 282 120 232 Z" fill="${c}" /><path d="M260 212 Q285 272 270 392 Q250 412 235 372 Q230 282 240 232 Z" fill="${c}" />`;
      front.innerHTML = bangs;
    }
  }

  function renderAccessory() {
    const g = $("#accessory");
    g.innerHTML = "";
    const id = state.accessory;
    const hc = hairTone().color;
    if (id === "none") return;
    const map = {
      bow: `<path d="M145 98 Q115 68 145 88 Q175 68 145 98 Z" fill="#FF6B8A"/><path d="M215 98 Q185 68 215 88 Q245 68 215 98 Z" fill="#FF6B8A"/><circle cx="180" cy="90" r="12" fill="#FFC94A"/>`,
      bowMini: `<path d="M200 112 Q185 97 200 107 Q215 97 200 112 Z" fill="#FF8FB3"/><circle cx="200" cy="106" r="5" fill="#FFC94A"/>`,
      crown: `<path d="M125 110 L142 78 L158 105 L180 68 L202 105 L218 78 L235 110 Z" fill="#FFC94A" stroke="#E0A020" stroke-width="2"/><circle cx="142" cy="78" r="5" fill="#FF6B8A"/><circle cx="180" cy="68" r="6" fill="#7EC8FF"/><circle cx="218" cy="78" r="5" fill="#3ECFAD"/>`,
      tiara: `<path d="M130 112 Q180 62 230 112" fill="none" stroke="#B8D0FF" stroke-width="5"/><circle cx="180" cy="70" r="7" fill="#fff"/>`,
      flower: `<g transform="translate(112 122)"><circle cx="0" cy="-11" r="9" fill="#FF8FB3"/><circle cx="10" cy="5" r="9" fill="#FF8FB3"/><circle cx="-10" cy="5" r="9" fill="#FF8FB3"/><circle cx="0" cy="0" r="6" fill="#FFC94A"/></g>`,
      flowerCrown: `<ellipse cx="180" cy="110" rx="78" ry="18" fill="none" stroke="#7BCFB3" stroke-width="6"/><circle cx="120" cy="108" r="8" fill="#FF8FB3"/><circle cx="180" cy="98" r="8" fill="#FF8FB3"/><circle cx="240" cy="108" r="8" fill="#FFC94A"/>`,
      star: `<polygon points="115,118 120,131 134,131 123,140 127,153 115,144 103,153 107,140 96,131 110,131" fill="#FFC94A"/><polygon points="245,118 250,131 264,131 253,140 257,153 245,144 233,153 237,140 226,131 240,131" fill="#FFC94A"/>`,
      hearts: `<path d="M110 120 C110 108 126 108 126 120 C126 108 142 108 142 120 C142 136 126 148 126 148 C126 148 110 136 110 120 Z" fill="#FF6B8A"/><path d="M218 120 C218 108 234 108 234 120 C234 108 250 108 250 120 C250 136 234 148 234 148 C234 148 218 136 218 120 Z" fill="#FF6B8A"/>`,
      cat: `<path d="M108 132 L90 78 L145 115 Z" fill="${hc}" stroke="#4A3550" stroke-width="2"/><path d="M252 132 L270 78 L215 115 Z" fill="${hc}" stroke="#4A3550" stroke-width="2"/>`,
      bunny: `<ellipse cx="125" cy="62" rx="14" ry="40" fill="#fff" stroke="#E8E0E8" stroke-width="2" transform="rotate(-15 125 62)"/><ellipse cx="235" cy="62" rx="14" ry="40" fill="#fff" stroke="#E8E0E8" stroke-width="2" transform="rotate(15 235 62)"/>`,
      bear: `<circle cx="120" cy="92" r="22" fill="#C88962"/><circle cx="240" cy="92" r="22" fill="#C88962"/>`,
      hat: `<ellipse cx="180" cy="108" rx="55" ry="12" fill="#4A3040"/><rect x="150" y="48" width="60" height="60" rx="8" fill="#4A3040"/><rect x="150" y="88" width="60" height="10" fill="#FF6B8A"/>`,
      beret: `<ellipse cx="175" cy="98" rx="55" ry="28" fill="#FF6B8A"/><circle cx="200" cy="88" r="5" fill="#FFC94A"/>`,
      halo: `<ellipse cx="180" cy="62" rx="48" ry="12" fill="none" stroke="#FFE08A" stroke-width="6"/>`,
      horns: `<path d="M125 112 Q110 52 140 92" fill="none" stroke="#4A3040" stroke-width="10" stroke-linecap="round"/><path d="M235 112 Q250 52 220 92" fill="none" stroke="#4A3040" stroke-width="10" stroke-linecap="round"/>`,
    };
    g.innerHTML = map[id] || "";
  }

  function renderGlasses() {
    const g = $("#glasses");
    if (!g) return;
    g.innerHTML = "";
    const id = state.glasses;
    if (!id || id === "none") return;
    const map = {
      round: `<circle cx="142" cy="197" r="26" fill="rgba(255,255,255,0.12)" stroke="#5A3A28" stroke-width="3.5"/><circle cx="218" cy="197" r="26" fill="rgba(255,255,255,0.12)" stroke="#5A3A28" stroke-width="3.5"/><path d="M168 197 H192" stroke="#5A3A28" stroke-width="3"/><path d="M116 197 H96" stroke="#5A3A28" stroke-width="3" stroke-linecap="round"/><path d="M244 197 H264" stroke="#5A3A28" stroke-width="3" stroke-linecap="round"/>`,
      thin: `<circle cx="142" cy="197" r="25" fill="none" stroke="#8B7355" stroke-width="2.2"/><circle cx="218" cy="197" r="25" fill="none" stroke="#8B7355" stroke-width="2.2"/><path d="M167 197 H193" stroke="#8B7355" stroke-width="2"/>`,
      sunnies: `<ellipse cx="142" cy="197" rx="28" ry="20" fill="#2C2430" opacity="0.88"/><ellipse cx="218" cy="197" rx="28" ry="20" fill="#2C2430" opacity="0.88"/><path d="M170 197 H190" stroke="#2C2430" stroke-width="4"/>`,
      pinkSun: `<ellipse cx="142" cy="197" rx="28" ry="20" fill="#FF6B8A" opacity="0.75"/><ellipse cx="218" cy="197" rx="28" ry="20" fill="#FF6B8A" opacity="0.75"/><path d="M170 197 H190" stroke="#C44A68" stroke-width="4"/>`,
      heart: `<path d="M118 187 C118 170 142 170 142 187 C142 170 166 170 166 187 C166 210 142 227 142 227 C142 227 118 210 118 187 Z" fill="rgba(255,107,138,0.2)" stroke="#FF6B8A" stroke-width="3"/><path d="M194 187 C194 170 218 170 218 187 C218 170 242 170 242 187 C242 210 218 227 218 227 C218 227 194 210 194 187 Z" fill="rgba(255,107,138,0.2)" stroke="#FF6B8A" stroke-width="3"/><path d="M166 197 H194" stroke="#FF6B8A" stroke-width="3"/>`,
      catEye: `<path d="M116 207 Q116 177 142 177 Q168 177 172 192 L178 184 Q168 170 142 170 Q112 170 108 207 Z" fill="rgba(255,255,255,0.1)" stroke="#4A3040" stroke-width="3.2"/><path d="M188 192 Q192 177 218 177 Q244 177 244 207 Q248 170 218 170 Q192 170 182 184 Z" fill="rgba(255,255,255,0.1)" stroke="#4A3040" stroke-width="3.2"/><path d="M168 192 H192" stroke="#4A3040" stroke-width="3"/>`,
      square: `<rect x="118" y="180" width="48" height="36" rx="8" fill="rgba(180,200,255,0.12)" stroke="#3A5080" stroke-width="3.2"/><rect x="194" y="180" width="48" height="36" rx="8" fill="rgba(180,200,255,0.12)" stroke="#3A5080" stroke-width="3.2"/><path d="M166 198 H194" stroke="#3A5080" stroke-width="3"/>`,
      star: `<circle cx="142" cy="197" r="24" fill="none" stroke="#E0A020" stroke-width="3"/><circle cx="218" cy="197" r="24" fill="none" stroke="#E0A020" stroke-width="3"/><path d="M166 197 H192" stroke="#E0A020" stroke-width="3"/><polygon points="142,178 145,186 153,186 147,191 149,199 142,194 135,199 137,191 131,186 139,186" fill="#FFC94A"/>`,
      clear: `<circle cx="142" cy="197" r="26" fill="rgba(200,230,255,0.18)" stroke="#A8C8E8" stroke-width="3"/><circle cx="218" cy="197" r="26" fill="rgba(200,230,255,0.18)" stroke="#A8C8E8" stroke-width="3"/><path d="M168 197 H192" stroke="#A8C8E8" stroke-width="3"/>`,
    };
    g.innerHTML = map[id] || "";
  }

  function renderEarrings() {
    const g = $("#earrings");
    g.innerHTML = "";
    const id = state.earrings;
    if (id === "none") return;
    const map = {
      pearl: `<circle cx="88" cy="222" r="7" fill="#fff" stroke="#E0D8D0"/><circle cx="272" cy="222" r="7" fill="#fff" stroke="#E0D8D0"/>`,
      heart: `<path d="M80 220 C80 212 90 212 90 220 C90 212 100 212 100 220 C100 230 90 237 90 237 C90 237 80 230 80 220 Z" fill="#FF6B8A"/><path d="M260 220 C260 212 270 212 270 220 C270 212 280 212 280 220 C280 230 270 237 270 237 C270 237 260 230 260 220 Z" fill="#FF6B8A"/>`,
      star: `<polygon points="88,214 91,222 99,222 93,227 95,235 88,230 81,235 83,227 77,222 85,222" fill="#FFC94A"/><polygon points="272,214 275,222 283,222 277,227 279,235 272,230 265,235 267,227 261,222 269,222" fill="#FFC94A"/>`,
      drop: `<circle cx="88" cy="220" r="3" fill="#7EC8FF"/><ellipse cx="88" cy="234" rx="6" ry="10" fill="#7EC8FF"/><circle cx="272" cy="220" r="3" fill="#7EC8FF"/><ellipse cx="272" cy="234" rx="6" ry="10" fill="#7EC8FF"/>`,
      hoop: `<circle cx="88" cy="230" r="10" fill="none" stroke="#FFC94A" stroke-width="3"/><circle cx="272" cy="230" r="10" fill="none" stroke="#FFC94A" stroke-width="3"/>`,
      bow: `<path d="M88 224 Q78 214 88 220 Q98 214 88 224 Z" fill="#FF8FB3"/><path d="M272 224 Q262 214 272 220 Q282 214 272 224 Z" fill="#FF8FB3"/>`,
      candy: `<ellipse cx="88" cy="228" rx="8" ry="6" fill="#FF8FB3"/><ellipse cx="272" cy="228" rx="8" ry="6" fill="#7AF0D1"/>`,
      flower: `<circle cx="88" cy="224" r="4" fill="#FFC94A"/><circle cx="88" cy="216" r="4" fill="#FF8FB3"/><circle cx="272" cy="224" r="4" fill="#FFC94A"/><circle cx="272" cy="216" r="4" fill="#FF8FB3"/>`,
      diamond: `<polygon points="88,214 95,224 88,240 81,224" fill="#B8E0FF"/><polygon points="272,214 279,224 272,240 265,224" fill="#B8E0FF"/>`,
    };
    g.innerHTML = map[id] || "";
  }

  function renderNecklace() {
    const g = $("#necklace");
    g.innerHTML = "";
    const id = state.necklace;
    if (id === "none") return;
    const map = {
      pearl: `<path d="M148 305 Q180 330 212 305" fill="none" stroke="#E8E0D8" stroke-width="3"/><circle cx="165" cy="318" r="5" fill="#fff"/><circle cx="180" cy="324" r="6" fill="#fff"/><circle cx="195" cy="318" r="5" fill="#fff"/>`,
      heart: `<path d="M148 305 Q180 328 212 305" fill="none" stroke="#FF8FB3" stroke-width="2.5"/><path d="M168 322 C168 314 178 314 180 322 C182 314 192 314 192 322 C192 334 180 342 180 342 C180 342 168 334 168 322 Z" fill="#FF6B8A"/>`,
      star: `<path d="M148 305 Q180 328 212 305" fill="none" stroke="#FFC94A" stroke-width="2.5"/><polygon points="180,316 183,324 192,324 185,329 188,338 180,332 172,338 175,329 168,324 177,324" fill="#FFC94A"/>`,
      candy: `<path d="M148 305 Q180 328 212 305" fill="none" stroke="#7EC8FF" stroke-width="2.5"/><ellipse cx="180" cy="328" rx="11" ry="8" fill="#FF8FB3"/>`,
      choker: `<path d="M146 298 Q180 315 214 298" fill="none" stroke="#FF6B8A" stroke-width="7" stroke-linecap="round"/><circle cx="180" cy="310" r="5" fill="#FFC94A"/>`,
      locket: `<path d="M148 305 Q180 328 212 305" fill="none" stroke="#FFC94A" stroke-width="2.5"/><circle cx="180" cy="330" r="10" fill="#FFC94A"/><circle cx="180" cy="330" r="5" fill="#FF8FB3"/>`,
      bead: `<circle cx="158" cy="312" r="5" fill="#FF6B8A"/><circle cx="170" cy="320" r="5" fill="#FFC94A"/><circle cx="180" cy="324" r="5" fill="#3ECFAD"/><circle cx="190" cy="320" r="5" fill="#7EC8FF"/><circle cx="202" cy="312" r="5" fill="#B89BE8"/>`,
      ribbon: `<path d="M148 303 Q180 322 212 303" fill="none" stroke="#FF8FB3" stroke-width="3"/><path d="M165 320 Q180 342 195 320" fill="#FF6B8A"/>`,
      key: `<path d="M148 305 Q180 328 212 305" fill="none" stroke="#FFC94A" stroke-width="2.5"/><circle cx="180" cy="326" r="7" fill="none" stroke="#FFC94A" stroke-width="3"/><rect x="178" y="332" width="4" height="14" fill="#FFC94A"/>`,
    };
    g.innerHTML = map[id] || "";
  }

  function renderNails() {
    const item = NAILS.find((x) => x.id === state.nails) || NAILS[0];
    const c = item.id === "french" ? "#FFE8F0" : item.color;
    $("#nailsL").innerHTML = `
      <ellipse cx="70" cy="468" rx="3.2" ry="5.5" fill="${c}" transform="rotate(-35 70 468)" />
      <ellipse cx="75" cy="462" rx="3" ry="5.5" fill="${c}" transform="rotate(-12 75 462)" />
      <ellipse cx="81" cy="461" rx="3" ry="5.8" fill="${c}" />
      <ellipse cx="87" cy="463" rx="2.8" ry="5.2" fill="${c}" transform="rotate(18 87 463)" />
    `;
    $("#nailsR").innerHTML = `
      <ellipse cx="290" cy="468" rx="3.2" ry="5.5" fill="${c}" transform="rotate(35 290 468)" />
      <ellipse cx="285" cy="462" rx="3" ry="5.5" fill="${c}" transform="rotate(12 285 462)" />
      <ellipse cx="279" cy="461" rx="3" ry="5.8" fill="${c}" />
      <ellipse cx="273" cy="463" rx="2.8" ry="5.2" fill="${c}" transform="rotate(-18 273 463)" />
    `;
  }

  function renderBackground() {
    const item = BACKGROUNDS.find((x) => x.id === state.background) || BACKGROUNDS[0];
    $("#bgLayer").style.background = item.css;
  }

  function renderAll() {
    applySkin();
    renderBlush();
    renderEyeshadow();
    renderEyes();
    renderEyeliner();
    renderLashes();
    renderLips();
    renderHair();
    renderGlasses();
    renderAccessory();
    renderEarrings();
    renderNecklace();
    if (window.PrincessWardrobe) {
      window.PrincessWardrobe.apply(state, SKINS);
    }
    renderNails();
    renderBackground();
    if (window.HoneyActors && typeof window.HoneyActors.refreshAllGirls === "function") {
      window.HoneyActors.refreshAllGirls();
    }
  }

  function setValue(key, value, record = true) {
    if (state[key] === value) return;
    if (record) pushHistory();
    state[key] = value;
    if ((key === "top" || key === "skirt" || key === "pants") && value !== "none" && state.dress !== "none") {
      state.dress = "none";
    }
    renderAll();
    renderPanel();
  }

  function renderTabs() {
    const tabs = currentTabs();
    if (!tabs.find((t) => t.id === activeTab)) activeTab = tabs[0].id;
    tabsEl.innerHTML = tabs
      .map((tab) => `<button type="button" class="tab ${tab.id === activeTab ? "active" : ""}" data-tab="${tab.id}">${tab.label}</button>`)
      .join("");
  }

  function renderPanel() {
    const tabs = currentTabs();
    const tab = tabs.find((t) => t.id === activeTab) || tabs[0];
    const current = state[tab.id];
    const total = [...MAKEUP_TABS, ...DRESS_TABS].reduce((n, t) => n + t.items.length, 0);
    itemCountEl.textContent = `本页 ${tab.items.length} 件 · 共 ${total} 种道具`;
    panelEl.innerHTML = `
      <div class="panel-title">${tab.label}<span class="panel-sub">点选换装</span></div>
      <div class="swatches">
        ${tab.items
          .map((item) => {
            const selected = item.id === current ? "selected" : "";
            const preview = window.MakeupPreview
              ? window.MakeupPreview.render(tab.id, item)
              : `<div class="swatch-dot" style="background:${item.color || "#ddd"}"></div>`;
            return `<button type="button" class="swatch swatch-preview ${selected}" data-key="${tab.id}" data-id="${item.id}" title="${item.label}">${preview}<span class="label">${item.label}</span></button>`;
          })
          .join("")}
      </div>
    `;
  }

  function setMode(next) {
    mode = next;
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
    activeTab = currentTabs()[0].id;
    renderTabs();
    renderPanel();
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)].id;
  }

  function randomLook() {
    pushHistory();
    state.skin = pick(SKINS);
    state.blush = pick(BLUSHES.filter((x) => x.id !== "none"));
    state.eyeshadow = pick(EYESHADOWS);
    state.eyecolor = pick(EYECOLORS);
    state.eyeliner = pick(EYELINERS);
    state.lashes = pick(LASHES);
    state.lips = pick(LIPS);
    state.nails = pick(NAILS);
    state.hairstyle = pick(HAIRSTYLES);
    state.haircolor = pick(HAIRCOLORS);
    if (Math.random() > 0.45) {
      state.dress = pick(DRESSES.filter((x) => x.id !== "none"));
      state.top = "none";
      state.skirt = "none";
      state.pants = "none";
    } else {
      state.dress = "none";
      state.top = pick(TOPS.filter((x) => x.id !== "none"));
      state.skirt = pick(SKIRTS);
      state.pants = pick(PANTS);
    }
    state.shoes = pick(SHOES);
    state.bag = pick(BAGS);
    state.accessory = pick(ACCESSORIES);
    state.glasses = pick(GLASSES);
    state.earrings = pick(EARRINGS);
    state.necklace = pick(NECKLACES);
    state.background = pick(BACKGROUNDS);
    renderAll();
    renderPanel();
    showToast("惊喜造型完成～");
  }

  function resetLook() {
    pushHistory();
    Object.assign(state, {
      skin: "peach",
      blush: "none",
      eyeshadow: "none",
      eyecolor: "brown",
      eyeliner: "none",
      lashes: "none",
      lips: "natural",
      nails: "none",
      hairstyle: "bob",
      haircolor: "brown",
      dress: "none",
      top: "blousePink",
      skirt: "pleat",
      pants: "none",
      shoes: "ballet",
      bag: "none",
      accessory: "none",
      glasses: "none",
      earrings: "none",
      necklace: "none",
      background: "candy",
    });
    renderAll();
    renderPanel();
    showToast("已恢复清爽造型～");
  }

  function undo() {
    const prev = history.pop();
    if (!prev) {
      showToast("没有可撤销的操作啦～");
      return;
    }
    Object.assign(state, prev);
    renderAll();
    renderPanel();
    showToast("已撤销～");
  }

  function paintBackground(ctx, id) {
    const grads = {
      beach: ["#7ec8ff", "#c8ecff", "#ffe7b0", "#ffd18a"],
      starry: ["#2a2450", "#6b4f9a", "#ff9ec0"],
      garden: ["#9be7ff", "#c8f7c4", "#ffe7a8"],
      castle: ["#d7c4ff", "#ffd6ec", "#ffe8c8"],
      bakery: ["#ffd6e8", "#ffe8c4", "#ffc4d8"],
      classroom: ["#a8d8ff", "#e8f4ff", "#e8d4b8"],
      snow: ["#d8e8ff", "#f0f6ff", "#ffffff"],
      rainbow: ["#ffb3c6", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#bdb2ff"],
      stage: ["#2a1848", "#6a3a8a", "#ff8fb3"],
      candy: ["#b8e8ff", "#ffe6f2", "#ffe9c8"],
    };
    const colors = grads[id] || grads.candy;
    const g = ctx.createLinearGradient(0, 0, 0, 1160);
    colors.forEach((col, i) => g.addColorStop(i / (colors.length - 1), col));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 720, 1160);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function savePhoto() {
    const svg = $("#character");
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "720");
    clone.setAttribute("height", "1160");
    const svgStr = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 1160;
    const ctx = canvas.getContext("2d");
    paintBackground(ctx, state.background);
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" }));
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 720, 1160);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      roundRect(ctx, 280, 1080, 160, 40, 20);
      ctx.fill();
      ctx.fillStyle = "#ef4d72";
      ctx.font = "700 26px Fredoka, ZCOOL KuaiLe, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("小蜜糖", 360, 1108);
      const link = document.createElement("a");
      link.download = `小蜜糖-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
      showToast("照片已保存～");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast("保存失败，请再试～");
    };
    img.src = url;
  }

  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });
  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    activeTab = btn.dataset.tab;
    renderTabs();
    renderPanel();
  });
  panelEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".swatch");
    if (!btn) return;
    setValue(btn.dataset.key, btn.dataset.id);
  });
  $("#btnRandom").addEventListener("click", randomLook);
  $("#btnReset").addEventListener("click", resetLook);
  $("#btnUndo").addEventListener("click", undo);
  $("#btnSave").addEventListener("click", savePhoto);

  renderTabs();
  renderPanel();
  renderAll();

  window.MakeupGame = {
    toast: showToast,
    state,
    refreshWorldAvatars() {
      if (window.HoneyActors) window.HoneyActors.refreshAllGirls();
    },
  };
})();
