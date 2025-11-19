"use client";

import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import type { ReactNode } from "react";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
