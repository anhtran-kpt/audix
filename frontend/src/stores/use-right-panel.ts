"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type RightPanelKind = "none" | "now-playing" | "queue";

type State = { active: RightPanelKind };
type Actions = {
  open: (kind: Exclude<RightPanelKind, "none">) => void;
  close: () => void;
  toggle: (kind: Exclude<RightPanelKind, "none">) => void;
};

type Store = State & Actions;

export const useRightPanel = create<Store>()(
  subscribeWithSelector((set, get) => ({
    active: "none",
    open: (kind) => set({ active: kind }),
    toggle: (kind) => set({ active: get().active === kind ? "none" : kind }),
    close: () => set({ active: "none" }),
  }))
);
