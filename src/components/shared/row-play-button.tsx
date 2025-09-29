"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";
import { usePlayContext } from "@/hooks/use-play-context";

type RowPlayButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const RowPlayButton = ({ context, className }: RowPlayButtonProps) => {
  const { handlePlay, isThisTrack, isThisContext, isPlaying } =
    usePlayContext(context);

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
