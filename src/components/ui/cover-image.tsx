"use-client";

import { CoverImageSize, coverImageSizeMap } from "@/lib/constants/size-maps";
import { cn } from "@/lib/utils";
import { CldImage, CldImageProps } from "next-cloudinary";
import { FC } from "react";
import { IconButton } from "./icon-button";
import { PlayIcon } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Track } from "@/app/generated/prisma";

interface CoverImageProps extends CldImageProps {
  size?: CoverImageSize;
  track?: Track;
}

export const CoverImage: FC<CoverImageProps> = ({
  size = "md",
  track,
  className,
  ...props
}) => {
  const sizeClasses = coverImageSizeMap[size];
  // const { playTrack } = useAudioPlayer();

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
      {track && (
        <IconButton
          icon={PlayIcon}
          size="sm"
          // onClick={() => playTrack(track)}
          iconClassName="fill-foreground stroke-0"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
        />
      )}
    </div>
  );
};
