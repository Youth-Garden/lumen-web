import { PortalInstance } from '../types/portal.types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LayoutState {
  portals: PortalInstance[];

  // Actions
  onPresent: (instance: PortalInstance) => void;
  onDismiss: (id?: string) => void;
  closeAllPortals: () => void;

  // Internal cleanup
  removePortal: (id: string) => void;
}

const initialState = {
  portals: [],
};

export const usePortalStore = create<LayoutState>()(devtools((set, get) => ({
  ...initialState,

  onPresent: (instance) => {
    const { portals } = get();
    const existingIndex = portals.findIndex(
      (portal) => portal.id === instance.id,
    );

    if (existingIndex > -1) {
      // If it exists (maybe closing), reopen it and update data
      set({
        portals: portals.map((portal, i) =>
          i === existingIndex
            ? { ...portal, ...instance, isOpen: true }
            : portal,
        ),
      });
      return;
    }

    set({
      portals: [...portals, { ...instance, isOpen: true }],
    });
  },

  onDismiss: (id) => {
    const { portals, removePortal } = get();
    if (portals.length === 0) return;

    const targetId = id || portals[portals.length - 1].id;

    set({
      portals: portals.map((portal) =>
        portal.id === targetId ? { ...portal, isOpen: false } : portal,
      ),
    });

    // Automatically remove from stack after animation completes
    // BUT only if it hasn't been reopened in the meantime
    setTimeout(() => {
      const currentPortals = get().portals;
      const portal = currentPortals.find((p) => p.id === targetId);
      if (portal && !portal.isOpen && targetId) {
        removePortal(targetId);
      }
    }, 200);
  },

  closeAllPortals: () => {
    set({ ...initialState });
  },

  removePortal: (id) => {
    const { portals } = get();
    set({
      portals: portals.filter((portal) => portal.id !== id),
    });
  },
}), { name: 'PortalStore' }));
