"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { UserRoleType } from "@/features/common/constants/enum";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRoleType[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isChecking } = useAuthStore();

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated || !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/403");
      return;
    }
  }, [isAuthenticated, user, isChecking, router, allowedRoles, pathname]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking Auth...
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
