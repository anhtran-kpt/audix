"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";
import { usePlayContext } from "@/hooks/use-play-context";

type MiniPlayContextButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const MiniPlayContextButton = ({
  context,
  className,
}: MiniPlayContextButtonProps) => {
  const { handlePlay, isThisContext, isPlaying } = usePlayContext(context);

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
