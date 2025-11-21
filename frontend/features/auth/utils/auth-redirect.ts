import { User } from "@/features/common/types/entity.type";
import { UserRole } from "@/features/common/constants/enum";

export const getRedirectPath = (
  user: User | null,
  returnUrl?: string | null
): string => {
  if (!user) return "/login";

  const decodedReturnUrl = returnUrl
    ? decodeURIComponent(returnUrl)
    : undefined;

  if (user.role === UserRole.ADMIN) {
    if (!decodedReturnUrl || decodedReturnUrl === "/") {
      return "/admin/dashboard";
    }

    if (
      decodedReturnUrl.includes("/login") ||
      decodedReturnUrl.includes("/register")
    ) {
      return "/admin/dashboard";
    }

    return decodedReturnUrl;
  }

  if (
    decodedReturnUrl &&
    decodedReturnUrl !== "/" &&
    !decodedReturnUrl.includes("/login") &&
    !decodedReturnUrl.includes("/register")
  ) {
    return decodedReturnUrl;
  }

  return "/";
};
