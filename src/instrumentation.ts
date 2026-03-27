export async function register() {
  // Node.js v25+ exposes a broken localStorage Proxy (no getItem/setItem)
  // when --localstorage-file is not properly configured. Replace it entirely.
  if (typeof globalThis.localStorage !== "undefined") {
    const ls = globalThis.localStorage as Record<string, unknown>;
    if (typeof ls.getItem !== "function") {
      const store: Record<string, string> = {};
      (globalThis as Record<string, unknown>).localStorage = {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = String(value);
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach((k) => delete store[k]);
        },
        get length() {
          return Object.keys(store).length;
        },
        key: (index: number) => Object.keys(store)[index] ?? null,
      };
    }
  }
}
