"use client";

import {
  DownloadIcon,
  EllipsisIcon,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  ShuffleIcon,
} from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CoverImage } from "@/components/ui/cover-image";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { ArtistImage } from "@/components/ui/artist-image";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import { formatDate } from "date-fns/format";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { IconButton } from "@/components/ui/icon-button";
import tinycolor from "tinycolor2";
import { FullAlbum } from "@/features/album/contracts/album-dto";
import { Button } from "@/components/ui/button";
import { usePlayTrackButton } from "@/hooks/use-play-track-button";

type BannerSectionProps = Pick<
  FullAlbum,
  | "releaseDate"
  | "imageId"
  | "albumType"
  | "artist"
  | "title"
  | "totalTracks"
  | "duration"
  | "genres"
>;

export const BannerSection = ({
  imageId,
  releaseDate,
  albumType,
  artist,
  title,
  totalTracks,
  duration,
  genres,
}: BannerSectionProps) => {
  const { handlePlay, isPlaying } = usePlayTrackButton();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

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
          <CoverImage
            alt={title}
            src={imageId}
            size="xl"
            onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
            priority
          />
          <div className="flex flex-col gap-3">
            <p className="font-medium">{albumTypeMap[albumType]}</p>
            <p className="font-bold text-6xl mt-1 mb-3">{title}</p>
            <div className="space-x-2">
              {genres.map(({ genre }) => (
                <Badge key={genre.id} style={{ backgroundColor: genre.color }}>
                  {genre.name}
                </Badge>
              ))}
            </div>
            <div className="inline-flex items-center gap-2">
              <ArtistImage alt={artist.name} src={artist.imageId} size="xs" />
              <NavLink href={`/artists/${artist.id}`} className="text-sm">
                {artist.name}
              </NavLink>
              <Dot />
              {releaseDate && (
                <span className="">{formatDate(releaseDate, "PP")}</span>
              )}
              <div className="flex items-center gap-2">
                {totalTracks > 0 && (
                  <>
                    <Dot />
                    <span>
                      {`${totalTracks} ${pluralize(
                        "tracks",
                        totalTracks
                      )}, ${prettyMilliseconds(duration * 1000)}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 px-12">
        <Button
          onClick={() => handlePlay(context)}
          className="absolute bottom-2 right-2 opacity-0 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <IconButton
          icon={ShuffleIcon}
          size="xl"
          tooltipContent={
            <>
              Enable shuffle for <strong>{title}</strong>
            </>
          }
        />
        <IconButton
          icon={PlusCircleIcon}
          size="xl"
          tooltipContent={
            <>
              Save to <strong>Your Library</strong>
            </>
          }
        />
        <IconButton icon={DownloadIcon} size="xl" tooltipContent="Download" />
        <IconButton
          icon={EllipsisIcon}
          size="xl"
          tooltipContent={
            <>
              More options for <strong>{title}</strong>
            </>
          }
        />
      </div>
    </section>
  );
};
