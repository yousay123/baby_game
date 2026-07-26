import { SCENES, MAKEUP, MARKET_GOODS, APPLIANCE_NAMES, CHAR_STYLES, DISH_RECIPES, ALL_GOODS } from "../core/constants.js";
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
  isPowerOn,
  startCook,
  startCookRecipe,
  analyzeRecipe,
  buyIngredientDirect,
  buyMissingIngredients,
  takeIngredientToPrep,
  checkoutCart,
  addToCart,
} from "../gameplay/systems.js";
import { emit } from "../gameplay/GameState.js";
import { applyMakeup } from "../characters/Avatar.js";
import { makeup2d } from "./Makeup2D.js";
import { VirtualStick } from "./VirtualStick.js";

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

    const stickEl = document.getElementById("virtualStick");
    this.stick = stickEl
      ? new VirtualStick(stickEl, ({ x, z }) => {
          if (game.fp) game.fp.stick = { x, z };
        })
      : null;
    this.stickVisible = false;

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
    if (panel) {
      // 厨房/餐厅默认展开引导，方便点步骤走路执行
      if (id === "kitchen" || id === "dining") {
        panel.classList.remove("hud-collapsed");
        if (toggle) toggle.textContent = "收起";
      } else if (id !== "makeup") {
        panel.classList.add("hud-collapsed");
        if (toggle) toggle.textContent = "物品";
      }
    }
    if (id === "makeup") {
      makeup2d.show();
      makeup2d.render(this.game.state);
      if (this.game.fp) {
        this.game.fp.enabled = false;
        this.game.fp.stick = { x: 0, z: 0 };
      }
      this.stickVisible = false;
      this.stick?.setVisible(false);
    } else {
      makeup2d.hide();
      if (this.game.fp) this.game.fp.enabled = true;
      this.stickVisible = true;
      this.stick?.setVisible(true);
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
    if (quest) {
      quest.classList.remove("quest-clickable");
      quest.onclick = null;
    }

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
      const hintNames = (state.shoppingHint || [])
        .map((id) => ALL_GOODS.find((g) => g.id === id)?.name || id)
        .filter(Boolean);
      quest.textContent = hintNames.length
        ? `菜谱还缺：${hintNames.join("、")}，点货架选购后去收银台`
        : state.cart.length
          ? "选好了去收银台结账，或点购物车旁柜台"
          : "直接点货架选购，结账后回家";
      addHead("购物车");
      addItems(state.cart, "空空的");
      addHead("已买购物袋");
      addItems(state.bag, "还没结账");
      this.addBtn(actions, "去结账", () => this.doCheckout(state), "btn-coral");
    } else if (scene === "kitchen") {
      title.textContent = "厨房引导";
      const guide = this.buildKitchenGuide(state);
      quest.textContent = guide.quest;
      quest.classList.toggle("quest-clickable", !!guide.action?.onClick);
      quest.onclick = guide.action?.onClick
        ? () => {
            guide.action.onClick();
            this.refresh(this.game.state);
          }
        : null;
      list.innerHTML = "";
      guide.steps.forEach((s, i) => {
        const li = document.createElement("li");
        li.className = s.done ? "guide-done" : s.current ? "guide-current" : "guide-todo";
        if (s.onClick) {
          li.classList.add("guide-clickable");
          li.setAttribute("role", "button");
          li.tabIndex = 0;
          const tip = s.current ? "点我前往 ›" : "前往 ›";
          li.innerHTML = `<span>${i + 1}. ${s.text}</span><em class="guide-go">${tip}</em>`;
          li.onclick = () => {
            s.onClick();
            this.refresh(this.game.state);
          };
        } else {
          li.innerHTML = `<span>${i + 1}. ${s.text}</span>`;
        }
        list.appendChild(li);
      });
      actions.innerHTML = "";
      if (guide.action) {
        this.addBtn(actions, guide.action.label, () => {
          guide.action.onClick();
          this.refresh(this.game.state);
        }, "btn-coral");
      }
      if (guide.secondary) {
        guide.secondary.forEach((s) => {
          this.addBtn(actions, s.label, () => {
            s.onClick();
            this.refresh(this.game.state);
          });
        });
      }
    } else if (scene === "dining") {
      title.textContent = "餐厅聚餐";
      quest.textContent = this.diningQuest(state);
      const diningAct = () => {
        if (state.carrying) {
          const sceneRef = this.game.scenes.current;
          const run = () => {
            if (placeOnTable(state)) {
              this.toast("菜上桌啦！下一步：喊爸爸妈妈来坐下吃饭");
              sceneRef?.onFoodPlaced?.(this.game);
              this.game.syncCarryVisual();
              this.refresh(state);
            }
          };
          if (typeof sceneRef?.walkTo === "function") {
            this.toast("走到餐桌旁～");
            sceneRef.walkTo({ x: 0, z: 1.4 }, run);
          } else run();
          return;
        }
        if (
          state.tableFood.length &&
          !["eating", "done", "calling", "seating"].includes(state.mealPhase)
        ) {
          if (startMealCall(state)) {
            this.toast("开饭啦——爸爸妈妈快来餐厅坐好！");
            this.game.scenes.current?.onCallFamily?.(this.game);
            this.refresh(state);
          }
        }
      };
      if (state.carrying || (state.tableFood.length && !["eating", "done", "calling", "seating"].includes(state.mealPhase))) {
        quest.classList.add("quest-clickable");
        quest.onclick = diningAct;
      }
      addHead("手中端着");
      if (state.carrying) addItems([state.carrying], "");
      else addItems([], "没有端菜");
      addHead("餐桌上");
      addItems(state.tableFood, "还没摆菜");
      if (state.carrying) {
        this.addBtn(actions, "▶ 走到餐桌放下", diningAct, "btn-coral");
      }
      if (state.tableFood.length && state.mealPhase !== "eating" && state.mealPhase !== "done" && state.mealPhase !== "calling" && state.mealPhase !== "seating") {
        this.addBtn(actions, "▶ 喊爸爸妈妈来坐下吃饭", diningAct, "btn-coral");
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

  /** 走到厨房目标点再执行（已在附近则直接执行） */
  walkKitchenTo(pos, onArrive, walkingToast = "这就过去～") {
    const scene = this.game.scenes.current;
    const go = () => {
      onArrive?.();
      this.refresh(this.game.state);
    };
    if (this.game.scenes.currentId !== "kitchen" || typeof scene?.walkTo !== "function") {
      go();
      return;
    }
    const px = scene.player?.position?.x ?? 0;
    const pz = scene.player?.position?.z ?? 0;
    if (Math.hypot(pos.x - px, pos.z - pz) < 1.4) {
      go();
      return;
    }
    this.toast(walkingToast);
    scene.walkTo(pos, go);
  }

  kitchenQuest(state) {
    if (state.bag.length) return "下一步：点这里 → 走到冰箱放食材";
    if (state.prep.some((i) => (i.tag === "veg" || i.tag === "meat" || i.tag === "seafood") && !i.washed)) {
      return "下一步：点这里 → 走到水槽洗菜";
    }
    if (state.cooked.length) return "下一步：点这里 → 走到装盘台装盘";
    if (state.plated.length && !state.carrying) return "下一步：点这里 → 端菜去餐厅";
    if (state.carrying) return "下一步：点这里 → 去餐厅上桌";
    if (state.cooking) return "正在做饭，稍等一下～";
    return "下一步：点这里 → 打开灶台菜谱做饭";
  }

  buildKitchenGuide(state) {
    const needsWash = state.prep.some(
      (i) => (i.tag === "veg" || i.tag === "meat" || i.tag === "seafood") && !i.washed
    );
    const hasCookedFlow = !!(
      state.cooked.length ||
      state.plated.length ||
      state.carrying ||
      state.tableFood?.length
    );

    const goFridge = () => {
      this.walkKitchenTo({ x: -4.0, z: -1.4 }, () => {
        if (state.bag.length) {
          if (!isPowerOn(state, "fridge")) setPower(state, "fridge", "on");
          if (putBagInFridge(state)) this.toast("食材放进冰箱啦，打开菜谱继续做饭吧");
          else this.toast("放冰箱失败，再试一次～");
        } else {
          this.openApplianceModal("fridge", APPLIANCE_NAMES.fridge, () => {
            this.game.scenes.current?.applyPower?.(state);
          });
        }
      }, "走到冰箱～");
    };

    const goSinkWash = () => {
      this.walkKitchenTo({ x: -2.4, z: -1.5 }, () => {
        const washed = washPrep(state);
        this.toast(washed ? "洗干净啦！可以开做了" : "操作台没有要洗的食材");
      }, "走到洗菜池～");
    };

    const goStoveRecipe = () => {
      this.walkKitchenTo({ x: -0.4, z: -1.5 }, () => {
        this.openCookRecipeModal("stove");
      }, "走到燃气灶看菜谱～");
    };

    const goPlate = () => {
      this.walkKitchenTo({ x: 3.6, z: 2.4 }, () => {
        if (state.cooked.length) {
          this.openPlateModal(state);
          this.toast("选盘子或碗，把做好的菜装好");
        } else if (state.plated.length && !state.carrying) {
          const item = pickUpPlated(state, 0);
          if (item) {
            this.toast(`端起了${item.dish}`);
            this.game.syncCarryVisual();
          }
        } else {
          this.toast("还没有要装的菜哦");
        }
      }, "走到装盘台～");
    };

    const goDiningServe = async () => {
      if (state.plated.length && !state.carrying) {
        const item = pickUpPlated(state, 0);
        if (item) {
          this.toast(`端起了${item.dish}，去餐厅上桌`);
          this.game.syncCarryVisual();
        }
      }
      if (!state.carrying && !this.game.state.carrying) {
        this.toast("先装盘再端菜哦");
        goPlate();
        return;
      }
      this.toast("去餐厅放到餐桌～");
      await this.game.go("dining");
      const dining = this.game.scenes.current;
      if (typeof dining?.walkTo === "function") {
        dining.walkTo({ x: 0, z: 1.4 }, () => {
          if (placeOnTable(this.game.state)) {
            this.toast("菜上桌啦！点引导喊爸爸妈妈吃饭");
            dining.onFoodPlaced?.(this.game);
            this.game.syncCarryVisual();
            this.refresh(this.game.state);
          }
        });
      }
    };

    const callFamily = async () => {
      if (this.game.scenes.currentId !== "dining") {
        await this.game.go("dining");
      }
      if (startMealCall(state)) {
        this.toast("开饭啦——爸爸妈妈快来餐厅坐好！");
        this.game.scenes.current?.onCallFamily?.(this.game);
      } else if (state.tableFood?.length) {
        this.toast("爸爸妈妈已经在路上或坐好啦");
      } else {
        this.toast("先把菜放到餐桌上再喊人吃饭");
      }
      this.refresh(this.game.state);
    };

    const steps = [
      {
        text: "打开灶台菜谱，采购材料并做饭",
        done: hasCookedFlow || state.cooking,
        onClick: goStoveRecipe,
      },
      {
        text: "蔬菜洗净（若需要）",
        done: !needsWash,
        onClick: goSinkWash,
      },
      {
        text: "把做好的菜装盘/装碗",
        done: !state.cooked.length && (!!state.plated.length || !!state.carrying || !!state.tableFood?.length),
        onClick: goPlate,
      },
      {
        text: "端菜去餐厅放到餐桌",
        done: !!state.tableFood?.length || ["calling", "seating", "eating", "done"].includes(state.mealPhase),
        onClick: () => goDiningServe(),
      },
      {
        text: "喊爸爸妈妈来坐下吃饭",
        done: ["calling", "seating", "eating", "done"].includes(state.mealPhase),
        onClick: () => callFamily(),
      },
    ];
    const curIdx = steps.findIndex((s) => !s.done);
    if (curIdx >= 0) steps[curIdx].current = true;

    let action = null;
    const secondary = [];

    if (state.bag.length) {
      action = { label: "▶ 走到冰箱放食材", onClick: goFridge };
      secondary.push({ label: "打开灶台菜谱", onClick: goStoveRecipe });
    } else if (needsWash) {
      action = { label: "▶ 走到水槽洗菜", onClick: goSinkWash };
      secondary.push({ label: "打开灶台菜谱", onClick: goStoveRecipe });
    } else if (state.cooking) {
      action = { label: "正在做饭…请稍等", onClick: () => this.toast("锅里还在炒呢～") };
    } else if (state.cooked.length) {
      action = { label: "▶ 走到装盘台", onClick: goPlate };
      secondary.push({ label: "打开灶台菜谱", onClick: goStoveRecipe });
    } else if (state.plated.length && !state.carrying) {
      action = { label: "▶ 端菜去餐厅上桌", onClick: () => goDiningServe() };
    } else if (state.carrying) {
      action = { label: "▶ 去餐厅放到餐桌", onClick: () => goDiningServe() };
    } else if (state.tableFood?.length && !["calling", "seating", "eating", "done"].includes(state.mealPhase)) {
      action = { label: "▶ 喊爸爸妈妈吃饭", onClick: () => callFamily() };
      secondary.push({ label: "再做一道菜", onClick: goStoveRecipe });
    } else {
      action = { label: "▶ 走到灶台打开菜谱", onClick: goStoveRecipe };
      secondary.push(
        { label: "电饭煲菜谱", onClick: () => this.walkKitchenTo({ x: 1.4, z: -1.5 }, () => this.openCookRecipeModal("rice"), "走到电饭煲～") },
        { label: "烤箱菜谱", onClick: () => this.walkKitchenTo({ x: 3.0, z: -1.5 }, () => this.openCookRecipeModal("oven"), "走到烤箱～") }
      );
    }

    return { quest: this.kitchenQuest(state), steps, action, secondary };
  }

  diningQuest(state) {
    if (state.mealPhase === "eating") return "一家人坐着吃饭聊天中～";
    if (state.mealPhase === "done") return "吃饱啦！可以回厨房再做一道菜";
    if (state.mealPhase === "calling" || state.mealPhase === "seating") return "爸爸妈妈正在过来坐下…";
    if (state.tableFood.length) return "下一步：喊爸爸妈妈来坐下吃饭";
    if (state.carrying) return "下一步：把菜放到餐桌上";
    return "先去厨房按引导做饭装盘再回来";
  }

  addBtn(parent, label, onClick, cls = "") {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn " + cls;
    btn.textContent = label;
    btn.onclick = onClick;
    parent.appendChild(btn);
  }

  /** 成品菜样式预览 */
  renderDishPreview(recipe) {
    const p = recipe.preview || { plate: "#faf6f0", foods: [] };
    const foods = (p.foods || [])
      .map(
        (f) =>
          `<span class="dish-blob" style="background:${f.color};left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%;border-radius:${f.r}%"></span>`
      )
      .join("");
    const shape = p.bowl ? "dish-preview--bowl" : "";
    return `<div class="dish-preview ${shape}" style="--plate:${p.plate}">${foods}</div>`;
  }

  /**
   * 灶台/电饭煲/烤箱菜谱面板
   * @param {"stove"|"rice"|"oven"} station
   * @param {string} [keepRecipeId] 刷新后面板仍展开该菜
   */
  openCookRecipeModal(station = "stove", keepRecipeId = null) {
    const state = this.game.state;
    const recipes = DISH_RECIPES.filter((r) => r.station === station);
    const stationName =
      station === "stove" ? "燃气灶菜谱" : station === "rice" ? "电饭煲菜谱" : "烤箱菜谱";
    const powerKey = station === "rice" ? "rice" : station === "oven" ? "oven" : "stove";
    const powerOn = isPowerOn(state, powerKey);
    const powerLabel = APPLIANCE_NAMES[powerKey] || powerKey;

    const wrap = document.createElement("div");
    wrap.className = "recipe-panel";
    wrap.innerHTML = `
      <p class="recipe-power ${powerOn ? "is-on" : ""}">
        ${powerLabel}：${powerOn ? "已打开" : "未打开"}
        ${powerOn ? "" : `<button type="button" class="btn btn-coral btn-sm" data-power-on="${powerKey}">先打开</button>`}
      </p>
      <p class="recipe-hint">共 ${recipes.length} 道菜 · 选一道；缺料可直接采购到操作台，洗菜后开做</p>
      <div class="recipe-list"></div>
      <div class="recipe-detail" hidden></div>
    `;

    const listEl = wrap.querySelector(".recipe-list");
    const detailEl = wrap.querySelector(".recipe-detail");

    const showDetail = (recipeId) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return;
      const { ingredients, needBuy, canCook } = analyzeRecipe(state, recipe);
      const missCost = needBuy.reduce((s, i) => s + (Number(i.price) || ALL_GOODS.find((g) => g.id === i.id)?.price || 0), 0);
      detailEl.hidden = false;
      detailEl.innerHTML = `
        <div class="recipe-detail-head">
          ${this.renderDishPreview(recipe)}
          <div>
            <h3 class="recipe-name">${recipe.icon || ""} ${recipe.name}</h3>
            <p class="recipe-desc">${recipe.desc || ""}</p>
          </div>
        </div>
        <ul class="recipe-ings">
          ${ingredients
            .map((ing) => {
              const goods = ALL_GOODS.find((g) => g.id === ing.id);
              const price = goods?.price || 0;
              const cls =
                ing.status === "missing"
                  ? "is-missing"
                  : ing.status === "have"
                    ? "is-have"
                    : "is-warn";
              let actionBtn = "";
              if (ing.status === "missing") {
                actionBtn = `<button type="button" class="btn btn-coral btn-sm" data-buy="${ing.id}">采购 ¥${price}</button>`;
              } else if (ing.status === "inFridge") {
                actionBtn = `<button type="button" class="btn btn-coral btn-sm" data-take="${ing.id}">取出</button>`;
              } else if (ing.status === "inBag") {
                actionBtn = `<button type="button" class="btn btn-coral btn-sm" data-buy="${ing.id}">放到操作台</button>`;
              }
              return `<li class="${cls}">
                <span class="ing-swatch" style="background:${ing.color || goods?.color || "#ccc"}"></span>
                <span class="ing-name">${ing.name}</span>
                <span class="ing-status">${ing.label}</span>
                ${actionBtn}
              </li>`;
            })
            .join("")}
        </ul>
        <div class="recipe-actions">
          ${
            needBuy.length
              ? `<button type="button" class="btn btn-coral" data-buy-all="1">一键采购缺料 ¥${missCost}</button>`
              : canCook
                ? `<button type="button" class="btn btn-coral" data-cook="${recipe.id}">开始做${recipe.name}</button>`
                : `<div class="recipe-block-wrap">
                    <p class="recipe-block">${
                      ingredients.find((i) => i.status === "needWash")
                        ? "蔬菜还没洗，先去水槽洗菜～"
                        : ingredients.find((i) => i.status === "inFridge")
                          ? "材料在冰箱，点「取出」放到操作台"
                          : ingredients.find((i) => i.status === "inBag")
                            ? "材料在购物袋，点上面按钮放到操作台"
                            : state.cooking
                              ? "正在做饭中…"
                              : !isPowerOn(state, powerKey)
                                ? `请先打开${powerLabel}`
                                : "材料还没准备好"
                    }</p>
                    ${
                      ingredients.some((i) => i.status === "inFridge")
                        ? `<button type="button" class="btn btn-coral" data-take-all="1">全部取出到操作台</button>`
                        : ""
                    }
                  </div>`
          }
        </div>
      `;

      detailEl.querySelectorAll("[data-buy]").forEach((btn) => {
        btn.onclick = () => {
          const res = buyIngredientDirect(state, btn.dataset.buy);
          this.toast(res.msg);
          this.openCookRecipeModal(station, recipe.id);
        };
      });
      detailEl.querySelectorAll("[data-take]").forEach((btn) => {
        btn.onclick = () => {
          const res = takeIngredientToPrep(state, btn.dataset.take);
          this.toast(res.msg);
          this.openCookRecipeModal(station, recipe.id);
        };
      });
      const buyAll = detailEl.querySelector("[data-buy-all]");
      if (buyAll) {
        buyAll.onclick = () => {
          const res = buyMissingIngredients(state, recipe.id);
          this.toast(res.msg);
          this.openCookRecipeModal(station, recipe.id);
        };
      }
      const takeAll = detailEl.querySelector("[data-take-all]");
      if (takeAll) {
        takeAll.onclick = () => {
          ingredients
            .filter((i) => i.status === "inFridge")
            .forEach((i) => takeIngredientToPrep(state, i.id));
          this.toast("食材已放到操作台");
          this.openCookRecipeModal(station, recipe.id);
        };
      }
      const cookBtn = detailEl.querySelector("[data-cook]");
      if (cookBtn) {
        cookBtn.onclick = () => {
          if (!isPowerOn(state, powerKey)) {
            setPower(state, powerKey, "on");
            this.game.scenes.current?.applyPower?.(state);
          }
          const res = startCookRecipe(state, recipe.id, (r) => {
            this.toast(`${r.dish}做好啦！去装盘，再端到餐厅喊爸妈吃饭～`);
          });
          this.toast(res.msg);
          if (res.ok) document.getElementById("modal").hidden = true;
          else this.openCookRecipeModal(station, recipe.id);
        };
      }
    };

    recipes.forEach((recipe) => {
      const { needBuy, canCook, ingredients } = analyzeRecipe(state, recipe);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "recipe-card";
      const miss = needBuy.length
        ? `缺${needBuy.length}样`
        : canCook
          ? "可以开做"
          : ingredients.some((i) => i.status === "needWash")
            ? "需洗菜"
            : "备料中";
      card.innerHTML = `
        ${this.renderDishPreview(recipe)}
        <div class="recipe-card-meta">
          <strong>${recipe.name}</strong>
          <span class="recipe-card-tag ${needBuy.length ? "tag-miss" : canCook ? "tag-ok" : "tag-warn"}">${miss}</span>
        </div>
      `;
      card.onclick = () => {
        listEl.querySelectorAll(".recipe-card").forEach((c) => c.classList.remove("is-active"));
        card.classList.add("is-active");
        showDetail(recipe.id);
      };
      listEl.appendChild(card);
    });

    wrap.querySelector("[data-power-on]")?.addEventListener("click", (e) => {
      const key = e.currentTarget.dataset.powerOn;
      setPower(state, key, "on");
      this.game.scenes.current?.applyPower?.(state);
      this.toast(`${APPLIANCE_NAMES[key] || key}已打开`);
      this.openCookRecipeModal(station);
    });

    // 默认展开（刷新时保持当前菜；灶台优先西红柿炒鸡蛋）
    const preferred =
      (keepRecipeId && recipes.find((r) => r.id === keepRecipeId)) ||
      recipes.find((r) => r.id === "tomatoEgg") ||
      recipes[0];
    if (preferred) {
      const cards = [...listEl.querySelectorAll(".recipe-card")];
      const idx = recipes.findIndex((r) => r.id === preferred.id);
      const card = cards[idx] || cards[0];
      if (card) {
        card.classList.add("is-active");
        showDetail(preferred.id);
      }
    }

    this.openModal(stationName, wrap, [{ label: "关闭", className: "btn-ghost" }]);
  }

  openPlateModal(state) {
    const wrap = document.createElement("div");
    if (!state.cooked.length) {
      wrap.innerHTML = `<p style="margin:0;line-height:1.5;color:#887078">还没有做好的菜。请先去灶台按菜谱做饭～</p>`;
      this.openModal("装盘台", wrap, [
        {
          label: "去看菜谱",
          className: "btn-coral",
          onClick: () => this.openCookRecipeModal("stove"),
        },
        { label: "关闭", className: "btn-ghost" },
      ]);
      return;
    }
    wrap.innerHTML = `<p style="margin:0 0 10px;color:#887078;font-size:13px">把做好的菜装进盘子或碗里，再端去餐厅餐桌。</p>${state.cooked
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
      .join("")}`;
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-plate]");
      if (!btn) return;
      const item = plateDish(state, Number(btn.dataset.plate), btn.dataset.v);
      if (item) {
        this.toast(`${item.dish}已装好！点引导「端起菜去餐厅」放到餐桌吧`);
        document.getElementById("modal").hidden = true;
        this.game.scenes.current?.onPlated?.(this.game);
        this.refresh(state);
      }
    });
    this.openModal("装盘台 · 装好菜", wrap, [{ label: "关闭", className: "btn-ghost" }]);
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
    const bgEl = document.getElementById("bgStyles");
    if (!tabs || !options) return;

    const modeTabs = () => (this.makeupMode === "dress" ? MAKEUP.dressTabs : MAKEUP.makeupTabs);

    const applyToViews = () => {
      emit(this.game.state);
      const avatar = this.game.player;
      if (avatar) applyMakeup(avatar, this.game.state);
      makeup2d.render(this.game.state);
    };

    const render = () => {
      if (bgEl) {
        const selBg = this.game.state.makeup.bg || "bgRose";
        bgEl.innerHTML = `<span class="bg-styles-label">背景</span>${MAKEUP.bg
          .map(
            (b) =>
              `<button type="button" data-bg="${b.id}" class="bg-style-btn ${selBg === b.id ? "active" : ""}" title="${b.desc}">
                <span>${b.icon}</span>
              </button>`
          )
          .join("")}`;
      }
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
      const big = ["prop", "hat", "jewelry", "baby"].includes(this.makeupTab);
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

    bgEl?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-bg]");
      if (!b) return;
      this.game.state.makeup.bg = b.dataset.bg;
      applyToViews();
      const opt = MAKEUP.bg.find((x) => x.id === b.dataset.bg);
      this.toast(`背景：${opt?.name || ""}`);
      render();
    });
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

export { washPrep, togglePower, setPower, startCook, startCookRecipe, addToCart };
