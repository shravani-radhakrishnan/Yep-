import { useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORIES, loadCustomCategories, makeCategory, saveCustomCategories } from '../../lib/categories';
import { subscribeToUserData, saveUserLists, saveUserCategories } from '../../lib/firebase/firestoreService';
import { loadData, makeItem, saveData } from '../../lib/storage';
import type { Category, DataStore, Item, SortMode, Status } from '../../lib/types';
import { fetchRating } from '../useRatingFetch';

function sortItems(items: Item[], sort: SortMode): Item[] {
  const copy = [...items];
  if (sort === 'smart') {
    const o = { new: 0, skip: 1, done: 2 } as const;
    return copy.sort((a, b) => o[a.status] - o[b.status] || a.picks - b.picks);
  }
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => (a.status === 'new' ? 0 : 1) - (b.status === 'new' ? 0 : 1));
}

export function useDecider(userId: string | null = null) {
  const isFirestore = userId !== null;

  const [data, setData] = useState<DataStore>(() => isFirestore ? {} : loadData());
  const [customCats, setCustomCats] = useState<Category[]>(() => isFirestore ? [] : loadCustomCategories());
  const [ready, setReady] = useState(!isFirestore);
  const [cat, setCat] = useState('movies');
  const [sort, setSort] = useState<SortMode>('smart');
  const [toast, setToast] = useState('');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const lastPickedRef = useRef<string | null>(null);
  const pickedIdRef = useRef<string | null>(null);
  const pickCooldownRef = useRef(0);
  const customCatsRef = useRef(customCats);
  customCatsRef.current = customCats;

  // Subscribe to Firestore when signed in
  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToUserData(userId, (newData, newCats) => {
      setData(newData);
      setCustomCats(newCats);
      setReady(true);
    });
    return unsub;
  }, [userId]);

  const persist = useCallback((updater: (cur: DataStore) => DataStore) => {
    setData(cur => {
      const next = updater(cur);
      if (userId) {
        saveUserLists(userId, next);
      } else {
        saveData(next);
      }
      return next;
    });
  }, [userId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  pickedIdRef.current = pickedId;

  const allCategories = [...CATEGORIES, ...customCats];
  const items = sortItems(data[cat] ?? [], sort);
  const pickedItem = pickedId ? (data[cat] ?? []).find(i => i.id === pickedId) ?? null : null;

  const markItem = useCallback((id: string, status: Status) => {
    persist(cur => ({
      ...cur,
      [cat]: (cur[cat] ?? []).map(i => (i.id === id ? { ...i, status } : i)),
    }));
  }, [cat, persist]);

  const deleteItem = useCallback((id: string) => {
    persist(cur => ({ ...cur, [cat]: (cur[cat] ?? []).filter(i => i.id !== id) }));
  }, [cat, persist]);

  const addItem = useCallback(async (name: string) => {
    const currentCat = cat;
    if ((data[currentCat] ?? []).find(i => i.name.toLowerCase() === name.toLowerCase())) {
      showToast('Already in the list!');
      return;
    }

    const item = makeItem(name);
    persist(cur => ({ ...cur, [currentCat]: [item, ...(cur[currentCat] ?? [])] }));

    const catDef = allCategories.find(c => c.id === currentCat)!;
    if (catDef.type === 'fun') {
      persist(cur => ({
        ...cur,
        [currentCat]: (cur[currentCat] ?? []).map(i =>
          i.id === item.id ? { ...i, rating: '🎲', detail: 'Added' } : i,
        ),
      }));
      return;
    }

    setLoadingIds(prev => new Set(prev).add(item.id));
    const { rating, detail, poster } = await fetchRating(name, catDef.type, currentCat === 'restaurants');
    setLoadingIds(prev => { const s = new Set(prev); s.delete(item.id); return s; });
    persist(cur => ({
      ...cur,
      [currentCat]: (cur[currentCat] ?? []).map(i =>
        i.id === item.id ? { ...i, rating, detail, poster } : i,
      ),
    }));
  }, [cat, data, allCategories, persist, showToast]);

  const pickOne = useCallback(() => {
    if (pickedIdRef.current !== null) return;
    if (Date.now() < pickCooldownRef.current) return;
    const all = data[cat] ?? [];
    if (!all.length) { showToast('Add something first!'); return; }

    const fresh = all.filter(i => i.status === 'new');
    const pool = fresh.length ? fresh : all;
    const elig = pool.length > 1 ? pool.filter(i => i.id !== lastPickedRef.current) : pool;
    const pick = elig[Math.floor(Math.random() * elig.length)];

    persist(cur => ({
      ...cur,
      [cat]: (cur[cat] ?? []).map(i => i.id === pick.id ? { ...i, picks: i.picks + 1 } : i),
    }));
    lastPickedRef.current = pick.id;
    setPickedId(pick.id);
  }, [cat, data, persist, showToast]);

  const giveFeedback = useCallback((status: Status) => {
    if (!pickedId) return;
    const id = pickedId;
    persist(cur => ({
      ...cur,
      [cat]: (cur[cat] ?? []).map(i => (i.id === id ? { ...i, status } : i)),
    }));
    setPickedId(null);
    pickCooldownRef.current = Date.now() + 500;
    showToast(status === 'done' ? '✓ Marked as done!' : 'Got it — noted for next time');
  }, [pickedId, cat, persist, showToast]);

  const closeModal = useCallback(() => {
    setPickedId(null);
    pickCooldownRef.current = Date.now() + 500;
  }, []);

  const addCategory = useCallback((name: string) => {
    const newCat = makeCategory(name);
    setCustomCats(prev => {
      const next = [...prev, newCat];
      if (userId) saveUserCategories(userId, next);
      else saveCustomCategories(next);
      return next;
    });
    setCat(newCat.id);
  }, [userId]);

  const deleteCategory = useCallback((id: string) => {
    setCustomCats(prev => {
      const next = prev.filter(c => c.id !== id);
      if (userId) saveUserCategories(userId, next);
      else saveCustomCategories(next);
      return next;
    });
    persist(cur => { const next = { ...cur }; delete next[id]; return next; });
    setCat(prev => (prev === id ? 'movies' : prev));
  }, [userId, persist]);

  const reroll = useCallback(() => {
    const all = data[cat] ?? [];
    if (!all.length) return;
    const fresh = all.filter(i => i.status === 'new');
    const pool = fresh.length ? fresh : all;
    const elig = pool.length > 1 ? pool.filter(i => i.id !== lastPickedRef.current) : pool;
    const pick = elig[Math.floor(Math.random() * elig.length)];
    persist(cur => ({
      ...cur,
      [cat]: (cur[cat] ?? []).map(i => i.id === pick.id ? { ...i, picks: i.picks + 1 } : i),
    }));
    lastPickedRef.current = pick.id;
    setPickedId(pick.id);
  }, [cat, data, persist]);

  return {
    ready, items, cat, sort, toast, pickedItem, loadingIds,
    categories: allCategories, data,
    setCat, setSort, markItem, deleteItem, addItem, pickOne,
    giveFeedback, closeModal, reroll, addCategory, deleteCategory,
  };
}
