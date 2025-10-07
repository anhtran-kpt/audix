"use client";

import { BadgeCheckIcon, EllipsisIcon, ShuffleIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import tinycolor from "tinycolor2";
import { IconButton } from "@/components/ui/icon-button";
import { FollowButton } from "@/components/features/follow-button";
import { FollowersBadge } from "@/components/features/follow-badge";
import { AppImage } from "@/components/shared/app-image";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { useQuery } from "@tanstack/react-query";
import { artistQueries } from "@/features/artist/api/artist-options";

export const BannerSection = ({ artistId }: { artistId: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);
  const { data: artist, status } = useQuery({
    ...artistQueries.banner(artistId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

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
          <AppImage
            priority
            alt={artist.name}
            src={artist.imageId}
            containerClassName="size-56"
            className="rounded-full"
            sizes="(max-width: 768px) 50vw, 224px"
            onLoad={(e) => {
              setImageUrl((e.target as HTMLImageElement).src);
            }}
          />
          <div className="flex flex-col gap-3">
            {artist.isVerified && (
              <div className="flex gap-2 items-center">
                <BadgeCheckIcon className="stroke-white fill-sky-500 size-8" />
                Verified Artist
              </div>
            )}
            <p className="font-extrabold text-6xl mt-1 mb-3">{artist.name}</p>
            <FollowersBadge artistId={artistId} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 px-12">
        <RoundedPlayButton
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
              Enable shuffle for <strong>{artist.name}</strong>
            </>
          }
        />
        <FollowButton artistId={artistId} />
        <IconButton
          icon={EllipsisIcon}
          size="xl"
          tooltipContent={
            <>
              More options for <strong>{artist.name}</strong>
            </>
          }
        />
      </div>
    </section>
  );
};
