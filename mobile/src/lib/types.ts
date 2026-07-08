export type Status = 'new' | 'done' | 'skip';
export type SortMode = 'smart' | 'name' | 'new';
export type CategoryType = 'movie' | 'place' | 'fun';

export interface Category {
  id: string;
  label: string;
  placeholder: string;
  hint: string;
  type: CategoryType;
  isCustom?: boolean;
}

export interface Item {
  id: string;
  name: string;
  rating: string;
  detail: string;
  status: Status;
  picks: number;
  poster?: string;
}

export type DataStore = Record<string, Item[]>;
