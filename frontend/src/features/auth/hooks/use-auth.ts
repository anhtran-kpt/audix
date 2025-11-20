"use client";

import { useEffect } from "react";
import { login as loginApi, getProfile } from "../api/client";
import { useAuthStore } from "../stores/use-auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { login: setLoginState, logout: setLogoutState, user } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setLoginState(data.user, data.access_token);
    },
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const {
    data: profileData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
    // Chỉ chạy query khi có token VÀ user trong store chưa có (để tránh fetch lại thừa thãi)
    // Hoặc luôn fetch để update data mới nhất (tùy chiến lược)
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache profile trong 5 phút
  });

  // Xử lý Side Effect (Thay thế onSuccess/onError cũ)
  useEffect(() => {
    if (profileData) {
      // Token hợp lệ -> Nạp user vào Store
      // Lưu ý: profileData phải khớp type với User trong store
      setLoginState(profileData, token!);
    }
  }, [profileData, setLoginState, token]);

  useEffect(() => {
    if (isError) {
      // Token hết hạn hoặc lỗi -> Logout sạch sẽ
      setLogoutState();
    }
  }, [isError, setLogoutState]);

  return {
    login: loginMutation.mutateAsync,
    logout: setLogoutState,
    user,
    // Loading khi đang login HOẶC đang fetch profile lần đầu
    isLoading: loginMutation.isPending || (isLoading && !!token),
    isAuthenticated: !!user,
  };
};
