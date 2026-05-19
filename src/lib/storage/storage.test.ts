import { beforeEach, describe, expect, it } from 'vitest';
import { loadData, makeItem, saveData } from '.';

beforeEach(() => localStorage.clear());

describe('makeItem', () => {
  it('creates an item with the given name', () => {
    const item = makeItem('Oppenheimer');
    expect(item.name).toBe('Oppenheimer');
  });

  it('defaults status to new, picks to 0, rating/detail to empty', () => {
    const item = makeItem('Test');
    expect(item.status).toBe('new');
    expect(item.picks).toBe(0);
    expect(item.rating).toBe('');
    expect(item.detail).toBe('');
  });

  it('generates a non-empty id', () => {
    expect(makeItem('A').id).toBeTruthy();
  });

  it('generates unique ids for different items', () => {
    expect(makeItem('A').id).not.toBe(makeItem('B').id);
  });
});

describe('loadData', () => {
  it('returns seed data when localStorage is empty', () => {
    const data = loadData();
    expect(data.movies).toBeDefined();
    expect(data.movies.length).toBeGreaterThan(0);
  });

  it('includes all four default categories in seed data', () => {
    const data = loadData();
    expect(data.movies).toBeDefined();
    expect(data.restaurants).toBeDefined();
    expect(data.places).toBeDefined();
    expect(data.activities).toBeDefined();
  });

  it('returns seed data when localStorage contains invalid JSON', () => {
    localStorage.setItem('dcdr11', 'not-json');
    const data = loadData();
    expect(data.movies).toBeDefined();
  });
});

describe('saveData / loadData round-trip', () => {
  it('persists and retrieves data correctly', () => {
    const item = makeItem('Dune');
    saveData({ movies: [item] });
    const loaded = loadData();
    expect(loaded.movies).toHaveLength(1);
    expect(loaded.movies[0].name).toBe('Dune');
  });

  it('persists all item fields without loss', () => {
    const item = { ...makeItem('Dune'), rating: '⭐ 8.5', detail: 'Sci-Fi', status: 'done' as const, picks: 3 };
    saveData({ movies: [item] });
    const loaded = loadData();
    expect(loaded.movies[0]).toMatchObject({ name: 'Dune', rating: '⭐ 8.5', status: 'done', picks: 3 });
  });
});
