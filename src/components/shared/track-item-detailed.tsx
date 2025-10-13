import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import TrackIndexCell from "./track-index-cell";
import { TrackItemCompact } from "./track-item-compact";
import { cn } from "@/lib/utils";
import { TrackItemDetailed as TrackItemDetailedType } from "@/features/track/contracts/track-dto";
import { TrackDetails } from "../features/track-dropdown-details";
import { formatDuration } from "@/utils/date";
import { NavLink } from "../ui/nav-link";
import { format } from "date-fns";
import { IconButton } from "../ui/icon-button";
import { PlusCircleIcon } from "lucide-react";

type TrackItemDetailedProps = {
  context: StartPlaybackInput;
  track: TrackItemDetailedType;
  index: number;
};

export const TrackItemDetailed = ({
  context,
  track,
  index,
}: TrackItemDetailedProps) => {
  return (
    <li
      className={cn(
        gridClass,
        "py-2 pr-6 group hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="flex justify-center items-center text-base font-semibold group">
        <TrackIndexCell
          isPlaying={isPlaying}
          isThisTrack={isThisTrack}
          index={index}
          context={context}
        />
      </div>

      <TrackItemCompact
        track={track}
        canHover={false}
        hasCover={context.contextType !== "ALBUM"}
      />

      {context.contextType === "PLAYLIST" && (
        <div>
          <NavLink href={`/albums/${track.album.id}`} className="text-left">
            {track.album.title}
          </NavLink>
        </div>
      )}

      <div className="text-right">
        {context.contextType === "PLAYLIST" && track.addedAt
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
            context.contextType === "PLAYLIST" ? context.contextId : undefined
          }
        />
      </div>
    </li>
  );
};
