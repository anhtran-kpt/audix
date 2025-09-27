"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayButton } from "@/hooks/use-play-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";

type RowPlayButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const RowPlayButton = ({ context, className }: RowPlayButtonProps) => {
  const { handlePlay, isThisTrack, isThisContext, isPlaying } =
    usePlayButton(context);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn(className)}
    >
      {isThisContext && isThisTrack && isPlaying ? (
        <PauseIcon className="size-4 fill-foreground stroke-0" />
      ) : (
        <PlayIcon className="size-4 fill-foreground stroke-0" />
      )}
    </button>
  );
};
