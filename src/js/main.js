import { DEFAULT_SETTINGS, WORLD } from "./config.js";
import { createGame } from "./game.js";
import { createInput } from "./input.js";
import { loadSettings, saveSettings } from "./storage.js";

const screens = {
  start: document.querySelector("#screen-start"),
  settings: document.querySelector("#screen-settings"),
  game: document.querySelector("#screen-game"),
  result: document.querySelector("#screen-result")
};

const el = {
  startBattle: document.querySelector("#btn-start-battle"),
  openSettings: document.querySelector("#btn-open-settings"),
  begin: document.querySelector("#btn-begin"),
  backHome: document.querySelector("#btn-back-home"),
  restart: document.querySelector("#btn-restart"),
  home: document.querySelector("#btn-home"),
  hpPlayer: document.querySelector("#hp-player"),
  hpAi: document.querySelector("#hp-ai"),
  status: document.querySelector("#game-status"),
  resultTitle: document.querySelector("#result-title"),
  resultDesc: document.querySelector("#result-desc"),
  canvas: document.querySelector("#game-canvas"),
  joystickBase: document.querySelector("#joystick-base"),
  joystickStick: document.querySelector("#joystick-stick"),
  jump: document.querySelector("#btn-jump"),
  attack: document.querySelector("#btn-attack")
};

let settings = loadSettings();
const input = createInput(el.canvas);

const game = createGame({
  canvas: el.canvas,
  settings,
  onHudUpdate(playerRatio, aiRatio) {
    el.hpPlayer.style.width = `${Math.max(0, playerRatio) * 100}%`;
    el.hpAi.style.width = `${Math.max(0, aiRatio) * 100}%`;
  },
  onStatus(text) {
    el.status.textContent = text;
  },
  onFinish(win) {
    el.resultTitle.textContent = win ? "胜利！" : "失败！";
    el.resultDesc.textContent = win ? "你成功击败 AI" : "你被 AI 击败了";
    show("result");
  }
});

function show(name) {
  Object.entries(screens).forEach(([key, node]) => node.classList.toggle("active", key === name));
}

function setupSettingsPanel() {
  const binds = [
    ["p1-color", "player", "color"],
    ["p1-weapon", "player", "weapon"],
    ["ai-color", "ai", "color"],
    ["ai-weapon", "ai", "weapon"]
  ];

  for (const [id, side, key] of binds) {
    const node = document.querySelector(`#${id}`);
    node.value = settings[side][key];
    node.addEventListener("input", () => {
      settings[side][key] = node.value;
      saveSettings(settings);
    });
  }

  const rangeBinds = [
    ["p1-hp", "p1-hp-v", "player", "hp"],
    ["p1-atk", "p1-atk-v", "player", "atk"],
    ["p1-speed", "p1-speed-v", "player", "speed"],
    ["ai-hp", "ai-hp-v", "ai", "hp"],
    ["ai-atk", "ai-atk-v", "ai", "atk"],
    ["ai-speed", "ai-speed-v", "ai", "speed"],
    ["ai-difficulty", "ai-difficulty-v", "ai", "difficulty"]
  ];

  for (const [id, valueId, side, key] of rangeBinds) {
    const node = document.querySelector(`#${id}`);
    const val = document.querySelector(`#${valueId}`);
    node.value = settings[side][key] ?? DEFAULT_SETTINGS[side][key];
    val.textContent = String(node.value);
    node.addEventListener("input", () => {
      const num = Number(node.value);
      settings[side][key] = num;
      val.textContent = node.value;
      saveSettings(settings);
    });
  }
}

function fitCanvasDpr() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  el.canvas.width = Math.floor(WORLD.width * dpr);
  el.canvas.height = Math.floor(WORLD.height * dpr);
  const ctx = el.canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startBattle() {
  settings = loadSettings();
  game.setSettings(settings);
  game.stop();
  show("game");
  el.status.textContent = "准备中";
  game.start();
}

function setupEvents() {
  el.startBattle.addEventListener("click", startBattle);
  el.openSettings.addEventListener("click", () => show("settings"));
  el.begin.addEventListener("click", startBattle);
  el.backHome.addEventListener("click", () => show("start"));
  el.home.addEventListener("click", () => show("start"));
  el.restart.addEventListener("click", startBattle);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (screens.start.classList.contains("active") || screens.result.classList.contains("active"))) {
      startBattle();
    }
  });

  window.addEventListener("resize", fitCanvasDpr);
  bindTouchControls();
}

function bindTouchControls() {
  const base = el.joystickBase;
  const stick = el.joystickStick;
  let dragging = false;

  const updateStick = (clientX, clientY) => {
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const max = rect.width * 0.34;
    const dist = Math.hypot(dx, dy);
    const ratio = dist > max ? max / dist : 1;
    const ox = dx * ratio;
    const oy = dy * ratio;
    stick.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
    input.setJoystick(ox / max);
    input.setJump(oy < -max * 0.55);
  };

  base.addEventListener("pointerdown", (e) => {
    dragging = true;
    base.setPointerCapture(e.pointerId);
    updateStick(e.clientX, e.clientY);
  });

  base.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    updateStick(e.clientX, e.clientY);
  });

  const endDrag = () => {
    dragging = false;
    stick.style.transform = "translate(-50%, -50%)";
    input.setJoystick(0);
    input.setJump(false);
  };

  base.addEventListener("pointerup", endDrag);
  base.addEventListener("pointercancel", endDrag);

  const bindPress = (node, setter) => {
    node.addEventListener("pointerdown", (e) => {
      node.setPointerCapture(e.pointerId);
      setter(true);
    });
    node.addEventListener("pointerup", () => setter(false));
    node.addEventListener("pointercancel", () => setter(false));
    node.addEventListener("pointerleave", () => setter(false));
  };

  bindPress(el.jump, input.setJump);
  bindPress(el.attack, input.setAttack);
}

function loop(now) {
  game.tick(now, input.get());
  requestAnimationFrame(loop);
}

fitCanvasDpr();
setupSettingsPanel();
setupEvents();
show("start");
requestAnimationFrame(loop);
