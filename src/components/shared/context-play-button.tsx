"use client";

import { usePlaybackStore } from "@/stores/use-playback-store";
import { Button } from "../ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayContextButton } from "@/hooks/use-play-context-button";
import { PlaybackContextSnapshot } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";

type ContextPlayButtonProps = {
  context: PlaybackContextSnapshot;
  className?: string;
};

export const ContextPlayButton = ({
  context,
  className,
}: ContextPlayButtonProps) => {
  const session = usePlaybackStore((s) => s.session);
  const { handlePlay, isThisContext } = usePlayContextButton(context);

  if (!session) {
    return null;
  }

  return (
    <Button
      size="icon"
      onClick={handlePlay}
      className={cn("size-14 rounded-full", className)}
    >
      {isThisContext && session.isPlaying ? (
        <PauseIcon className="size-7 fill-current stroke-0" />
      ) : (
        <PlayIcon className="size-7 fill-current stroke-0" />
      )}
    </Button>
  );
};
