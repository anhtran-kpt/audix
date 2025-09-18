"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import { useAudioStore } from "@/stores/use-audio-store";
import { usePlaybackContext, useIsPlaying } from "@/hooks/use-audio-player";
import { useMemo } from "react";
import { postApi } from "@/lib/http/request";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/icon-button";
import { useShallow } from "zustand/react/shallow";
import {
  SnapshotInput,
  SnapshotOutput,
} from "@/features/playback/contracts/playback-dto";

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

    const { trackRefs, ...meta } = await postApi<SnapshotOutput, SnapshotInput>(
      "/playback/snapshot",
      {
        type: context.type,
        contextId: context.contextId,
        name: context.name,
      }
    );

    if (!trackRefs?.length) return;

    clearExplicit();
    await startFromContext(trackRefs, defaultStartIndex, meta);
  };

  return (
    <IconButton
      icon={isPlaying && isSameContext ? PauseIcon : PlayIcon}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      size="xl"
      className={cn("bg-primary p-3", className)}
      iconClassName="stroke-0 fill-white"
      tooltipContent={isPlaying && isSameContext ? "Pause" : "Play"}
    />
  );
}
