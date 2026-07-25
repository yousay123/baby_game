(function () {
  "use strict";

  function avatarFromMakeup() {
    const src = document.getElementById("character");
    if (!src) return null;
    const clone = src.cloneNode(true);
    clone.removeAttribute("id");
    clone.removeAttribute("role");
    clone.removeAttribute("aria-label");
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("class", "avatar-svg");
    clone.setAttribute("viewBox", "0 0 360 580");
    clone.setAttribute("width", "92");
    clone.setAttribute("height", "148");
    const prefix = "av" + Math.random().toString(36).slice(2, 8);
    const idMap = {};
    clone.querySelectorAll("[id]").forEach((node) => {
      const oldId = node.id;
      const neu = prefix + "-" + oldId;
      idMap[oldId] = neu;
      node.id = neu;
    });
    const attrs = ["fill", "stroke", "filter", "clip-path", "href", "xlink:href"];
    clone.querySelectorAll("*").forEach((node) => {
      attrs.forEach((attr) => {
        const val = node.getAttribute(attr);
        if (!val) return;
        let next = val;
        Object.keys(idMap).forEach((oldId) => {
          next = next
            .replace(new RegExp("url\\(#" + oldId + "\\)", "g"), "url(#" + idMap[oldId] + ")")
            .replace(new RegExp("#" + oldId + "(?![-\\w])", "g"), "#" + idMap[oldId]);
        });
        if (next !== val) node.setAttribute(attr, next);
      });
    });
    return clone;
  }

  function prepareWalkRig(svg) {
    if (!svg || svg.dataset.rigged === "1") return;
    svg.dataset.rigged = "1";
    svg.classList.add("walk-rig");

    const ns = "http://www.w3.org/2000/svg";
    const shoesG = svg.querySelector('[id$="-shoes"]');
    if (shoesG && !shoesG.querySelector(".walk-shoe-l")) {
      const left = document.createElementNS(ns, "g");
      left.setAttribute("class", "walk-shoe walk-shoe-l");
      const right = document.createElementNS(ns, "g");
      right.setAttribute("class", "walk-shoe walk-shoe-r");
      [...shoesG.children].forEach((child) => {
        let cx = 180;
        try {
          const b = child.getBBox();
          cx = b.x + b.width / 2;
        } catch (e) {}
        (cx < 180 ? left : right).appendChild(child);
      });
      shoesG.appendChild(left);
      shoesG.appendChild(right);
    }

    const handL = svg.querySelector('[id$="-handL"]');
    const handR = svg.querySelector('[id$="-handR"]');
    if (handL) handL.classList.add("walk-hand", "walk-hand-l");
    if (handR) handR.classList.add("walk-hand", "walk-hand-r");

    const armsG = svg.querySelector('[id$="-arms"]');
    if (armsG && !armsG.querySelector(".walk-arm-l")) {
      const kids = [...armsG.children];
      if (kids.length >= 6) {
        const left = document.createElementNS(ns, "g");
        left.setAttribute("class", "walk-arm walk-arm-l");
        const right = document.createElementNS(ns, "g");
        right.setAttribute("class", "walk-arm walk-arm-r");
        kids.slice(0, Math.ceil(kids.length / 2)).forEach((n) => left.appendChild(n));
        kids.slice(Math.ceil(kids.length / 2)).forEach((n) => right.appendChild(n));
        armsG.appendChild(left);
        armsG.appendChild(right);
      }
    }
  }

  function pushCartHTML() {
    return `<div class="push-cart" hidden aria-hidden="true">
      <div class="cart-handle"></div>
      <div class="cart-basket">
        <div class="cart-item c1"></div>
        <div class="cart-item c2"></div>
        <div class="cart-item c3"></div>
      </div>
      <div class="cart-wheel w1"></div>
      <div class="cart-wheel w2"></div>
    </div>`;
  }

  function heldBagsHTML() {
    return `<div class="held-bags" hidden aria-hidden="true">
      <div class="shop-bag b1"><i></i></div>
      <div class="shop-bag b2"><i></i></div>
    </div>`;
  }

  function heldItemHTML() {
    return `<div class="held-item" hidden aria-hidden="true"><span class="held-item-icon">菜</span></div>`;
  }

  function refreshGirl(el) {
    if (!el) return;
    const host = el.querySelector(".avatar-host");
    if (!host) return;
    const svg = avatarFromMakeup();
    host.innerHTML = "";
    if (svg) {
      host.appendChild(svg);
      requestAnimationFrame(() => prepareWalkRig(svg));
    }
  }

  function mountGirl(el) {
    if (!el) return;
    el.innerHTML =
      `<div class="avatar-stack">` +
      `<div class="avatar-bob"><div class="avatar-host"></div></div>` +
      pushCartHTML() +
      heldBagsHTML() +
      heldItemHTML() +
      `</div><div class="actor-name">小蜜糖</div>`;
    refreshGirl(el);
  }

  function dadSVG() {
    return `<svg class="walk-svg npc-svg" viewBox="0 0 100 160" width="78" height="126" aria-hidden="true">
      <ellipse cx="50" cy="152" rx="20" ry="5" fill="rgba(0,0,0,.16)"/>
      <g class="walk-leg walk-leg-l">
        <path d="M40 96 L36 138" stroke="#5A6A88" stroke-width="11" stroke-linecap="round"/>
        <ellipse cx="35" cy="142" rx="9" ry="4.5" fill="#2C2430"/>
      </g>
      <g class="walk-leg walk-leg-r">
        <path d="M60 96 L64 138" stroke="#5A6A88" stroke-width="11" stroke-linecap="round"/>
        <ellipse cx="65" cy="142" rx="9" ry="4.5" fill="#2C2430"/>
      </g>
      <path d="M32 58 C30 92 36 100 50 102 C64 100 70 92 68 58Z" fill="#3D6FBF"/>
      <path d="M34 58 C38 48 62 48 66 58 L64 70 C50 76 36 70 34 58Z" fill="#2F5AA0"/>
      <rect x="44" y="70" width="12" height="18" rx="2" fill="#E8F0FF" opacity="0.85"/>
      <g class="walk-arm walk-arm-l">
        <path d="M34 62 C20 72 18 90 24 98" fill="none" stroke="#E8B888" stroke-width="8" stroke-linecap="round"/>
        <path d="M34 62 C26 70 24 82 28 88" fill="none" stroke="#3D6FBF" stroke-width="10" stroke-linecap="round"/>
      </g>
      <g class="walk-arm walk-arm-r">
        <path d="M66 62 C80 72 82 90 76 98" fill="none" stroke="#E8B888" stroke-width="8" stroke-linecap="round"/>
        <path d="M66 62 C74 70 76 82 72 88" fill="none" stroke="#3D6FBF" stroke-width="10" stroke-linecap="round"/>
      </g>
      <circle cx="50" cy="36" r="17" fill="#E8B888"/>
      <path d="M32 34 C36 12 64 12 68 34Z" fill="#3A3038"/>
      <ellipse cx="44" cy="36" rx="2.3" ry="2.8" fill="#2A2020"/>
      <ellipse cx="56" cy="36" rx="2.3" ry="2.8" fill="#2A2020"/>
      <path d="M43 46 Q50 51 57 46" stroke="#C87868" fill="none" stroke-width="1.7"/>
    </svg>`;
  }

  function momSVG() {
    return `<svg class="walk-svg npc-svg" viewBox="0 0 100 160" width="78" height="126" aria-hidden="true">
      <ellipse cx="50" cy="152" rx="20" ry="5" fill="rgba(0,0,0,.16)"/>
      <g class="walk-leg walk-leg-l">
        <path d="M42 104 L38 138" stroke="#FFD2B8" stroke-width="9" stroke-linecap="round"/>
        <ellipse cx="37" cy="142" rx="9" ry="4.5" fill="#C44569"/>
      </g>
      <g class="walk-leg walk-leg-r">
        <path d="M58 104 L62 138" stroke="#FFD2B8" stroke-width="9" stroke-linecap="round"/>
        <ellipse cx="63" cy="142" rx="9" ry="4.5" fill="#C44569"/>
      </g>
      <path d="M30 88 C28 112 38 122 50 124 C62 122 72 112 70 88Z" fill="#B57EDC"/>
      <path d="M32 56 C30 84 36 92 50 94 C64 92 70 84 68 56Z" fill="#FF8FB3"/>
      <path d="M34 56 C38 46 62 46 66 56 L64 68 C50 74 36 68 34 56Z" fill="#FF6B8A"/>
      <circle cx="50" cy="70" r="4" fill="#FFD56A"/>
      <g class="walk-arm walk-arm-l">
        <path d="M34 60 C20 70 18 88 24 96" fill="none" stroke="#FFD2B8" stroke-width="8" stroke-linecap="round"/>
        <path d="M34 60 C26 68 24 80 28 86" fill="none" stroke="#FF8FB3" stroke-width="10" stroke-linecap="round"/>
      </g>
      <g class="walk-arm walk-arm-r">
        <path d="M66 60 C80 70 82 88 76 96" fill="none" stroke="#FFD2B8" stroke-width="8" stroke-linecap="round"/>
        <path d="M66 60 C74 68 76 80 72 86" fill="none" stroke="#FF8FB3" stroke-width="10" stroke-linecap="round"/>
      </g>
      <circle cx="50" cy="36" r="17" fill="#FFD2B8"/>
      <path d="M30 34 C34 8 66 8 70 34 C60 24 40 24 30 34Z" fill="#6B3F2A"/>
      <path d="M28 38 C26 58 38 68 44 58 C36 50 32 42 28 38Z" fill="#6B3F2A"/>
      <path d="M72 38 C74 58 62 68 56 58 C64 50 68 42 72 38Z" fill="#6B3F2A"/>
      <ellipse cx="44" cy="36" rx="2.3" ry="2.8" fill="#2A2020"/>
      <ellipse cx="56" cy="36" rx="2.3" ry="2.8" fill="#2A2020"/>
      <path d="M44 46 Q50 51 56 46" stroke="#E89A9A" fill="none" stroke-width="1.7"/>
      <ellipse cx="40" cy="42" rx="3.5" ry="2.2" fill="#FF8AA8" opacity="0.45"/>
      <ellipse cx="60" cy="42" rx="3.5" ry="2.2" fill="#FF8AA8" opacity="0.45"/>
    </svg>`;
  }

  function dogSVG() {
    return `<svg class="walk-svg npc-svg" viewBox="0 0 100 90" width="72" height="64" aria-hidden="true">
      <ellipse cx="48" cy="82" rx="20" ry="4" fill="rgba(0,0,0,.15)"/>
      <ellipse cx="44" cy="54" rx="26" ry="18" fill="#D4A06A"/>
      <ellipse cx="44" cy="54" rx="20" ry="12" fill="#E8C090" opacity="0.55"/>
      <circle cx="68" cy="36" r="15" fill="#D4A06A"/>
      <ellipse cx="63" cy="34" rx="2.4" ry="3" fill="#2A2020"/>
      <ellipse cx="73" cy="34" rx="2.4" ry="3" fill="#2A2020"/>
      <ellipse cx="78" cy="42" rx="5" ry="2.5" fill="#C08050"/>
      <path d="M18 52 Q6 36 16 26" stroke="#D4A06A" stroke-width="8" fill="none" stroke-linecap="round"/>
      <ellipse cx="28" cy="68" rx="7" ry="5" fill="#C08050"/>
      <ellipse cx="56" cy="70" rx="7" ry="5" fill="#C08050"/>
      <circle cx="58" cy="28" r="5" fill="#C08050"/>
      <circle cx="78" cy="28" r="5" fill="#C08050"/>
    </svg>`;
  }

  function mount(el, kind) {
    if (!el) return;
    if (kind === "girl") {
      mountGirl(el);
      return;
    }
    const name = kind === "dad" ? "爸爸" : kind === "mom" ? "妈妈" : "旺旺";
    const svg = kind === "dad" ? dadSVG() : kind === "mom" ? momSVG() : dogSVG();
    el.innerHTML = svg + `<div class="actor-name">${name}</div>`;
  }

  function refreshAllGirls() {
    ["marketGirl", "homeGirl", "kitchenGirl"].forEach((id) => {
      refreshGirl(document.getElementById(id));
    });
  }

  function setCart(el, on) {
    if (!el) return;
    el.classList.toggle("has-cart", !!on);
    const cart = el.querySelector(".push-cart");
    if (cart) cart.hidden = !on;
    if (on) setBags(el, false);
  }

  function setBags(el, on) {
    if (!el) return;
    el.classList.toggle("has-bags", !!on);
    const bags = el.querySelector(".held-bags");
    if (bags) bags.hidden = !on;
    if (on) {
      const cart = el.querySelector(".push-cart");
      if (cart) cart.hidden = true;
      el.classList.remove("has-cart");
      const hi = el.querySelector(".held-item");
      if (hi) hi.hidden = true;
      el.classList.remove("has-hold");
    }
  }

  function setHolding(el, item) {
    if (!el) return;
    const hi = el.querySelector(".held-item");
    if (!hi) return;
    if (!item) {
      hi.hidden = true;
      el.classList.remove("has-hold");
      return;
    }
    hi.hidden = false;
    el.classList.add("has-hold");
    const icon = hi.querySelector(".held-item-icon");
    if (icon) icon.textContent = item.icon || (item.name && item.name[0]) || "物";
    setBags(el, false);
  }

  function setFacing(el, facing) {
    if (!el) return;
    el.classList.toggle("face-left", facing === "left");
  }

  window.HoneyActors = {
    mount,
    setCart,
    setBags,
    setHolding,
    setFacing,
    refreshGirl,
    refreshAllGirls,
    avatarFromMakeup,
  };
})();
