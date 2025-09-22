"use client";

import { cn } from "@/lib/utils";
import { Clock3Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { formatDuration } from "@/lib/helpers/format-duration";
import { TrackListItem } from "@/features/track/contracts/track-dto";
import TrackItem from "./track-item";
import { format } from "date-fns";
import { NavLink } from "../ui/nav-link";
import { TrackDropdown } from "./track-dropdown";
import TrackIndexCell from "../shared/track-index-cell";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

type TrackListProps = {
  contextId: string;
  type: "ALBUM" | "PLAYLIST" | "ARTIST";
  tracks: TrackListItem[];
};

export const TrackList = ({ contextId, type, tracks }: TrackListProps) => {
  const { isPlaying, session } = usePlaybackStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying(),
      session: s.session,
    }))
  );

  const gridCols: Record<TrackListProps["type"], string> = {
    PLAYLIST: "grid-cols-[3rem_1fr_9rem_9rem_6rem_4rem_3rem]",
    ALBUM: "grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]",
    ARTIST: "grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]",
  };

  const gridClass = cn("grid w-full items-center", gridCols[type]);

  return (
    <div className="space-y-1 w-full">
      <div
        className={cn(
          gridClass,
          "text-muted-foreground font-medium pb-2 mb-4 border-b border-border pr-6"
        )}
      >
        <div className="text-center">#</div>
        <div className="text-left">Title</div>
        {type === "PLAYLIST" && <div className="text-left">Album</div>}
        <div className="text-right">
          {type === "PLAYLIST" ? "Date added" : "Plays"}
        </div>
        <div className="text-right"></div>
        <div className="flex justify-end">
          <Clock3Icon size={16} />
        </div>
        <div className=""></div>
      </div>

      {tracks.length > 0 ? (
        tracks.map((track, trackIndex) => {
          const isThisTrack =
            session?.snapshot.contextType === type &&
            session?.snapshot.contextId === contextId &&
            session.currentTrackId === track.id;

          return (
            <div
              key={track.id}
              className={cn(
                gridClass,
                "py-2 pr-6 group hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex justify-center items-center text-base font-semibold group">
                <TrackIndexCell
                  isPlaying={isPlaying}
                  isThisTrack={isThisTrack}
                  index={trackIndex}
                  context={{ type, contextId }}
                />
              </div>

              <TrackItem
                track={track}
                hasCover={type !== "ALBUM"}
                canHover={false}
                isActive={isThisTrack}
              />

              {type === "PLAYLIST" && (
                <div>
                  <NavLink
                    href={`/albums/${track.album.id}`}
                    className="text-left"
                  >
                    {track.album.title}
                  </NavLink>
                </div>
              )}

              <div className="text-right">
                {type === "PLAYLIST" && track.addedAt
                  ? format(new Date(track.addedAt), "PP")
                  : track.playCount?.toLocaleString() ?? "—"}
              </div>

              <div className="invisible group-hover:visible flex items-center justify-end">
                <IconButton
                  icon={PlusCircleIcon}
                  className="text-current"
                  size="sm"
                  tooltipContent={
                    <>
                      Add to <strong>Liked Tracks</strong>
                    </>
                  }
                />
              </div>

              <div className="text-right">{formatDuration(track.duration)}</div>

              <div className="invisible group-hover:visible flex items-center justify-end">
                <TrackDropdown
                  track={track}
                  playlistId={type === "PLAYLIST" ? contextId : undefined}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center py-2">No tracks found.</p>
      )}
    </div>
  );
};
