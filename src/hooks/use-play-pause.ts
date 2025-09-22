"use client";

import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

export function usePlayPause() {
  const { session, play, pause, resume } = usePlaybackStore(
    useShallow((s) => ({
      session: s.session,
      play: s.play,
      pause: s.pause,
      resume: s.resume,
    }))
  );

  const isPlaying = session?.isPlaying ?? false;

  const toggle = () => {
    if (!session) {
      return;
    }
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  return {
    isPlaying,
    hasSession: !!session,
    toggle,
    play,
    pause,
    resume,
  };
}
