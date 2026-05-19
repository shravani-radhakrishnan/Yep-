import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange } from '../../lib/firebase/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthChange(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
