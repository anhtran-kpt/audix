import { usePlaybackStore } from "@/stores/use-playback-store";

export function useTrackPlayPause(trackId: string, context: Playback) {
  const { session, play, pause, resume } = usePlaybackStore((s) => ({
    session: s.session,
    play: s.play,
    pause: s.pause,
    resume: s.resume,
  }));

  const currentTrackId = session?.currentTrackId;
  const isPlaying = session?.isPlaying ?? false;
  const isCurrent = currentTrackId === trackId;

  const toggle = () => {
    // Nếu track đang phát
    if (isCurrent) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
      return;
    }

    if (context) {
      play({
        contextType: context?.type,
        contextId: context?.id,
        startTrackId: trackId,
      });
    }
  };

  return {
    isPlaying: isCurrent && isPlaying,
    isCurrent,
    toggle,
  };
}
