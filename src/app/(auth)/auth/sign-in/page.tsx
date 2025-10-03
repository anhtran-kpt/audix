"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Google from "@/components/ui/google";
import { Input } from "@/components/ui/input";
import { NavLink } from "@/components/ui/nav-link";
import { Separator } from "@/components/ui/separator";
import { SignInInput } from "@/features/auth/contracts/auth-dto";
import { SignInInputSchema } from "@/features/auth/contracts/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const form = useForm<SignInInput>({
    mode: "onBlur",
    resolver: zodResolver(SignInInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: SignInInput) {
    console.log(values);
  }

  const { control, handleSubmit } = form;

  return (
    <Card className="w-full max-w-md absolute top-1/2 left-1/2 -translate-1/2">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">
          Welcome back to AudiX
        </CardTitle>
        <CardDescription className="text-xs">
          Immerse yourself in a personalized music experience that brings your
          favorite tracks to life, anytime, anywhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <div className="space-y-2">
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
              <div className="text-end">
                <NavLink href={`/auth/forgot-password`} className="underline">
                  Forgot password?
                </NavLink>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className="relative">
              <Separator />
              <div className="absolute top-1/2 left-1/2 -translate-1/2 bg-card px-4">
                or
              </div>
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={() => signIn("google")}
              variant="outline"
            >
              <Google />
              Sign in with Google
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center gap-1 justify-center">
        Don&apos;t have an account?{" "}
        <NavLink href={`/auth/sign-up`} className="underline">
          Sign up now
        </NavLink>
      </CardFooter>
    </Card>
  );
}
