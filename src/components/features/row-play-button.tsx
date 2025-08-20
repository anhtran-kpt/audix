"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import {
  useIsPlaying,
  useNowPlayingId,
  usePlaybackContext,
} from "@/hooks/use-audio-player";
import { useAudioStore } from "@/stores/use-audio-store";
import { IconButton } from "../ui/icon-button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

type TrackRef = { id: string; audioId: string };

type RowPlayButtonProps = {
  context: { type: PlaybackContextType; contextId?: string };
  trackRefs: TrackRef[];
  trackId: string;
};

export function RowPlayButton({
  context,
  trackRefs,
  trackId,
}: RowPlayButtonProps) {
  const isPlaying = useIsPlaying();
  const nowPlayingId = useNowPlayingId();
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

  const thisIndex = trackRefs.findIndex((r) => r.id === trackId);
  const isThisTrack = isSameContext && nowPlayingId === trackId;

  const onClick = async () => {
    if (thisIndex < 0) return;

    if (isThisTrack) {
      togglePlay();
      return;
    }

    await startFromContext(trackRefs, thisIndex, context);
  };

  return (
    <IconButton
      aria-pressed={isThisTrack && isPlaying}
      icon={isThisTrack && isPlaying ? PauseIcon : PlayIcon}
      size="sm"
      onClick={onClick}
      iconClassName="fill-foreground stroke-0"
      className="hidden group-hover:block"
    />
  );
}
