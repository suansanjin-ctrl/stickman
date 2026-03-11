export function createInput(canvas) {
  const keys = new Set();
  const state = {
    move: 0,
    jump: false,
    attack: false,
    enter: false,
    joystickX: 0,
    touchJump: false,
    touchAttack: false
  };

  window.addEventListener("keydown", (e) => {
    keys.add(e.key);
    if (e.key === "Enter") state.enter = true;
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.key);
  });

  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  return {
    get() {
      const keyboardMove = (keys.has("a") || keys.has("ArrowLeft") ? -1 : 0) + (keys.has("d") || keys.has("ArrowRight") ? 1 : 0);
      state.move = Math.max(-1, Math.min(1, Math.abs(state.joystickX) > 0.05 ? state.joystickX : keyboardMove));
      state.jump = keys.has("k") || keys.has("K") || keys.has("w") || keys.has("ArrowUp") || state.touchJump;
      state.attack = keys.has("j") || keys.has("J") || state.touchAttack;
      return state;
    },
    consumeEnter() {
      const v = state.enter;
      state.enter = false;
      return v;
    },
    setJoystick(v) { state.joystickX = v; },
    setJump(v) { state.touchJump = v; },
    setAttack(v) { state.touchAttack = v; }
  };
}
