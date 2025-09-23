"use client";

import { PlaybackContextSnapshot } from "@/features/playback/contracts/playback-dto";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";

export function usePlayContextButton(context: PlaybackContextSnapshot) {
  const { session, play, pause, resume } = usePlaybackStore(
    useShallow((s) => ({
      session: s.session,
      play: s.play,
      pause: s.pause,
      resume: s.resume,
    }))
  );

  const isPlaying = session?.isPlaying ?? false;
  const isThisContext =
    session?.snapshot.contextId === context.contextIdOrQuery;
  const isThisTrack = session?.currentTrackId === context.startTrackId;

  const handlePlay = () => {
    if (isThisContext && isThisTrack) {
      return isPlaying ? pause() : resume();
    }
    return play(context);
  };

  return { isThisContext, isThisTrack, handlePlay };
}
