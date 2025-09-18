"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function CoverImage({
  onLoad,
  className,
  ...props
}: CldImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad: NonNullable<CldImageProps["onLoad"]> = (e) => {
    onLoad?.(e);
    setIsLoaded(true);
  };

  return (
    <CldImage
      onLoad={handleLoad}
      className={cn("object-cover transition-opacity duration-400", className)}
      style={{ opacity: isLoaded ? 1 : 0 }}
      {...props}
    />
  );
}
