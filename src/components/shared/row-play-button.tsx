"use client";

import { usePlaybackStore } from "@/stores/use-playback-store";
import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayContextButton } from "@/hooks/use-play-context-button";
import { PlaybackContextSnapshot } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";

type RowPlayButtonProps = {
  context: PlaybackContextSnapshot;
  className?: string;
};

export const RowPlayButton = ({ context, className }: RowPlayButtonProps) => {
  const { handlePlay, isThisContext, isPlaying } =
    usePlayContextButton(context);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn(className)}
    >
      {isThisContext && isPlaying ? (
        <PauseIcon className="size-4 fill-foreground stroke-0" />
      ) : (
        <PlayIcon className="size-4 fill-foreground stroke-0" />
      )}
    </button>
  );
};
