"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { register as registerApi } from "../api/client";
import { useAuthStore } from "../stores/use-auth-store";
import { getRedirectPath } from "../utils/auth-redirect";

export const useRegister = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setLoginState } = useAuthStore();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setLoginState(data.user, data.access_token);
      toast.success(`Welcome, ${data.user.name}!`);

      const returnUrl = searchParams.get("returnUrl");
      const redirectPath = getRedirectPath(data.user, returnUrl);

      router.replace(redirectPath);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
