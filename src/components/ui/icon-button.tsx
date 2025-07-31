"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  iconClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tooltipContent?: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      size = "md",
      tooltipContent,
      className,
      iconClassName,
      ...buttonProps
    },
    ref
  ) => {
    const iconSizeMap = { sm: 16, md: 20, lg: 24, xl: 28 };
    const iconSize = iconSizeMap[size];

    const btn = (
      <button
        {...buttonProps}
        ref={ref}
        type={buttonProps.type ?? "button"}
        className={cn(
          "rounded-full text-muted-foreground hover:text-foreground hover:scale-105 transition-transform cursor-pointer",
          className
        )}
      >
        <Icon
          width={iconSize}
          height={iconSize}
          className={cn(iconClassName)}
        />
      </button>
    );

    if (!tooltipContent) return btn;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

IconButton.displayName = "IconButton";
