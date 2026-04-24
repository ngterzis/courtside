import { create } from 'zustand';

interface UIState {
  activeSeasonId: string | null; // null = current
  chatOpen: boolean;
  setActiveSeasonId: (id: string | null) => void;
  setChatOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSeasonId: null,
  chatOpen: false,
  setActiveSeasonId: (id) => set({ activeSeasonId: id }),
  setChatOpen: (open) => set({ chatOpen: open }),
}));
