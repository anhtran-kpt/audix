"use client";

import { BadgeCheckIcon, EllipsisIcon, ShuffleIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { ArtistImage } from "@/components/ui/artist-image";
import { Badge } from "@/components/ui/badge";
import tinycolor from "tinycolor2";
import { IconButton } from "@/components/ui/icon-button";
import { FollowButton } from "@/components/features/follow-button";
import { ContextPlayButton } from "@/components/features/context-play-button";
import { TrackRef } from "@/stores/use-audio-store";
import { FollowersBadge } from "@/components/features/follow-badge";
import { FullArtist } from "@/contracts/artist";
import { zCuidType } from "@/contracts/common";

type BannerSectionProps = Pick<
  FullArtist,
  "name" | "imageId" | "genres" | "isVerified"
> & { trackRefs: TrackRef[] } & { artistId: zCuidType };

export const BannerSection = ({
  imageId,
  isVerified,
  name,
  genres,
  trackRefs,
  artistId,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  return (
    <section
      className="relative -mx-12 -mt-30 space-y-8"
      style={{
        backgroundImage: `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${toT} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 30rem",
      }}
    >
      <div className="relative h-[calc(108rem/4)]">
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          <ArtistImage
            alt={name}
            src={imageId}
            size="xl"
            onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
            priority
          />
          <div className="flex flex-col gap-3">
            {isVerified && (
              <div className="flex gap-2 items-center">
                <BadgeCheckIcon className="stroke-white fill-sky-500 size-8" />
                Verified Artist
              </div>
            )}
            <p className="font-extrabold text-6xl mt-1 mb-3">{name}</p>
            <FollowersBadge artistId={artistId} />
            <div className="space-x-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.name}
                  style={{ backgroundColor: genre.color }}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 px-12">
        <ContextPlayButton
          trackRefs={trackRefs}
          context={{ contextId: artistId, type: "ARTIST", name }}
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
