"use client";

import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

export function usePlayTrackButton() {
  const { session, play, pause, resume } = usePlaybackStore(
    useShallow((s) => ({
      session: s.session,
      play: s.play,
      pause: s.pause,
      resume: s.resume,
    }))
  );

  const isPlaying = session?.isPlaying ?? false;

  const handlePlay = (context: StartPlaybackInput) => {
    const isThisContext =
      session?.snapshot.contextId === context.contextIdOrQuery;
    const isThisTrack = session?.currentTrackId === context.startTrackId;

    if (isThisContext && isThisTrack) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    }

    play(context);
  };

  return {
    isPlaying,
    handlePlay,
  };
}
