import { create } from "zustand";

type NewPlaylistDialogState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
};

export const useNewPlaylistDialog = create<NewPlaylistDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),
}));
