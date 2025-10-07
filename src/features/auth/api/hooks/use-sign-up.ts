"use client";

import { postApi } from "@/lib/http/api";
import { useMutation } from "@tanstack/react-query";
import { SignUpOutput } from "../../data-access/auth-repo";
import { SignUpInput } from "../../contracts/auth-dto";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: SignUpInput) =>
      postApi<SignUpOutput>(`/auth/sign-up`, input),
    onMutate: () => {},
    onSuccess: async (_, vars) => {
      const result = await signIn("credentials", {
        email: vars.email,
        password: vars.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        toast.success("Sign up successful");
        router.push("/");
      } else {
        toast.error("Sign in failed");
      }
    },
  });
};
