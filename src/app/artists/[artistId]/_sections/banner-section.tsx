"use client";

import { BadgeCheckIcon, EllipsisIcon, ShuffleIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import tinycolor from "tinycolor2";
import { IconButton } from "@/components/ui/icon-button";
import { FollowButton } from "@/components/features/follow-button";
import { FollowersBadge } from "@/components/features/follow-badge";
import { CldImage } from "next-cloudinary";
import { ContextPlayButton } from "@/components/shared/context-play-button";
import { ArtistDetailPage } from "@/features/artist/data-access/artist-repo";

type BannerSectionProps = {
  imageId: ArtistDetailPage["artist"]["imageId"];
  isVerified: ArtistDetailPage["artist"]["isVerified"];
  name: ArtistDetailPage["artist"]["name"];
  artistId: string;
};

export const BannerSection = ({
  imageId,
  isVerified,
  name,
  artistId,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);
  const [isLoaded, setIsLoaded] = useState(false);

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  return (
    <section
      className="relative -mx-12 -mt-30 space-y-8 transition-colors"
      style={{
        backgroundImage: `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${toT} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 30rem",
      }}
    >
      <div className="relative h-[calc(108rem/4)]">
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          <div className="relative overflow-hidden rounded-full aspect-square shrink-0 size-56">
            <CldImage
              className="object-cover duration-400 transition-opacity"
              fill
              sizes="224px"
              priority
              alt={name}
              src={imageId}
              style={{ opacity: isLoaded ? 1 : 0 }}
              onLoad={(e) => {
                setImageUrl((e.target as HTMLImageElement).src);
                setIsLoaded(true);
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            {isVerified && (
              <div className="flex gap-2 items-center">
                <BadgeCheckIcon className="stroke-white fill-sky-500 size-8" />
                Verified Artist
              </div>
            )}
            <p className="font-extrabold text-6xl mt-1 mb-3">{name}</p>
            <FollowersBadge artistId={artistId} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 px-12">
        <ContextPlayButton
          context={{
            contextType: "ARTIST",
            contextId: artistId,
          }}
        />
        <IconButton
          icon={ShuffleIcon}
          size="xl"
          tooltipContent={
            <>
              Enable shuffle for <strong>{name}</strong>
            </>
          }
        />
        <FollowButton artistId={artistId} />
        <IconButton
          icon={EllipsisIcon}
          size="xl"
          tooltipContent={
            <>
              More options for <strong>{name}</strong>
            </>
          }
        />
      </div>
    </section>
  );
};
