"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import { useAudioStore } from "@/stores/use-audio-store";
import { usePlaybackContext, useIsPlaying } from "@/hooks/use-audio-player";
import { useMemo } from "react";
import { postApi } from "@/lib/http/request";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/icon-button";
import { SnapshotOutput } from "@/contracts/playback";
import { useShallow } from "zustand/react/shallow";

type ContextMeta = {
  type: PlaybackContextType;
  contextId?: string;
  name?: string;
};

export function ContextPlayButton({
  context,
  defaultStartIndex = 0,
  className,
}: {
  context: ContextMeta;
  defaultStartIndex?: number;
  className?: string;
}) {
  const isPlaying = useIsPlaying();
  const current = usePlaybackContext();
  const isSameContext = useMemo(
    () =>
      current?.type === context.type &&
      current?.contextId === context.contextId,
    [current?.type, current?.contextId, context.type, context.contextId]
  );

  const { togglePlay, startFromContext, clearExplicit } = useAudioStore(
    useShallow((s) => ({
      togglePlay: s.togglePlay,
      startFromContext: s.startFromContext,
      clearExplicit: s.clearExplicit,
    }))
  );

  const onClick = async () => {
    if (isSameContext) {
      await togglePlay();
    }

    const data = await postApi<SnapshotOutput>("/playback/snapshot", {
      type: context.type,
      contextId: context.contextId,
    });

    if (!data?.refs?.length) return;

    clearExplicit();
    await startFromContext(data.refs, defaultStartIndex, {
      type: context.type,
      contextId: context.contextId,
      name: data.name ?? context.name,
      snapshotId: data.snapshotId,
    });
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
