import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

interface NavLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export function NavLink({ children, className, ...props }: NavLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "text-[calc(13rem/16)] hover:text-primary hover:underline underline-offset-3 truncate font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
}
