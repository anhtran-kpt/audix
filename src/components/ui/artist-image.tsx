"use-client";

import { ImageSize, imageSizeMap } from "@/lib/constants/size-maps";
import { cn } from "@/lib/utils";
import { CldImage, CldImageProps } from "next-cloudinary";
import { FC } from "react";

interface ArtistImageProps extends CldImageProps {
  size?: ImageSize;
}

export const ArtistImage: FC<ArtistImageProps> = ({
  size = "md",
  className,
  ...props
}) => {
  const sizeClasses = imageSizeMap[size];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full aspect-square border-2",
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
