import { cn } from "@/lib/utils";
import { AppImage } from "./app-image";
import { TrackItemCompact as TrackItemCompactType } from "@/features/track/contracts/track-dto";
import { TrackItemInfo } from "./track-item-info";
import { TrackDetails } from "../features/track-details";
import { RowPlayButton } from "./row-play-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";

type TrackItemCompactProps = {
  hasMoreDetails?: boolean;
  hasCover?: boolean;
  canHover?: boolean;
  track: TrackItemCompactType;
  context?: StartPlaybackInput;
};

export const TrackItemCompact = ({
  hasMoreDetails = true,
  canHover = true,
  track,
  hasCover = true,
  context,
}: TrackItemCompactProps) => {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-3 min-w-0 w-full",
        canHover && "p-2 group hover:bg-muted rounded-md"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {hasCover && (
            <AppImage
              src={track.album.imageId}
              alt={track.title}
              containerClassName="size-12"
              sizes="48px"
              className={cn(
                context && "group-hover:brightness-65 transition-[brightness]"
              )}
            />
          )}
          {context && (
            <RowPlayButton
              context={context}
              className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
            />
          )}
        </div>
        <TrackItemInfo
          title={track.title}
          isExplicit={track.isExplicit}
          isActive={false}
          artists={track.artists}
        />
      </div>
      {hasMoreDetails && (
        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity">
          <TrackDetails track={track} />
        </div>
      )}
    </div>
  );
};
