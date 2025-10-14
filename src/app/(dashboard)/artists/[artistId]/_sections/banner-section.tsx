"use client";

import { useQuery } from "@tanstack/react-query";
import { AppImage } from "../../../../../components/shared/app-image";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { FollowersBadge } from "../../../../../components/features/follow-badge";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { IconButton } from "../../../../../components/ui/icon-button";
import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import { RoundedPlayButton } from "../../../../../components/shared/context-play-button/rounded-play-button";
import { FollowButton } from "../../../../../components/features/follow-button";

export const BannerSection = ({ artistId }: { artistId: string }) => {
  const { data: artist, status } = useQuery({
    ...artistQueryOptions.banner(artistId),
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 -mt-19 sm:-mt-21 md:-mt-23 lg:-mt-25 xl:-mt-27 flex flex-col">
      <div className="relative">
        <AppImage
          priority
          alt={artist.name}
          src={artist.bannerId}
          containerClassName="rounded-none w-full h-52 sm:h-60 md:h-68 lg:h-76 xl:h-84 2xl:h-92"
          className="rounded-none brightness-75 object-top object-cover"
          sizes="100vw"
          onLoad={(e) => {
            setImageUrl((e.target as HTMLImageElement).src);
          }}
        />
        <div className="absolute flex flex-col gap-2 md:gap-3 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-12 bottom-4 lg:bottom-6">
          <span className="font-extrabold text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl">
            {artist.name}
          </span>
          <FollowersBadge artistId={artistId} />
        </div>
      </div>
      <div
        style={{
          background: gradient
            ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.via} 30%, ${gradient.to} 100%)`
            : undefined,
        }}
        className="transition-colors flex items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 gap-6 justify-between sm:justify-start pt-6"
      >
        <div className="flex items-center gap-6">
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
        </div>
        <div className="flex items-center gap-6">
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
      </div>
    </section>
  );
};
