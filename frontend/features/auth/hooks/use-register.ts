"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register as registerApi } from "../api/client";
import { useAuthStore } from "../stores/use-auth-store";

export const useRegister = () => {
  const router = useRouter();
  const { login: setLoginState } = useAuthStore();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setLoginState(data.user, data.access_token);

      toast.success(`Welcome, ${data.user.name}!`);

      router.push("/");
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
