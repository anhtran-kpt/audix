"use client";

import { AppImage } from "@/components/shared/app-image";
import { PlaylistItem as PlaylistItemType } from "@/features/playlist/contracts/playlist-dto";
import { useRouter } from "next/navigation";
import { RoundedPlayContextButton } from "../play/rounded-play-context-button";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";

export const PlaylistItem = ({ playlist }: { playlist: PlaylistItemType }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col group gap-2 overflow-hidden">
      <div
        className="relative cursor-pointer"
        onClick={() => router.push(`/playlists/${playlist.id}`)}
      >
        <AppImage
          alt={playlist.title}
          src={
            playlist.imageId ?? process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
          }
          className="group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
        />
        <RoundedPlayContextButton
          context={{ contextType: "PLAYLIST", contextId: playlist.id }}
          className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
        />
      </div>

      <div className="flex flex-col items-start w-full min-w-0">
        <NavLink
          href={`/playlists/${playlist.id}`}
          className="text-[calc(15rem/16)] truncate block w-full"
        >
          {playlist.title}
        </NavLink>
        <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
          <span>Playlist</span>
          {playlist.user && (
            <>
              <Dot />
              <div className="space-x-1">
                <span>By</span>
                <NavLink href={`/users/${playlist.user.id}`}>
                  {playlist.user.name}
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
