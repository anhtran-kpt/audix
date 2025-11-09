"use client";

import { RoundedPlayContextButton } from "@/components/features/play/rounded-play-context-button";
import { ToggleFollowArtistButton } from "@/components/features/toggle-follow-artist-button";
import { AppImage } from "@/components/shared/app-image";
import { IconButton } from "@/components/ui/icon-button";
import SectionHeading from "@/components/ui/section-heading";
import { VerifiedIcon } from "@/components/ui/verified-icon";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { ArtistOverview } from "@/lib/data/artist-data";
import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/features/tracks-table/artist/data-table";
import { ArtistFollowersBadge } from "@/components/features/artist-follow-badge";

type OverviewSectionProps = {
  artist: ArtistOverview;
};
export const OverviewSection = ({ artist }: OverviewSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  return (
    <section
      className="transition-colors -mx-responsive -mt-[calc(var(--spacing-responsive)+var(--header-height))] px-responsive flex flex-col gap-6 xl:gap-8"
      style={{
        background: gradient
          ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.via} 8rem, ${gradient.to} 36rem)`
          : undefined,
      }}
    >
      <div className="mt-[calc(var(--spacing-responsive)+var(--header-height))] flex flex-col sm:flex-row justify-start sm:items-end sm:gap-5 xl:gap-6">
        <AppImage
          alt={artist.name}
          src={artist.imageId}
          containerClassName="size-72 sm:size-42 md:size-48 lg:size-52 xl:size-56 max-sm:place-self-center rounded-full"
          className="rounded-full"
          sizes="(max-width: 768px) 50vw, 224px"
          onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
          priority
        />
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 max-sm:mt-6">
          <div className=" flex items-center gap-2">
            <VerifiedIcon />
            <span>Verified Artist</span>
          </div>

          <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            {artist.name}
          </span>

          <ArtistFollowersBadge
            artistId={artist.id}
            initialData={artist.followersCount}
          />
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start max-sm:flex-row-reverse sm:gap-6">
        <div className="flex items-center gap-6 max-sm:flex-row-reverse">
          <RoundedPlayContextButton
            context={{
              contextType: "ARTIST",
              contextId: artist.id,
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
          <ToggleFollowArtistButton
            artist={{
              name: artist.name,
              imageId: artist.imageId,
              id: artist.id,
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
      <div>
        <SectionHeading title="Popular" />
        <DataTable
          data={artist.tracks}
          contextId={artist.id}
          contextType="ARTIST"
        />
      </div>
    </section>
  );
};
