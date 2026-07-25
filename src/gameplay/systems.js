import { emit, cloneItem } from "./GameState.js";
import { RECIPES } from "../core/constants.js";

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

export function startCook(state, type, onDone) {
  if (state.cooking) return { ok: false, msg: "正在做饭中…" };
  const recipe = RECIPES[type];
  if (!recipe) return { ok: false, msg: "未知菜谱" };
  if (recipe.power && !state.power[recipe.power]) {
    return { ok: false, msg: `请先打开${recipe.power === "stove" ? "燃气灶" : recipe.power === "rice" ? "电饭煲" : "烤箱"}` };
  }
  if (!state.prep.length) {
    return { ok: false, msg: "操作台没有食材，先从冰箱取出～" };
  }
  const missing = recipe.need.filter((t) => !hasPrepTag(state, t));
  if (missing.length) {
    return { ok: false, msg: `还缺：${missing.join("、")}` };
  }
  if (recipe.needWashed && !hasWashedVeg(state)) {
    return { ok: false, msg: "蔬菜还没洗，先去水槽洗菜～" };
  }
  if (type === "stirfry" && !state.power.hood) {
    state.power.hood = true;
  }
  state.cooking = true;
  consumePrepTags(state, recipe.need);
  setTimeout(() => {
    state.cooking = false;
    state.cooked.push({
      dish: recipe.dish,
      icon: recipe.icon,
      name: recipe.name,
      vesselDefault: recipe.vesselDefault,
    });
    emit(state);
    if (onDone) onDone(recipe);
  }, recipe.time);
  emit(state);
  return { ok: true, msg: `正在${recipe.name}…` };
}

export function putBagInFridge(state) {
  if (!state.bag.length) return false;
  if (!state.power.fridge) return false;
  state.fridge.push(...state.bag.map(cloneItem));
  state.bag = [];
  emit(state);
  return true;
}

export function takeFromFridge(state, idx) {
  if (idx < 0 || idx >= state.fridge.length) return null;
  if (!state.power.fridge) return null;
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

export function togglePower(state, key) {
  if (!(key in state.power)) return false;
  state.power[key] = !state.power[key];
  emit(state);
  return state.power[key];
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
  emit(state);
  return { ok: true, total, msg: "结账成功！提着购物袋回家吧～" };
}

export function addToCart(state, goods) {
  if (!state.hasCart) return { ok: false, msg: "先去拿购物车～" };
  state.cart.push({ ...goods });
  emit(state);
  return { ok: true, msg: `放入购物车：${goods.name}` };
}
