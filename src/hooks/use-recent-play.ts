"use client";

import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import { ContextFromHistoryOutput } from "@/features/playback/contracts/playback-dto";
import { postApi } from "@/lib/http/request";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

export const useRecentPlay = () => {
  const { startFromContext, clearExplicit } = useAudioStore(
    useShallow((s) => ({
      startFromContext: s.startFromContext,
      clearExplicit: s.clearExplicit,
    }))
  );

  const handlePlay = async (trackId: zCuidType) => {
    const { trackRefs, startIndex, ...meta } =
      await postApi<ContextFromHistoryOutput>(
        `/playback/context-from-history`,
        { trackId }
      );

    if (!trackRefs?.length) return;

    clearExplicit();

    await startFromContext(trackRefs, startIndex, {
      contextId: meta.contextId,
      type: meta.type,
      snapshotId: meta.snapshotId,
      name: meta.name,
    });
  };

  return { handlePlay };
};
