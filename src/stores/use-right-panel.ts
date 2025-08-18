"use client";

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";

export type RightPanelKind = "none" | "now-playing" | "queue";

type State = { active: RightPanelKind };
type Actions = {
  open: (kind: Exclude<RightPanelKind, "none">) => void;
  close: () => void;
  toggle: (kind: Exclude<RightPanelKind, "none">) => void;
};

type Store = State & Actions;

export const useRightPanel = create<Store>()(
  persist(
    subscribeWithSelector((set, get) => ({
      active: "none",
      open: (kind) => set({ active: kind }),
      toggle: (kind) => set({ active: get().active === kind ? "none" : kind }),
      close: () => set({ active: "none" }),
    })),
    {
      name: "audix:right-panel",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({ active: s.active }),
      merge: (persisted: any, current) => {
        const ok: RightPanelKind[] = ["none", "now-playing", "queue"];
        const active = ok.includes(persisted?.active)
          ? persisted.active
          : "none";
        return { ...current, active };
      },
    }
  )
);
