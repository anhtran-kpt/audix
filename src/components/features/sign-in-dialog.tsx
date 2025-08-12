"use client";

import { LogInIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { signIn, useSession } from "next-auth/react";
import Google from "../ui/google";
import GitHub from "../ui/github";
import { Separator } from "../ui/separator";
import { NavLink } from "../ui/nav-link";

export const SignInDialog = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <LogInIcon />
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center">Sign in</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Your email address" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Your password"
          />
        </div>
        <div className="text-end">
          <NavLink href="/forgot-password" className="underline">
            Forgot password?
          </NavLink>
        </div>
        <DialogFooter>
          <Button className="w-full">Sign in</Button>
        </DialogFooter>
        <div className="text-center">
          <span className="text-muted-foreground text-[calc(13rem/16)]">
            Don't have an account?
          </span>{" "}
          <NavLink href="/sign-up" className="underline">
            Sign up now
          </NavLink>
        </div>
        <div className="relative my-2">
          <Separator />
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-background px-3">
            <span className="select-none text-muted-foreground">Or</span>
          </div>
        </div>
        <Button onClick={() => signIn("google")} variant="outline">
          <Google />
          Continue with Google
        </Button>
        <Button onClick={() => signIn("github")} variant="outline">
          <GitHub />
          Continue with GitHub
        </Button>
      </DialogContent>
    </Dialog>
  );
};
