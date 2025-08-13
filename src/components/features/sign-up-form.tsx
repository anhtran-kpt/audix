"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { signUpInput, SignUpInput } from "@/features/auth/schemas/auth.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionSubmit } from "@/features/_shared/hooks/use-action-submit";
import { signUpAction } from "@/features/auth/actions/sign-up.action";
import { signIn } from "next-auth/react";

export const SignUpForm = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpInput),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, errors },
  } = form;

  const { isPending, submit } = useActionSubmit(form, signUpAction, {
    onSuccess: async ({ values }) => {
      const signed = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signed?.error) {
        form.setError("root", {
          message: "Automatic sign in failed, please sign in again",
        });
        return;
      }

      router.replace(callbackUrl);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <FormField
          name="name"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: johndoe@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="••••••••" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="••••••••" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errors.root?.message && (
          <p className="text-sm text-destructive-foreground">
            {errors.root.message}
          </p>
        )}

        <Button
          className="w-full"
          disabled={!isValid || isSubmitting || isPending}
        >
          Create account
        </Button>
      </form>
    </Form>
  );
};
