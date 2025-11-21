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
import { Input } from "@/components/ui/input";
// import { NavLink } from "@/components/ui/nav-link";
// import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { useRegister } from "@/features/auth/hooks/use-register";
import {
  registerSchema,
  RegisterSchemaType,
} from "@/features/auth/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const { register, isLoading } = useRegister();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const subscription = watch(({ name }) => {
      if (name === "confirmPassword") {
        trigger("confirmPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data: RegisterSchemaType) => {
    await register({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  };

  const {
    handleSubmit,
    control,
    setError,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

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
            {errors.root && (
              <div className="text-destructive text-sm">
                {errors.root.message}
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
                    <Input
                      placeholder="Enter your password"
                      type="password"
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
                    <Input
                      placeholder="Re-enter your password"
                      type="password"
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
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
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
              disabled={isSubmitting || isLoading}
            >
              {/* <Google /> */}
              Sign up with Google
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex items-center gap-1 justify-center">
        Already have an account?{" "}
        <Link href={`/auth/login`} className="underline">
          Sign in now
        </Link>
      </CardFooter>
    </Card>
  );
}
