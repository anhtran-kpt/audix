"use client";

import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import { FollowersBadge } from "@/components/features/follow-badge";
import { IconButton } from "@/components/ui/icon-button";
import { AppImage } from "@/components/shared/app-image";
import { FollowButton } from "@/components/features/follow-button";
import { RoundedPlayContextButton } from "@/components/features/play/rounded-play-context-button";
import { VerifiedIcon } from "@/components/ui/verified-icon";

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
    <section
      className="transition-colors -mx-responsive -mt-[calc(var(--spacing-responsive)+var(--header-height))] px-responsive flex flex-col gap-6 xl:gap-8"
      style={{
        background: gradient
          ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.via} 60%, ${gradient.to} 100%)`
          : undefined,
      }}
    >
      <div className="mt-[calc(var(--spacing-responsive)+var(--header-height))] flex flex-col sm:flex-row justify-start sm:items-end sm:gap-5 xl:gap-6">
        <AppImage
          alt={artist.name}
          src={artist.imageId}
          containerClassName="size-72 sm:size-42 md:size-48 lg:size-52 xl:size-56 max-sm:place-self-center rounded-full border border-white"
          className="rounded-full"
          sizes="(max-width: 768px) 50vw, 224px"
          onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
          priority
        />
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 max-sm:mt-6">
          <div className="max-sm:hidden flex items-center gap-2">
            <VerifiedIcon />
            <span>Verified Artist</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <VerifiedIcon />
            </div>
            <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              {artist.name}
            </span>
          </div>
          <FollowersBadge artistId={artistId} />
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start max-sm:flex-row-reverse sm:gap-6">
        <div className="flex items-center gap-6 max-sm:flex-row-reverse">
          <RoundedPlayContextButton
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
          <FollowButton
            artist={{
              name: artist.name,
              imageId: artist.imageId,
              id: artistId,
            }}
          />
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
