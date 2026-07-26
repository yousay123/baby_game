import { MAKEUP, CHAR_STYLES, CHAR_MODELS } from "../core/constants.js";

function cloneItem(item) {
  return { ...item, washed: !!item.washed };
}

export function createGameState() {
  const style = CHAR_STYLES[0];
  return {
    money: 10000,
    flags: {},
    stats: { earned: 0, spent: 0 },
    hasCart: false,
    cart: [],
    bag: [],
    shoppingHint: [],
    /** 用户最近选中的菜谱，洗菜/回灶台后继续展开 */
    lastRecipeId: null,
    lastRecipeStation: "stove",
    /** idle | calling | helping */
    cookHelpPhase: "idle",
    /** 客厅分别邀请爸妈吃饭 */
    mealInvited: { dad: false, mom: false },
    fridge: [],
    prep: [],
    holding: null,
    cooked: [],
    plated: [],
    carrying: null,
    tableFood: [],
    /** idle | ready | invite | seating | eating | done */
    mealPhase: "idle",
    cooking: false,
    power: {
      tv: "off",
      ac: "off",
      lamp: "off",
      light: "on",
      fridge: "on",
      hood: "off",
      microwave: "off",
      stove: "off",
      rice: "off",
      oven: "off",
      dishwasher: "off",
    },
    makeup: { ...style.makeup },
    charStyle: style.id,
    charModel: style.model || CHAR_MODELS[0].id,
    listeners: new Set(),
  };
}

export function subscribe(state, fn) {
  state.listeners.add(fn);
  return () => state.listeners.delete(fn);
}

export function emit(state) {
  state.listeners.forEach((fn) => fn(state));
}

export function findMakeupOption(slot, id) {
  return (MAKEUP[slot] || []).find((o) => o.id === id) || (MAKEUP[slot] || [])[0];
}

export { cloneItem };
