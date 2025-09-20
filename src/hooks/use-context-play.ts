"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import { useAudioStore } from "@/stores/use-audio-store";
import { usePlaybackContext } from "@/hooks/use-audio-player";
import { useShallow } from "zustand/react/shallow";
import {
  SnapshotInput,
  SnapshotOutput,
} from "@/features/playback/contracts/playback-dto";
import { postApi } from "@/lib/http/request";

type ContextMeta = {
  type: PlaybackContextType;
  contextId?: string;
  name?: string;
};

export const useContextPlay = () => {
  const current = usePlaybackContext();

  const { togglePlay, startFromContext, clearExplicit } = useAudioStore(
    useShallow((s) => ({
      togglePlay: s.togglePlay,
      startFromContext: s.startFromContext,
      clearExplicit: s.clearExplicit,
    }))
  );

  const handleContextPlay = async (context: ContextMeta) => {
    const isSameContext =
      current?.type === context.type &&
      current?.contextId === context.contextId;

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
    await startFromContext(trackRefs, 0, meta);
  };

  return { handleContextPlay };
};
