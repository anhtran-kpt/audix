import { create } from "zustand";
import { User } from "@/types/user";
import { AuthUserPayload } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void; // Hàm chạy khi F5
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Mặc định là đang load để check token

  login: (user, token) => {
    // 1. Lưu token vào LocalStorage
    localStorage.setItem("accessToken", token);
    // 2. Cập nhật State
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    // 1. Xóa token
    localStorage.removeItem("accessToken");
    // 2. Reset State
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    // Logic kiểm tra khi reload trang sẽ làm ở Bước 3
    // Tạm thời chỉ check xem có token không
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Ở đây đáng lẽ phải gọi API /auth/profile để verify token
      // Nhưng tạm thời set true để UI không bị flicker
      set({ isAuthenticated: true, isLoading: false });
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
