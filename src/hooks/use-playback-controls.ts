import { usePlaybackStore } from "@/stores/use-playback-store";

export function usePlaybackControls() {
  const {
    session,
    pause,
    resume,
    play,
    next,
    previous,
    toggleShuffle,
    setRepeatMode,
  } = usePlaybackStore((s) => ({
    session: s.session,
    pause: s.pause,
    resume: s.resume,
    play: s.play,
    next: s.next,
    previous: s.previous,
    toggleShuffle: s.toggleShuffle,
    setRepeatMode: s.setRepeatMode,
  }));

  const isPlaying = session?.isPlaying ?? false;
  const isShuffled = session?.isShuffled ?? false;
  const repeatMode = session?.repeatMode ?? "OFF";
  const currentTrackId = session?.currentTrackId;

  const togglePlayPause = () => {
    if (!session) return;
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const cycleRepeatMode = () => {
    switch (repeatMode) {
      case "OFF":
        setRepeatMode("ALL");
        break;
      case "ALL":
        setRepeatMode("ONE");
        break;
      case "ONE":
        setRepeatMode("OFF");
        break;
    }
  };

  return {
    // state
    session,
    isPlaying,
    isShuffled,
    repeatMode,
    currentTrackId,

    // controls
    togglePlayPause,
    next,
    previous,
    toggleShuffle,
    cycleRepeatMode,
  };
}
