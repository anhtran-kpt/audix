"use client";

import { Button } from "@/components/ui/button";
import { StartPlaybackInput } from "@/features/playback/playback-types";
import { usePlayContext } from "@/features/playback/hooks/use-play-context";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon } from "lucide-react";

type RoundedPlayContextButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};
export const RoundedPlayContextButton = ({
  context,
  className,
}: RoundedPlayContextButtonProps) => {
  const { handlePlay, isThisContext, isPlaying } = usePlayContext({ context });

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
