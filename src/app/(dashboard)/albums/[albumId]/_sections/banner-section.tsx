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
import tinycolor from "tinycolor2";
import { AppImage } from "@/components/shared/app-image";
import { LikeButton } from "@/components/shared/like-button";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { useQuery } from "@tanstack/react-query";
import { albumQueryOptions } from "@/features/album/api/album-query-options";

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

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  return (
    <section
      className="relative text-white -mx-12 -mt-30 space-y-8"
      style={{
        backgroundImage: `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${toT} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 30rem",
      }}
    >
      <div className="relative h-[calc(108rem/4)]">
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          <AppImage
            alt={album.title}
            src={album.imageId}
            containerClassName="size-56"
            sizes="(max-width: 768px) 50vw, 224px"
            onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
            priority
          />
          <div className="flex flex-col gap-3">
            <p className="font-medium">{albumTypeMap[album.albumType]}</p>
            <p className="font-bold text-6xl mt-1 mb-3">{album.title}</p>
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
      </div>
      <div className="flex items-center gap-6 px-12">
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
