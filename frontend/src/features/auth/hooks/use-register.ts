"use client";

import { useMutation } from "@tanstack/react-query";
import { SignUpInput } from "@/features/auth/auth.type";
import { useRouter } from "next/navigation";
import { signUp } from "../auth-actions";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: SignUpInput) => await signUp(input),
    onSuccess: async (res, vars) => {
      if (!res.success) throw new Error(res.message);

      const result = await signIn("credentials", {
        email: vars.email,
        password: vars.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        router.push("/");
      } else {
        throw new Error("Automatic sign-in failed.");
      }
    },
  });
};
