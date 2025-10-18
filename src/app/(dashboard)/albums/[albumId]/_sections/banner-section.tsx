"use client";

import { albumQueryOptions } from "@/features/album/api/album-query-options";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { IconButton } from "@/components/ui/icon-button";
import { AppImage } from "@/components/shared/app-image";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { NavLink } from "@/components/ui/nav-link";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { formatDate } from "date-fns/format";
import Dot from "@/components/ui/dot";
import { ToggleLikeAlbumButton } from "@/components/shared/toggle-like-album-button";

export const BannerSection = ({ albumId }: { albumId: string }) => {
  const { data: album, status } = useQuery({
    ...albumQueryOptions.banner(albumId),
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
                containerClassName="size-9 rounded-full"
                className="rounded-full"
                sizes="36px"
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
                        "tracks",
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
          <RoundedPlayButton
            context={{
              contextType: "ALBUM",
              contextId: albumId,
            }}
          />
          <IconButton
            icon={ShuffleIcon}
            size="xl"
            tooltipContent={
              <>
                Enable shuffle for <strong>{album.title}</strong>
              </>
            }
          />
        </div>
        <div className="flex items-center gap-6">
          <ToggleLikeAlbumButton album={{ ...album, id: albumId }} />
          <IconButton
            icon={EllipsisIcon}
            size="xl"
            tooltipContent={
              <>
                More options for <strong>{album.title}</strong>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
};
