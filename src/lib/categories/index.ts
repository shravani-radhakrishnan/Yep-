import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'movies',      label: '🎬 Movies',      placeholder: 'e.g. Oppenheimer, Dune…',   hint: '⭐ TMDB rating loads automatically',  type: 'movie' },
  { id: 'restaurants', label: '🍽 Restaurants',  placeholder: "e.g. Grimaldi's, Nobu…",   hint: 'Add your favourite spots',            type: 'place' },
  { id: 'places',      label: '📍 Places',       placeholder: 'e.g. Central Park, The Met…', hint: 'Add places you want to visit',      type: 'place' },
  { id: 'activities',  label: '🎲 Activities',   placeholder: 'e.g. Bowling, Board games…', hint: 'Anything goes — no rating needed',   type: 'fun'   },
];

const EMOJI_MAP: [RegExp, string][] = [
  [/book|read|lit/i,              '📚'],
  [/music|song|album|band/i,      '🎵'],
  [/game|gaming|play/i,           '🎮'],
  [/show|series|tv|watch|film/i,  '📺'],
  [/travel|trip|vacat|dest/i,     '✈️'],
  [/sport|gym|fit|run|hike/i,     '⚽'],
  [/podcast|listen/i,             '🎙️'],
  [/drink|bar|cocktail|wine|beer/i, '🍹'],
  [/food|meal|eat|cook|recip/i,   '🥗'],
  [/art|museum|exhibit/i,         '🎨'],
  [/shop|buy|store/i,             '🛍️'],
];

function autoEmoji(name: string): string {
  for (const [re, emoji] of EMOJI_MAP) {
    if (re.test(name)) return emoji;
  }
  return '✨';
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

const CUSTOM_CATS_KEY = 'dcdr_cats';

export function makeCategory(name: string): Category {
  const trimmed = name.trim();
  const hasEmoji = trimmed.charCodeAt(0) > 127;
  const label = hasEmoji ? trimmed : `${autoEmoji(trimmed)} ${trimmed}`;
  return {
    id: `cat_${uid()}`,
    label,
    placeholder: `Add to ${trimmed}…`,
    hint: 'Your custom list — anything goes',
    type: 'fun',
    isCustom: true,
  };
}

export function loadCustomCategories(): Category[] {
  try {
    const stored = localStorage.getItem(CUSTOM_CATS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(cats: Category[]): void {
  localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(cats));
}
