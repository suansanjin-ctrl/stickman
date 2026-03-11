import { WORLD } from "./config.js";

const FRICTION = 0.84;

function overPit(x) {
  return WORLD.pits.some((pit) => x > pit.x && x < pit.x + pit.w);
}

export function updatePhysics(f, dt) {
  if (f.dead) {
    f.vx *= 0.96;
  }

  f.vy += WORLD.gravity;
  f.x += f.vx * dt * 60;
  f.y += f.vy * dt * 60;

  f.vx *= FRICTION;
  f.onGround = false;

  const floorBlocked = !overPit(f.x);
  if (floorBlocked && f.y >= WORLD.floorY) {
    f.y = WORLD.floorY;
    f.vy = 0;
    f.onGround = true;
  }

  for (const p of WORLD.platforms) {
    const withinX = f.x + f.w * 0.5 > p.x && f.x - f.w * 0.5 < p.x + p.w;
    const fromAbove = f.vy >= 0 && f.y - f.vy <= p.y;
    if (withinX && fromAbove && f.y >= p.y && f.y <= p.y + p.h + 12) {
      f.y = p.y;
      f.vy = 0;
      f.onGround = true;
    }
  }

  if (f.x < 12) f.x = 12;
  if (f.x > WORLD.width - 12) f.x = WORLD.width - 12;
}

export function isOut(f) {
  return f.y > WORLD.height + 140;
}
