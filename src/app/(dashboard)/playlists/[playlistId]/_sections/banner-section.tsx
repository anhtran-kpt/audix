"use client";

import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { FallbackCoverImage } from "@/components/features/fallback-cover-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import {
  DownloadIcon,
  GlobeIcon,
  ListIcon,
  LockIcon,
  SearchIcon,
  ShuffleIcon,
  SortDescIcon,
  UserPlus2Icon,
} from "lucide-react";
import tinycolor from "tinycolor2";
import { useQuery } from "@tanstack/react-query";
import { PlaylistDetailDropdown } from "@/components/features/playlist-detail-dropdown";
import EditPlaylistDetails from "@/components/features/edit-playlist-details";
import { AppImage } from "@/components/shared/app-image";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";

export const BannerSection = ({ playlistId }: { playlistId: string }) => {
  const { data: playlist, status } = useQuery({
    ...playlistQueryOptions.banner(playlistId),
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

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
            <AppImage
              alt={playlist.title}
              src={playlist.imageId}
              onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
              priority
              containerClassName="size-56"
              sizes="(max-width: 768px) 50vw, 224px"
            />
          ) : (
            <FallbackCoverImage type="detail" />
          )}
          <div className="flex flex-col gap-3">
            {playlist.isPublic ? (
              <div className="flex items-center gap-2">
                <GlobeIcon className="size-5" />{" "}
                <span className="font-medium flex items-center">
                  Public Playlist
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LockIcon className="size-5" />{" "}
                <span className="font-medium flex items-center">
                  Private Playlist
                </span>
              </div>
            )}

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
              <RoundedPlayButton
                context={{
                  contextType: "PLAYLIST",
                  contextId: playlist.id,
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
          <EditPlaylistDetails playlistId={playlistId} />
          <PlaylistDetailDropdown
            playlistId={playlist.id}
            title={playlist.title}
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
