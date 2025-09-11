"use client";

import { useImageGradient } from "@/hooks/use-image-gradient";
import { useEffect, useState } from "react";
import { CoverImage } from "@/components/ui/cover-image";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { FallbackCoverImage } from "@/components/features/fallback-cover-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import {
  DownloadIcon,
  EditIcon,
  EllipsisIcon,
  ListIcon,
  SearchIcon,
  ShuffleIcon,
  SortDescIcon,
  UserPlus2Icon,
} from "lucide-react";
import tinycolor from "tinycolor2";
import { ContextPlayButton } from "@/components/features/context-play-button";
import { PlaylistDetail } from "@/features/playlist/contracts/playlist-dto";
import { useQuery } from "@tanstack/react-query";
import { playlistDetailOption } from "@/features/playlist/query/playlist-options";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import Image from "next/image";

type BannerSectionProps = {
  initialData: PlaylistDetail;
  playlistId: zCuidType;
};

export const BannerSection = ({
  initialData,
  playlistId,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);
  const [oldImageId, setOldImageId] = useState<string | null>(null);

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  const { data: playlist } = useQuery({
    ...playlistDetailOption(playlistId),
    select: (data) => ({
      id: data.id,
      imageId: data.imageId,
      title: data.title,
      isPublic: data.isPublic,
      description: data.description,
      user: data.user,
      totalTracks: data.totalTracks,
      duration: data.duration,
    }),
    initialData: initialData,
  });

  useEffect(() => {
    if (playlist?.imageId) {
      setOldImageId((prev) =>
        playlist.imageId !== prev ? prev ?? playlist.imageId : prev
      );
    }
  }, [playlist?.imageId]);

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
          {playlist.imageId ? (
            <CoverImage
              alt={playlist.title}
              src={playlist.imageId}
              size="xl"
              onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
              priority
            />
          ) : (
            <FallbackCoverImage type="detail" />
          )}
          {/* {playlist.imageId ? (
            playlist.imageId.startsWith("https") ? (
              <div className="relative overflow-hidden rounded-sm aspect-square shrink-0 size-56">
                {oldImageId && (
                  <CoverImage
                    alt={playlist.title}
                    src={oldImageId}
                    size="xl"
                    onLoad={(e) =>
                      setImageUrl((e.target as HTMLImageElement).src)
                    }
                    priority
                    preserveTransformations
                  />
                )}

                {playlist.imageId && (
                  <Image
                    src={playlist.imageId}
                    alt={playlist.title}
                    fill
                    className="object-cover absolute inset-0 transition-opacity duration-500"
                    onLoadingComplete={(img) => {
                      img.style.opacity = "1";
                    }}
                    style={{ opacity: 0 }}
                  />
                )}
              </div>
            ) : (
              <CoverImage
                alt={playlist.title}
                src={playlist.imageId}
                size="xl"
                onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
                priority
                preserveTransformations
              />
            )
          ) : (
            <FallbackCoverImage type="detail" />
          )} */}
          <div className="flex flex-col gap-3">
            <p className="font-medium">
              {playlist.isPublic ? "Public" : "Private"} Playlist
            </p>
            <p className="font-bold text-6xl mt-1 mb-3">{playlist.title}</p>
            {playlist.description && (
              <p className="text-sm text-muted-foreground">
                {playlist.description}
              </p>
            )}
            <div className="inline-flex items-center gap-2">
              {playlist.user ? (
                <>
                  <Avatar>
                    <AvatarImage src={playlist.user.image as string} />
                    <AvatarFallback>{playlist.user.name}</AvatarFallback>
                  </Avatar>
                  <NavLink
                    href={`/users/${playlist.user.id}`}
                    className="text-sm"
                  >
                    {playlist.user.name}
                  </NavLink>
                </>
              ) : (
                <>
                  <span>Audix</span>
                </>
              )}
              <div className="flex items-center gap-2">
                {playlist.totalTracks > 0 && (
                  <>
                    <Dot />
                    <span>
                      {`${playlist.totalTracks} ${pluralize(
                        "tracks",
                        playlist.totalTracks
                      )}, ${prettyMilliseconds(playlist.duration * 1000)}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-6 px-12">
        <div className="flex items-center gap-6">
          {playlist.totalTracks > 0 && (
            <>
              <ContextPlayButton
                context={{
                  type: "PLAYLIST",
                  contextId: playlist.id,
                  name: playlist.title,
                }}
              />
              <IconButton
                icon={ShuffleIcon}
                size="xl"
                tooltipContent={
                  <>
                    Enable shuffle for <strong>{playlist.title}</strong>
                  </>
                }
              />
              <IconButton
                icon={DownloadIcon}
                size="xl"
                tooltipContent={<>Download</>}
              />
            </>
          )}
          <IconButton
            icon={UserPlus2Icon}
            size="xl"
            tooltipContent={
              <>
                Invite collaborators to <strong>{playlist.title}</strong>
              </>
            }
          />
          <IconButton
            icon={EditIcon}
            size="xl"
            tooltipContent={<>Edit details</>}
          />
          <IconButton
            icon={EllipsisIcon}
            size="xl"
            tooltipContent={
              <>
                More options for <strong>{playlist.title}</strong>
              </>
            }
          />
        </div>
        <div className="flex items-center gap-6">
          <IconButton
            icon={SearchIcon}
            size="lg"
            tooltipContent={
              <>
                Search in <strong>{playlist.title}</strong>
              </>
            }
          />
          <IconButton
            icon={SortDescIcon}
            size="lg"
            tooltipContent={<>Sort by</>}
          />
          <IconButton icon={ListIcon} size="lg" tooltipContent={<>View as</>} />
        </div>
      </div>
    </section>
  );
};
