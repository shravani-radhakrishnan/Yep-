import { beforeEach, describe, expect, it } from 'vitest';
import { CATEGORIES, loadCustomCategories, makeCategory, saveCustomCategories } from '.';

beforeEach(() => localStorage.clear());

describe('CATEGORIES', () => {
  it('has exactly 4 built-in categories', () => {
    expect(CATEGORIES).toHaveLength(4);
  });

  it('has the expected ids in order', () => {
    expect(CATEGORIES.map(c => c.id)).toEqual(['movies', 'restaurants', 'places', 'activities']);
  });

  it('none are marked as custom', () => {
    expect(CATEGORIES.every(c => !c.isCustom)).toBe(true);
  });
});

describe('makeCategory', () => {
  it('sets isCustom to true', () => {
    expect(makeCategory('Test').isCustom).toBe(true);
  });

  it('sets type to fun', () => {
    expect(makeCategory('Test').type).toBe('fun');
  });

  it('generates a unique id with cat_ prefix', () => {
    const cat = makeCategory('Test');
    expect(cat.id).toMatch(/^cat_/);
    expect(makeCategory('Other').id).not.toBe(cat.id);
  });

  it('auto-assigns 📚 emoji for "books"', () => {
    expect(makeCategory('Books').label).toContain('📚');
  });

  it('auto-assigns 🎵 emoji for "music"', () => {
    expect(makeCategory('Music').label).toContain('🎵');
  });

  it('auto-assigns 🎮 emoji for "gaming"', () => {
    expect(makeCategory('Gaming').label).toContain('🎮');
  });

  it('auto-assigns 📺 emoji for "shows"', () => {
    expect(makeCategory('TV Shows').label).toContain('📺');
  });

  it('falls back to ✨ for unrecognised names', () => {
    expect(makeCategory('Miscellaneous').label).toContain('✨');
  });

  it('preserves a user-supplied leading emoji', () => {
    expect(makeCategory('🎯 Darts').label).toBe('🎯 Darts');
  });

  it('includes the name in the label', () => {
    expect(makeCategory('Podcasts').label).toContain('Podcasts');
  });

  it('sets a meaningful placeholder', () => {
    expect(makeCategory('Books').placeholder).toContain('Books');
  });
});

describe('loadCustomCategories / saveCustomCategories', () => {
  it('returns empty array when nothing is stored', () => {
    expect(loadCustomCategories()).toEqual([]);
  });

  it('returns empty array when localStorage is corrupted', () => {
    localStorage.setItem('dcdr_cats', 'bad json');
    expect(loadCustomCategories()).toEqual([]);
  });

  it('round-trips categories through localStorage', () => {
    const cats = [makeCategory('Books'), makeCategory('Podcasts')];
    saveCustomCategories(cats);
    const loaded = loadCustomCategories();
    expect(loaded).toHaveLength(2);
    expect(loaded[0].label).toBe(cats[0].label);
    expect(loaded[1].label).toBe(cats[1].label);
  });

  it('persists isCustom and type fields', () => {
    saveCustomCategories([makeCategory('Art')]);
    const [cat] = loadCustomCategories();
    expect(cat.isCustom).toBe(true);
    expect(cat.type).toBe('fun');
  });
});
