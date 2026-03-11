import { WEAPONS, WORLD } from "./config.js";

export function thinkAI(ai, player, now, difficulty = 2) {
  const level = Math.max(1, Math.min(5, Number(difficulty) || 2));
  const dx = player.x - ai.x;
  const dy = player.y - ai.y;
  const absX = Math.abs(dx);
  const dir = dx > 0 ? 1 : -1;
  const weaponRange = WEAPONS[ai.weapon].range;

  const chaseFactor = 0.78 + level * 0.08;
  let move = 0;
  if (absX > weaponRange * chaseFactor) {
    move = dir;
  } else if (level >= 4 && absX < weaponRange * 0.55) {
    move = -dir * 0.25;
  }

  const targetHigher = dy < -(54 - level * 4);
  const nearPlatform = WORLD.platforms.some((p) => Math.abs(ai.x - (p.x + p.w / 2)) < 100 && ai.y >= p.y);
  const jumpChance = 0.35 + level * 0.12;
  const jump = ai.onGround && (
    (targetHigher && nearPlatform && Math.random() < jumpChance) ||
    (absX < 90 && player.y < ai.y - 15 && Math.random() < jumpChance * 0.8)
  );

  const attackWindow = weaponRange * (0.9 + level * 0.05);
  const attack = absX < attackWindow && Math.abs(dy) < 80 && now >= ai.cooldownUntil;

  return { move, jump, attack };
}
