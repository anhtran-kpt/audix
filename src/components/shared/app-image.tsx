"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
      <CldImage
        fill
        className={cn(
          "object-cover rounded-sm duration-400 transition-opacity",
          className
        )}
        quality="auto"
        format="auto"
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={handleLoad}
        sizes="256px"
        {...props}
      />
    </div>
  );
}
