import { create } from "zustand";

export type RightPanelKind = "none" | "now-playing" | "queue";

type State = { active: RightPanelKind };
type Actions = {
  open: (kind: Exclude<RightPanelKind, "none">) => void;
  close: () => void;
  toggle: (kind: Exclude<RightPanelKind, "none">) => void;
};

export const useRightPanel = create<State & Actions>((set, get) => ({
  active: "none",
  open: (kind) => set({ active: kind }),
  toggle: (kind) => {
    const { active } = get();
    set({ active: active === kind ? "none" : kind });
  },
  close: () => set({ active: "none" }),
}));
