import { MAKEUP } from "../core/constants.js";

function cloneItem(item) {
  return { ...item, washed: !!item.washed };
}

export function createGameState() {
  return {
    money: 10000,
    hasCart: false,
    cart: [],
    bag: [],
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
    makeup: {
      lipstick: MAKEUP.lipstick[0].id,
      blush: MAKEUP.blush[0].id,
      eyeshadow: MAKEUP.eyeshadow[0].id,
      hair: MAKEUP.hair[0].id,
      top: MAKEUP.top[0].id,
      bottom: MAKEUP.bottom[0].id,
    },
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
