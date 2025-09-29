"use client";

import { Button } from "../ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";
import { usePlayContext } from "@/hooks/use-play-context";

type ContextPlayButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const ContextPlayButton = ({
  context,
  className,
}: ContextPlayButtonProps) => {
  const { handlePlay, isThisContext, isPlaying } = usePlayContext(context);

  return (
    <Button
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn("size-12 rounded-full", className)}
    >
      {isThisContext && isPlaying ? (
        <PauseIcon className="size-6 fill-current stroke-0" />
      ) : (
        <PlayIcon className="size-6 fill-current stroke-0" />
      )}
    </Button>
  );
};
