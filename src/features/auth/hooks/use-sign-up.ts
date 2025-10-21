"use client";

import { postApi } from "@/lib/http/api";
import { useMutation } from "@tanstack/react-query";
import { SignUpOutput } from "@/features/auth/data-access/auth-repo";
import { SignUpInput } from "@/features/auth/contracts/auth-dto";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { authEndpoints } from "../api/auth-endpoints";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: SignUpInput) =>
      postApi<SignUpOutput>(authEndpoints.signUp, { body: input }),

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
