export const isChunkLoadError = (message: string) =>
  /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Failed to load module script/i.test(message);

/** Reload stale deployments once; blocked storage must never crash recovery. */
export const reloadStaleChunkOnce = (storage: Pick<Storage, 'getItem' | 'setItem'>, reload: () => void) => {
  try {
    const key = '__chunk_reload__';
    if (storage.getItem(key)) return false;
    storage.setItem(key, '1');
    reload();
    return true;
  } catch {
    return false;
  }
};