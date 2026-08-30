import { clear, createStore, entries, setMany, type UseStore } from "idb-keyval";

export function readMigratedLocalStorage(key: string, legacyKey: string): string | null {
  const current = window.localStorage.getItem(key);
  const legacy = window.localStorage.getItem(legacyKey);

  if (current === null && legacy !== null) window.localStorage.setItem(key, legacy);
  if (legacy !== null) window.localStorage.removeItem(legacyKey);
  return current ?? legacy;
}

export async function migrateIndexedDBStore(
  legacyDatabaseName: string,
  storeName: string,
  currentStore: UseStore,
): Promise<void> {
  try {
    const legacyStore = createStore(legacyDatabaseName, storeName);
    const legacyEntries = await entries(legacyStore);
    if (legacyEntries.length === 0) return;

    const currentKeys = new Set((await entries(currentStore)).map(([key]) => key));
    const missingEntries = legacyEntries.filter(([key]) => !currentKeys.has(key));
    if (missingEntries.length > 0) await setMany(missingEntries, currentStore);
    await clear(legacyStore);
  } catch {
    // Storage migration is best-effort. Network data remains the durable source.
  }
}
