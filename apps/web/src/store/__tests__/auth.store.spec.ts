import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useAuthStore } from '../auth.store';

describe('useAuthStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().clearAuth();
    });
  });

  it('should initialize with unauthenticated default state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('should set authenticated user and tokens on setAuth', () => {
    const mockUser = { id: 'u1', email: 'user@test.com', role: 'USER' };

    act(() => {
      useAuthStore.getState().setAuth(mockUser, 'access-123', 'refresh-456');
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('access-123');
    expect(state.refreshToken).toBe('refresh-456');
  });

  it('should update user fields partially with updateUser', () => {
    const mockUser = {
      id: 'u1',
      email: 'user@test.com',
      role: 'USER',
      fullName: 'Old Name',
    };

    act(() => {
      useAuthStore.getState().setAuth(mockUser, 'token');
      useAuthStore.getState().updateUser({ fullName: 'New Name' });
    });

    expect(useAuthStore.getState().user?.fullName).toBe('New Name');
    expect(useAuthStore.getState().user?.email).toBe('user@test.com');
  });

  it('should reset state on clearAuth and expireSession', () => {
    const mockUser = { id: 'u1', email: 'user@test.com', role: 'USER' };

    act(() => {
      useAuthStore.getState().setAuth(mockUser, 'token');
      useAuthStore.getState().expireSession();
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isSessionExpired).toBe(true);
  });
});
