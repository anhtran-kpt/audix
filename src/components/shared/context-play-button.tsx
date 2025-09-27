"use client";

import { Button } from "../ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayButton } from "@/hooks/use-play-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";

type ContextPlayButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const ContextPlayButton = ({
  context,
  className,
}: ContextPlayButtonProps) => {
  const { handlePlay, isThisContext, isPlaying } = usePlayButton(context);

  return (
    <Button
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn("size-14 rounded-full", className)}
    >
      {isThisContext && isPlaying ? (
        <PauseIcon className="size-7 fill-current stroke-0" />
      ) : (
        <PlayIcon className="size-7 fill-current stroke-0" />
      )}
    </Button>
  );
};
