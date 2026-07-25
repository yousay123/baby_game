export const SCENES = {
  makeup: { id: "makeup", title: "公主换装化妆屋" },
  market: { id: "market", title: "蜜糖超市" },
  home: { id: "home", title: "温馨客厅" },
  kitchen: { id: "kitchen", title: "家庭厨房" },
  dining: { id: "dining", title: "温馨餐厅" },
};

export const COLORS = {
  skin: 0xf2c4a0,
  hair: 0x5a3a28,
  floor: 0xe8d4c4,
  wall: 0xfff0f5,
  coral: 0xef6b8a,
  wood: 0xc48a5a,
  woodDark: 0x8a5a38,
  metal: 0xb0c0d0,
  white: 0xffffff,
  green: 0x6ecf7a,
};

export const MARKET_GOODS = {
  drinks: [
    { id: "juice", name: "果汁", icon: "果汁", price: 8, tag: "drink", color: "#ffb347" },
    { id: "milk", name: "牛奶", icon: "牛奶", price: 7, tag: "drink", color: "#f5f5f5" },
    { id: "soda", name: "汽水", icon: "汽水", price: 6, tag: "drink", color: "#7ec8ff" },
  ],
  veg: [
    { id: "tomato", name: "番茄", icon: "茄", price: 4, tag: "veg", color: "#ff6b5a" },
    { id: "carrot", name: "胡萝卜", icon: "萝", price: 3, tag: "veg", color: "#ff8f40" },
    { id: "broccoli", name: "西兰花", icon: "兰", price: 5, tag: "veg", color: "#4aaa50" },
    { id: "cabbage", name: "白菜", icon: "白", price: 3, tag: "veg", color: "#d8f0c8" },
  ],
  daily: [
    { id: "rice", name: "大米", icon: "米", price: 12, tag: "rice", color: "#f5f0e0" },
    { id: "oil", name: "食用油", icon: "油", price: 15, tag: "oil", color: "#f0d060" },
    { id: "flour", name: "面粉", icon: "粉", price: 8, tag: "flour", color: "#fff8e8" },
    { id: "egg", name: "鸡蛋", icon: "蛋", price: 6, tag: "egg", color: "#ffe8b0" },
  ],
  snack: [
    { id: "chips", name: "薯片", icon: "薯", price: 8, tag: "snack", color: "#ffe08a" },
    { id: "bread", name: "面包胚", icon: "包", price: 6, tag: "flour", color: "#e8c898" },
  ],
};

export const RECIPES = {
  stirfry: {
    name: "炒菜",
    need: ["veg", "oil"],
    needWashed: true,
    power: "stove",
    time: 2400,
    dish: "炒蔬菜",
    icon: "菜",
    vesselDefault: "plate",
  },
  rice: {
    name: "蒸米饭",
    need: ["rice"],
    power: "rice",
    time: 2800,
    dish: "米饭",
    icon: "饭",
    vesselDefault: "bowl",
  },
  porridge: {
    name: "煮粥",
    need: ["rice"],
    power: "stove",
    time: 2600,
    dish: "白粥",
    icon: "粥",
    vesselDefault: "bowl",
  },
  bread: {
    name: "烤面包",
    need: ["flour"],
    power: "oven",
    time: 3000,
    dish: "烤面包",
    icon: "包",
    vesselDefault: "plate",
  },
};

export const MAKEUP = {
  tabs: [
    { id: "lipstick", name: "口红" },
    { id: "blush", name: "腮红" },
    { id: "eyeshadow", name: "眼影" },
    { id: "hair", name: "发型色" },
    { id: "top", name: "上衣" },
    { id: "bottom", name: "下装" },
  ],
  lipstick: [
    { id: "lip1", name: "蜜桃", color: "#e87a8a" },
    { id: "lip2", name: "樱桃", color: "#d4455a" },
    { id: "lip3", name: "豆沙", color: "#b06070" },
  ],
  blush: [
    { id: "blush1", name: "浅粉", color: "#ffb0c0" },
    { id: "blush2", name: "珊瑚", color: "#ff8a9a" },
    { id: "blush3", name: "自然", color: "#f0a090" },
  ],
  eyeshadow: [
    { id: "eye1", name: "粉棕", color: "#c89088" },
    { id: "eye2", name: "玫瑰", color: "#d07090" },
    { id: "eye3", name: "大地", color: "#a87858" },
  ],
  hair: [
    { id: "hair1", name: "栗棕", color: "#5a3a28" },
    { id: "hair2", name: "深褐", color: "#3a2820" },
    { id: "hair3", name: "蜜茶", color: "#8a5a38" },
    { id: "hair4", name: "酒红", color: "#6a3040" },
  ],
  top: [
    { id: "top1", name: "粉衣", color: "#ff8fb3" },
    { id: "top2", name: "白衣", color: "#fff5f8" },
    { id: "top3", name: "蓝衣", color: "#7eb8ff" },
  ],
  bottom: [
    { id: "bot1", name: "粉裙", color: "#ff6b8a", skirt: true },
    { id: "bot2", name: "牛仔裤", color: "#4a6a9a", skirt: false },
    { id: "bot3", name: "白裤", color: "#f0e8f0", skirt: false },
  ],
};
