"use client";

import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

export function usePlayContext(context: StartPlaybackInput) {
  const { isPlaying, start, pause, resume, contextId, currentTrackId } =
    usePlaybackStore(
      useShallow((s) => ({
        start: s.start,
        pause: s.pause,
        resume: s.resume,
        isPlaying: s.isPlaying,
        contextId: s.session?.snapshot.contextId,
        currentTrackId: s.session?.currentTrackId,
      }))
    );

  const isThisContext = contextId === context.contextId;
  const isThisTrack = currentTrackId === context.startTrackId;

  const handlePlay = () => {
    if (isThisContext) {
      if (isThisTrack) {
        return isPlaying ? pause() : resume();
      } else {
        return start(context);
      }
    }

    return start(context);
  };

  return { isPlaying, isThisContext, isThisTrack, handlePlay };
}
