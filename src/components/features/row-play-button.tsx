"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import {
  useIsPlaying,
  usenowPlayingRefId,
  usePlaybackContext,
} from "@/hooks/use-audio-player";
import { useAudioStore } from "@/stores/use-audio-store";
import { IconButton } from "../ui/icon-button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { postApi } from "@/lib/http/request";
import { SnapshotOutput } from "@/contracts/playback";

type RowPlayButtonProps = {
  context: { type: PlaybackContextType; contextId?: string; name?: string };
  trackId: string;
  buttonType?: "inside" | "outside";
};

export function RowPlayButton({
  context,
  trackId,
  buttonType = "inside",
}: RowPlayButtonProps) {
  const isPlaying = useIsPlaying();
  const nowPlayingRefId = usenowPlayingRefId();
  const currentCtx = usePlaybackContext();
  const isSameContext =
    currentCtx?.type === context.type &&
    currentCtx?.contextId === context.contextId;
  const isThisTrack = isSameContext && nowPlayingRefId === trackId;

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

    const data = await postApi<SnapshotOutput>("/playback/snapshot", {
      type: context.type,
      contextId: context.contextId,
    });

    if (!data?.refs?.length) return;

    const startIndex = Math.max(
      0,
      data.refs.findIndex((r) => r.id === trackId)
    );

    clearExplicit();

    await startFromContext(data.refs, startIndex, {
      type: context.type,
      contextId: context.contextId,
      name: data.name ?? context.name,
      snapshotId: data.snapshotId,
    });
  };

  return (
    <IconButton
      aria-pressed={isThisTrack && isPlaying}
      icon={isThisTrack && isPlaying ? PauseIcon : PlayIcon}
      size="sm"
      onClick={onClick}
      iconClassName="fill-foreground stroke-0"
      className={cn(
        buttonType === "inside"
          ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
          : "hidden group-hover:block"
      )}
    />
  );
}
