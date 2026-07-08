'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadProfile = useAuthStore((state) => state.loadProfile);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return <>{children}</>;
}
