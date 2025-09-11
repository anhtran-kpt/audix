"use-client";

import { CoverImageSize, coverImageSizeMap } from "@/lib/constants/size-maps";
import { cn } from "@/lib/utils";
import { CldImage, CldImageProps } from "next-cloudinary";
import { FC, useState } from "react";
import { IconButton } from "./icon-button";
import { PlayIcon } from "lucide-react";
import { Track } from "@/app/generated/prisma";

interface CoverImageProps extends CldImageProps {
  size?: CoverImageSize;
  track?: Track;
}

export const CoverImage: FC<CoverImageProps> = ({
  size = "md",
  track,
  className,
  onLoad,
  ...props
}) => {
  const sizeClasses = coverImageSizeMap[size];
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad: NonNullable<CldImageProps["onLoad"]> = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm aspect-square shrink-0",
        sizeClasses
      )}
    >
      <CldImage
        className={cn(
          "object-cover transition-opacity duration-500",
          sizeClasses,
          className
        )}
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={handleLoad}
        {...props}
      />
      {track && (
        <IconButton
          icon={PlayIcon}
          size="sm"
          iconClassName="fill-foreground stroke-0"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
        />
      )}
    </div>
  );
};
