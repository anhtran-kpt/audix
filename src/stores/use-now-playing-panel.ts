import { create } from "zustand";

type State = { isOpen: boolean };
type Actions = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useNowPlayingPanel = create<State & Actions>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
