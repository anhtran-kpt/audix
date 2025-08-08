"use-client";

import { CoverImageSize, coverImageSizeMap } from "@/lib/constants/size-maps";
import { cn } from "@/lib/utils";
import { CldImage, CldImageProps } from "next-cloudinary";
import { FC } from "react";

interface CoverImageProps extends CldImageProps {
  size?: CoverImageSize;
}

export const CoverImage: FC<CoverImageProps> = ({
  size = "md",
  className,
  ...props
}) => {
  const sizeClasses = coverImageSizeMap[size];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm aspect-square shrink-0",
        sizeClasses
      )}
    >
      <CldImage
        className={cn("object-cover", sizeClasses, className)}
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        {...props}
      />
    </div>
  );
};
