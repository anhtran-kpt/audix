"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { authKeys } from "@/features/auth/api/keys";
import { getProfile } from "@/features/auth/api/client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, logout, finishInitialLoad } = useAuthStore();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const {
    data: profileData,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: authKeys.profile(),
    queryFn: getProfile,
    retry: false,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!token) {
      logout();
      finishInitialLoad();
      return;
    }

    if (isSuccess && profileData) {
      login(profileData, token);
    }

    if (isError) {
      logout();
    }
  }, [
    token,
    isSuccess,
    isError,
    profileData,
    login,
    logout,
    finishInitialLoad,
  ]);

  return <>{children}</>;
}
