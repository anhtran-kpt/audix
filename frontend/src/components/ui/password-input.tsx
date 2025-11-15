"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { IconButton } from "./icon-button";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  toggleLabel?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    { className, toggleLabel = "Toggle password visibility", ...props },
    ref
  ) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={className}
          {...props}
        />
        <IconButton
          icon={show ? EyeOff : Eye}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShow((prev) => !prev)}
          aria-label={toggleLabel}
        />
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
