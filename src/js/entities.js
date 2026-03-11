import { WEAPONS } from "./config.js";

export function createFighter(kind, cfg, x) {
  return {
    kind,
    x,
    y: 560,
    vx: 0,
    vy: 0,
    w: 32,
    h: 96,
    facing: kind === "player" ? 1 : -1,
    color: cfg.color,
    weapon: cfg.weapon,
    maxHp: cfg.hp,
    hp: cfg.hp,
    atk: cfg.atk,
    speed: cfg.speed,
    onGround: false,
    attackUntil: 0,
    hitUntil: 0,
    dead: false,
    cooldownUntil: 0
  };
}

export function hitTarget(attacker, defender, now) {
  const weapon = WEAPONS[attacker.weapon];
  const inY = Math.abs((attacker.y - attacker.h * 0.5) - (defender.y - defender.h * 0.5)) < 80;
  const inX = Math.abs(attacker.x - defender.x) < weapon.range;
  if (!inX || !inY || defender.dead) return false;

  const direction = attacker.x <= defender.x ? 1 : -1;
  defender.hp = Math.max(0, defender.hp - attacker.atk);
  defender.vx += direction * weapon.knockback;
  defender.vy = -5.4;
  defender.hitUntil = now + 170;
  if (defender.hp <= 0) defender.dead = true;
  return true;
}
