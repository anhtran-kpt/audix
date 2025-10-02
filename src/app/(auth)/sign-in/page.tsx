"use client";

import { Button } from "@/components/ui/button";
import Google from "@/components/ui/google";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-1/2">
      <Button
        className="w-full"
        onClick={() => signIn("google")}
        variant="outline"
      >
        <Google />
        Sign in with Google
      </Button>
    </div>
  );
}
