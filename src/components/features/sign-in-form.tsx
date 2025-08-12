"use client";

import { useActionSubmit } from "@/features/_shared/hooks/use-action-submit";
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

export const SignInForm = () => {
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

  return (
    <Form {...form}>
      <form className="space-y-6">
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

        <div className="text-end -mt-3">
          <NavLink href="/auth/forgot-password" className="underline">
            Forgot password?
          </NavLink>
        </div>
        <Button className="w-full">Sign in</Button>
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
          onClick={() => signIn("google")}
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
