"use client";

import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlobeIcon, LockIcon, ShuffleIcon } from "lucide-react";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { IconButton } from "@/components/ui/icon-button";
import { AppImage } from "@/components/shared/app-image";
import { NavLink } from "@/components/ui/nav-link";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import Dot from "@/components/ui/dot";
import { UserImage } from "@/components/shared/user-image";
import { PlaylistDetailDropdown } from "@/components/features/playlist-detail-dropdown";
import { ToggleLikePlaylistButton } from "@/components/features/toggle-like-playlist-button";

export const BannerSection = ({ playlistId }: { playlistId: string }) => {
  const { data: playlist, status } = useQuery({
    ...playlistQueryOptions.banner(playlistId),
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
          alt={playlist.title}
          src={
            playlist.imageId ?? process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
          }
          containerClassName="size-72 sm:size-42 md:size-48 lg:size-52 xl:size-56 max-sm:place-self-center"
          sizes="(max-width: 768px) 50vw, 224px"
          onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
          priority
        />
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 max-sm:mt-6">
          {playlist.isPublic ? (
            <div className="max-sm:hidden flex items-center gap-2">
              <GlobeIcon className="size-5" />{" "}
              <span className="font-medium flex items-center">
                Public Playlist
              </span>
            </div>
          ) : (
            <div className="max-sm:hidden flex items-center gap-2">
              <LockIcon className="size-5" />{" "}
              <span className="font-medium flex items-center">
                Private Playlist
              </span>
            </div>
          )}
          <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            {playlist.title}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
            <div className="flex sm:inline-flex items-center gap-2">
              {playlist.user ? (
                <>
                  <UserImage
                    imageUrl={playlist.user.image}
                    name={playlist.user.name}
                  />
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
            </div>
            <div className="flex items-center gap-2">
              {playlist.isPublic ? (
                <div className="flex sm:hidden items-center gap-2">
                  <GlobeIcon className="size-5" />{" "}
                  <span className="font-medium flex items-center">
                    Public Playlist
                  </span>
                </div>
              ) : (
                <div className="flex sm:hidden items-center gap-2">
                  <LockIcon className="size-5" />{" "}
                  <span className="font-medium flex items-center">
                    Private Playlist
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Dot />
                <span>
                  {`${playlist.totalTracks} ${pluralize(
                    "tracks",
                    playlist.totalTracks
                  )}, ${prettyMilliseconds(playlist.duration * 1000)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start max-sm:flex-row-reverse sm:gap-6">
        <div className="flex items-center gap-6 max-sm:flex-row-reverse">
          <RoundedPlayButton
            context={{
              contextType: "PLAYLIST",
              contextId: playlistId,
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
        </div>
        <div className="flex items-center gap-6">
          <ToggleLikePlaylistButton
            playlist={{
              id: playlist.id,
              title: playlist.title,
              imageId: playlist.imageId,
              user: playlist.user,
            }}
          />
          <PlaylistDetailDropdown
            playlistId={playlistId}
            title={playlist.title}
          />
        </div>
      </div>
    </section>
  );
};
