"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface AppImageProps extends CldImageProps {
  containerClassName?: string;
}

export function AppImage({
  className,
  containerClassName,
  onLoad,
  ...props
}: AppImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad: NonNullable<CldImageProps["onLoad"]> = (e) => {
    onLoad?.(e);
    setIsLoaded(true);
  };

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-sm shrink-0",
        containerClassName
      )}
    >
      {!isLoaded && <Skeleton className="absolute inset-0" />}

      <CldImage
        fill
        className={cn(
          "object-cover rounded-sm transition-opacity duration-400",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        quality="auto"
        format="auto"
        onLoad={handleLoad}
        sizes="240px"
        {...props}
      />
    </div>
  );
}
