"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import { TrackRef, useAudioStore } from "@/stores/use-audio-store";
import { useIsPlaying, usePlaybackContext } from "@/hooks/use-audio-player"; // file use-audio-player.ts
import { useShallow } from "zustand/react/shallow";
import { IconButton } from "../ui/icon-button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ContextPlayButtonProps = {
  context: {
    type: PlaybackContextType;
    contextId?: string;
    name?: string;
  };
  trackRefs: TrackRef[];
  defaultStartIndex?: number;
  className?: string;
};

export function ContextPlayButton({
  context,
  trackRefs,
  defaultStartIndex = 0,
  className,
}: ContextPlayButtonProps) {
  const isPlaying = useIsPlaying();
  const currentCtx = usePlaybackContext();

  const { startFromContext, togglePlay } = useAudioStore(
    useShallow((s) => ({
      startFromContext: s.startFromContext,
      togglePlay: s.togglePlay,
    }))
  );

  const isSameContext =
    currentCtx?.type === context.type &&
    currentCtx?.contextId === context.contextId;

  const onClick = async () => {
    if (!trackRefs.length) return;

    if (isSameContext) {
      await togglePlay();
    } else {
      await startFromContext(trackRefs, defaultStartIndex, context);
    }
  };

  return (
    <IconButton
      icon={isPlaying && isSameContext ? PauseIcon : PlayIcon}
      onClick={onClick}
      size="xl"
      className={cn("bg-primary p-3", className)}
      iconClassName="stroke-0 fill-white"
      tooltipContent={isPlaying && isSameContext ? "Pause" : "Play"}
    />
  );
}
