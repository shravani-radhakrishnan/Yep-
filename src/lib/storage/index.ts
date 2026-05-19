import type { Item, DataStore } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function seedData(): DataStore {
  return {
    movies: [
      { id: uid(), name: 'Dune: Part Two',  rating: '⭐ 8.5 / 10', detail: 'Sci-Fi · 2h 46m · 2024',    status: 'new',  picks: 0 },
      { id: uid(), name: 'Oppenheimer',     rating: '⭐ 8.9 / 10', detail: 'Biography · 3h · 2023',      status: 'done', picks: 2 },
      { id: uid(), name: 'Anora',           rating: '⭐ 7.8 / 10', detail: 'Drama · 2h 19m · 2024',      status: 'new',  picks: 0 },
      { id: uid(), name: 'Conclave',        rating: '⭐ 7.4 / 10', detail: 'Thriller · 2h 1m · 2024',    status: 'skip', picks: 1 },
      { id: uid(), name: 'The Brutalist',   rating: '⭐ 7.6 / 10', detail: 'Drama · 3h 35m · 2024',      status: 'new',  picks: 0 },
    ],
    restaurants: [
      { id: uid(), name: "Grimaldi's Pizza", rating: '⭐ 4.6 / 5', detail: 'Pizza · $$ · Brooklyn',      status: 'new',  picks: 0 },
      { id: uid(), name: 'Ramen Nakamura',   rating: '⭐ 4.4 / 5', detail: 'Ramen · $$ · NYC',           status: 'done', picks: 1 },
      { id: uid(), name: 'Via Carota',       rating: '⭐ 4.7 / 5', detail: 'Italian · $$$ · NYC',        status: 'new',  picks: 0 },
    ],
    places: [
      { id: uid(), name: 'Central Park',    rating: '⭐ 4.8 / 5', detail: 'Park · Free · NYC',           status: 'new',  picks: 0 },
      { id: uid(), name: 'The Met Museum',  rating: '⭐ 4.7 / 5', detail: 'Museum · $30 · NYC',          status: 'done', picks: 1 },
    ],
    activities: [
      { id: uid(), name: 'Bowling night',   rating: '🎳 Fun', detail: '~2 hours',                        status: 'new',  picks: 0 },
      { id: uid(), name: 'Board games',     rating: '🎲 Fun', detail: 'At home',                         status: 'done', picks: 3 },
    ],
  };
}

const ITEMS_KEY = 'dcdr11';

export function loadData(): DataStore {
  try {
    const stored = localStorage.getItem(ITEMS_KEY);
    return stored ? JSON.parse(stored) : seedData();
  } catch {
    return seedData();
  }
}

export function saveData(data: DataStore): void {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(data));
}

export function makeItem(name: string): Item {
  return { id: uid(), name, rating: '', detail: '', status: 'new', picks: 0 };
}
