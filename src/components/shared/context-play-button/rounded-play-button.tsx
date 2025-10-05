"use client";

import { Button } from "@/components/ui/button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { usePlayContext } from "@/hooks/use-play-context";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon } from "lucide-react";

type RoundedPlayButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};
export const RoundedPlayButton = ({
  context,
  className,
}: RoundedPlayButtonProps) => {
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
