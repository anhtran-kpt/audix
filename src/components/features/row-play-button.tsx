"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import {
  useIsPlaying,
  useNowPlayingRefId,
  usePlaybackContext,
} from "@/hooks/use-audio-player";
import { useAudioStore } from "@/stores/use-audio-store";
import { IconButton } from "../ui/icon-button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { postApi } from "@/lib/http/request";
import {
  SnapshotInput,
  SnapshotOutput,
} from "@/features/playback/contracts/playback-dto";

type RowPlayButtonProps = {
  context: { type: PlaybackContextType; contextId?: string; name?: string };
  buttonType?: "inside" | "outside";
};

export function RowPlayButton({
  context,
  buttonType = "inside",
}: RowPlayButtonProps) {
  const isPlaying = useIsPlaying();
  const nowPlayingRefId = useNowPlayingRefId();
  const currentCtx = usePlaybackContext();
  const isSameContext =
    currentCtx?.type === context.type &&
    currentCtx?.contextId === context.contextId;
  const isThisTrack = isSameContext && nowPlayingRefId === context.contextId;

  const { startFromContext, clearExplicit, play, pause } = useAudioStore(
    useShallow((s) => ({
      startFromContext: s.startFromContext,
      play: s.play,
      pause: s.pause,
      clearExplicit: s.clearExplicit,
    }))
  );

  const onClick = async () => {
    if (isThisTrack) {
      if (isPlaying) pause();
      else play();
    }

    const { trackRefs, startIndex, ...meta } = await postApi<
      SnapshotOutput,
      SnapshotInput
    >("/playback/snapshot", {
      type: context.type,
      contextId: context.contextId,
      clickedTrackId: context.contextId,
    });

    if (!trackRefs?.length) return;

    clearExplicit();

    await startFromContext(trackRefs, startIndex, {
      type: meta.type,
      contextId: meta.contextId,
      name: meta.name,
      snapshotId: meta.snapshotId,
    });
  };

  return (
    <IconButton
      aria-pressed={isThisTrack && isPlaying}
      icon={isThisTrack && isPlaying ? PauseIcon : PlayIcon}
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      iconClassName="fill-foreground stroke-0"
      className={cn(
        buttonType === "inside"
          ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
          : "hidden group-hover:block"
      )}
    />
  );
}
