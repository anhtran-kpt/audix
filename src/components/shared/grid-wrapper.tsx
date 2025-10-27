"use client";

import { ReactNode, useRef } from "react";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { cn } from "@/lib/utils";

interface GridWrapperProps {
  children: ReactNode;
}

export const GridWrapper = ({ children }: GridWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const limit = useResponsiveLimit(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      style={{
        gridTemplateColumns: `repeat(${limit}, minmax(0, 1fr))`,
      }}
      className={cn("grid gap-4 xl:gap-6 transition-[grid-template-columns]")}
    >
      {children}
    </div>
  );
};
