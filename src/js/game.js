import { WEAPONS } from "./config.js";
import { thinkAI } from "./ai.js";
import { createFighter, hitTarget } from "./entities.js";
import { updatePhysics, isOut } from "./physics.js";
import { drawFighter, drawWorld } from "./renderer.js";

export function createGame({ canvas, settings: initialSettings, onFinish, onHudUpdate, onStatus }) {
  let settings = structuredClone(initialSettings);
  const ctx = canvas.getContext("2d");
  const state = {
    running: false,
    player: createFighter("player", settings.player, 180),
    ai: createFighter("ai", settings.ai, 1080),
    last: 0,
    freezeUntil: 0
  };

  function reset() {
    state.player = createFighter("player", settings.player, 180);
    state.ai = createFighter("ai", settings.ai, 1080);
    state.freezeUntil = performance.now() + 2300;
  }

  function applyMove(f, move, jump) {
    if (Math.abs(move) > 0.01) {
      f.vx += move * f.speed * 0.2;
      f.facing = move >= 0 ? 1 : -1;
    }
    if (jump && f.onGround) f.vy = -11.5;
  }

  function doAttack(attacker, defender, now) {
    if (now < attacker.cooldownUntil || attacker.dead) return;
    attacker.cooldownUntil = now + WEAPONS[attacker.weapon].cooldown;
    attacker.attackUntil = now + 120;
    hitTarget(attacker, defender, now);
  }

  function updateStatus(now) {
    if (now < state.freezeUntil) {
      const left = Math.ceil((state.freezeUntil - now) / 1000);
      onStatus?.(left > 0 ? `准备开战 ${left}` : "Fight!");
    } else {
      onStatus?.("战斗中");
    }
  }

  function tick(now, input) {
    if (!state.running) return;
    const dt = Math.min(0.033, (now - state.last) / 1000 || 0.016);
    state.last = now;

    const canControl = now >= state.freezeUntil;

    if (canControl) {
      applyMove(state.player, input.move, input.jump);
      if (input.attack) doAttack(state.player, state.ai, now);

      const aiDecision = thinkAI(state.ai, state.player, now, settings.ai.difficulty);
      applyMove(state.ai, aiDecision.move, aiDecision.jump);
      if (aiDecision.attack) doAttack(state.ai, state.player, now);
    }

    updatePhysics(state.player, dt);
    updatePhysics(state.ai, dt);

    drawWorld(ctx);
    drawFighter(ctx, state.player, now);
    drawFighter(ctx, state.ai, now);

    onHudUpdate(state.player.hp / state.player.maxHp, state.ai.hp / state.ai.maxHp);
    updateStatus(now);

    if (!canControl) return;

    if (state.ai.dead || isOut(state.ai)) {
      state.running = false;
      onFinish(true);
    }
    if (state.player.dead || isOut(state.player)) {
      state.running = false;
      onFinish(false);
    }
  }

  return {
    setSettings(next) {
      settings = structuredClone(next);
    },
    start() {
      reset();
      state.running = true;
      state.last = performance.now();
    },
    stop() { state.running = false; },
    tick,
    get running() { return state.running; }
  };
}
