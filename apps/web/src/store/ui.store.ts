import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface UiState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        commandPaletteOpen: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }),
        setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      }),
      {
        name: 'lumen-ui-storage',
      },
    ),
    { name: 'UiStore' },
  ),
);
