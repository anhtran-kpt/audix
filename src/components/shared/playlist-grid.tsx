"use client";

import { GridWrapper } from "./grid-wrapper";
import { NavLink } from "../ui/nav-link";
import Dot from "../ui/dot";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { AppImage } from "./app-image";
import { useRouter } from "next/navigation";
import { RoundedPlayContextButton } from "../features/play/rounded-play-context-button";

type PlaylistGridProps = {
  playlists: PlaylistItem[];
};

export default function PlaylistGrid({ playlists }: PlaylistGridProps) {
  const router = useRouter();

  return (
    <GridWrapper>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="flex flex-col group gap-2 overflow-hidden"
        >
          <div
            className="relative cursor-pointer"
            onClick={() => router.push(`/playlists/${playlist.id}`)}
          >
            <AppImage
              alt={playlist.title}
              src={
                playlist.imageId ??
                process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
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
                    <NavLink href={`users/${playlist.user.id}`}>
                      {playlist.user.name}
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
}
