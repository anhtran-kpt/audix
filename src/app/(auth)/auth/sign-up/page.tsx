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
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { SignUpInput } from "@/features/auth/contracts/auth-dto";
import { SignUpInputSchema } from "@/features/auth/contracts/auth-schema";
import { useSignUp } from "@/features/auth/hooks/use-sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SignUpPage() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpInputSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: signUp, isPending } = useSignUp();

  useEffect(() => {
    const subscription = form.watch(({ name }) => {
      if (name === "confirmPassword") {
        form.trigger("confirmPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: SignUpInput) => {
    try {
      await signUp(values);
    } catch (error: any) {
      const message = error?.message || "Sign up failed. Please try again.";

      if (message.toLowerCase().includes("email")) {
        form.setError("email", { type: "manual", message });
      } else {
        form.setError("root", { type: "manual", message });
      }
    }
  };

  const { control, handleSubmit, formState } = form;

  return (
    <Card className="w-full max-w-md absolute top-1/2 left-1/2 -translate-1/2">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Welcome to AudiX</CardTitle>
        <CardDescription className="text-xs">
          Immerse yourself in a personalized music experience that brings your
          favorite tracks to life, anytime, anywhere.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {formState.errors.root && (
              <div className="text-destructive text-sm">
                {formState.errors.root.message}
              </div>
            )}

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: johndoe@gmail.com" {...field} />
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
                    <PasswordInput
                      placeholder="Enter your password"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Re-enter your password"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={formState.isSubmitting || isPending}
            >
              {isPending ? "Signing up..." : "Sign up"}
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
              onClick={() => signIn("google", { callbackUrl: "/" })}
              variant="outline"
              disabled={formState.isSubmitting || isPending}
            >
              <Google />
              Sign up with Google
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex items-center gap-1 justify-center">
        Already have an account?{" "}
        <NavLink href={`/auth/sign-in`} className="underline">
          Sign in now
        </NavLink>
      </CardFooter>
    </Card>
  );
}
