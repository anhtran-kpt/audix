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
      disabled,
      ...buttonProps
    },
    ref
  ) => {
    const iconSize = iconSizeMap[size];

    const btnClasses = cn(
      "rounded-full text-muted-foreground transition-transform",
      className,
      disabled
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "hover:text-foreground hover:scale-105 cursor-pointer"
    );

    const btn = (
      <button
        {...buttonProps}
        ref={ref}
        type={buttonProps.type ?? "button"}
        disabled={disabled}
        className={btnClasses}
      >
        <Icon className={cn(iconSize, iconClassName)} />
        <span className="sr-only">{description}</span>
      </button>
    );

    if (!tooltipContent || disabled) {
      return btn;
    }

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
