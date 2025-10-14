"use client";

import { DownloadIcon, EllipsisIcon, ShuffleIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import { formatDate } from "date-fns/format";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { IconButton } from "@/components/ui/icon-button";
import { AppImage } from "@/components/shared/app-image";
import { LikeButton } from "@/components/shared/like-button";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { useQuery } from "@tanstack/react-query";
import { albumQueryOptions } from "@/features/album/api/album-query-options";
import { useIsMobile } from "@/hooks/use-mobile";

export const BannerSection = ({ albumId }: { albumId: string }) => {
  const { data: album, status } = useQuery({
    ...albumQueryOptions.banner(albumId),
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);
  const isMobile = useIsMobile();

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  if (isMobile) {
    return (
      <section
        className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 -mt-19 sm:-mt-21 md:-mt-23 lg:-mt-25 xl:-mt-27 flex flex-col gap-4 sm:gap-6 justify-end transition-colors"
        style={{
          background: gradient
            ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.via} 30%, ${gradient.to} 100%)`
            : undefined,
        }}
      >
        <div className="relative h-84 sm:h-92">
          <AppImage
            alt={album.title}
            src={album.imageId}
            containerClassName="absolute bottom-0 left-1/2 -translate-x-1/2 size-64 sm:size-72"
            sizes="(max-width: 768px) 50vw, 224px"
            onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
            priority
          />
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 px-4 sm:px-6 md:px-8">
          <span className="font-bold text-3xl sm:text-4xl">{album.title}</span>
          <div className="flex items-center gap-2">
            <AppImage
              alt={album.artist.name}
              src={album.artist.imageId}
              sizes="40px"
              containerClassName="size-5 sm:size-6 rounded-full"
            />
            <NavLink href={`/artists/${album.artist.id}`} className="text-sm">
              {album.artist.name}
            </NavLink>
          </div>
          <div className="inline-flex items-center gap-2">
            <span>{albumTypeMap[album.albumType]}</span>
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
        <div className="flex items-center gap-6 px-4 sm:px-6 pt-2">
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
          <LikeButton albumId={albumId} />
          <IconButton icon={DownloadIcon} size="xl" tooltipContent="Download" />
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
      </section>
    );
  }

  return (
    <section
      className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 -mt-19 sm:-mt-21 md:-mt-23 lg:-mt-25 xl:-mt-27 flex flex-col justify-end transition-colors"
      style={{
        background: gradient
          ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.via} 30%, ${gradient.to} 100%)`
          : undefined,
      }}
    >
      <div className="flex items-end gap-3 sm:gap-4 lg:gap-5 2xl:gap-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 h-52 sm:h-60 md:h-68 lg:h-76 xl:h-84 2xl:h-92">
        <AppImage
          alt={album.title}
          src={album.imageId}
          containerClassName="size-36 sm:size-42 md:size-48 lg:size-52 xl:size-56"
          sizes="(max-width: 768px) 50vw, 224px"
          onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
          priority
        />
        <div className="flex flex-col gap-1 sm:gap-2 lg:gap-3">
          <span>{albumTypeMap[album.albumType]}</span>
          <span className="font-extrabold text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl mt-1 mb-3">
            {album.title}
          </span>
          <div className="inline-flex items-center gap-2">
            <AppImage
              alt={album.artist.name}
              src={album.artist.imageId}
              sizes="48px"
              containerClassName="size-7 rounded-full"
            />
            <NavLink href={`/artists/${album.artist.id}`} className="text-sm">
              {album.artist.name}
            </NavLink>
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
      <div className="flex items-center gap-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 xl:pt-8">
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
        <LikeButton albumId={albumId} />
        <IconButton icon={DownloadIcon} size="xl" tooltipContent="Download" />
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
    </section>
  );
};
