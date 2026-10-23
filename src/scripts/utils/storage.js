/** Liest JSON aus localStorage oder sessionStorage. Im privaten Modus kommt `fallback`. */
export function readJson(storage, key, fallback) {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Privater Modus: Der Wert gilt dann nur bis zum Neuladen.
  }
}

export function removeKey(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    // siehe writeJson
  }
}
