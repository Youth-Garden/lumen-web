import { cookieHelper } from '@lumen/utils';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const SIDEBAR_COLLAPSED_COOKIE = 'sidebar_collapsed';

const getInitialCollapsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  return cookieHelper.get(SIDEBAR_COLLAPSED_COOKIE) === 'true';
};

interface UiState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  devtools(
    (set) => ({
      sidebarCollapsed: getInitialCollapsed(),
      commandPaletteOpen: false,
      toggleSidebar: () =>
        set((state) => {
          const next = !state.sidebarCollapsed;
          cookieHelper.set(SIDEBAR_COLLAPSED_COOKIE, String(next), {
            expires: 365,
            path: '/',
          });
          return { sidebarCollapsed: next };
        }),
      setSidebarCollapsed: (collapsed) => {
        cookieHelper.set(SIDEBAR_COLLAPSED_COOKIE, String(collapsed), {
          expires: 365,
          path: '/',
        });
        set({ sidebarCollapsed: collapsed });
      },
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    { name: 'UiStore' },
  ),
);
