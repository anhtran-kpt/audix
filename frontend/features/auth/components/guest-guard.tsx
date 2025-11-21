"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { getRedirectPath } from "../utils/auth-redirect";

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isChecking, user } = useAuthStore();

  useEffect(() => {
    if (isChecking) return;

    if (isAuthenticated && user) {
      const returnUrl = searchParams.get("returnUrl");
      const redirectPath = getRedirectPath(user, returnUrl);

      router.replace(redirectPath);
    }
  }, [isAuthenticated, isChecking, router, user, searchParams]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
