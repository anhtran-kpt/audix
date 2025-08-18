import { useEffect, useRef, useCallback } from "react";
import { PlaybackContextType, useAudioStore } from "@/stores/use-audio-store";
import { TTrack } from "@/types";
import { useShallow } from "zustand/react/shallow";
import { useAudioPlayerHydrated } from "./use-audio-player-hydrated";
import { getAudioUrl } from "@/lib/helpers/get-audio-url";

export const useCurrentTrack = () =>
  useAudioStore(useShallow((state) => state.currentTrack));

export const usePlaybackContext = () =>
  useAudioStore(useShallow((state) => state.playbackContext));

export const useIsPlaying = () => useAudioStore((state) => state.isPlaying);

export const usePlaybackState = () =>
  useAudioStore(
    useShallow((state) => ({
      isPlaying: state.isPlaying,
      isLoading: state.isLoading,
      currentTime: state.currentTime,
      duration: state.duration,
    }))
  );

export const usePlayerControls = () =>
  useAudioStore(
    useShallow((state) => ({
      play: state.play,
      pause: state.pause,
      stop: state.stop,
      togglePlay: state.togglePlay,
      next: state.next,
      previous: state.previous,
      seek: state.seek,
      seekBy: state.seekBy,
    }))
  );

export const useVolumeControls = () =>
  useAudioStore(
    useShallow((state) => ({
      volume: state.volume,
      isMuted: state.isMuted,
      setVolume: state.setVolume,
      toggleMute: state.toggleMute,
    }))
  );

export const usePlayerModes = () =>
  useAudioStore(
    useShallow((state) => ({
      isShuffled: state.isShuffled,
      repeatMode: state.repeatMode,
      toggleShuffle: state.toggleShuffle,
      toggleRepeat: state.toggleRepeat,
      setRepeatMode: state.setRepeatMode,
    }))
  );

export const useQueueManagement = () =>
  useAudioStore(
    useShallow((state) => ({
      queue: state.queue,
      queueIndex: state.queueIndex,
      addToQueue: state.addToQueue,
      removeFromQueue: state.removeFromQueue,
      clearQueue: state.clearQueue,
      skipTo: state.skipTo,
    }))
  );

export const useError = () => useAudioStore(useShallow((state) => state.error));

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const setAudioElement = useAudioStore((state) => state.setAudioElement);
  const hasHydrated = useAudioPlayerHydrated();

  const currentTrack = useCurrentTrack();
  const playbackState = usePlaybackState();
  const playerControls = usePlayerControls();
  const volumeControls = useVolumeControls();
  const playerModes = usePlayerModes();
  const queueManagement = useQueueManagement();
  const error = useError();

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.preload = "metadata";
    setAudioElement(el);
  }, [setAudioElement]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !hasHydrated) return;

    const s = useAudioStore.getState();

    el.volume = s.isMuted ? 0 : typeof s.volume === "number" ? s.volume : 0.8;

    if (s.currentTrack) {
      el.src = getAudioUrl(s.currentTrack.audioId);
      el.load();

      if (s.currentTime && s.currentTime > 0) {
        const onLoaded = () => {
          el.currentTime = Math.min(
            s.currentTime,
            el.duration || s.currentTime
          );
          el.removeEventListener("loadedmetadata", onLoaded);
        };
        el.addEventListener("loadedmetadata", onLoaded);
      }
    }
  }, [hasHydrated]);

  const progress =
    playbackState.duration > 0
      ? (playbackState.currentTime / playbackState.duration) * 100
      : 0;

  const hasNext = queueManagement.queueIndex < queueManagement.queue.length - 1;
  const hasPrev = queueManagement.queueIndex > 0;

  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const playTrack = useCallback(
    async (
      track: TTrack,
      context?: {
        type: PlaybackContextType;
        id: string | null;
        name: string | null;
      }
    ) => {
      const { setCurrentTrack, play } = useAudioStore.getState();
      setCurrentTrack(track, context);
      await play();
    },
    []
  );

  return {
    currentTrack,
    error,
    progress,
    hasNext,
    hasPrev,

    playback: playbackState,
    controls: playerControls,
    volume: volumeControls,
    modes: playerModes,
    queue: queueManagement,

    formatTime,
    playTrack,
    audioRef,
  };
};

export const useAudioKeyboardShortcuts = () => {
  const { togglePlay, next, previous, seekBy } = usePlayerControls();
  const { volume, setVolume } = useVolumeControls();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "arrowright":
          if (event.shiftKey) {
            next();
          } else {
            seekBy(10);
          }
          break;
        case "arrowleft":
          if (event.shiftKey) {
            previous();
          } else {
            seekBy(-10);
          }
          break;
        case "arrowup":
          event.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "arrowdown":
          event.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case "m":
          useAudioStore.getState().toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [togglePlay, next, previous, setVolume, seekBy, volume]);
};

export const useMediaSession = () => {
  const currentTrack = useCurrentTrack();
  const isPlaying = useIsPlaying();
  const { play, pause, next, previous } = usePlayerControls();

  useEffect(() => {
    if ("mediaSession" in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artists.find(
          (artist) => artist.artist.id === currentTrack.album.artistId
        )?.artist.name,
        album: currentTrack.album.title,
      });

      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("nexttrack", next);
      navigator.mediaSession.setActionHandler("previoustrack", previous);

      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [currentTrack, isPlaying, play, pause, next, previous]);
};
