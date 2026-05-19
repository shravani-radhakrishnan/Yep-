import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useDecider } from '.';

beforeEach(() => localStorage.clear());

// ── Initial state ────────────────────────────────────────────────────────────

describe('initial state', () => {
  it('starts on the movies tab', () => {
    const { result } = renderHook(() => useDecider());
    expect(result.current.cat).toBe('movies');
  });

  it('starts with smart sort', () => {
    const { result } = renderHook(() => useDecider());
    expect(result.current.sort).toBe('smart');
  });

  it('has no picked item', () => {
    const { result } = renderHook(() => useDecider());
    expect(result.current.pickedItem).toBeNull();
  });

  it('loads the 4 default categories', () => {
    const { result } = renderHook(() => useDecider());
    expect(result.current.categories.map(c => c.id)).toContain('movies');
    expect(result.current.categories.map(c => c.id)).toContain('activities');
  });

  it('has seed items in movies', () => {
    const { result } = renderHook(() => useDecider());
    expect(result.current.items.length).toBeGreaterThan(0);
  });
});

// ── addItem ──────────────────────────────────────────────────────────────────

describe('addItem', () => {
  it('adds an item to the current category', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Inception'); });
    expect(result.current.items.some(i => i.name === 'Inception')).toBe(true);
  });

  it('prepends the new item so it appears first', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('New Film'); });
    const newItems = result.current.items.filter(i => i.status === 'new');
    expect(newItems[0].name).toBe('New Film');
  });

  it('prevents adding a duplicate (exact match)', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Dupe'); });
    const before = result.current.items.length;
    await act(async () => { await result.current.addItem('Dupe'); });
    expect(result.current.items.length).toBe(before);
  });

  it('prevents adding a duplicate (case-insensitive)', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Matrix'); });
    const before = result.current.items.length;
    await act(async () => { await result.current.addItem('matrix'); });
    expect(result.current.items.length).toBe(before);
  });

  it('shows a toast for duplicate items', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Already'); });
    await act(async () => { await result.current.addItem('Already'); });
    expect(result.current.toast).toBe('Already in the list!');
  });
});

// ── markItem ─────────────────────────────────────────────────────────────────

describe('markItem', () => {
  it('marks an item as done', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Test Film'); });
    const item = result.current.items.find(i => i.name === 'Test Film')!;
    act(() => result.current.markItem(item.id, 'done'));
    expect(result.current.items.find(i => i.id === item.id)!.status).toBe('done');
  });

  it('marks an item as skip', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Skip Me'); });
    const item = result.current.items.find(i => i.name === 'Skip Me')!;
    act(() => result.current.markItem(item.id, 'skip'));
    expect(result.current.items.find(i => i.id === item.id)!.status).toBe('skip');
  });

  it('resets an item back to new', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Reset Me'); });
    const item = result.current.items.find(i => i.name === 'Reset Me')!;
    act(() => result.current.markItem(item.id, 'done'));
    act(() => result.current.markItem(item.id, 'new'));
    expect(result.current.items.find(i => i.id === item.id)!.status).toBe('new');
  });
});

// ── deleteItem ───────────────────────────────────────────────────────────────

describe('deleteItem', () => {
  it('removes the item from the list', async () => {
    const { result } = renderHook(() => useDecider());
    await act(async () => { await result.current.addItem('Delete Me'); });
    const item = result.current.items.find(i => i.name === 'Delete Me')!;
    act(() => result.current.deleteItem(item.id));
    expect(result.current.items.find(i => i.id === item.id)).toBeUndefined();
  });
});

// ── pickOne ──────────────────────────────────────────────────────────────────

describe('pickOne', () => {
  it('sets a picked item (opens modal)', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    expect(result.current.pickedItem).not.toBeNull();
  });

  it('increments the picked item\'s picks count', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    expect(result.current.pickedItem!.picks).toBeGreaterThan(0);
  });

  it('does nothing if modal is already open', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    const firstId = result.current.pickedItem!.id;
    act(() => result.current.pickOne());
    expect(result.current.pickedItem!.id).toBe(firstId);
  });

  it('shows a toast when list is empty', async () => {
    const { result } = renderHook(() => useDecider());
    // Switch to a fresh custom category with no items
    act(() => result.current.addCategory('EmptyCat'));
    act(() => result.current.pickOne());
    expect(result.current.toast).toBe('Add something first!');
  });
});

// ── closeModal ───────────────────────────────────────────────────────────────

describe('closeModal', () => {
  it('clears the picked item', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    act(() => result.current.closeModal());
    expect(result.current.pickedItem).toBeNull();
  });
});

// ── giveFeedback ─────────────────────────────────────────────────────────────

describe('giveFeedback', () => {
  it('marks the picked item as done and closes modal', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    const pickedId = result.current.pickedItem!.id;
    act(() => result.current.giveFeedback('done'));
    expect(result.current.pickedItem).toBeNull();
    expect(result.current.items.find(i => i.id === pickedId)!.status).toBe('done');
  });

  it('marks the picked item as skip and closes modal', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    const pickedId = result.current.pickedItem!.id;
    act(() => result.current.giveFeedback('skip'));
    expect(result.current.pickedItem).toBeNull();
    expect(result.current.items.find(i => i.id === pickedId)!.status).toBe('skip');
  });

  it('shows a toast after done feedback', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    act(() => result.current.giveFeedback('done'));
    expect(result.current.toast).toBe('✓ Marked as done!');
  });
});

// ── reroll ───────────────────────────────────────────────────────────────────

describe('reroll', () => {
  it('keeps the modal open after reroll', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    act(() => result.current.reroll());
    expect(result.current.pickedItem).not.toBeNull();
  });

  it('picks a different item when multiple options exist', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.pickOne());
    const firstId = result.current.pickedItem!.id;
    // Seed data has 5 movies — a different one should be chosen
    let differentPicked = false;
    for (let i = 0; i < 10; i++) {
      act(() => result.current.reroll());
      if (result.current.pickedItem!.id !== firstId) { differentPicked = true; break; }
    }
    expect(differentPicked).toBe(true);
  });
});

// ── sort ─────────────────────────────────────────────────────────────────────

describe('sort', () => {
  it('smart sort places new items before done items', () => {
    const { result } = renderHook(() => useDecider());
    const statuses = result.current.items.map(i => i.status);
    const firstDoneIdx = statuses.indexOf('done');
    const lastNewIdx = statuses.lastIndexOf('new');
    if (firstDoneIdx !== -1 && lastNewIdx !== -1) {
      expect(lastNewIdx).toBeLessThan(firstDoneIdx);
    }
  });

  it('name sort orders items alphabetically', async () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.setSort('name'));
    const names = result.current.items.map(i => i.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

// ── custom categories ────────────────────────────────────────────────────────

describe('addCategory / deleteCategory', () => {
  it('adds a custom category and switches to it', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.addCategory('Books'));
    expect(result.current.categories.some(c => c.isCustom && c.label.includes('Books'))).toBe(true);
    expect(result.current.cat).toMatch(/^cat_/);
  });

  it('persists custom category across re-mounts', () => {
    const { result: r1 } = renderHook(() => useDecider());
    act(() => r1.current.addCategory('Podcasts'));
    const { result: r2 } = renderHook(() => useDecider());
    expect(r2.current.categories.some(c => c.label.includes('Podcasts'))).toBe(true);
  });

  it('deletes a custom category and falls back to movies', () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.addCategory('Temp'));
    const catId = result.current.cat;
    act(() => result.current.deleteCategory(catId));
    expect(result.current.categories.every(c => c.id !== catId)).toBe(true);
    expect(result.current.cat).toBe('movies');
  });

  it('clears items of a deleted category', async () => {
    const { result } = renderHook(() => useDecider());
    act(() => result.current.addCategory('Temp'));
    const catId = result.current.cat;
    await act(async () => { await result.current.addItem('Item A'); });
    act(() => result.current.deleteCategory(catId));
    // Re-mount to verify storage was cleared
    const { result: r2 } = renderHook(() => useDecider());
    expect(r2.current.data[catId]).toBeUndefined();
  });
});
