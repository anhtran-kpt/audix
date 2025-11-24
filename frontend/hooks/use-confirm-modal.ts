import { create } from "zustand";

interface ConfirmModalStore {
  isOpen: boolean;
  title: string;
  description: string;
  isLoading: boolean;
  onConfirm: () => Promise<void> | void;
  onOpen: (data: {
    title: string;
    description: string;
    onConfirm: () => Promise<void> | void;
  }) => void;
  onClose: () => void;
  setLoading: (loading: boolean) => void;
}

export const useConfirmModal = create<ConfirmModalStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  isLoading: false,
  onConfirm: () => {},
  onOpen: ({ title, description, onConfirm }) =>
    set({ isOpen: true, title, description, onConfirm }),
  onClose: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));
