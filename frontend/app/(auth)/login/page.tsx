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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoginSchemaType } from "@/features/auth/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    login(data);

    // if (result?.error) {
    //   if (result.error === "Invalid credentials") {
    //     form.setError("email", {
    //       type: "manual",
    //       message: "Incorrect email or password.",
    //     });
    //     form.setError("password", {
    //       type: "manual",
    //       message: "Incorrect email or password.",
    //     });
    //   } else {
    //     form.setError("email", {
    //       type: "manual",
    //       message: "Sign in failed. Please try again.",
    //     });
    //   }
    //   return;
    // }

    // toast.success("Sign in sucessful!");
    // router.push("/");
  };

  const { control, handleSubmit, formState } = form;

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
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                        autoComplete="new-password"
                        autoCorrect="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-end">
                <Link href={`/auth/forgot-password`} className="underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={formState.isSubmitting || isLoggingIn}
            >
              {formState.isSubmitting || isLoggingIn
                ? "Signing in..."
                : "Sign in"}
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
              // onClick={() => signIn("google", { callbackUrl: "/" })}
              variant="outline"
              disabled={formState.isSubmitting || isLoggingIn}
            >
              {/* <Google /> */}
              Sign in with Google
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex items-center gap-1 justify-center">
        Don&apos;t have an account?{" "}
        <Link href={`/register`} className="underline">
          Sign up now
        </Link>
      </CardFooter>
    </Card>
  );
}
