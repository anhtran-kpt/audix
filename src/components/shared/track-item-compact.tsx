import { cn } from "@/lib/utils";
import { AppImage } from "./app-image";
import { TrackItemCompact as TrackItemCompactType } from "@/features/track/contracts/track-dto";
import { TrackItemInfo } from "./track-item-info";
import { TrackDetails } from "../features/track-details";

type TrackItemCompactProps = {
  hasMoreDetails?: boolean;
  hasCover?: boolean;
  canHover?: boolean;
  track: TrackItemCompactType;
};

export const TrackItemCompact = ({
  hasMoreDetails = true,
  canHover = true,
  track,
  hasCover = true,
}: TrackItemCompactProps) => {
  console.log(track);
  return (
    <li
      className={cn(
        "group flex items-center gap-3 flex-1 min-w-0",
        canHover && "p-2 group hover:bg-muted rounded-md"
      )}
    >
      <div className="flex items-center gap-3">
        {hasCover && <AppImage src={track.album.imageId} alt={track.title} />}
        <TrackItemInfo
          title={track.title}
          isExplicit={track.isExplicit}
          isActive={false}
          artists={track.artists}
        />
      </div>
      {hasMoreDetails && <TrackDetails track={track} />}
    </li>
  );
};
