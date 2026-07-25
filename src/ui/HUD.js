import { SCENES, MAKEUP, MARKET_GOODS, APPLIANCE_NAMES, CHAR_STYLES } from "../core/constants.js";
import {
  plateDish,
  pickUpPlated,
  placeOnTable,
  startMealCall,
  putBagInFridge,
  takeFromFridge,
  washPrep,
  togglePower,
  setPower,
  getPowerMode,
  startCook,
  checkoutCart,
  addToCart,
} from "../gameplay/systems.js";
import { emit } from "../gameplay/GameState.js";
import { applyMakeup } from "../characters/Avatar.js";
import { makeup2d } from "./Makeup2D.js";

export class HUD {
  constructor(game) {
    this.game = game;
    this.toastTimer = null;
    this.makeupMode = "makeup";
    this.makeupTab = "lipstick";

    document.getElementById("sceneNav").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-scene]");
      if (!btn) return;
      game.go(btn.dataset.scene);
    });

    document.getElementById("btnFinishMakeup")?.addEventListener("click", () => {
      game.toast("美美出发！去超市买菜吧～");
      makeup2d.hide();
      game.go("market");
    });

    this.bindMakeupUI();
    this.unsubscribe = null;

    const panel = document.getElementById("hudPanel");
    const toggle = document.getElementById("hudToggle");
    toggle?.addEventListener("click", () => {
      panel?.classList.toggle("hud-collapsed");
      if (toggle) {
        toggle.textContent = panel?.classList.contains("hud-collapsed") ? "物品" : "收起";
      }
    });
  }

  bindState(state) {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = () => {};
    const sync = () => this.refresh(state);
    state.listeners.add(sync);
    this.unsubscribe = () => state.listeners.delete(sync);
    sync();
  }

  onSceneChange(id) {
    document.querySelectorAll("#sceneNav button").forEach((b) => {
      b.classList.toggle("active", b.dataset.scene === id);
    });
    document.body.classList.toggle("scene-makeup", id === "makeup");
    const sub = document.getElementById("sceneSubtitle");
    if (sub) sub.textContent = SCENES[id]?.title || "";
    const makeup = document.getElementById("makeupPanel");
    if (makeup) makeup.hidden = id !== "makeup";
    const panel = document.getElementById("hudPanel");
    const toggle = document.getElementById("hudToggle");
    if (panel && id !== "makeup") {
      panel.classList.add("hud-collapsed");
      if (toggle) toggle.textContent = "物品";
    }
    if (id === "makeup") {
      makeup2d.show();
      makeup2d.render(this.game.state);
      if (this.game.fp) this.game.fp.enabled = false;
    } else {
      makeup2d.hide();
      if (this.game.fp) this.game.fp.enabled = true;
    }
    this.refresh(this.game.state);
  }

  toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  openModal(title, bodyHtml, actions) {
    const modal = document.getElementById("modal");
    document.getElementById("modalTitle").textContent = title;
    const body = document.getElementById("modalBody");
    if (typeof bodyHtml === "string") body.innerHTML = `<p>${bodyHtml}</p>`;
    else {
      body.innerHTML = "";
      body.appendChild(bodyHtml);
    }
    const box = document.getElementById("modalActions");
    box.innerHTML = "";
    actions.forEach((a) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn " + (a.className || "btn-ghost");
      btn.textContent = a.label;
      btn.onclick = () => {
        modal.hidden = true;
        if (a.onClick) a.onClick();
      };
      box.appendChild(btn);
    });
    modal.hidden = false;
  }

  refresh(state) {
    const money = document.getElementById("walletMoney");
    if (money) money.textContent = String(state.money);
    const walletHint = document.getElementById("walletHint");
    if (walletHint) {
      const e = state.stats?.earned || 0;
      const s = state.stats?.spent || 0;
      walletHint.textContent = e || s ? `赚¥${e} · 花¥${s}` : "领零花钱·做家务·做饭可赚钱";
    }

    const list = document.getElementById("invList");
    const quest = document.getElementById("questText");
    const title = document.getElementById("questTitle");
    const actions = document.getElementById("hudActions");
    if (!list || !actions) return;

    const scene = this.game.scenes.currentId;
    actions.innerHTML = "";
    list.innerHTML = "";

    const addHead = (t) => {
      const li = document.createElement("li");
      li.className = "head";
      li.textContent = t;
      list.appendChild(li);
    };
    const addItems = (arr, empty) => {
      if (!arr.length) {
        const li = document.createElement("li");
        li.className = "empty";
        li.textContent = empty;
        list.appendChild(li);
        return;
      }
      arr.forEach((i) => {
        const li = document.createElement("li");
        const mark = i.washed ? " ·已洗" : "";
        const vessel = i.vessel ? `(${i.vessel === "bowl" ? "碗" : "盘"})` : "";
        li.innerHTML = `<span>${i.name || i.dish}${mark}${vessel}</span><span>×1</span>`;
        list.appendChild(li);
      });
    };

    if (scene === "market") {
      title.textContent = "超市购物";
      quest.textContent = state.hasCart
        ? "点货架选购，去收银台结账"
        : "先点购物车区域拿车";
      addHead("购物车");
      addItems(state.cart, "空空的");
      addHead("已买购物袋");
      addItems(state.bag, "还没结账");
      this.addBtn(actions, "去结账", () => this.doCheckout(state), "btn-coral");
    } else if (scene === "kitchen") {
      title.textContent = "厨房任务";
      quest.textContent = this.kitchenQuest(state);
      addHead("手提袋");
      addItems(state.bag, "空");
      addHead("冰箱");
      addItems(state.fridge, "空");
      addHead("操作台");
      addItems(state.prep, "空");
      addHead("做好的菜");
      addItems(state.cooked, "还没做");
      addHead("已装盘");
      addItems(state.plated, "未装盘");
      if (state.bag.length) {
        this.addBtn(actions, "全部放进冰箱", () => {
          if (putBagInFridge(state)) this.toast("食材放进冰箱啦");
          else this.toast("放不进去，检查冰箱电源");
        }, "btn-coral");
      }
      if (state.cooked.length) {
        this.addBtn(actions, "装盘 / 装碗", () => this.openPlateModal(state), "btn-coral");
      }
      if (state.plated.length && !state.carrying) {
        this.addBtn(actions, "端起装好的菜", () => {
          const item = pickUpPlated(state, 0);
          if (item) {
            this.toast(`端起了${item.dish}`);
            this.game.syncCarryVisual();
          }
        });
      }
      if (state.carrying) {
        this.addBtn(actions, "去餐厅上菜", () => this.game.go("dining"), "btn-coral");
      }
    } else if (scene === "dining") {
      title.textContent = "餐厅聚餐";
      quest.textContent = this.diningQuest(state);
      addHead("手中端着");
      if (state.carrying) addItems([state.carrying], "");
      else addItems([], "没有端菜");
      addHead("餐桌上");
      addItems(state.tableFood, "还没摆菜");
      if (state.carrying) {
        this.addBtn(actions, "放到餐桌上", () => {
          if (placeOnTable(state)) {
            this.toast("菜上桌啦，热气腾腾～");
            this.game.scenes.current?.onFoodPlaced?.(this.game);
            this.game.syncCarryVisual();
          }
        }, "btn-coral");
      }
      if (state.tableFood.length && state.mealPhase !== "eating" && state.mealPhase !== "done") {
        this.addBtn(actions, "喊爸爸妈妈吃饭！", () => {
          if (startMealCall(state)) {
            this.toast("开饭啦——爸爸妈妈快来！");
            this.game.scenes.current?.onCallFamily?.(this.game);
          }
        }, "btn-coral");
      }
    } else if (scene === "home") {
      title.textContent = "温馨小屋";
      quest.textContent = state.bag.length
        ? "提着购物袋，去厨房放冰箱吧"
        : "点电器开关，或去厨房/餐厅";
      addHead("手提袋");
      addItems(state.bag, "空");
      addHead("冰箱存货");
      addItems(state.fridge, "空");
      this.addBtn(actions, "去厨房", () => this.game.go("kitchen"));
      this.addBtn(actions, "去餐厅", () => this.game.go("dining"));
    } else {
      title.textContent = "蜜糖妆扮";
      quest.textContent = "选口红腮红换装，化好妆去超市";
      addItems([], "化妆后去购物做饭");
    }
  }

  kitchenQuest(state) {
    if (state.bag.length) return "点冰箱把购物袋放进去";
    if (state.fridge.length && !state.prep.length) return "打开冰箱取出食材";
    if (state.prep.some((i) => i.tag === "veg" && !i.washed)) return "去水槽洗菜";
    if (state.cooked.length && !state.plated.length) return "把菜装进盘子或碗里";
    if (state.plated.length || state.carrying) return "端菜去餐厅";
    return "开电器，点灶台做饭";
  }

  diningQuest(state) {
    if (state.mealPhase === "eating" || state.mealPhase === "done") return "一家人吃饭中，狗狗蹲在桌下～";
    if (state.tableFood.length) return "喊爸爸妈妈来吃饭吧";
    if (state.carrying) return "走到餐桌旁把菜放下";
    return "先去厨房做饭装盘再回来";
  }

  addBtn(parent, label, onClick, cls = "") {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn " + cls;
    btn.textContent = label;
    btn.onclick = onClick;
    parent.appendChild(btn);
  }

  openPlateModal(state) {
    const wrap = document.createElement("div");
    wrap.innerHTML = state.cooked
      .map(
        (d, idx) =>
          `<div style="display:flex;justify-content:space-between;gap:8px;margin:8px 0;align-items:center">
            <span>${d.dish}</span>
            <span>
              <button type="button" class="btn btn-coral" data-plate="${idx}" data-v="plate">装盘</button>
              <button type="button" class="btn" data-plate="${idx}" data-v="bowl">装碗</button>
            </span>
          </div>`
      )
      .join("");
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-plate]");
      if (!btn) return;
      const item = plateDish(state, Number(btn.dataset.plate), btn.dataset.v);
      if (item) {
        this.toast(`${item.dish}已装进${item.vessel === "bowl" ? "碗" : "盘子"}，热气腾腾！`);
        document.getElementById("modal").hidden = true;
        this.game.scenes.current?.onPlated?.(this.game);
      }
    });
    this.openModal("装盘装碗", wrap, [{ label: "关闭", className: "btn-ghost" }]);
  }

  doCheckout(state) {
    if (!state.cart.length) {
      this.toast("购物车是空的");
      return;
    }
    const res = checkoutCart(state);
    this.toast(res.msg);
    if (res.ok) this.game.syncCarryVisual();
  }

  bindMakeupUI() {
    const modes = document.getElementById("makeupModes");
    const tabs = document.getElementById("makeupTabs");
    const options = document.getElementById("makeupOptions");
    const title = document.getElementById("makeupPanelTitle");
    const stylesEl = document.getElementById("charStyles");
    if (!tabs || !options) return;

    const modeTabs = () => (this.makeupMode === "dress" ? MAKEUP.dressTabs : MAKEUP.makeupTabs);

    const applyToViews = () => {
      emit(this.game.state);
      const avatar = this.game.player;
      if (avatar) applyMakeup(avatar, this.game.state);
      makeup2d.render(this.game.state);
    };

    const render = () => {
      if (stylesEl) {
        stylesEl.innerHTML = CHAR_STYLES.map(
          (s) => `<button type="button" data-style="${s.id}" class="char-style-btn ${this.game.state.charStyle === s.id ? "active" : ""}" title="${s.desc}">
            <span class="char-style-icon">${s.icon}</span>
            <span class="char-style-name">${s.name}</span>
          </button>`
        ).join("");
      }
      if (modes) {
        modes.querySelectorAll("button").forEach((b) => {
          b.classList.toggle("active", b.dataset.mode === this.makeupMode);
        });
      }
      if (title) {
        title.textContent = this.makeupMode === "dress" ? "蜜糖换装间" : "蜜糖化妆台";
      }
      const listTabs = modeTabs();
      if (!listTabs.find((t) => t.id === this.makeupTab)) {
        this.makeupTab = listTabs[0]?.id || "lipstick";
      }
      tabs.innerHTML = listTabs
        .map((t) => `<button type="button" data-tab="${t.id}" class="${t.id === this.makeupTab ? "active" : ""}">${t.name}</button>`)
        .join("");
      const list = MAKEUP[this.makeupTab] || [];
      const selected = this.game.state.makeup[this.makeupTab];
      const big = this.makeupTab === "prop" || this.makeupTab === "accessory";
      options.classList.toggle("options-props", big);
      options.innerHTML = list
        .map((o) => {
          const icon = o.icon
            ? `<span class="product-icon${big ? " product-icon-lg" : ""}" aria-hidden="true">${o.icon}</span>`
            : o.color
              ? `<div class="swatch" style="background:${o.color}"></div>`
              : "";
          const desc = o.desc ? `<small class="product-desc">${o.desc}</small>` : "";
          const colorDot = o.color
            ? `<span class="product-dot" style="background:${o.color}"></span>`
            : "";
          return `<button type="button" data-opt="${o.id}" class="product-card ${big ? "product-card-lg" : ""} ${selected === o.id ? "selected" : ""}">
            ${icon}
            <span class="product-name">${colorDot}${o.name}</span>
            ${desc}
          </button>`;
        })
        .join("");
    };

    stylesEl?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-style]");
      if (!b) return;
      const style = CHAR_STYLES.find((s) => s.id === b.dataset.style);
      if (!style) return;
      this.game.state.charStyle = style.id;
      Object.assign(this.game.state.makeup, style.makeup);
      applyToViews();
      this.toast(`已切换风格：${style.name}`);
      render();
    });
    modes?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-mode]");
      if (!b) return;
      this.makeupMode = b.dataset.mode;
      this.makeupTab = modeTabs()[0]?.id || "lipstick";
      render();
    });
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-tab]");
      if (!b) return;
      this.makeupTab = b.dataset.tab;
      render();
    });
    options.addEventListener("click", (e) => {
      const b = e.target.closest("[data-opt]");
      if (!b) return;
      this.game.state.makeup[this.makeupTab] = b.dataset.opt;
      applyToViews();
      const opt = (MAKEUP[this.makeupTab] || []).find((o) => o.id === b.dataset.opt);
      this.toast(`已换上：${opt?.name || b.textContent.trim()}`);
      render();
    });
    render();
  }

  openApplianceModal(key, label, onChanged, { extra = [] } = {}) {
    const mode = getPowerMode(this.game.state, key);
    const modeLabel = mode === "on" ? "运行中" : mode === "paused" ? "已暂停" : "已关闭";
    const wrap = document.createElement("div");
    wrap.innerHTML = `<p style="margin:0 0 12px;line-height:1.5">当前状态：<strong>${modeLabel}</strong></p>
      <p style="margin:0;color:#887078;font-size:13px">请选择操作：</p>`;
    const actions = [
      {
        label: "打开",
        className: "btn-coral",
        onClick: () => {
          setPower(this.game.state, key, "on");
          onChanged?.();
          this.toast(`${label}已打开`);
        },
      },
      {
        label: "关闭",
        className: "btn-ghost",
        onClick: () => {
          setPower(this.game.state, key, "off");
          onChanged?.();
          this.toast(`${label}已关闭`);
        },
      },
      {
        label: "暂停",
        className: "btn-ghost",
        onClick: () => {
          setPower(this.game.state, key, "paused");
          onChanged?.();
          this.toast(`${label}已暂停`);
        },
      },
      ...extra,
      { label: "取消", className: "btn-ghost" },
    ];
    this.openModal(label || APPLIANCE_NAMES[key] || key, wrap, actions);
  }

  openFridgeModal(state) {
    if (state.bag.length) {
      this.openModal("冰箱", `手提袋有 ${state.bag.length} 件，全部放进冰箱？`, [
        { label: "取消", className: "btn-ghost" },
        {
          label: "放进冰箱",
          className: "btn-coral",
          onClick: () => {
            if (putBagInFridge(state)) this.toast("放好啦");
          },
        },
      ]);
      return;
    }
    if (!state.fridge.length) {
      this.toast("冰箱空空的");
      return;
    }
    const wrap = document.createElement("div");
    wrap.innerHTML = state.fridge
      .map(
        (i, idx) =>
          `<div style="display:flex;justify-content:space-between;margin:6px 0">
            <span>${i.name}</span>
            <button type="button" class="btn btn-coral" data-take="${idx}">取出</button>
          </div>`
      )
      .join("");
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-take]");
      if (!b) return;
      const item = takeFromFridge(state, Number(b.dataset.take));
      if (item) {
        this.toast(`取出了${item.name}`);
        document.getElementById("modal").hidden = true;
      }
    });
    this.openModal("打开冰箱", wrap, [{ label: "关门", className: "btn-ghost" }]);
  }
}

export { washPrep, togglePower, setPower, startCook, addToCart };
