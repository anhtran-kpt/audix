"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { login as loginApi } from "../api/client";
import { useAuthStore } from "../stores/use-auth-store";
import { getRedirectPath } from "../utils/auth-redirect";

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

      const returnUrl = searchParams.get("returnUrl");

      const redirectPath = getRedirectPath(data.user, returnUrl);

      router.replace(redirectPath);
    },
  });

  const handleLogout = () => {
    setLogoutState();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
  };
};
