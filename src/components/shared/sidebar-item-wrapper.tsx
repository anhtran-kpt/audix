"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SidebarItemWrapperProps {
  open: boolean;
  image: ReactNode;
  info?: ReactNode;
  right?: ReactNode;
}

export function SidebarItemWrapper({
  open,
  image,
  info,
  right,
}: SidebarItemWrapperProps) {
  return (
    <div
      className={cn(
        "min-w-0 flex items-center transition-all duration-200",
        open ? "gap-3 flex-1" : "justify-center w-10"
      )}
    >
      <div className="relative shrink-0 size-10 flex items-center justify-center">
        {image}
      </div>

      <div
        className={cn(
          "flex flex-col gap-0.5 overflow-hidden transition-[opacity,max-width,margin] duration-200",
          open ? "opacity-100 max-w-full ml-0" : "opacity-0 max-w-0 ml-0"
        )}
        aria-hidden={!open}
      >
        {info}
      </div>

      {right}
    </div>
  );
}
