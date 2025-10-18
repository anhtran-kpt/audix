import { cn } from "@/lib/utils";
import { AppImage } from "./app-image";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { TrackItemInfo } from "./track-item-info";
import { RowPlayButton } from "./row-play-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { TrackDropdownDetails } from "../features/track-dropdown-details";

type TrackItemCompactProps = {
  track: TrackItem;
  hasMoreDetails?: boolean;
  hasCover?: boolean;
  canHover?: boolean;
  canPlay?: boolean;
  context?: StartPlaybackInput;
};

export const TrackItemCompact = ({
  track,
  context,
  hasMoreDetails = true,
  canHover = true,
  hasCover = true,
  canPlay = true,
}: TrackItemCompactProps) => {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-4 min-w-0 w-full",
        canHover && "p-2 group hover:bg-muted rounded-md"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {hasCover && (
          <div className="relative">
            <AppImage
              src={track.album.imageId}
              alt={track.title}
              containerClassName="size-12"
              sizes="48px"
              className={cn(
                canPlay &&
                  canHover &&
                  "group-hover:brightness-65 transition-[brightness]"
              )}
            />
            {context && canPlay && (
              <RowPlayButton
                context={context}
                className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
              />
            )}
          </div>
        )}
        <TrackItemInfo
          title={track.title}
          isExplicit={track.isExplicit}
          artists={track.artists}
          context={context}
        />
      </div>
      {hasMoreDetails && (
        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity">
          <TrackDropdownDetails
            track={track}
            contextType="ALBUM"
            contextId={track.album.id}
          />
        </div>
      )}
    </div>
  );
};
