import { GridWrapper } from "../ui/grid-wrapper";
import LargeMediaCover from "./large-media-cover";
import { NavLink } from "../ui/nav-link";
import Dot from "../ui/dot";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { FallbackCoverImage } from "../features/fallback-cover-image";

type PlaylistListProps = {
  playlists: PlaylistItem[];
};

export default function PlaylistList({ playlists }: PlaylistListProps) {
  return (
    <GridWrapper>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="flex flex-col group gap-2 overflow-hidden"
        >
          {playlist.imageId ? (
            <LargeMediaCover
              alt={playlist.title}
              src={playlist.imageId}
              context={{
                type: "PLAYLIST",
                contextId: playlist.id,
              }}
            />
          ) : (
            <FallbackCoverImage type="detail" />
          )}
          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink
              href={`/playlists/${playlist.id}`}
              className="text-15 truncate w-full"
            >
              {playlist.title}
            </NavLink>
            <div className="flex text-13 text-muted-foreground items-center gap-1.5 mt-0.5">
              <span>Playlist</span>
              {playlist.user && (
                <>
                  <Dot />
                  <span>By</span>
                  <NavLink href={`users/${playlist.user.id}`}>
                    {playlist.user.name}
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
}
