// src/features/auth/stores/use-auth-store.ts
import { User } from "@/features/common/types/entity.type";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isChecking: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  finishInitialLoad: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isChecking: true,

  login: (user, token) => {
    localStorage.setItem("accessToken", token);
    set({ user, isAuthenticated: true, isChecking: false });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false, isChecking: false });
  },

  finishInitialLoad: () => {
    set({ isChecking: false });
  },
}));
