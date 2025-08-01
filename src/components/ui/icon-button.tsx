"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";
import { IconSize, iconSizeMap } from "@/lib/constants/size-maps";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  iconClassName?: string;
  size?: IconSize;
  tooltipContent?: ReactNode;
  description?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      size = "md",
      tooltipContent,
      className,
      iconClassName,
      description,
      ...buttonProps
    },
    ref
  ) => {
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
        <Icon className={cn(iconSize, iconClassName)} />
        <span className="sr-only">{description}</span>
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
