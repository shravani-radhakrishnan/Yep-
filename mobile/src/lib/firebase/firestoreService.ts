import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from '.';
import { loadData, loadCustomCategories } from '../storage';
import type { Category, DataStore } from '../types';

function userRef(userId: string) {
  return doc(db, 'users', userId);
}

export async function saveUserLists(userId: string, data: DataStore): Promise<void> {
  await setDoc(userRef(userId), { lists: data }, { merge: true });
}

export async function saveUserCategories(userId: string, cats: Category[]): Promise<void> {
  await setDoc(userRef(userId), { customCategories: cats }, { merge: true });
}

export function subscribeToUserData(
  userId: string,
  onData: (data: DataStore, customCategories: Category[]) => void,
): Unsubscribe {
  return onSnapshot(userRef(userId), async snap => {
    if (!snap.exists()) {
      // First sign-in — migrate any existing localStorage data to Firestore
      const localData = await loadData();
      const localCats = await loadCustomCategories();
      await setDoc(userRef(userId), { lists: localData, customCategories: localCats });
      // onSnapshot will fire again once the write is confirmed
    } else {
      const d = snap.data();
      onData(d.lists ?? {}, d.customCategories ?? []);
    }
  });
}
