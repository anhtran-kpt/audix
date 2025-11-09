"use client";

import WaveForm from "@/components/ui/wave-form";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { usePlayTrack } from "@/hooks/use-play-track";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon } from "lucide-react";

type TrackIndexCellProps = {
  context: StartPlaybackInput;
  trackId: string;
  index: number;
};

export const TrackIndexCell = ({
  context,
  index,
  trackId,
}: TrackIndexCellProps) => {
  const { handlePlay, isThisContext, isPlaying, isThisTrack } = usePlayTrack({
    context,
    trackId,
  });

  const isCurrentlyPlaying = isPlaying && isThisContext && isThisTrack;

  const iconClassName = "size-4 fill-foreground stroke-0";
  const hiddenOnHoverClass = "group-hover/table-row:hidden";
  const shownOnHoverClass = "hidden group-hover/table-row:flex";

  return (
    <div
      className={cn(
        "items-center justify-center font-semibold text-muted-foreground sm:group-hover/table-row:text-foreground text-base",
        context.contextType !== "ARTIST" ? "hidden sm:flex" : "flex"
      )}
    >
      <span
        className={cn(
          "flex",
          isCurrentlyPlaying ? "hidden" : hiddenOnHoverClass
        )}
      >
        {index + 1}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePlay();
        }}
        className={cn(
          "cursor-pointer hidden group-hover/table-row:block",
          isCurrentlyPlaying && "block"
        )}
      >
        {isCurrentlyPlaying ? (
          <>
            <div className={hiddenOnHoverClass}>
              <WaveForm />
            </div>
            <PauseIcon
              className={cn(
                "hidden group-hover/table-row:block",
                iconClassName
              )}
            />
          </>
        ) : (
          <PlayIcon className={cn(shownOnHoverClass, iconClassName)} />
        )}
      </button>
    </div>
  );
};
