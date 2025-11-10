"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { StartPlaybackInput } from "@/features/playback/playback-types";
import { cn } from "@/lib/utils";
import { usePlayTrack } from "@/features/playback/hooks/use-play-track";

type MiniPlayTrackButtonProps = {
  context: StartPlaybackInput;
  className?: string;
  trackId: string;
};

export const MiniPlayTrackButton = ({
  context,
  className,
  trackId,
}: MiniPlayTrackButtonProps) => {
  const { handlePlay, isThisContext, isPlaying, isThisTrack } = usePlayTrack({
    context,
    trackId,
  });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn("cursor-pointer", className)}
    >
      {isThisContext && isThisTrack && isPlaying ? (
        <PauseIcon className="size-4 fill-foreground stroke-0" />
      ) : (
        <PlayIcon className="size-4 fill-foreground stroke-0" />
      )}
    </button>
  );
};
