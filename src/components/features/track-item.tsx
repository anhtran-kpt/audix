import { ItemTitle } from "../ui/item-title";
import { CldImage } from "next-cloudinary";
import { ReactNode, useState } from "react";
import { TrackItem as TrackItemType } from "@/features/track/contracts/track-dto";
import { cn } from "@/lib/utils";
import { FallbackCoverImage } from "./fallback-cover-image";
import TrackArtists from "../shared/track-artists";

export type TrackItemProps = {
  track: TrackItemType;
  playButton?: ReactNode;
  hasCover?: boolean;
  canHover?: boolean;
  imageSize?: "small" | "large";
  isActive?: boolean;
};

export default function TrackItem({
  track,
  playButton,
  hasCover = true,
  imageSize = "small",
  isActive = false,
  canHover = true,
}: TrackItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "group flex items-center gap-3 flex-1 min-w-0",
        canHover && "p-2 group hover:bg-muted rounded-md"
      )}
    >
      {hasCover && (
        <div
          className={cn(
            "relative overflow-hidden rounded-sm aspect-square shrink-0",
            imageSize === "small" ? "size-12" : "size-14"
          )}
        >
          {track.album.imageId === "placeholder" ? (
            <FallbackCoverImage type="item" />
          ) : (
            <CldImage
              className={`object-cover ${
                playButton ? "group-hover:brightness-65" : ""
              }`}
              alt={track.title}
              src={track.album.imageId}
              style={{ opacity: isLoaded ? 1 : 0 }}
              onLoad={() => setIsLoaded(true)}
              fill
              sizes="48px"
            />
          )}
          {playButton}
        </div>
      )}
      <div className="flex flex-col gap-0.5 w-full overflow-hidden">
        <ItemTitle title={track.title} isActive={isActive} />
        <TrackArtists
          isExplicit={track.isExplicit}
          artists={track.artists.map((item) => item.artist)}
        />
      </div>
    </div>
  );
}
