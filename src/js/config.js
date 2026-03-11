export const STORAGE_KEY = "stickman_mvp_settings";

export const WEAPONS = {
  fist: { name: "拳套", range: 58, cooldown: 360, knockback: 4.2 },
  sword: { name: "短剑", range: 72, cooldown: 500, knockback: 5.1 },
  staff: { name: "短棍", range: 85, cooldown: 620, knockback: 5.8 }
};

export const DEFAULT_SETTINGS = {
  player: { color: "#22c55e", weapon: "fist", hp: 120, atk: 12, speed: 5 },
  ai: { color: "#ef4444", weapon: "fist", hp: 120, atk: 10, speed: 4.6, difficulty: 2 }
};

export const WORLD = {
  width: 1280,
  height: 720,
  gravity: 0.58,
  floorY: 650,
  platforms: [
    { x: 160, y: 540, w: 210, h: 18 },
    { x: 460, y: 470, w: 230, h: 18 },
    { x: 790, y: 400, w: 240, h: 18 },
    { x: 1040, y: 540, w: 180, h: 18 }
  ],
  pits: [
    { x: 390, w: 120 },
    { x: 940, w: 100 }
  ]
};
