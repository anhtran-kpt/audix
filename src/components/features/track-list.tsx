"use client";

import { cn } from "@/lib/utils";
import { Clock3Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { format } from "date-fns";
import { NavLink } from "../ui/nav-link";
import TrackIndexCell from "../shared/track-index-cell";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";
import { formatDuration } from "@/utils/date";
import { TrackDetails } from "./track-dropdown-details";
import { TrackItemCompact } from "../shared/track-item-compact";

type TrackListProps = {
  contextId: string;
  contextType: "ALBUM" | "PLAYLIST" | "ARTIST";
  tracks: TrackItem[];
};

export const TrackList = ({
  contextId,
  contextType,
  tracks,
}: TrackListProps) => {
  const { isPlaying, snapshot, currentTrackId } = usePlaybackStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      currentTrackId: s.session?.currentTrackId,
      snapshot: s.session?.snapshot,
    }))
  );

  const gridCols: Record<TrackListProps["contextType"], string> = {
    PLAYLIST: "grid-cols-[3rem_1fr_9rem_12rem_6rem_4rem_3rem]",
    ALBUM:
      "grid-cols-[3rem_1fr_6rem_4rem_3rem] md:grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]",
    ARTIST:
      "grid-cols-[3rem_1fr_6rem_4rem_3rem] md:grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]",
  };

  const gridClass = cn("grid w-full items-center", gridCols[contextType]);

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
        {contextType === "PLAYLIST" && <div className="text-right">Album</div>}
        <div className="text-right hidden md:block">
          {contextType === "PLAYLIST" ? "Date added" : "Plays"}
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
            snapshot?.contextType === contextType &&
            snapshot?.contextId === contextId &&
            currentTrackId === track.id;

          return (
            <div
              key={track.id}
              className={cn(
                gridClass,
                "py-2 pr-6 group hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground",
                isThisTrack && "bg-muted text-foreground"
              )}
            >
              <div className="flex justify-center items-center text-base font-semibold group">
                <TrackIndexCell
                  isPlaying={isPlaying}
                  isThisTrack={isThisTrack}
                  index={trackIndex}
                  context={{
                    contextType,
                    contextId,
                    startTrackId: track.id,
                  }}
                />
              </div>

              <TrackItemCompact
                track={track}
                canHover={false}
                hasCover={contextType !== "ALBUM"}
                hasMoreDetails={false}
                context={{
                  contextId,
                  contextType,
                }}
                canPlay={false}
              />

              {contextType === "PLAYLIST" && (
                <div className="text-right">
                  <NavLink href={`/albums/${track.album.id}`}>
                    {track.album.title}
                  </NavLink>
                </div>
              )}

              <div className="text-right hidden md:block">
                {contextType === "PLAYLIST" && track.addedAt
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
                <TrackDetails
                  track={track}
                  playlistId={
                    contextType === "PLAYLIST" ? contextId : undefined
                  }
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
