import { describe, expect, it, vi } from 'vitest';
import { isChunkLoadError, reloadStaleChunkOnce } from '@/lib/startupRecovery';

describe('startup recovery', () => {
  it('recognizes Safari and Chromium stale module failures, not opaque script errors', () => {
    expect(isChunkLoadError('Importing a module script failed.')).toBe(true);
    expect(isChunkLoadError('Failed to fetch dynamically imported module: /assets/app.js')).toBe(true);
    expect(isChunkLoadError('Script error.')).toBe(false);
  });

  it('reloads only once to avoid a reload loop', () => {
    const storage = window.sessionStorage;
    storage.clear();
    const reload = vi.fn();
    expect(reloadStaleChunkOnce(storage, reload)).toBe(true);
    expect(reloadStaleChunkOnce(storage, reload)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('returns to the fallback when browser storage is blocked', () => {
    const reload = vi.fn();
    const storage = { getItem: () => { throw new Error('SecurityError'); }, setItem: vi.fn() };
    expect(reloadStaleChunkOnce(storage, reload)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});