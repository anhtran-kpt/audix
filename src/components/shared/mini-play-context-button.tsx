"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayButton } from "@/hooks/use-play-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";

type MiniPlayContextButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const MiniPlayContextButton = ({
  context,
  className,
}: MiniPlayContextButtonProps) => {
  const { handlePlay, isThisContext, isPlaying } = usePlayButton(context);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn("cursor-pointer", className)}
    >
      {isThisContext && isPlaying ? (
        <PauseIcon className="size-4 fill-foreground stroke-0" />
      ) : (
        <PlayIcon className="size-4 fill-foreground stroke-0" />
      )}
    </button>
  );
};
