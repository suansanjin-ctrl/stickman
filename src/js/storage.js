import { DEFAULT_SETTINGS, STORAGE_KEY } from "./config.js";

function mergeSettings(saved) {
  return {
    player: { ...DEFAULT_SETTINGS.player, ...(saved?.player ?? {}) },
    ai: { ...DEFAULT_SETTINGS.ai, ...(saved?.ai ?? {}) }
  };
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    return mergeSettings(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergeSettings(settings)));
}
