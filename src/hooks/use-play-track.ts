"use client";

import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

type UsePlayTrackProps = {
  context: StartPlaybackInput;
  trackId: string;
};

export const usePlayTrack = ({ context, trackId }: UsePlayTrackProps) => {
  const {
    isPlaying,
    start,
    pause,
    resume,
    contextId,
    contextType,
    currentTrackId,
  } = usePlaybackStore(
    useShallow((s) => ({
      start: s.start,
      pause: s.pause,
      resume: s.resume,
      isPlaying: s.isPlaying,
      contextId: s.session?.snapshot?.contextId,
      contextType: s.session?.snapshot?.contextType,
      currentTrackId: s.session?.currentTrackId,
    }))
  );

  const isThisContext =
    contextId === context.contextId && contextType === context.contextType;
  const isThisTrack = currentTrackId === trackId;

  const handlePlay = () => {
    if (isThisContext && isThisTrack) {
      return isPlaying ? pause() : resume();
    }

    if (isThisContext && !isThisTrack) {
      return start({ ...context, startTrackId: trackId });
    }

    return start({ ...context, startTrackId: trackId });
  };

  return { isPlaying, isThisContext, isThisTrack, handlePlay };
};
