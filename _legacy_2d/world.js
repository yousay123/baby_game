(function () {
  "use strict";

  const MARKET_GOODS = {
    drinks: [
      { id: "juice", name: "果汁", icon: "果汁", price: 8, tag: "drink", color: "#ffb347" },
      { id: "milk", name: "牛奶", icon: "牛奶", price: 7, tag: "drink", color: "#f5f5f5", promo: true },
      { id: "soda", name: "汽水", icon: "汽水", price: 6, tag: "drink", color: "#7ec8ff" },
      { id: "tea", name: "奶茶", icon: "奶茶", price: 12, tag: "drink", color: "#d4a574" },
      { id: "water", name: "矿泉水", icon: "水", price: 3, tag: "drink", color: "#c8e8ff" },
      { id: "yogurt", name: "酸奶", icon: "酸", price: 5, tag: "drink", color: "#ffe0f0" },
    ],
    candy: [
      { id: "lolly", name: "棒棒糖", icon: "棒", price: 3, tag: "candy", color: "#ff8fb3" },
      { id: "choco", name: "巧克力", icon: "巧", price: 10, tag: "candy", color: "#8b5a2b" },
      { id: "gummy", name: "软糖", icon: "软", price: 5, tag: "candy", color: "#ff6b8a" },
      { id: "cookie", name: "曲奇", icon: "曲", price: 9, tag: "candy", color: "#e8c48a" },
      { id: "marsh", name: "棉花糖", icon: "棉", price: 6, tag: "candy", color: "#fff0f5" },
      { id: "jelly", name: "果冻", icon: "冻", price: 4, tag: "candy", color: "#c9a7ff" },
    ],
    veg: [
      { id: "tomato", name: "番茄", icon: "茄", price: 4, tag: "veg", color: "#ff6b5a" },
      { id: "carrot", name: "胡萝卜", icon: "萝", price: 3, tag: "veg", color: "#ff8f40" },
      { id: "broccoli", name: "西兰花", icon: "兰", price: 5, tag: "veg", color: "#4aaa50" },
      { id: "corn", name: "玉米", icon: "米", price: 4, tag: "veg", color: "#ffd24a" },
      { id: "cabbage", name: "白菜", icon: "白", price: 3, tag: "veg", color: "#d8f0c8" },
      { id: "pepper", name: "青椒", icon: "椒", price: 4, tag: "veg", color: "#3ecf6a" },
    ],
    snack: [
      { id: "chips", name: "薯片", icon: "薯", price: 8, tag: "snack", color: "#ffe08a" },
      { id: "popcorn", name: "爆米花", icon: "爆", price: 10, tag: "snack", color: "#fff3c4" },
      { id: "nuts", name: "坚果", icon: "果", price: 11, tag: "snack", color: "#c89868" },
      { id: "bread", name: "面包胚", icon: "包", price: 6, tag: "flour", color: "#e8c898" },
      { id: "biscuit", name: "饼干", icon: "饼", price: 7, tag: "snack", color: "#d4a574" },
      { id: "seaweed", name: "海苔", icon: "苔", price: 5, tag: "snack", color: "#3a6a40" },
    ],
    toy: [
      { id: "bear", name: "小熊", icon: "熊", price: 28, tag: "toy", color: "#d4a06a" },
      { id: "ball", name: "皮球", icon: "球", price: 15, tag: "toy", color: "#ef4d72" },
      { id: "blocks", name: "积木", icon: "木", price: 22, tag: "toy", color: "#ffc94a" },
      { id: "doll", name: "娃娃", icon: "娃", price: 30, tag: "toy", color: "#ffb0c8" },
      { id: "puzzle", name: "拼图", icon: "图", price: 18, tag: "toy", color: "#7ec8ff" },
      { id: "car", name: "小汽车", icon: "车", price: 20, tag: "toy", color: "#5b8cff" },
    ],
    daily: [
      { id: "rice", name: "大米", icon: "米", price: 12, tag: "rice", color: "#f5f0e0" },
      { id: "egg", name: "鸡蛋", icon: "蛋", price: 6, tag: "egg", color: "#ffe8b0" },
      { id: "oil", name: "食用油", icon: "油", price: 15, tag: "oil", color: "#f0d060" },
      { id: "flour", name: "面粉", icon: "粉", price: 8, tag: "flour", color: "#fff8e8" },
      { id: "salt", name: "食盐", icon: "盐", price: 3, tag: "daily", color: "#eef2f6" },
      { id: "sauce", name: "酱油", icon: "酱", price: 9, tag: "daily", color: "#5a3a28" },
    ],
  };

  const RECIPES = {
    stirfry: {
      name: "炒菜",
      need: ["veg", "oil"],
      needWashed: true,
      power: "stove",
      time: 2800,
      result: "香喷喷的炒蔬菜出锅啦！全家都夸小蜜糖手艺好～",
      icon: "菜",
      dish: "炒蔬菜",
    },
    rice: {
      name: "蒸米饭",
      need: ["rice"],
      power: "rice",
      time: 3200,
      result: "热腾腾的米饭蒸好啦！粒粒晶莹～",
      icon: "饭",
      dish: "米饭",
    },
    porridge: {
      name: "煮粥",
      need: ["rice"],
      power: "stove",
      time: 3000,
      result: "一锅暖暖的粥煮好了，给爸爸妈妈喝吧～",
      icon: "粥",
      dish: "白粥",
    },
    bread: {
      name: "烤面包",
      need: ["flour"],
      power: "oven",
      time: 3400,
      result: "金黄烤面包出炉！香气飘满整个厨房～",
      icon: "包",
      dish: "烤面包",
    },
  };

  const POWER_LABELS = {
    tv: "电视",
    ac: "空调",
    lamp: "落地灯",
    light: "吊灯",
    fridge: "冰箱",
    hood: "抽油烟机",
    microwave: "微波炉",
    stove: "燃气灶",
    rice: "电饭煲",
    oven: "烤箱",
    dishwasher: "洗碗机",
  };

  const NPC_LINES = {
    dad: [
      "爸爸：小蜜糖回来啦！今天化妆超漂亮～",
      "爸爸：去超市买东西记得结账哦～",
      "爸爸：爸爸饿了，厨房里可以做饭给我们吃！",
    ],
    mom: [
      "妈妈：宝贝欢迎回家！抱抱～",
      "妈妈：厨房里有锅灶，你可以炒菜蒸饭哦～",
      "妈妈：狗狗好想你，去摸摸它吧～",
    ],
    dog: [
      "旺旺：汪汪！（开心地摇尾巴）",
      "旺旺：汪！（闻到零食味道了）",
      "旺旺：汪汪汪～（想跟你去厨房）",
    ],
  };

  const SUBTITLES = {
    makeup: "公主换装化妆屋",
    market: "蜜糖超市购物中",
    home: "温馨小屋客厅",
    kitchen: "家庭小厨房",
  };

  const state = {
    scene: "makeup",
    money: 10000,
    hasCart: false,
    cart: [],
    bag: [],
    fridge: [],
    prep: [],
    holding: null,
    cooked: [],
    cooking: false,
    moving: false,
    power: {
      tv: false,
      ac: false,
      lamp: false,
      light: true,
      fridge: true,
      hood: false,
      microwave: false,
      stove: false,
      rice: false,
      oven: false,
      dishwasher: false,
    },
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function toast(msg) {
    if (window.MakeupGame && typeof window.MakeupGame.toast === "function") {
      window.MakeupGame.toast(msg);
      return;
    }
    const el = $("#toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function cartSubtotal() {
    return state.cart.reduce((s, i) => s + i.price, 0);
  }

  function cartDiscount() {
    const vegCount = state.cart.filter((i) => i.tag === "veg").length;
    return vegCount >= 3 ? 2 : 0;
  }

  function cartTotal() {
    return Math.max(0, cartSubtotal() - cartDiscount());
  }

  function renderCart() {
    const list = $("#cartList");
    const count = $("#cartCount");
    const money = $("#walletMoney");
    const totalEl = $("#cartTotal");
    if (money) money.textContent = String(state.money);
    if (count) count.textContent = String(state.cart.length);
    if (totalEl) totalEl.textContent = String(cartTotal());
    if (!list) return;
    if (!state.cart.length) {
      list.innerHTML = '<li class="empty">还没有商品～</li>';
    } else {
      list.innerHTML = state.cart
        .map(
          (i, idx) =>
            `<li>
              <span>${i.name}</span>
              <span>¥${i.price}
                <button type="button" class="rm" data-rm="${idx}" title="移除">×</button>
              </span>
            </li>`
        )
        .join("");
    }
    const disc = cartDiscount();
    const quest = $("#marketQuest");
    if (quest && disc) {
      quest.textContent = `已享蔬菜满减 ¥${disc} · 去收银台结账吧`;
    }
  }

  function listHTML(items, emptyText) {
    if (!items.length) return `<li class="empty">${emptyText}</li>`;
    return items
      .map((i) => {
        const mark = i.washed ? " ·已洗" : "";
        return `<li><span>${i.name}${mark}</span><span>×1</span></li>`;
      })
      .join("");
  }

  function renderBag() {
    const bagHtml = listHTML(state.bag, "手提袋是空的～");
    const fridgeHtml = listHTML(state.fridge, "冰箱空空的～");
    const prepHtml = listHTML(state.prep, "操作台没有食材～");

    const homeBag = $("#homeBagList");
    if (homeBag) {
      homeBag.innerHTML =
        `<li class="list-head">手提袋</li>${bagHtml}` +
        `<li class="list-head">冰箱</li>${fridgeHtml}`;
    }

    const bagList = $("#bagList");
    const fridgeList = $("#fridgeList");
    const prepList = $("#prepList");
    if (bagList) bagList.innerHTML = bagHtml;
    if (fridgeList) fridgeList.innerHTML = fridgeHtml;
    if (prepList) prepList.innerHTML = prepHtml;

    const cookBag = $("#cookIngredients");
    if (cookBag) cookBag.innerHTML = prepHtml;

    const cooked = $("#cookedList");
    if (cooked) {
      cooked.innerHTML =
        state.cooked.length === 0
          ? '<li class="empty">还没做好菜～</li>'
          : state.cooked
              .map((d) => `<li><span>${d.dish}</span><span>完成</span></li>`)
              .join("");
    }

    const quest = $("#cookQuest");
    if (quest) {
      if (state.bag.length) {
        quest.textContent = "先把购物袋放进冰箱，再取出食材洗菜做饭～";
      } else if (state.fridge.length && !state.prep.length) {
        quest.textContent = "点冰箱取出食材到操作台，再去洗菜池洗碗菜～";
      } else if (state.prep.some((i) => i.tag === "veg" && !i.washed)) {
        quest.textContent = "蔬菜还没洗！去洗菜池洗干净，再开火炒菜～";
      } else {
        quest.textContent = "打开电器电源，再点灶台/电饭煲/烤箱开始做饭";
      }
    }
  }

  function syncCarryVisual() {
    if (!window.HoneyActors) return;
    ["marketGirl", "homeGirl", "kitchenGirl"].forEach((id) => {
      const girl = document.getElementById(id);
      if (!girl) return;
      const isMarket = id === "marketGirl";
      if (isMarket && state.hasCart) {
        window.HoneyActors.setCart(girl, true);
        window.HoneyActors.setBags(girl, false);
        window.HoneyActors.setHolding(girl, null);
        return;
      }
      window.HoneyActors.setCart(girl, false);
      if (state.bag.length) {
        window.HoneyActors.setBags(girl, true);
        window.HoneyActors.setHolding(girl, null);
      } else if (state.holding) {
        window.HoneyActors.setBags(girl, false);
        window.HoneyActors.setHolding(girl, state.holding);
      } else {
        window.HoneyActors.setBags(girl, false);
        window.HoneyActors.setHolding(girl, null);
      }
    });
  }

  function syncCartVisual() {
    syncCarryVisual();
  }

  function applyPowerVisuals() {
    Object.keys(state.power).forEach((key) => {
      const on = !!state.power[key];
      $$(`[data-appliance="${key}"]`).forEach((el) => {
        el.classList.toggle("is-on", on);
      });
      $$(`[data-furn="${key}"]`).forEach((el) => {
        el.classList.toggle("is-on", on);
      });
      $$(`[data-power="${key}"]`).forEach((el) => {
        el.classList.toggle("is-on", on);
      });
    });
    const map = $("#homeMap");
    if (map) map.classList.toggle("lights-off", !state.power.light);
  }

  function fillShelves() {
    $$(".shelf-goods").forEach((box) => {
      const cat = box.dataset.cat;
      if (!cat || !MARKET_GOODS[cat]) return;
      box.innerHTML = MARKET_GOODS[cat]
        .map(
          (g) =>
            `<button type="button" class="goods-btn" data-goods-id="${g.id}" data-cat="${cat}" title="${g.name} ¥${g.price}">
              <span class="g-icon" style="background:${g.color || "#fff"}">${g.icon}</span>
              <span class="g-name">${g.name}</span>
              <span class="g-price">¥${g.price}${g.promo ? "特" : ""}</span>
            </button>`
        )
        .join("");
    });
  }

  function mountActors() {
    if (!window.HoneyActors) return;
    window.HoneyActors.mount($("#marketGirl"), "girl");
    window.HoneyActors.mount($("#homeGirl"), "girl");
    window.HoneyActors.mount($("#kitchenGirl"), "girl");
    window.HoneyActors.mount($("#npcDad"), "dad");
    window.HoneyActors.mount($("#npcMom"), "mom");
    window.HoneyActors.mount($("#npcDog"), "dog");
    syncCartVisual();
  }

  function refreshAvatars() {
    if (window.HoneyActors) window.HoneyActors.refreshAllGirls();
    syncCartVisual();
  }

  function showScene(name) {
    state.scene = name;
    $$(".scene").forEach((el) => {
      el.hidden = el.dataset.scene !== name;
    });
    $$(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.scene === name);
    });
    const actions = $("#makeupActions");
    if (actions) actions.style.display = name === "makeup" ? "" : "none";
    const sub = $("#sceneSubtitle");
    if (sub) sub.textContent = SUBTITLES[name] || "";

    if (name === "market") {
      fillShelves();
      renderCart();
      refreshAvatars();
      syncCarryVisual();
    }
    if (name === "home" || name === "kitchen") {
      renderBag();
      refreshAvatars();
      syncCarryVisual();
      applyPowerVisuals();
    }
    if (name === "kitchen") {
      const progress = $("#cookProgress");
      if (progress) progress.hidden = true;
    }
  }

  function getPos(el) {
    if (!el) return { x: 50, y: 50 };
    if (el.dataset.x != null && el.dataset.y != null) {
      return { x: parseFloat(el.dataset.x), y: parseFloat(el.dataset.y) };
    }
    const sx = parseFloat(el.style.left);
    const sy = parseFloat(el.style.top);
    if (!Number.isNaN(sx) && !Number.isNaN(sy) && el.style.left && el.style.top) {
      return { x: sx, y: sy };
    }
    const map = el.closest(".world-map");
    if (map) {
      const mr = map.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (mr.width > 0 && mr.height > 0) {
        return {
          x: ((er.left + er.width / 2 - mr.left) / mr.width) * 100,
          y: ((er.top + er.height / 2 - mr.top) / mr.height) * 100,
        };
      }
    }
    return { x: 50, y: 50 };
  }

  function moveActorTo(actorId, xPct, yPct, done) {
    const el = document.getElementById(actorId);
    if (!el) {
      if (done) done();
      return;
    }
    const from = getPos(el);
    const toX = Math.max(6, Math.min(94, xPct));
    const toY = Math.max(18, Math.min(90, yPct));
    const dist = Math.hypot(toX - from.x, toY - from.y);
    if (dist < 0.8) {
      if (done) done();
      return;
    }

    // 樱校式：匀速点地走路，步频随距离变化，双腿循环迈步
    const speed = 22; // % per second
    const duration = Math.max(500, Math.min(3200, (dist / speed) * 1000));
    const strideMs = Math.max(220, Math.min(380, 280));
    el.style.setProperty("--stride-ms", strideMs + "ms");

    if (window.HoneyActors) {
      window.HoneyActors.setFacing(el, toX < from.x ? "left" : "right");
    }

    const token = {};
    state.moveToken = token;
    el.classList.add("walking");
    state.moving = true;

    const start = performance.now();
    function tick(now) {
      if (state.moveToken !== token) return;
      const t = Math.min(1, (now - start) / duration);
      // 接近匀速，尾部轻微减速（模拟游戏角色走路）
      const ease = t < 0.92 ? t / 0.92 * 0.96 : 0.96 + (t - 0.92) / 0.08 * 0.04;
      el.style.left = from.x + (toX - from.x) * ease + "%";
      el.style.top = from.y + (toY - from.y) * ease + "%";
      // 深度感：越往屏幕上方略缩小
      const depth = 0.92 + (parseFloat(el.style.top) / 100) * 0.16;
      el.style.setProperty("--walk-scale", depth.toFixed(3));
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.remove("walking");
        state.moving = false;
        if (done) done();
      }
    }
    requestAnimationFrame(tick);
  }

  function pctFromEvent(map, e) {
    const rect = map.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  function targetPct(el) {
    return getPos(el);
  }

  function walkToTarget(actorId, targetEl, action) {
    const { x, y } = targetPct(targetEl);
    // Stand slightly below the shelf/zone so character is visible in front
    moveActorTo(actorId, x, Math.min(90, y + 8), action);
  }

  function addToCart(goods) {
    if (!state.hasCart) {
      toast("先去入口拿购物车吧～");
      return;
    }
    if (state.cart.length >= 12) {
      toast("购物车装满啦，先去结账吧～");
      return;
    }
    state.cart.push({ ...goods });
    renderCart();
    toast(`放入购物车：${goods.name}`);
  }

  function removeFromCart(idx) {
    if (idx < 0 || idx >= state.cart.length) return;
    const item = state.cart.splice(idx, 1)[0];
    renderCart();
    toast(`已拿出：${item.name}`);
  }

  function clearCart() {
    if (!state.cart.length) {
      toast("购物车已经是空的～");
      return;
    }
    state.cart = [];
    renderCart();
    toast("已清空购物车");
  }

  function pickupCart() {
    if (state.hasCart) {
      toast("已经拿着购物车啦～");
      return;
    }
    state.hasCart = true;
    syncCartVisual();
    toast("拿到购物车啦！去货架选购吧～");
  }

  function openModal(title, body, actions) {
    const modal = $("#modal");
    if (!modal) return;
    $("#modalTitle").textContent = title;
    const bodyEl = $("#modalBody");
    bodyEl.innerHTML = "";
    if (typeof body === "string") {
      bodyEl.textContent = body;
    } else if (body instanceof Node) {
      bodyEl.appendChild(body);
    }
    const box = $("#modalActions");
    box.innerHTML = "";
    actions.forEach((a) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn " + (a.className || "btn-ghost");
      btn.textContent = a.label;
      btn.addEventListener("click", () => {
        modal.hidden = true;
        if (a.onClick) a.onClick();
      });
      box.appendChild(btn);
    });
    modal.hidden = false;
  }

  function checkout() {
    if (!state.cart.length) {
      toast("购物车是空的，先去选购吧～");
      return;
    }
    const total = cartTotal();
    const disc = cartDiscount();
    const discText = disc ? `（已减蔬菜优惠 ¥${disc}）` : "";
    openModal(
      "收银台结账",
      `共 ${state.cart.length} 件，应付 ¥${total}${discText}。钱包余额 ¥${state.money}。确认付款吗？`,
      [
        { label: "再逛逛", className: "btn-ghost" },
        {
          label: "确认付款",
          className: "btn-coral",
          onClick: () => {
            if (state.money < total) {
              toast("钱不够啦，少买一点或清空几件吧～");
              return;
            }
            state.money -= total;
            state.bag.push(...state.cart.map((i) => ({ ...i, washed: false })));
            state.cart = [];
            state.hasCart = false;
            syncCarryVisual();
            renderCart();
            renderBag();
            toast("结账成功！手里提着购物袋，可以从出口回家啦～");
            const quest = $("#marketQuest");
            if (quest) quest.textContent = "提着购物袋回家吧！点右侧出口";
          },
        },
      ]
    );
  }

  function goHomeFromMarket() {
    if (state.cart.length) {
      toast("还没结账哦，先去收银台～");
      return;
    }
    showScene("home");
    if (state.bag.length) {
      toast("提着购物袋到家啦！去厨房把菜放进冰箱吧～");
    } else {
      toast("到家啦！爸爸妈妈和狗狗在等你～");
    }
    setTimeout(() => speak("mom"), 500);
  }

  function speak(npcKey, fixedText) {
    const bubble = $("#homeSpeech");
    const target = $(`.npc[data-npc="${npcKey}"]`);
    if (!bubble) return;
    const lines = NPC_LINES[npcKey] || [];
    bubble.hidden = false;
    bubble.textContent =
      fixedText || lines[Math.floor(Math.random() * lines.length)] || "……";
    if (target) {
      bubble.style.left = target.style.left;
      bubble.style.top = `calc(${target.style.top} - 10%)`;
    }
    clearTimeout(speak._t);
    speak._t = setTimeout(() => {
      bubble.hidden = true;
    }, 2800);
  }

  function hasTag(tag) {
    return state.prep.some((i) => i.tag === tag);
  }

  function hasWashedVeg() {
    return state.prep.some((i) => i.tag === "veg" && i.washed);
  }

  function consumeTags(tags) {
    tags.forEach((tag) => {
      let idx = -1;
      if (tag === "veg") {
        idx = state.prep.findIndex((i) => i.tag === "veg" && i.washed);
        if (idx < 0) idx = state.prep.findIndex((i) => i.tag === "veg");
      } else {
        idx = state.prep.findIndex((i) => i.tag === tag);
      }
      if (idx >= 0) {
        const removed = state.prep.splice(idx, 1)[0];
        if (state.holding && state.holding === removed) state.holding = null;
        else if (
          state.holding &&
          state.holding.id === removed.id &&
          state.holding.name === removed.name
        ) {
          state.holding = null;
        }
      }
    });
    if (state.holding && !state.prep.includes(state.holding)) {
      state.holding = state.prep[0] || null;
    }
    renderBag();
    syncCarryVisual();
  }

  function putBagInFridge() {
    if (!state.bag.length) {
      toast("手上没有购物袋～");
      return;
    }
    if (!state.power.fridge) {
      toast("冰箱没通电，先打开冰箱电源～");
      return;
    }
    state.fridge.push(...state.bag);
    state.bag = [];
    state.holding = null;
    renderBag();
    syncCarryVisual();
    toast("购物袋里的东西都放进冰箱啦！");
  }

  function takeFromFridge(idx) {
    if (idx < 0 || idx >= state.fridge.length) return;
    if (!state.power.fridge) {
      toast("冰箱没通电，打不开门～");
      return;
    }
    const item = state.fridge.splice(idx, 1)[0];
    state.prep.push(item);
    state.holding = item;
    renderBag();
    syncCarryVisual();
    toast(`取出了${item.name}，可以去洗菜或做饭啦～`);
  }

  function openFridge() {
    if (state.bag.length) {
      openModal(
        "冰箱",
        `手提袋里有 ${state.bag.length} 件东西。要全部放进冰箱吗？`,
        [
          { label: "先不放", className: "btn-ghost" },
          {
            label: "全部放进冰箱",
            className: "btn-coral",
            onClick: putBagInFridge,
          },
        ]
      );
      return;
    }
    if (!state.fridge.length) {
      toast("冰箱空空的，先去超市买菜再放进来～");
      return;
    }
    if (!state.power.fridge) {
      toast("冰箱电源是关的，点一下冰箱开关再打开～");
      return;
    }
    const body = document.createElement("div");
    body.innerHTML =
      `<p style="margin:0 0 10px">点击取出放到操作台：</p>` +
      `<ul class="cart-list fridge-pick">` +
      state.fridge
        .map(
          (i, idx) =>
            `<li><span>${i.icon || ""} ${i.name}</span>` +
            `<button type="button" class="btn-mini" data-take="${idx}">取出</button></li>`
        )
        .join("") +
      `</ul>`;
    openModal("打开冰箱", body, [{ label: "关上门", className: "btn-ghost" }]);
    const pick = body.querySelector(".fridge-pick");
    if (pick) {
      pick.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-take]");
        if (!btn) return;
        takeFromFridge(Number(btn.dataset.take));
        const modal = $("#modal");
        if (modal) modal.hidden = true;
      });
    }
  }

  function washAtSink() {
    const vegs = state.prep.filter((i) => i.tag === "veg");
    if (!vegs.length) {
      if (state.fridge.some((i) => i.tag === "veg")) {
        toast("蔬菜还在冰箱里，先点冰箱取出来～");
      } else if (state.bag.some((i) => i.tag === "veg")) {
        toast("蔬菜还在购物袋里，先放进冰箱再取出～");
      } else {
        toast("操作台上没有蔬菜，先去超市买点菜吧～");
      }
      return;
    }
    const dirty = vegs.filter((i) => !i.washed);
    if (!dirty.length) {
      toast("蔬菜已经洗干净啦，可以去开火炒菜～");
      return;
    }
    dirty.forEach((i) => {
      i.washed = true;
    });
    const water = $(".zone-sink .sink-water");
    if (water) {
      water.classList.add("running");
      setTimeout(() => water.classList.remove("running"), 1200);
    }
    renderBag();
    syncCarryVisual();
    toast("哗啦啦～蔬菜洗干净啦，可以去灶台炒菜了！");
  }

  function togglePower(key) {
    if (!(key in state.power)) return;
    state.power[key] = !state.power[key];
    applyPowerVisuals();
    const label = POWER_LABELS[key] || key;
    toast(state.power[key] ? `${label}打开了～` : `${label}关掉了`);
  }

  function useFurniture(key) {
    if (key === "sofa") {
      toast("小蜜糖在沙发上坐了一会儿，好舒服～");
      return;
    }
    if (key === "table") {
      toast("茶几上有遥控器，可以去开电视～");
      return;
    }
    if (key === "shelf") {
      toast("书架上摆着全家福和故事书～");
      return;
    }
    if (key === "plant") {
      toast("绿植绿油油的，浇了一点水～");
      return;
    }
    if (key === "dogbed") {
      toast("这是旺旺的小窝～");
      return;
    }
    if (key in state.power) {
      togglePower(key);
    }
  }

  function startCook(type) {
    if (state.cooking) return;
    const recipe = RECIPES[type];
    if (!recipe) return;

    if (recipe.power && !state.power[recipe.power]) {
      const label = POWER_LABELS[recipe.power] || "电器";
      toast(`请先打开${label}电源，再开始${recipe.name}～`);
      return;
    }

    if (state.bag.length && !state.prep.length && !state.fridge.length) {
      toast("食材还在购物袋里，先放进冰箱再取出到操作台～");
      return;
    }
    if (!state.prep.length && state.fridge.length) {
      toast("食材在冰箱里，点冰箱取出来再做～");
      return;
    }

    const missing = recipe.need.filter((t) => !hasTag(t));
    if (missing.length) {
      const names = {
        veg: "蔬菜",
        oil: "食用油",
        rice: "大米",
        flour: "面粉/面包胚",
        egg: "鸡蛋",
      };
      toast(
        `操作台上还缺：${missing.map((t) => names[t] || t).join("、")}～`
      );
      return;
    }

    if (recipe.needWashed && !hasWashedVeg()) {
      toast("蔬菜还没洗！先去洗菜池把菜洗干净～");
      return;
    }

    if (type === "stirfry" && !state.power.hood) {
      toast("炒菜前先打开抽油烟机比较好哦～（已为你自动打开）");
      state.power.hood = true;
      applyPowerVisuals();
    }

    state.cooking = true;
    consumeTags(recipe.need);
    const panel = $("#cookProgress");
    const bar = $("#cookBarFill");
    const text = $("#cookProgressText");
    panel.hidden = false;
    if (bar) bar.style.width = "0%";
    if (text) text.textContent = `正在${recipe.name}…`;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / recipe.time);
      if (bar) bar.style.width = p * 100 + "%";
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        state.cooking = false;
        panel.hidden = true;
        state.cooked.push({
          icon: recipe.icon,
          dish: recipe.dish,
          name: recipe.name,
        });
        renderBag();
        syncCarryVisual();
        toast(recipe.result);
      }
    }
    requestAnimationFrame(tick);
  }

  function bindMarket() {
    const map = $("#marketMap");
    if (!map) return;

    map.addEventListener("click", (e) => {
      // 允许连点改方向（打断上一段走路）
      const goodsBtn = e.target.closest(".goods-btn");
      if (goodsBtn) {
        e.stopPropagation();
        const cat = goodsBtn.dataset.cat;
        const id = goodsBtn.dataset.goodsId;
        const goods = (MARKET_GOODS[cat] || []).find((g) => g.id === id);
        const aisle = goodsBtn.closest(".aisle");
        walkToTarget("marketGirl", aisle || goodsBtn, () => {
          if (goods) addToCart(goods);
        });
        return;
      }

      const zone = e.target.closest(".zone");
      if (zone) {
        e.stopPropagation();
        const z = zone.dataset.zone;
        walkToTarget("marketGirl", zone, () => {
          if (z === "carts") pickupCart();
          if (z === "checkout") checkout();
          if (z === "exitHome") goHomeFromMarket();
        });
        return;
      }

      if (e.target.closest(".aisle") || e.target.closest(".actor")) return;
      const p = pctFromEvent(map, e);
      moveActorTo("marketGirl", p.x, p.y);
    });
  }

  function bindHome() {
    const map = $("#homeMap");
    if (!map) return;

    map.addEventListener("click", (e) => {
      const npc = e.target.closest(".npc");
      if (npc) {
        e.stopPropagation();
        walkToTarget("homeGirl", npc, () => {
          speak(npc.dataset.npc);
          if (npc.dataset.npc === "dog") {
            const snack =
              state.prep.find((i) => i.tag === "snack") ||
              state.bag.find((i) => i.tag === "snack") ||
              state.fridge.find((i) => i.tag === "snack");
            if (snack) toast("旺旺开心地吃了一点零食碎屑～");
          }
        });
        return;
      }
      const furn = e.target.closest("[data-furn]");
      if (furn) {
        e.stopPropagation();
        walkToTarget("homeGirl", furn, () => {
          useFurniture(furn.dataset.furn);
        });
        return;
      }
      const zone = e.target.closest(".zone");
      if (zone) {
        e.stopPropagation();
        const z = zone.dataset.zone;
        walkToTarget("homeGirl", zone, () => {
          if (z === "toKitchen") {
            showScene("kitchen");
            if (state.bag.length) {
              toast("提着购物袋进厨房啦，先把东西放进冰箱～");
            } else {
              toast("走进厨房啦～");
            }
          }
          if (z === "toMarket") {
            showScene("market");
            toast("出门去超市咯～");
          }
        });
        return;
      }
      if (e.target.closest(".actor")) return;
      const p = pctFromEvent(map, e);
      moveActorTo("homeGirl", p.x, p.y);
    });
  }

  function bindKitchen() {
    const map = $("#kitchenMap");
    if (!map) return;

    map.addEventListener("click", (e) => {
      const station = e.target.closest(".station");
      if (station) {
        e.stopPropagation();
        const wantToggle = !!e.target.closest(".power-btn");
        walkToTarget("kitchenGirl", station, () => {
          const cook = station.dataset.cook;
          const powerKey = station.dataset.power;
          if (wantToggle && powerKey) {
            togglePower(powerKey);
            return;
          }
          if (powerKey && !state.power[powerKey]) {
            togglePower(powerKey);
            toast(`${POWER_LABELS[powerKey] || "电器"}已打开，再点一次开始做饭～`);
            return;
          }
          startCook(cook);
        });
        return;
      }
      const appliance = e.target.closest("[data-appliance]");
      if (appliance) {
        e.stopPropagation();
        const key = appliance.dataset.appliance;
        const wantToggle = !!e.target.closest(".power-btn");
        walkToTarget("kitchenGirl", appliance, () => {
          if (key === "fridge") {
            if (wantToggle) togglePower("fridge");
            else openFridge();
            return;
          }
          togglePower(key);
        });
        return;
      }
      const zone = e.target.closest(".zone");
      if (zone) {
        e.stopPropagation();
        walkToTarget("kitchenGirl", zone, () => {
          if (zone.dataset.zone === "toHome") {
            showScene("home");
            toast("回到客厅啦～");
            setTimeout(
              () => speak("dad", "爸爸：好香啊！小蜜糖做的吗？"),
              400
            );
          }
          if (zone.dataset.zone === "sink") {
            washAtSink();
          }
        });
        return;
      }
      if (e.target.closest(".actor")) return;
      const p = pctFromEvent(map, e);
      moveActorTo("kitchenGirl", p.x, p.y);
    });
  }

  function bindNav() {
    $$(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const scene = btn.dataset.scene;
        if (scene === "home" && state.cart.length) {
          toast("超市里还有未结账的商品，先去收银台吧～");
          showScene("market");
          return;
        }
        showScene(scene);
        if (scene === "market") toast("欢迎来到蜜糖超市！先拿购物车～");
        if (scene === "home") toast("到家啦～");
        if (scene === "kitchen") toast("厨房时间！");
        if (scene === "makeup") toast("回到化妆屋～");
      });
    });

    const goMarket = $("#btnGoMarket");
    if (goMarket) {
      goMarket.addEventListener("click", () => {
        showScene("market");
        toast("化好妆出发去超市啦～");
      });
    }

    const clearBtn = $("#btnClearCart");
    if (clearBtn) clearBtn.addEventListener("click", clearCart);

    const goCheck = $("#btnGoCheckout");
    if (goCheck) {
      goCheck.addEventListener("click", () => {
        const lane = $(".checkout-lane");
        if (lane) walkToTarget("marketGirl", lane, checkout);
        else checkout();
      });
    }

    const cartList = $("#cartList");
    if (cartList) {
      cartList.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-rm]");
        if (!btn) return;
        removeFromCart(Number(btn.dataset.rm));
      });
    }

    const modal = $("#modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.hidden = true;
      });
    }
  }

  function boot() {
    mountActors();
    fillShelves();
    renderCart();
    renderBag();
    applyPowerVisuals();
    syncCarryVisual();
    bindNav();
    bindMarket();
    bindHome();
    bindKitchen();
    showScene("makeup");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.HoneyWorld = { showScene, state, toast, refreshAvatars };
})();
