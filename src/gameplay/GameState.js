import { MAKEUP, CHAR_STYLES } from "../core/constants.js";

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
    fridge: [],
    prep: [],
    holding: null,
    cooked: [],
    plated: [],
    carrying: null,
    tableFood: [],
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
