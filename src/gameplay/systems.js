import { emit, cloneItem } from "./GameState.js";
import { RECIPES, DISH_RECIPES, ALL_GOODS } from "../core/constants.js";

export function plateDish(state, cookedIndex, vessel) {
  if (cookedIndex < 0 || cookedIndex >= state.cooked.length) return false;
  const dish = state.cooked.splice(cookedIndex, 1)[0];
  const item = {
    id: `plated-${Date.now()}`,
    dish: dish.dish,
    icon: dish.icon,
    vessel: vessel || dish.vesselDefault || "plate",
    hot: true,
  };
  state.plated.push(item);
  emit(state);
  return item;
}

export function pickUpPlated(state, platedIndex) {
  if (state.carrying) return null;
  if (platedIndex < 0 || platedIndex >= state.plated.length) return null;
  const item = state.plated.splice(platedIndex, 1)[0];
  state.carrying = item;
  emit(state);
  return item;
}

export function placeOnTable(state) {
  if (!state.carrying) return false;
  state.tableFood.push(state.carrying);
  state.carrying = null;
  if (state.mealPhase === "idle") state.mealPhase = "ready";
  emit(state);
  return true;
}

export function startMealCall(state) {
  if (!state.tableFood.length) return false;
  state.mealPhase = "calling";
  emit(state);
  return true;
}

export function setMealPhase(state, phase) {
  state.mealPhase = phase;
  emit(state);
}

export function hasPrepTag(state, tag) {
  return state.prep.some((i) => i.tag === tag);
}

export function hasWashedVeg(state) {
  return state.prep.some((i) => i.tag === "veg" && i.washed);
}

export function findItemIn(list, ingredientId) {
  return (list || []).find((i) => i.id === ingredientId) || null;
}

/** 厨房可用：操作台 prep 或冰箱 fridge */
export function getIngredientKitchenStatus(state, ingredientId) {
  const inPrep = findItemIn(state.prep, ingredientId);
  const inFridge = findItemIn(state.fridge, ingredientId);
  const inBag = findItemIn(state.bag, ingredientId);
  const goods = ALL_GOODS.find((g) => g.id === ingredientId);
  return {
    id: ingredientId,
    name: goods?.name || ingredientId,
    tag: goods?.tag,
    color: goods?.color,
    icon: goods?.icon,
    inPrep: !!inPrep,
    inFridge: !!inFridge,
    inBag: !!inBag,
    have: !!(inPrep || inFridge),
    washed: !!(inPrep && inPrep.washed),
    needBuy: !(inPrep || inFridge || inBag),
  };
}

export function analyzeRecipe(state, recipe) {
  const ingredients = (recipe.ingredients || []).map((ing) => {
    const st = getIngredientKitchenStatus(state, ing.id);
    const needWash = !!ing.needWash;
    let status = "have";
    let label = "已有";
    if (st.needBuy) {
      status = "missing";
      label = "需购买";
    } else if (st.inBag && !st.have) {
      status = "inBag";
      label = "已购·请进冰箱";
    } else if (needWash && st.inPrep && !st.washed) {
      status = "needWash";
      label = "已有·需洗净";
    } else if (!st.inPrep && st.inFridge) {
      status = "inFridge";
      label = "冰箱里·请取出";
    } else {
      status = "have";
      label = needWash && st.washed ? "已有·已洗" : "已有";
    }
    return {
      ...ing,
      ...st,
      needWash,
      status,
      label,
    };
  });
  const needBuy = ingredients.filter((i) => i.status === "missing");
  const canCook =
    !state.cooking &&
    ingredients.every((i) => {
      if (i.status === "missing" || i.status === "inBag" || i.status === "inFridge") return false;
      if (i.needWash && !i.washed) return false;
      return i.inPrep;
    });
  return { ingredients, needBuy, canCook };
}

export function consumePrepIngredients(state, ingredients) {
  ingredients.forEach((ing) => {
    let idx = -1;
    if (ing.needWash) {
      idx = state.prep.findIndex((i) => i.id === ing.id && i.washed);
    }
    if (idx < 0) idx = state.prep.findIndex((i) => i.id === ing.id);
    if (idx >= 0) state.prep.splice(idx, 1);
  });
  emit(state);
}

export function consumePrepTags(state, tags) {
  tags.forEach((tag) => {
    let idx = -1;
    if (tag === "veg") {
      idx = state.prep.findIndex((i) => i.tag === "veg" && i.washed);
      if (idx < 0) idx = state.prep.findIndex((i) => i.tag === "veg");
    } else {
      idx = state.prep.findIndex((i) => i.tag === tag);
    }
    if (idx >= 0) state.prep.splice(idx, 1);
  });
  emit(state);
}

/** 按菜谱 id 开做 */
export function startCookRecipe(state, recipeId, onDone) {
  if (state.cooking) return { ok: false, msg: "正在做饭中…" };
  const recipe = DISH_RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return { ok: false, msg: "未知菜谱" };
  if (recipe.power && !isPowerOn(state, recipe.power)) {
    const tip =
      recipe.power === "stove" ? "燃气灶" : recipe.power === "rice" ? "电饭煲" : "烤箱";
    return { ok: false, msg: `请先打开${tip}` };
  }
  const analysis = analyzeRecipe(state, recipe);
  if (analysis.needBuy.length) {
    return {
      ok: false,
      msg: `还缺：${analysis.needBuy.map((i) => i.name).join("、")}，去超市买吧`,
      needBuy: analysis.needBuy,
    };
  }
  if (!analysis.canCook) {
    const wash = analysis.ingredients.find((i) => i.status === "needWash");
    if (wash) return { ok: false, msg: `${wash.name}还没洗，先去水槽洗菜～` };
    const fr = analysis.ingredients.find((i) => i.status === "inFridge");
    if (fr) return { ok: false, msg: `${fr.name}在冰箱里，请先取出到操作台` };
    const bag = analysis.ingredients.find((i) => i.status === "inBag");
    if (bag) return { ok: false, msg: `${bag.name}还在购物袋，请先放进冰箱再取出` };
    return { ok: false, msg: "材料还没准备好～" };
  }
  if (recipe.needHood && !isPowerOn(state, "hood")) {
    setPower(state, "hood", "on");
  }
  state.cooking = true;
  consumePrepIngredients(state, recipe.ingredients);
  setTimeout(() => {
    state.cooking = false;
    state.cooked.push({
      dish: recipe.dish,
      icon: recipe.icon,
      name: recipe.name,
      vesselDefault: recipe.vesselDefault,
      recipeId: recipe.id,
    });
    emit(state);
    if (onDone) onDone(recipe);
  }, recipe.time);
  emit(state);
  return { ok: true, msg: `正在做${recipe.name}…` };
}

/** 兼容旧调用 startCook("stirfry") */
export function startCook(state, type, onDone) {
  const mapped = RECIPES[type];
  if (mapped?.id) return startCookRecipe(state, mapped.id, onDone);
  return { ok: false, msg: "请从菜谱菜单选择要做的菜" };
}

export function putBagInFridge(state) {
  if (!state.bag.length) return false;
  if (!isPowerOn(state, "fridge")) return false;
  state.fridge.push(...state.bag.map(cloneItem));
  state.bag = [];
  emit(state);
  return true;
}

export function takeFromFridge(state, idx) {
  if (idx < 0 || idx >= state.fridge.length) return null;
  if (!isPowerOn(state, "fridge")) return null;
  const item = state.fridge.splice(idx, 1)[0];
  state.prep.push(item);
  state.holding = item;
  emit(state);
  return item;
}

export function washPrep(state) {
  const vegs = state.prep.filter((i) => i.tag === "veg" && !i.washed);
  if (!vegs.length) return false;
  vegs.forEach((i) => {
    i.washed = true;
  });
  emit(state);
  return true;
}

/** Normalize legacy boolean / string power values */
export function getPowerMode(state, key) {
  const v = state.power[key];
  if (v === true || v === "on") return "on";
  if (v === "paused") return "paused";
  return "off";
}

export function isPowerOn(state, key) {
  return getPowerMode(state, key) === "on";
}

export function isPowerActive(state, key) {
  const m = getPowerMode(state, key);
  return m === "on" || m === "paused";
}

export function setPower(state, key, mode) {
  if (!(key in state.power)) return false;
  if (!["on", "off", "paused"].includes(mode)) return false;
  state.power[key] = mode;
  emit(state);
  return mode;
}

/** Flip between on and off (paused → on). Kept for compatibility. */
export function togglePower(state, key) {
  if (!(key in state.power)) return false;
  const next = isPowerOn(state, key) ? "off" : "on";
  state.power[key] = next;
  emit(state);
  return next === "on";
}

export function checkoutCart(state) {
  const sub = state.cart.reduce((s, i) => s + i.price, 0);
  const vegCount = state.cart.filter((i) => i.tag === "veg").length;
  const disc = vegCount >= 3 ? 2 : 0;
  const total = Math.max(0, sub - disc);
  if (state.money < total) return { ok: false, total, msg: "钱不够啦～" };
  state.money -= total;
  state.bag.push(...state.cart.map((i) => cloneItem({ ...i, washed: false })));
  state.cart = [];
  state.hasCart = false;
  state.shoppingHint = [];
  state.stats = state.stats || {};
  state.stats.spent = (state.stats.spent || 0) + total;
  emit(state);
  return { ok: true, total, msg: `结账成功！花了 ¥${total}，钱包还剩 ¥${state.money}` };
}

export function addToCart(state, goods) {
  if (!state.hasCart) return { ok: false, msg: "先去拿购物车～" };
  state.cart.push({ ...goods });
  emit(state);
  return { ok: true, msg: `放入购物车：${goods.name}` };
}

export function earnMoney(state, amount, reason = "") {
  const n = Math.max(0, Math.floor(amount));
  if (!n) return { ok: false, amount: 0 };
  state.money += n;
  state.stats = state.stats || {};
  state.stats.earned = (state.stats.earned || 0) + n;
  emit(state);
  return { ok: true, amount: n, reason, money: state.money };
}

export function spendMoney(state, amount, reason = "") {
  const n = Math.max(0, Math.floor(amount));
  if (state.money < n) return { ok: false, amount: 0, msg: "钱不够啦～" };
  state.money -= n;
  state.stats = state.stats || {};
  state.stats.spent = (state.stats.spent || 0) + n;
  emit(state);
  return { ok: true, amount: n, reason, money: state.money };
}

/** Daily pocket money from parents (once per session flag) */
export function claimAllowance(state) {
  if (state.flags?.gotAllowance) {
    return { ok: false, msg: "今天的零花钱已经领过啦～" };
  }
  state.flags = state.flags || {};
  state.flags.gotAllowance = true;
  return earnMoney(state, 50, "零花钱");
}

/** Bonus after family meal */
export function claimMealBonus(state) {
  if (state.flags?.gotMealBonus) {
    return { ok: false, msg: "这顿饭的奖励已经领过啦" };
  }
  if (state.mealPhase !== "done") {
    return { ok: false, msg: "先做好饭喊家人一起吃吧" };
  }
  state.flags = state.flags || {};
  state.flags.gotMealBonus = true;
  const tip = 30 + (state.tableFood?.length || 0) * 15;
  return earnMoney(state, tip, "做饭奖励");
}

/** Small chore rewards */
export function claimChore(state, chore) {
  state.flags = state.flags || {};
  const key = `chore_${chore}`;
  if (state.flags[key]) return { ok: false, msg: "这件事已经做过啦" };
  const rewards = { plant: 8, dogbed: 10, shelf: 5, light: 6 };
  const amt = rewards[chore] || 5;
  state.flags[key] = true;
  return earnMoney(state, amt, "家务奖励");
}
