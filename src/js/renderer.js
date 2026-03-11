import { WEAPONS, WORLD } from "./config.js";

export function drawWorld(ctx) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.fillStyle = "#334155";
  ctx.fillRect(0, WORLD.floorY, WORLD.width, WORLD.height - WORLD.floorY);

  ctx.fillStyle = "#111827";
  for (const pit of WORLD.pits) {
    ctx.fillRect(pit.x, WORLD.floorY, pit.w, WORLD.height - WORLD.floorY);
  }

  ctx.fillStyle = "#475569";
  for (const p of WORLD.platforms) ctx.fillRect(p.x, p.y, p.w, p.h);
}

export function drawFighter(ctx, f, now) {
  const hitBlink = now < f.hitUntil && Math.floor(now / 70) % 2 === 0;
  if (hitBlink) return;

  const x = f.x;
  const y = f.y;

  ctx.strokeStyle = f.color;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.arc(x, y - 78, 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - 66);
  ctx.lineTo(x, y - 30);
  ctx.stroke();

  const attackPose = now < f.attackUntil;
  const armReach = attackPose ? 24 : 14;

  ctx.beginPath();
  ctx.moveTo(x, y - 55);
  ctx.lineTo(x - 16, y - 42);
  ctx.moveTo(x, y - 55);
  ctx.lineTo(x + f.facing * armReach, y - 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x - 12, y);
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x + 12, y);
  ctx.stroke();

  if (attackPose) {
    const weapon = WEAPONS[f.weapon];
    ctx.fillStyle = "#f8fafc";
    ctx.font = "12px sans-serif";
    ctx.fillText(weapon.name, x + f.facing * 28, y - 48);
  }
}
