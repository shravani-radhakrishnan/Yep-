import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, DataStore, Item } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function seedData(): DataStore {
  return {
    movies: [
      { id: uid(), name: 'Dune: Part Two',  rating: '⭐ 8.5 / 10', detail: 'Sci-Fi · 2h 46m · 2024',  status: 'new',  picks: 0 },
      { id: uid(), name: 'Oppenheimer',     rating: '⭐ 8.9 / 10', detail: 'Biography · 3h · 2023',    status: 'done', picks: 2 },
      { id: uid(), name: 'Anora',           rating: '⭐ 7.8 / 10', detail: 'Drama · 2h 19m · 2024',    status: 'new',  picks: 0 },
    ],
    restaurants: [
      { id: uid(), name: "Grimaldi's Pizza", rating: '⭐ 4.6 / 5', detail: 'Pizza · $$ · Brooklyn',   status: 'new',  picks: 0 },
      { id: uid(), name: 'Via Carota',       rating: '⭐ 4.7 / 5', detail: 'Italian · $$$ · NYC',     status: 'new',  picks: 0 },
    ],
    places: [
      { id: uid(), name: 'Central Park',  rating: '⭐ 4.8 / 5', detail: 'Park · Free · NYC',          status: 'new',  picks: 0 },
    ],
    activities: [
      { id: uid(), name: 'Bowling night', rating: '🎳 Fun', detail: '~2 hours',                       status: 'new',  picks: 0 },
      { id: uid(), name: 'Board games',   rating: '🎲 Fun', detail: 'At home',                        status: 'done', picks: 3 },
    ],
  };
}

const ITEMS_KEY = 'dcdr11';
const CATS_KEY  = 'dcdr_cats';

export async function loadData(): Promise<DataStore> {
  try {
    const stored = await AsyncStorage.getItem(ITEMS_KEY);
    return stored ? JSON.parse(stored) : seedData();
  } catch {
    return seedData();
  }
}

export async function saveData(data: DataStore): Promise<void> {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(data));
}

export async function loadCustomCategories(): Promise<Category[]> {
  try {
    const stored = await AsyncStorage.getItem(CATS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function saveCustomCategories(cats: Category[]): Promise<void> {
  await AsyncStorage.setItem(CATS_KEY, JSON.stringify(cats));
}

export function makeItem(name: string): Item {
  return { id: uid(), name, rating: '', detail: '', status: 'new', picks: 0 };
}
