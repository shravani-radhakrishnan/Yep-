import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from '.';
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
      // First sign-in for this account — start with an empty list.
      // (Local/device storage is not this account's data and must never seed it.)
      await setDoc(userRef(userId), { lists: {}, customCategories: [] });
      // onSnapshot will fire again once the write is confirmed
    } else {
      const d = snap.data();
      onData(d.lists ?? {}, d.customCategories ?? []);
    }
  });
}
