"use client";

import { RoundedPlayContextButton } from "@/components/features/play/rounded-play-context-button";
import { columns } from "@/components/features/tracks-table/album/columns";
import { DataTable } from "@/components/features/tracks-table/album/data-table";
import { AppImage } from "@/components/shared/app-image";
import { ToggleLikeAlbumButton } from "@/components/shared/toggle-like-album-button";
import { Button } from "@/components/ui/button";
import Dot from "@/components/ui/dot";
import { NavLink } from "@/components/ui/nav-link";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { AlbumOverview } from "@/lib/data/album-data";
import { formatDate } from "date-fns/format";
import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import pluralize from "pluralize";
import prettyMilliseconds from "pretty-ms";
import { useState } from "react";

type OverviewSectionProps = {
  album: AlbumOverview;
};
export const OverviewSection = ({ album }: OverviewSectionProps) => {
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
          alt={album.title}
          src={album.imageId}
          containerClassName="size-72 sm:size-42 md:size-48 lg:size-52 xl:size-56 max-sm:place-self-center"
          sizes="(max-width: 768px) 50vw, 224px"
          onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
          priority
        />
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 max-sm:mt-6">
          <span className="max-sm:hidden">{albumTypeMap[album.albumType]}</span>
          <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            {album.title}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
            <div className="flex sm:inline-flex items-center gap-2">
              <AppImage
                alt={album.artist.name}
                src={album.artist.imageId}
                containerClassName="size-7 rounded-full"
                className="rounded-full"
                sizes="28px"
                priority
              />
              <NavLink
                href={`/artists/${album.artist.id}`}
                className="font-medium"
              >
                {album.artist.name}
              </NavLink>
            </div>
            <div className="flex items-center gap-2">
              <span className="sm:hidden">{albumTypeMap[album.albumType]}</span>
              <Dot />
              {album.releaseDate && (
                <span className="">{formatDate(album.releaseDate, "PP")}</span>
              )}
              <div className="flex items-center gap-2">
                {album.totalTracks > 0 && (
                  <>
                    <Dot />
                    <span>
                      {`${album.totalTracks} ${pluralize(
                        "songs",
                        album.totalTracks
                      )}, ${prettyMilliseconds(album.duration * 1000)}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start max-sm:flex-row-reverse sm:gap-6">
        <div className="flex items-center gap-6 max-sm:flex-row-reverse">
          <RoundedPlayContextButton
            context={{
              contextType: "ALBUM",
              contextId: album.id,
            }}
          />
          <Button size="icon" variant="ghost">
            <ShuffleIcon className="size-7" />
          </Button>
        </div>
        <div className="flex items-center gap-6">
          <ToggleLikeAlbumButton album={{ ...album, id: album.id }} />
          <Button size="icon" variant="ghost">
            <EllipsisIcon className="size-7" />
          </Button>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={album.tracks}
          contextId={album.id}
          contextType="ALBUM"
        />
      </div>
    </section>
  );
};
