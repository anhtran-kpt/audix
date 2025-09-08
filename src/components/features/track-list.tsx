"use client";

import { cn } from "@/lib/utils";
import { Clock3Icon, EllipsisIcon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { formatDuration } from "@/lib/helpers/format-duration";
import WaveForm from "../ui/wave-form";
import {
  useIsPlaying,
  useNowPlayingRefId,
  usePlaybackContext,
} from "@/hooks/use-audio-player";
import { RowPlayButton } from "./row-play-button";
import { TrackListItem } from "@/features/track/contracts/track-dto";
import TrackItem from "./track-item";
import { format } from "date-fns";
import { NavLink } from "../ui/nav-link";

type TrackListProps = {
  contextId: string;
  type: "ALBUM" | "PLAYLIST" | "ARTIST";
  tracks: TrackListItem[];
};

export const TrackList = ({ contextId, type, tracks }: TrackListProps) => {
  const nowPlayingRefId = useNowPlayingRefId();
  const isPlaying = useIsPlaying();
  const playbackContext = usePlaybackContext();
  const gridClass =
    type === "PLAYLIST"
      ? "grid-cols-[3rem_1fr_9rem_9rem_6rem_4rem_3rem] grid w-full items-center"
      : "grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem] grid w-full items-center";

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

      {tracks && tracks.length > 0 ? (
        tracks.map((track, trackIndex) => {
          const isThisTrack =
            playbackContext?.type === type &&
            playbackContext?.contextId === contextId &&
            nowPlayingRefId === track.id;

          return (
            <div
              key={track.id}
              className={cn(
                gridClass,
                "py-2 pr-6 group hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex justify-center items-center text-base font-semibold group">
                {isPlaying && isThisTrack ? (
                  <>
                    <div className="group-hover:hidden">
                      <WaveForm />
                    </div>

                    <div className="hidden group-hover:block">
                      <RowPlayButton
                        context={{
                          contextId,
                          type,
                        }}
                        trackId={track.id}
                        buttonType="outside"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className={`group-hover:hidden ${
                        isThisTrack ? "text-primary" : ""
                      }`}
                    >
                      {trackIndex + 1}
                    </span>
                    <RowPlayButton
                      context={{
                        contextId,
                        type,
                      }}
                      trackId={track.id}
                      buttonType="outside"
                    />
                  </>
                )}
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
                {type === "PLAYLIST"
                  ? format(track.addedAt, "PP")
                  : track.playCount.toLocaleString()}
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
                <IconButton
                  icon={EllipsisIcon}
                  className="text-current"
                  tooltipContent={
                    <>
                      More options for <strong>{track.title}</strong>
                    </>
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
