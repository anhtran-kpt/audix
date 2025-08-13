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
import { signInInput, SignInInput } from "@/features/auth/schemas/auth.schema";
import { Separator } from "../ui/separator";
import Google from "../ui/google";
import { NavLink } from "../ui/nav-link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export const SignInForm = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInInput),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!res) {
      form.setError("root", {
        message: "An unknown error occurred. Try again later",
      });
      return;
    }
    if (res.error) {
      form.setError("root", { message: "Incorrect email or password" });
      return;
    }

    router.replace(callbackUrl);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.message && (
          <p className="text-sm text-destructive-foreground">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="text-end -mt-3">
          <NavLink href="/auth/forgot-password" className="underline">
            Forgot password?
          </NavLink>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <div className="text-center">
          <span className="text-muted-foreground text-[calc(13rem/16)]">
            Don't have an account?
          </span>{" "}
          <NavLink href="/auth/sign-up" className="underline">
            Sign up now
          </NavLink>
        </div>
        <div className="relative my-6">
          <Separator />
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-card px-3">
            <span className="select-none text-muted-foreground">Or</span>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          variant="outline"
          className="w-full"
        >
          <Google />
          Continue with Google
        </Button>
      </form>
    </Form>
  );
};
