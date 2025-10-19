"use client";

import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

type UsePlayContextProps = {
  context: StartPlaybackInput;
};

export const usePlayContext = ({ context }: UsePlayContextProps) => {
  const { isPlaying, start, pause, resume, contextId, contextType } =
    usePlaybackStore(
      useShallow((s) => ({
        start: s.start,
        pause: s.pause,
        resume: s.resume,
        isPlaying: s.isPlaying,
        contextId: s.session?.snapshot?.contextId,
        contextType: s.session?.snapshot?.contextType,
      }))
    );

  const isThisContext =
    contextId === context.contextId && contextType === context.contextType;

  const handlePlay = () => {
    if (isThisContext) {
      return isPlaying ? pause() : resume();
    }
    return start(context);
  };

  return { isPlaying, isThisContext, handlePlay };
};
