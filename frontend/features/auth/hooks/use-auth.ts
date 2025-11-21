"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginApi } from "../api/client";
import { useAuthStore } from "../stores/use-auth-store";

export const useAuth = () => {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    login: setLoginState,
    logout: setLogoutState,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setLoginState(data.user, data.access_token);
    },
  });

  const handleLogout = () => {
    setLogoutState();
    router.push("/auth/login");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
  };
};
