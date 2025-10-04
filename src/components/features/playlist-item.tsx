import { NavLink } from "../ui/nav-link";
import { cn } from "@/lib/utils";
import { PlaylistItem as PlaylistItemType } from "@/features/playlist/contracts/playlist-dto";
import { CoverImage } from "../ui/cover-image";
import { FallbackCoverImage } from "./fallback-cover-image";
import { ContextPlayButton } from "../shared/context-play-button";

export default function PlaylistItem({
  playlist,
}: {
  playlist: PlaylistItemType;
}) {
  return (
    <div className="flex flex-col group gap-2 overflow-hidden">
      <div className="relative rounded-md overflow-hidden size-full aspect-square">
        {playlist.imageId ? (
          <CoverImage alt={playlist.title} src={playlist.imageId} size="xl" />
        ) : (
          <FallbackCoverImage type="detail" />
        )}
        <ContextPlayButton
          context={{
            contextType: "ALBUM",
            contextId: playlist.id,
          }}
          className={cn(
            "absolute bottom-2 right-2",
            "opacity-0 translate-y-2 scale-95",
            "transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          )}
        />
      </div>
      <div className="flex flex-col items-start w-full min-w-0">
        <NavLink
          href={`/playlists/${playlist.id}`}
          className="text-[calc(15rem/16)] truncate w-full"
        >
          {playlist.title}
        </NavLink>
        {playlist.user && (
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            By {playlist.user.name}
          </div>
        )}
      </div>
    </div>
  );
}
