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
import { SignUpInput } from "@/features/auth/contracts/auth-dto";
import { SignUpInputSchema } from "@/features/auth/contracts/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function SignUpPage() {
  const form = useForm<SignUpInput>({
    mode: "onBlur",
    resolver: zodResolver(SignUpInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: SignUpInput) {
    console.log(values);
  }

  const { control, handleSubmit } = form;

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
                      {...field}
                      type="password"
                      autoCorrect="off"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign up
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
