"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar";

interface GridWrapperProps {
  children: ReactNode;
  className?: string;
}

export const GridWrapper = ({ children, className }: GridWrapperProps) => {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "grid",
        open
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
};
