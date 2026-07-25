/**
 * 公主换装衣柜 · 体型与服装渲染
 * 分类：连衣裙 / 上衣 / 裙子 / 裤子 / 鞋子 / 包包
 */
window.PrincessWardrobe = (() => {
  const DRESSES = [
    { id: "none", label: "不穿裙装", style: "none", color: "#ddd", accent: "#eee" },
    { id: "roseBall", label: "玫瑰舞会", style: "ball", color: "#FF6B8A", accent: "#FFE0EC", detail: "#FFC94A" },
    { id: "crystal", label: "水晶公主", style: "ball", color: "#B8D4FF", accent: "#F0F6FF", detail: "#E8F0FF" },
    { id: "mintGown", label: "薄荷长裙", style: "ball", color: "#5ED4B8", accent: "#D8FFF4", detail: "#FFC94A" },
    { id: "lavenderGown", label: "香芋长裙", style: "ball", color: "#B89BE8", accent: "#EDE0FF", detail: "#FFD0F0" },
    { id: "goldGown", label: "黄金礼服", style: "ball", color: "#F0C050", accent: "#FFF3C4", detail: "#FFF8E0" },
    { id: "sakura", label: "樱花公主", style: "princess", color: "#FF9EC0", accent: "#FFE8F2", detail: "#FF6B8A" },
    { id: "fairyDress", label: "精灵纱裙", style: "fairy", color: "#E0C8FF", accent: "#FFFFFF", detail: "#C9A7FF" },
    { id: "teaDress", label: "午后茶会", style: "lolita", color: "#FFB0C8", accent: "#FFF5F8", detail: "#7EC8FF" },
    { id: "ribbonDress", label: "蝴蝶结裙", style: "lolita", color: "#FF8FB3", accent: "#FFE0EC", detail: "#FFC94A" },
    { id: "snowDress", label: "雪国公主", style: "princess", color: "#E8F0FF", accent: "#FFFFFF", detail: "#B8D0FF" },
    { id: "sunset", label: "晚霞礼服", style: "ball", color: "#FF8F6B", accent: "#FFE0D0", detail: "#FFC94A" },
  ];

  const TOPS = [
    { id: "none", label: "无上衣", style: "none", color: "#ddd", accent: "#eee" },
    { id: "blousePink", label: "粉荷叶衫", style: "blouse", color: "#FFB0C8", accent: "#FFF5F8", detail: "#FF8FB3" },
    { id: "blouseWhite", label: "白蕾丝衫", style: "blouse", color: "#FFFFFF", accent: "#FFE8F2", detail: "#FFB0C8" },
    { id: "sailor", label: "水手上衣", style: "sailor", color: "#FFFFFF", accent: "#5B8CFF", detail: "#FF6B8A" },
    { id: "cardigan", label: "开衫毛衣", style: "cardigan", color: "#FFB8D0", accent: "#FFF0F5", detail: "#E8A0B8" },
    { id: "offShoulder", label: "一字肩", style: "off", color: "#C9B6FF", accent: "#F5F0FF", detail: "#FFC94A" },
    { id: "hoodie", label: "云朵卫衣", style: "hoodie", color: "#8ED7FF", accent: "#FFFFFF", detail: "#FFE08A" },
    { id: "vest", label: "学院马甲", style: "vest", color: "#5A7AB0", accent: "#FFFFFF", detail: "#FF6B8A" },
    { id: "camisole", label: "吊带衫", style: "cami", color: "#FFD0E0", accent: "#FFFFFF", detail: "#FF8FB3" },
    { id: "puff", label: "泡泡袖", style: "puff", color: "#FFE08A", accent: "#FFF8E0", detail: "#FF8FB3" },
  ];

  const SKIRTS = [
    { id: "none", label: "无裙子", style: "none", color: "#ddd", accent: "#eee" },
    { id: "tutu", label: "芭蕾蓬蓬", style: "tutu", color: "#FFB0D0", accent: "#FFFFFF", detail: "#FF8FB3" },
    { id: "pleat", label: "百褶短裙", style: "pleat", color: "#FF8FB3", accent: "#FFE0EC", detail: "#FFFFFF" },
    { id: "longA", label: "A字长裙", style: "long", color: "#B89BE8", accent: "#EDE0FF", detail: "#FFC94A" },
    { id: "mermaid", label: "鱼尾裙", style: "mermaid", color: "#5EB8D4", accent: "#D8F4FF", detail: "#FFC94A" },
    { id: "tiered", label: "层层纱裙", style: "tiered", color: "#FF9EC0", accent: "#FFE8F2", detail: "#FFFFFF" },
    { id: "denim", label: "牛仔短裙", style: "denim", color: "#6B9AD8", accent: "#A8C8F0", detail: "#FFC94A" },
    { id: "ribbonSkirt", label: "绑带裙", style: "ribbon", color: "#FF6B8A", accent: "#FFE0EC", detail: "#FFC94A" },
    { id: "lace", label: "蕾丝半裙", style: "lace", color: "#FFF5F8", accent: "#FFE0EC", detail: "#FFB0C8" },
    { id: "check", label: "格纹裙", style: "check", color: "#E87898", accent: "#FFF0F4", detail: "#5A7AB0" },
  ];

  const PANTS = [
    { id: "none", label: "无裤子", style: "none", color: "#ddd", accent: "#eee" },
    { id: "leggings", label: "打底裤", style: "legging", color: "#4A3040", accent: "#6A5060", detail: "#FF8FB3" },
    { id: "shorts", label: "花边短裤", style: "shorts", color: "#FFB0C8", accent: "#FFF5F8", detail: "#FF8FB3" },
    { id: "culottes", label: "阔腿裤", style: "wide", color: "#B89BE8", accent: "#EDE0FF", detail: "#FFC94A" },
    { id: "jeans", label: "牛仔裤", style: "jean", color: "#5B8CFF", accent: "#8EB0FF", detail: "#FFC94A" },
    { id: "capri", label: "七分裤", style: "capri", color: "#7BCFB3", accent: "#D8FFF4", detail: "#FFFFFF" },
    { id: "skirtPants", label: "裙裤", style: "skort", color: "#FF8FB3", accent: "#FFE0EC", detail: "#FFFFFF" },
    { id: "puffy", label: "灯笼裤", style: "puffy", color: "#E0C8FF", accent: "#F5F0FF", detail: "#FFC94A" },
  ];

  const SHOES = [
    { id: "glass", label: "水晶鞋", style: "heel", color: "#E8F4FF", accent: "#B8D0FF" },
    { id: "pumps", label: "公主高跟", style: "heel", color: "#FF6B8A", accent: "#FFB0C8" },
    { id: "ballet", label: "芭蕾舞鞋", style: "ballet", color: "#FFB0D0", accent: "#FFFFFF" },
    { id: "maryjane", label: "小皮鞋", style: "mary", color: "#4A3040", accent: "#FF8FB3" },
    { id: "boots", label: "长筒靴", style: "boot", color: "#8B5A3C", accent: "#C88962" },
    { id: "sneakers", label: "板鞋", style: "sneaker", color: "#FFFFFF", accent: "#7EC8FF" },
    { id: "sandals", label: "珍珠凉鞋", style: "sandal", color: "#FFD166", accent: "#FFFFFF" },
    { id: "loafers", label: "乐福鞋", style: "loafer", color: "#C89878", accent: "#FFE08A" },
    { id: "rain", label: "蝴蝶雨靴", style: "rain", color: "#3ECFAD", accent: "#FF8FB3" },
    { id: "slippers", label: "毛绒拖鞋", style: "slipper", color: "#C9B6FF", accent: "#FFE0F0" },
  ];

  const BAGS = [
    { id: "none", label: "不背包", style: "none", color: "#ddd", accent: "#eee" },
    { id: "pearl", label: "珍珠手包", style: "clutch", color: "#FFF5F8", accent: "#FFB0C8", side: "front" },
    { id: "heart", label: "爱心包", style: "heart", color: "#FF6B8A", accent: "#FFC94A", side: "front" },
    { id: "basket", label: "花篮包", style: "basket", color: "#E8C898", accent: "#FF8FB3", side: "front" },
    { id: "ribbon", label: "缎带包", style: "ribbon", color: "#B89BE8", accent: "#FFC94A", side: "front" },
    { id: "backpack", label: "小双肩", style: "backpack", color: "#7EC8FF", accent: "#FFE08A", side: "back" },
    { id: "tote", label: "托特包", style: "tote", color: "#FFB0C8", accent: "#FFFFFF", side: "front" },
    { id: "cross", label: "斜挎包", style: "cross", color: "#FF8F6B", accent: "#FFC94A", side: "front" },
    { id: "star", label: "星星包", style: "star", color: "#FFC94A", accent: "#FFFFFF", side: "front" },
    { id: "crownBag", label: "皇冠包", style: "crown", color: "#F0C050", accent: "#FF6B8A", side: "front" },
  ];

  function skin(state, skins) {
    return (skins.find((x) => x.id === state.skin) || skins[0]).color;
  }

  function renderLegs(state, skins) {
    const c = skin(state, skins);
    const g = document.getElementById("legs");
    // 分左右腿组，世界场景走路时可摆动
    g.innerHTML = `
      <g class="walk-leg walk-leg-l">
        <path d="M148 392
          C142 420 140 450 144 478
          C146 498 148 515 152 528
          L168 528
          C172 512 174 492 172 472
          C170 448 168 420 172 392 Z" fill="${c}"/>
        <ellipse cx="158" cy="455" rx="7" ry="5" fill="#fff" opacity="0.18"/>
        <ellipse cx="160" cy="526" rx="9" ry="5" fill="${c}"/>
        <path d="M148 392 C142 420 140 450 144 478 C146 498 148 515 152 528 L168 528 C172 512 174 492 172 472 C170 448 168 420 172 392 Z" fill="url(#legShade)" opacity="0.35"/>
      </g>
      <g class="walk-leg walk-leg-r">
        <path d="M212 392
          C218 420 220 450 216 478
          C214 498 212 515 208 528
          L192 528
          C188 512 186 492 188 472
          C190 448 192 420 188 392 Z" fill="${c}"/>
        <ellipse cx="202" cy="455" rx="7" ry="5" fill="#fff" opacity="0.18"/>
        <ellipse cx="200" cy="526" rx="9" ry="5" fill="${c}"/>
        <path d="M212 392 C218 420 220 450 216 478 C214 498 212 515 208 528 L192 528 C188 512 186 492 188 472 C190 448 192 420 188 392 Z" fill="url(#legShade)" opacity="0.35"/>
      </g>
    `;
  }

  function renderArms(state, skins) {
    const c = skin(state, skins);
    const shade = "rgba(0,0,0,0.08)";
    const g = document.getElementById("arms");
    // 与身体成比例的公主手臂：上臂粗、前臂略细，有肩与肘
    g.innerHTML = `
      <!-- 左肩衔接 -->
      <ellipse cx="132" cy="318" rx="16" ry="12" fill="${c}"/>
      <!-- 左上臂 -->
      <path d="M120 312
        C108 340 102 368 100 395
        C112 398 124 396 128 390
        C130 362 134 338 142 318 Z" fill="${c}"/>
      <!-- 左前臂 -->
      <path d="M100 392
        C92 420 86 445 82 468
        C94 472 106 468 108 458
        C110 435 112 412 116 395 Z" fill="${c}"/>
      <ellipse cx="104" cy="392" rx="11" ry="9" fill="${c}"/>
      <path d="M120 312 C108 340 102 368 100 395 C112 398 124 396 128 390 C130 362 134 338 142 318 Z" fill="${shade}"/>

      <!-- 右肩衔接 -->
      <ellipse cx="228" cy="318" rx="16" ry="12" fill="${c}"/>
      <!-- 右上臂 -->
      <path d="M240 312
        C252 340 258 368 260 395
        C248 398 236 396 232 390
        C230 362 226 338 218 318 Z" fill="${c}"/>
      <!-- 右前臂 -->
      <path d="M260 392
        C268 420 274 445 278 468
        C266 472 254 468 252 458
        C250 435 248 412 244 395 Z" fill="${c}"/>
      <ellipse cx="256" cy="392" rx="11" ry="9" fill="${c}"/>
      <path d="M240 312 C252 340 258 368 260 395 C248 398 236 396 232 390 C230 362 226 338 218 318 Z" fill="${shade}"/>
    `;

    const hl = document.getElementById("handL");
    const hr = document.getElementById("handR");
    // 人手：手掌 + 四指 + 拇指
    hl.innerHTML = `
      <g transform="translate(78 472) rotate(-18)">
        <ellipse cx="0" cy="4" rx="11" ry="13" fill="${c}"/>
        <ellipse cx="-10" cy="-2" rx="4" ry="7" fill="${c}" transform="rotate(-40)"/>
        <ellipse cx="-6" cy="-10" rx="3.2" ry="7" fill="${c}"/>
        <ellipse cx="-1" cy="-11" rx="3.2" ry="7.5" fill="${c}"/>
        <ellipse cx="4" cy="-10" rx="3.2" ry="7" fill="${c}"/>
        <ellipse cx="8" cy="-7" rx="3" ry="6" fill="${c}"/>
      </g>
    `;
    hr.innerHTML = `
      <g transform="translate(282 472) rotate(18)">
        <ellipse cx="0" cy="4" rx="11" ry="13" fill="${c}"/>
        <ellipse cx="10" cy="-2" rx="4" ry="7" fill="${c}" transform="rotate(40)"/>
        <ellipse cx="6" cy="-10" rx="3.2" ry="7" fill="${c}"/>
        <ellipse cx="1" cy="-11" rx="3.2" ry="7.5" fill="${c}"/>
        <ellipse cx="-4" cy="-10" rx="3.2" ry="7" fill="${c}"/>
        <ellipse cx="-8" cy="-7" rx="3" ry="6" fill="${c}"/>
      </g>
    `;
  }

  function sparkles(x, y, n = 3) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const dx = x + (i - 1) * 18;
      const dy = y + (i % 2) * 10;
      s += `<circle cx="${dx}" cy="${dy}" r="1.8" fill="#fff" opacity="0.85"/>`;
    }
    return s;
  }

  function renderDress(item) {
    const g = document.getElementById("dress");
    const sleeves = document.getElementById("sleeves");
    if (!item || item.id === "none") {
      g.innerHTML = "";
      return false;
    }
    const { color: c, accent: a, detail: d, style } = item;

    if (style === "ball") {
      g.innerHTML = `
        <path d="M135 312 Q180 338 225 312 L245 360 Q180 375 115 360 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M115 358 Q180 380 245 358 L275 490 Q180 515 85 490 Z" fill="${c}"/>
        <path d="M115 358 Q180 380 245 358 L260 450 Q180 475 100 450 Z" fill="${a}" opacity="0.55"/>
        <path d="M135 312 Q180 338 225 312 L230 345 Q180 358 130 345 Z" fill="${a}" opacity="0.85"/>
        <path d="M150 320 Q180 342 210 320" fill="none" stroke="${d}" stroke-width="3"/>
        <circle cx="180" cy="328" r="5" fill="${d}"/>
        <path d="M100 340 Q85 370 95 400" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round"/>
        <path d="M260 340 Q275 370 265 400" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round"/>
        <ellipse cx="120" cy="480" rx="6" ry="3" fill="${d}" opacity="0.7"/>
        <ellipse cx="180" cy="485" rx="7" ry="3" fill="${a}" opacity="0.8"/>
        <ellipse cx="240" cy="480" rx="6" ry="3" fill="${d}" opacity="0.7"/>
        ${sparkles(160, 430, 4)}
        <path d="M115 358 Q180 380 245 358 L275 490 Q180 515 85 490 Z" fill="url(#silkShine)"/>
      `;
      sleeves.innerHTML = `
        <ellipse cx="100" cy="355" rx="18" ry="14" fill="${a}" opacity="0.9"/>
        <ellipse cx="260" cy="355" rx="18" ry="14" fill="${a}" opacity="0.9"/>
      `;
    } else if (style === "fairy") {
      g.innerHTML = `
        <path d="M70 300 Q40 360 85 420 Q120 370 115 320 Z" fill="${a}" opacity="0.45"/>
        <path d="M290 300 Q320 360 275 420 Q240 370 245 320 Z" fill="${a}" opacity="0.45"/>
        <path d="M138 312 Q180 336 222 312 L235 380 Q180 420 125 380 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M125 375 Q180 410 235 375 L250 480 Q180 505 110 480 Z" fill="${c}" opacity="0.85"/>
        <path d="M125 375 Q180 410 235 375 L245 440 Q180 470 115 440 Z" fill="${a}" opacity="0.5"/>
        ${sparkles(150, 400, 5)}
        <circle cx="180" cy="330" r="4" fill="${d}"/>
      `;
      sleeves.innerHTML = `
        <path d="M128 320 Q110 345 100 375" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
        <path d="M232 320 Q250 345 260 375" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
      `;
    } else if (style === "lolita") {
      g.innerHTML = `
        <path d="M140 312 Q180 336 220 312 L228 355 Q180 368 132 355 Z" fill="${a}" filter="url(#softShadow)"/>
        <path d="M132 352 Q180 372 228 352 L250 465 Q180 490 110 465 Z" fill="${c}"/>
        <path d="M132 352 Q180 372 228 352 L240 400 Q180 420 120 400 Z" fill="${a}" opacity="0.65"/>
        <path d="M145 318 Q180 340 215 318" fill="none" stroke="${d}" stroke-width="4"/>
        <circle cx="180" cy="328" r="6" fill="${d}"/>
        <path d="M160 328 Q180 350 200 328" fill="${c}" opacity="0.5"/>
        <path d="M110 430 Q180 455 250 430" fill="none" stroke="${a}" stroke-width="8" opacity="0.8"/>
        <path d="M105 340 Q90 365 95 395" fill="none" stroke="${a}" stroke-width="16" stroke-linecap="round"/>
        <path d="M255 340 Q270 365 265 395" fill="none" stroke="${a}" stroke-width="16" stroke-linecap="round"/>
      `;
      sleeves.innerHTML = `
        <circle cx="98" cy="355" r="16" fill="${a}"/>
        <circle cx="262" cy="355" r="16" fill="${a}"/>
        <circle cx="98" cy="355" r="8" fill="${c}" opacity="0.35"/>
        <circle cx="262" cy="355" r="8" fill="${c}" opacity="0.35"/>
      `;
    } else {
      // princess classic
      g.innerHTML = `
        <path d="M138 312 Q180 338 222 312 L235 365 Q180 380 125 365 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M125 362 Q180 385 235 362 L265 485 Q180 510 95 485 Z" fill="${c}"/>
        <path d="M140 318 Q180 342 220 318 L218 350 Q180 362 142 350 Z" fill="${a}" opacity="0.9"/>
        <path d="M125 362 Q180 385 235 362 L250 440 Q180 465 110 440 Z" fill="${a}" opacity="0.4"/>
        <circle cx="180" cy="330" r="5" fill="${d}"/>
        <path d="M155 325 Q180 345 205 325" fill="none" stroke="${d}" stroke-width="2" opacity="0.7"/>
        <path d="M108 338 Q92 370 100 405" fill="none" stroke="${c}" stroke-width="17" stroke-linecap="round"/>
        <path d="M252 338 Q268 370 260 405" fill="none" stroke="${c}" stroke-width="17" stroke-linecap="round"/>
        ${sparkles(170, 450, 3)}
      `;
      sleeves.innerHTML = `
        <ellipse cx="102" cy="360" rx="15" ry="12" fill="${a}"/>
        <ellipse cx="258" cy="360" rx="15" ry="12" fill="${a}"/>
      `;
    }
    return true;
  }

  function renderTop(item) {
    const g = document.getElementById("top");
    const sleeves = document.getElementById("sleeves");
    if (!item || item.id === "none") {
      g.innerHTML = "";
      return;
    }
    const { color: c, accent: a, detail: d, style } = item;

    if (style === "blouse") {
      g.innerHTML = `
        <path d="M132 312 Q180 340 228 312 L240 390 Q180 410 120 390 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M145 315 Q180 338 215 315 L212 350 Q180 362 148 350 Z" fill="${a}" opacity="0.85"/>
        <path d="M150 320 Q180 342 210 320" fill="none" stroke="${d}" stroke-width="2"/>
        <circle cx="180" cy="335" r="4" fill="${d}"/>
        <path d="M132 312 Q120 330 125 355" fill="${a}" opacity="0.7"/>
        <path d="M228 312 Q240 330 235 355" fill="${a}" opacity="0.7"/>
      `;
      sleeves.innerHTML = `
        <ellipse cx="118" cy="345" rx="20" ry="14" fill="${a}"/>
        <ellipse cx="242" cy="345" rx="20" ry="14" fill="${a}"/>
        <path d="M105 350 Q95 380 92 410" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>
        <path d="M255 350 Q265 380 268 410" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>
      `;
    } else if (style === "sailor") {
      g.innerHTML = `
        <path d="M132 312 Q180 338 228 312 L238 395 Q180 415 122 395 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M132 312 L180 348 L228 312 L215 335 L180 358 L145 335 Z" fill="${a}"/>
        <rect x="155" y="365" width="50" height="10" rx="3" fill="${a}"/>
        <circle cx="180" cy="370" r="4" fill="${d}"/>
      `;
      sleeves.innerHTML = `
        <path d="M128 325 Q105 355 98 395" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/>
        <path d="M232 325 Q255 355 262 395" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/>
        <rect x="90" y="388" width="20" height="8" rx="2" fill="${a}"/>
        <rect x="250" y="388" width="20" height="8" rx="2" fill="${a}"/>
      `;
    } else if (style === "cardigan") {
      g.innerHTML = `
        <path d="M130 312 Q180 340 230 312 L242 400 Q180 420 118 400 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M180 320 L180 405" stroke="${a}" stroke-width="4"/>
        <circle cx="170" cy="345" r="3.5" fill="${d}"/><circle cx="170" cy="365" r="3.5" fill="${d}"/><circle cx="170" cy="385" r="3.5" fill="${d}"/>
        <path d="M145 318 Q180 342 215 318 L210 355 Q180 368 150 355 Z" fill="${a}" opacity="0.5"/>
      `;
      sleeves.innerHTML = `
        <path d="M128 320 Q100 360 95 420" fill="none" stroke="${c}" stroke-width="17" stroke-linecap="round"/>
        <path d="M232 320 Q260 360 265 420" fill="none" stroke="${c}" stroke-width="17" stroke-linecap="round"/>
      `;
    } else if (style === "off") {
      g.innerHTML = `
        <path d="M125 325 Q180 348 235 325 L242 395 Q180 415 118 395 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M120 322 Q180 312 240 322" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="180" cy="340" r="4" fill="${d}"/>
      `;
      sleeves.innerHTML = `
        <path d="M125 330 Q108 350 100 380" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
        <path d="M235 330 Q252 350 260 380" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
      `;
    } else if (style === "hoodie") {
      g.innerHTML = `
        <path d="M130 312 Q180 340 230 312 L245 405 Q180 430 115 405 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M148 318 Q180 345 212 318 L208 370 Q180 385 152 370 Z" fill="${a}" opacity="0.95"/>
        <ellipse cx="180" cy="308" rx="38" ry="16" fill="${c}" opacity="0.9"/>
        <circle cx="180" cy="350" r="4" fill="${d}"/>
      `;
      sleeves.innerHTML = `
        <path d="M128 325 Q95 370 90 430" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round"/>
        <path d="M232 325 Q265 370 270 430" fill="none" stroke="${c}" stroke-width="18" stroke-linecap="round"/>
      `;
    } else if (style === "vest") {
      g.innerHTML = `
        <path d="M140 312 Q180 338 220 312 L230 400 Q180 418 130 400 Z" fill="${a}" filter="url(#softShadow)"/>
        <path d="M145 318 L155 400 L205 400 L215 318 L180 345 Z" fill="${c}"/>
        <path d="M155 318 L180 348 L205 318" fill="none" stroke="${d}" stroke-width="3"/>
      `;
      sleeves.innerHTML = `
        <path d="M132 320 Q110 355 102 400" fill="none" stroke="${a}" stroke-width="12" stroke-linecap="round"/>
        <path d="M228 320 Q250 355 258 400" fill="none" stroke="${a}" stroke-width="12" stroke-linecap="round"/>
      `;
    } else if (style === "cami") {
      g.innerHTML = `
        <path d="M145 325 Q180 348 215 325 L225 395 Q180 412 135 395 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M150 318 L158 340 M210 318 L202 340" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
        <path d="M155 330 Q180 348 205 330" fill="none" stroke="${a}" stroke-width="3"/>
      `;
      sleeves.innerHTML = "";
    } else if (style === "puff") {
      g.innerHTML = `
        <path d="M135 312 Q180 340 225 312 L235 390 Q180 410 125 390 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M148 318 Q180 340 212 318 L208 350 Q180 362 152 350 Z" fill="${a}" opacity="0.8"/>
        <circle cx="180" cy="332" r="4" fill="${d}"/>
      `;
      sleeves.innerHTML = `
        <circle cx="112" cy="340" r="22" fill="${a}"/>
        <circle cx="248" cy="340" r="22" fill="${a}"/>
        <path d="M112 355 Q100 385 95 415" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>
        <path d="M248 355 Q260 385 265 415" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>
      `;
    }
  }

  function renderSkirt(item) {
    const g = document.getElementById("skirt");
    if (!item || item.id === "none") {
      g.innerHTML = "";
      return;
    }
    const { color: c, accent: a, detail: d, style } = item;

    if (style === "tutu") {
      g.innerHTML = `
        <ellipse cx="180" cy="420" rx="95" ry="50" fill="${c}" opacity="0.9" filter="url(#softShadow)"/>
        <ellipse cx="180" cy="415" rx="72" ry="38" fill="${a}" opacity="0.75"/>
        <ellipse cx="180" cy="410" rx="48" ry="26" fill="${c}"/>
        <path d="M145 395 Q180 410 215 395" fill="${d}" opacity="0.35"/>
      `;
    } else if (style === "pleat") {
      g.innerHTML = `
        <path d="M140 395 L220 395 L245 470 Q180 490 115 470 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M155 395 L150 470 M170 395 L168 475 M190 395 L192 475 M205 395 L210 470" stroke="${a}" stroke-width="3" opacity="0.7"/>
        <path d="M140 395 H220" stroke="${d}" stroke-width="4"/>
      `;
    } else if (style === "long") {
      g.innerHTML = `
        <path d="M142 395 L218 395 L250 490 Q180 512 110 490 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M142 395 L218 395 L240 470 Q180 490 120 470 Z" fill="${a}" opacity="0.45"/>
        <circle cx="180" cy="400" r="4" fill="${d}"/>
      `;
    } else if (style === "mermaid") {
      g.innerHTML = `
        <path d="M148 395 L212 395 L220 470 Q180 485 140 470 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M140 468 Q180 490 220 468 L245 500 Q180 520 115 500 Z" fill="${c}"/>
        <path d="M140 468 Q180 490 220 468 L235 515 Q180 530 125 515 Z" fill="${a}" opacity="0.5"/>
        ${sparkles(170, 500, 3)}
      `;
    } else if (style === "tiered") {
      g.innerHTML = `
        <path d="M145 395 L215 395 L230 430 Q180 442 130 430 Z" fill="${c}"/>
        <path d="M130 428 L230 428 L250 470 Q180 490 110 470 Z" fill="${a}"/>
        <path d="M110 468 L250 468 L255 490 Q180 512 105 490 Z" fill="${c}" opacity="0.95" filter="url(#softShadow)"/>
        <path d="M145 395 H215" stroke="${d}" stroke-width="3"/>
      `;
    } else if (style === "denim") {
      g.innerHTML = `
        <path d="M142 395 L218 395 L240 465 Q180 482 120 465 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M160 410 L155 450 M200 410 L205 450" stroke="${a}" stroke-width="2" opacity="0.6"/>
        <circle cx="155" cy="405" r="3" fill="${d}"/><circle cx="205" cy="405" r="3" fill="${d}"/>
      `;
    } else if (style === "ribbon") {
      g.innerHTML = `
        <path d="M140 395 L220 395 L250 480 Q180 505 110 480 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M170 395 Q180 430 190 395" fill="${d}"/>
        <path d="M165 420 Q150 455 170 450" fill="${a}"/><path d="M195 420 Q210 455 190 450" fill="${a}"/>
      `;
    } else if (style === "lace") {
      g.innerHTML = `
        <path d="M140 395 L220 395 L245 475 Q180 495 115 475 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M145 410 Q180 425 215 410" fill="none" stroke="${d}" stroke-width="2" opacity="0.7"/>
        <path d="M135 440 Q180 460 225 440" fill="none" stroke="${d}" stroke-width="2" opacity="0.6"/>
        <path d="M125 465 Q180 485 235 465" fill="none" stroke="${a}" stroke-width="3"/>
      `;
    } else if (style === "check") {
      g.innerHTML = `
        <path d="M140 395 L220 395 L242 468 Q180 485 118 468 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M155 395 V468 M175 395 V475 M195 395 V475 M215 395 V468" stroke="${d}" stroke-width="2" opacity="0.35"/>
        <path d="M140 420 H230 M140 445 H235" stroke="${a}" stroke-width="2" opacity="0.5"/>
      `;
    }
  }

  function renderPants(item) {
    const g = document.getElementById("pants");
    if (!item || item.id === "none") {
      g.innerHTML = "";
      return;
    }
    const { color: c, accent: a, detail: d, style } = item;

    if (style === "legging") {
      g.innerHTML = `
        <path d="M150 395 Q146 455 148 515 L170 515 Q172 455 170 395 Z" fill="${c}"/>
        <path d="M210 395 Q214 455 212 515 L190 515 Q188 455 190 395 Z" fill="${c}"/>
        <path d="M150 395 H210" fill="${a}" opacity="0.3"/>
      `;
    } else if (style === "shorts") {
      g.innerHTML = `
        <path d="M145 395 L215 395 L225 455 Q180 465 135 455 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M145 448 Q180 458 215 448" fill="none" stroke="${a}" stroke-width="4"/>
        <circle cx="180" cy="405" r="3" fill="${d}"/>
      `;
    } else if (style === "wide") {
      g.innerHTML = `
        <path d="M148 395 L175 395 L185 520 L115 525 Q130 450 148 395 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M185 395 L212 395 L245 525 L175 520 Q190 450 185 395 Z" fill="${c}"/>
        <path d="M148 395 H212" stroke="${d}" stroke-width="3"/>
      `;
    } else if (style === "jean") {
      g.innerHTML = `
        <path d="M150 395 L175 395 L180 520 L152 522 Q148 455 150 395 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M185 395 L210 395 L208 522 L180 520 Q188 455 185 395 Z" fill="${c}"/>
        <path d="M158 430 L162 480 M202 430 L198 480" stroke="${a}" stroke-width="1.5" opacity="0.5"/>
        <circle cx="170" cy="405" r="2.5" fill="${d}"/><circle cx="190" cy="405" r="2.5" fill="${d}"/>
      `;
    } else if (style === "capri") {
      g.innerHTML = `
        <path d="M150 395 L175 395 L178 490 L155 492 Q150 440 150 395 Z" fill="${c}"/>
        <path d="M185 395 L210 395 L205 492 L182 490 Q188 440 185 395 Z" fill="${c}"/>
        <path d="M155 485 H178 M182 485 H205" stroke="${a}" stroke-width="4"/>
      `;
    } else if (style === "skort") {
      g.innerHTML = `
        <path d="M145 395 L215 395 L235 460 Q180 478 125 460 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M155 395 L170 455 M190 395 L205 455" stroke="${a}" stroke-width="2" opacity="0.5"/>
        <path d="M145 395 H215" stroke="${d}" stroke-width="3"/>
      `;
    } else if (style === "puffy") {
      g.innerHTML = `
        <path d="M148 395 L175 395 Q195 450 190 510 L145 512 Q130 450 148 395 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M185 395 L212 395 Q230 450 215 512 L170 510 Q165 450 185 395 Z" fill="${c}"/>
        <ellipse cx="165" cy="460" rx="22" ry="28" fill="${a}" opacity="0.25"/>
        <ellipse cx="195" cy="460" rx="22" ry="28" fill="${a}" opacity="0.25"/>
      `;
    }
  }

  function renderShoes(item) {
    const g = document.getElementById("shoes");
    if (!item) {
      g.innerHTML = "";
      return;
    }
    const { color: c, accent: a, style } = item;

    // 鞋子画在脚踝位置，裙摆之下必须清晰可见
    if (style === "heel") {
      g.innerHTML = `
        <ellipse cx="160" cy="540" rx="26" ry="11" fill="${c}" filter="url(#softShadow)"/>
        <rect x="172" y="540" width="5" height="16" rx="1.5" fill="${c}"/>
        <ellipse cx="200" cy="540" rx="26" ry="11" fill="${c}"/>
        <rect x="183" y="540" width="5" height="16" rx="1.5" fill="${c}"/>
        <ellipse cx="152" cy="534" rx="8" ry="4" fill="${a}" opacity="0.8"/>
        <ellipse cx="208" cy="534" rx="8" ry="4" fill="${a}" opacity="0.8"/>
      `;
    } else if (style === "ballet") {
      g.innerHTML = `
        <ellipse cx="160" cy="540" rx="24" ry="10" fill="${c}" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="540" rx="24" ry="10" fill="${c}"/>
        <path d="M146 528 Q160 538 174 528" fill="none" stroke="${a}" stroke-width="2.5"/>
        <path d="M186 528 Q200 538 214 528" fill="none" stroke="${a}" stroke-width="2.5"/>
        <path d="M160 532 Q160 512 150 500" fill="none" stroke="${c}" stroke-width="2.2" opacity="0.65"/>
        <path d="M200 532 Q200 512 210 500" fill="none" stroke="${c}" stroke-width="2.2" opacity="0.65"/>
      `;
    } else if (style === "mary") {
      g.innerHTML = `
        <ellipse cx="160" cy="540" rx="24" ry="11" fill="${c}" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="540" rx="24" ry="11" fill="${c}"/>
        <path d="M145 528 H175 M185 528 H215" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="160" cy="528" r="3.5" fill="${a}"/>
        <circle cx="200" cy="528" r="3.5" fill="${a}"/>
      `;
    } else if (style === "boot") {
      g.innerHTML = `
        <path d="M145 478 L140 548 L178 548 L174 478 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M186 478 L182 548 L220 548 L214 478 Z" fill="${c}"/>
        <path d="M145 510 H174 M186 510 H214" stroke="${a}" stroke-width="2.5" opacity="0.55"/>
      `;
    } else if (style === "sneaker") {
      g.innerHTML = `
        <ellipse cx="160" cy="542" rx="28" ry="12" fill="${c}" stroke="${a}" stroke-width="3.5" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="542" rx="28" ry="12" fill="${c}" stroke="${a}" stroke-width="3.5"/>
        <ellipse cx="148" cy="538" rx="10" ry="6" fill="${a}" opacity="0.55"/>
        <ellipse cx="212" cy="538" rx="10" ry="6" fill="${a}" opacity="0.55"/>
      `;
    } else if (style === "sandal") {
      g.innerHTML = `
        <ellipse cx="160" cy="544" rx="22" ry="8" fill="${c}" opacity="0.9" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="544" rx="22" ry="8" fill="${c}" opacity="0.9"/>
        <path d="M148 528 Q160 540 172 528" fill="none" stroke="${c}" stroke-width="3.5"/>
        <path d="M188 528 Q200 540 212 528" fill="none" stroke="${c}" stroke-width="3.5"/>
        <circle cx="160" cy="532" r="3" fill="${a}"/><circle cx="200" cy="532" r="3" fill="${a}"/>
      `;
    } else if (style === "loafer") {
      g.innerHTML = `
        <ellipse cx="160" cy="542" rx="26" ry="11" fill="${c}" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="542" rx="26" ry="11" fill="${c}"/>
        <ellipse cx="160" cy="534" rx="10" ry="5" fill="${a}"/>
        <ellipse cx="200" cy="534" rx="10" ry="5" fill="${a}"/>
      `;
    } else if (style === "rain") {
      g.innerHTML = `
        <path d="M144 488 Q138 548 162 552 Q182 548 176 488 Z" fill="${c}" filter="url(#softShadow)"/>
        <path d="M184 488 Q180 548 204 552 Q224 548 216 488 Z" fill="${c}"/>
        <circle cx="160" cy="508" r="5" fill="${a}"/><circle cx="200" cy="508" r="5" fill="${a}"/>
      `;
    } else if (style === "slipper") {
      g.innerHTML = `
        <ellipse cx="160" cy="540" rx="24" ry="12" fill="${c}" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="540" rx="24" ry="12" fill="${c}"/>
        <ellipse cx="160" cy="532" rx="14" ry="7" fill="${a}" opacity="0.75"/>
        <ellipse cx="200" cy="532" rx="14" ry="7" fill="${a}" opacity="0.75"/>
      `;
    }
  }

  function renderBag(item) {
    const back = document.getElementById("bagBack");
    const front = document.getElementById("bagFront");
    back.innerHTML = "";
    front.innerHTML = "";
    if (!item || item.id === "none") return;

    const { color: c, accent: a, style, side } = item;
    const target = side === "back" ? back : front;

    if (style === "clutch") {
      target.innerHTML = `
        <g transform="translate(285 430)">
          <rect x="0" y="0" width="36" height="28" rx="6" fill="${c}" stroke="${a}" stroke-width="2" filter="url(#softShadow)"/>
          <circle cx="8" cy="10" r="2" fill="${a}"/><circle cx="16" cy="8" r="2" fill="${a}"/><circle cx="24" cy="10" r="2" fill="${a}"/>
          <rect x="12" y="-6" width="12" height="8" rx="3" fill="${a}"/>
        </g>
      `;
    } else if (style === "heart") {
      target.innerHTML = `
        <g transform="translate(280 420)">
          <path d="M10 20 C10 8 28 8 28 20 C28 8 46 8 46 20 C46 38 28 52 28 52 C28 52 10 38 10 20 Z" fill="${c}" filter="url(#softShadow)"/>
          <circle cx="28" cy="24" r="4" fill="${a}"/>
          <path d="M28 5 Q20 -10 28 0 Q36 -10 28 5" fill="${a}"/>
        </g>
      `;
    } else if (style === "basket") {
      target.innerHTML = `
        <g transform="translate(278 425)">
          <ellipse cx="24" cy="8" rx="20" ry="8" fill="none" stroke="${c}" stroke-width="3"/>
          <path d="M6 10 L10 40 Q24 48 38 40 L42 10" fill="${c}" filter="url(#softShadow)"/>
          <circle cx="16" cy="22" r="4" fill="${a}"/><circle cx="28" cy="20" r="4" fill="#FFC94A"/><circle cx="22" cy="30" r="3" fill="#7EC8FF"/>
        </g>
      `;
    } else if (style === "ribbon") {
      target.innerHTML = `
        <g transform="translate(282 425)">
          <rect x="4" y="8" width="40" height="32" rx="8" fill="${c}" filter="url(#softShadow)"/>
          <path d="M24 8 Q10 -5 24 4 Q38 -5 24 8 Z" fill="${a}"/>
          <circle cx="24" cy="6" r="4" fill="${a}"/>
          <rect x="18" y="20" width="12" height="8" rx="2" fill="${a}" opacity="0.6"/>
        </g>
      `;
    } else if (style === "backpack") {
      target.innerHTML = `
        <g transform="translate(210 300)">
          <rect x="0" y="10" width="50" height="55" rx="12" fill="${c}" filter="url(#softShadow)"/>
          <rect x="8" y="22" width="34" height="22" rx="6" fill="${a}" opacity="0.8"/>
          <path d="M8 10 Q25 -8 42 10" fill="none" stroke="${c}" stroke-width="5"/>
          <circle cx="25" cy="50" r="4" fill="${a}"/>
        </g>
      `;
    } else if (style === "tote") {
      target.innerHTML = `
        <g transform="translate(278 415)">
          <path d="M8 18 L4 55 Q24 62 44 55 L40 18 Z" fill="${c}" filter="url(#softShadow)"/>
          <path d="M12 18 Q12 0 24 0 Q36 0 36 18" fill="none" stroke="${a}" stroke-width="3"/>
          <circle cx="24" cy="35" r="5" fill="${a}" opacity="0.5"/>
        </g>
      `;
    } else if (style === "cross") {
      target.innerHTML = `
        <g transform="translate(250 380)">
          <path d="M40 20 Q70 80 20 140" fill="none" stroke="${a}" stroke-width="3"/>
          <rect x="55" y="70" width="38" height="30" rx="8" fill="${c}" filter="url(#softShadow)"/>
          <circle cx="74" cy="85" r="4" fill="${a}"/>
        </g>
      `;
    } else if (style === "star") {
      target.innerHTML = `
        <g transform="translate(278 420)">
          <polygon points="28,4 34,20 52,20 38,32 43,50 28,40 13,50 18,32 4,20 22,20" fill="${c}" filter="url(#softShadow)"/>
          <circle cx="28" cy="26" r="5" fill="${a}"/>
        </g>
      `;
    } else if (style === "crown") {
      target.innerHTML = `
        <g transform="translate(280 422)">
          <rect x="6" y="18" width="44" height="30" rx="8" fill="${c}" filter="url(#softShadow)"/>
          <path d="M10 18 L18 4 L26 16 L28 2 L30 16 L38 4 L46 18 Z" fill="${c}"/>
          <circle cx="18" cy="6" r="3" fill="${a}"/><circle cx="28" cy="4" r="3" fill="#7EC8FF"/><circle cx="38" cy="6" r="3" fill="${a}"/>
        </g>
      `;
    }
  }

  function clearSleevesIfNoClothes(hasDress, hasTop) {
    if (!hasDress && !hasTop) {
      document.getElementById("sleeves").innerHTML = "";
    }
  }

  function apply(state, skins) {
    renderLegs(state, skins);
    renderArms(state, skins);

    const dress = DRESSES.find((x) => x.id === state.dress) || DRESSES[0];
    const top = TOPS.find((x) => x.id === state.top) || TOPS[0];
    const skirt = SKIRTS.find((x) => x.id === state.skirt) || SKIRTS[0];
    const pants = PANTS.find((x) => x.id === state.pants) || PANTS[0];
    const shoes = SHOES.find((x) => x.id === state.shoes) || SHOES[0];
    const bag = BAGS.find((x) => x.id === state.bag) || BAGS[0];

    const wearingDress = renderDress(dress);

    if (wearingDress) {
      document.getElementById("top").innerHTML = "";
      document.getElementById("skirt").innerHTML = "";
      document.getElementById("pants").innerHTML = "";
    } else {
      renderTop(top);
      // 裙子与裤子可叠穿：裙子在上；若都有则都显示
      renderPants(pants);
      renderSkirt(skirt);
      clearSleevesIfNoClothes(false, top.id !== "none");
      if (top.id === "none") document.getElementById("sleeves").innerHTML = "";
    }

    renderShoes(shoes);
    renderBag(bag);
  }

  return {
    DRESSES,
    TOPS,
    SKIRTS,
    PANTS,
    SHOES,
    BAGS,
    apply,
    renderLegs,
    renderArms,
  };
})();
