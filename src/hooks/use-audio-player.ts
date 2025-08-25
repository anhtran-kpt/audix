"use client";

import { PlaybackContextType } from "@/app/generated/prisma";
import { TrackRef } from "@/contracts/playback";
import { getAudioUrl } from "@/lib/helpers/get-audio-url";
import {
  AudioStore,
  buildUpNextRefs,
  useAudioStore,
} from "@/stores/use-audio-store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export function useAudioPlayerHydrated() {
  const api = useAudioStore.persist;
  const [ready, setReady] = useState<boolean>(
    () => api?.hasHydrated?.() ?? false
  );
  useEffect(() => {
    if (!api) return;
    if (api.hasHydrated()) return setReady(true);
    return api.onFinishHydration(() => setReady(true));
  }, [api]);
  return ready;
}

export const selectUpNextRefs = (s: AudioStore) => buildUpNextRefs(s);
export const selectHasNext = (s: AudioStore) => buildUpNextRefs(s).length > 0;
export const selectHasPrev = (s: AudioStore) => s.history.length > 0;

export const useNowPlayingRef = () => useAudioStore((s) => s.nowPlayingRef);

export const useNowPlayingRefId = () =>
  useAudioStore(useShallow((s) => s.nowPlayingRef?.id));

export const usePlaybackContext = () =>
  useAudioStore(useShallow((s) => s.playbackContext));

export const useIsPlaying = () => useAudioStore((s) => s.isPlaying);

export const usePlaybackState = () =>
  useAudioStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      isLoading: s.isLoading,
      currentTime: s.currentTime,
      duration: s.duration,
    }))
  );

export const usePlayerControls = () =>
  useAudioStore(
    useShallow((s) => ({
      play: s.play,
      pause: s.pause,
      stop: s.stop,
      togglePlay: s.togglePlay,
      next: s.next,
      previous: s.previous,
      seek: s.seek,
      seekBy: s.seekBy,
      skipToUpNextIndex: s.skipToUpNextIndex,
      skipToContextIndex: s.skipToContextIndex,
      jumpToTrackId: s.jumpToTrackId,
    }))
  );

export const useVolumeControls = () =>
  useAudioStore(
    useShallow((s) => ({
      volume: s.volume,
      isMuted: s.isMuted,
      setVolume: s.setVolume,
      toggleMute: s.toggleMute,
    }))
  );

export const usePlayerModes = () =>
  useAudioStore(
    useShallow((s) => ({
      isShuffled: s.isShuffled,
      repeatMode: s.repeatMode,
      toggleShuffle: s.toggleShuffle,
      toggleRepeat: s.toggleRepeat,
      setRepeatMode: s.setRepeatMode,
    }))
  );

export function useQueue() {
  const upNext = useAudioStore(useShallow(selectUpNextRefs));

  const { enqueueNext, addToQueue, clearExplicit, skipToUpNextIndex } =
    useAudioStore(
      useShallow((s) => ({
        enqueueNext: s.enqueueNext,
        addToQueue: s.addToQueue,
        clearExplicit: s.clearExplicit,
        skipToUpNextIndex: s.skipToUpNextIndex,
      }))
    );

  const hasNext = useAudioStore(selectHasNext);
  const hasPrev = useAudioStore(selectHasPrev);

  return {
    upNext,
    enqueueNext,
    addToQueue,
    clearExplicit,
    skipToUpNextIndex,
    hasNext,
    hasPrev,
  } as const;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasHydrated = useAudioPlayerHydrated();
  const setAudioElement = useAudioStore((s) => s.setAudioElement);

  const playbackState = usePlaybackState();
  const controls = usePlayerControls();
  const volume = useVolumeControls();
  const modes = usePlayerModes();
  const error = useAudioStore((s) => s.error);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.preload = "metadata";
    setAudioElement(el);
  }, [setAudioElement]);

  // Attach media events once
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => useAudioStore.getState().next();
    const onTime = (e: Event) =>
      useAudioStore.setState({
        currentTime: (e.target as HTMLAudioElement).currentTime,
      });
    const onLoaded = (e: Event) =>
      useAudioStore
        .getState()
        .setDuration((e.target as HTMLAudioElement).duration);
    const onError = () =>
      useAudioStore.getState().setError("Failed to load audio");
    const onPlay = () => useAudioStore.setState({ isPlaying: true });
    const onPause = () => useAudioStore.setState({ isPlaying: false });

    el.addEventListener("ended", onEnded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("error", onError);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("error", onError);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  // Re-sync after hydrate (volume, src via nowPlayingRef.audioId, seek)
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !hasHydrated) return;
    const s = useAudioStore.getState();
    el.volume = s.isMuted ? 0 : typeof s.volume === "number" ? s.volume : 0.8;

    const ref = s.nowPlayingRef;
    if (ref) {
      const url = getAudioUrl(ref.audioId);
      if (!el.src || !el.src.includes(ref.audioId)) {
        el.src = url;
        el.load();
      }
      if (s.currentTime && s.currentTime > 0) {
        const onLoaded = () => {
          el.currentTime = Math.min(
            s.currentTime!,
            el.duration || s.currentTime!
          );
          el.removeEventListener("loadedmetadata", onLoaded);
        };
        el.addEventListener("loadedmetadata", onLoaded);
      }
    }
  }, [hasHydrated]);

  const progress = useMemo(
    () =>
      playbackState.duration > 0
        ? (playbackState.currentTime / playbackState.duration) * 100
        : 0,
    [playbackState.currentTime, playbackState.duration]
  );

  const formatTime = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  const playTrackRef = useCallback(async (ref: TrackRef) => {
    const { setCurrentFromRef, play } = useAudioStore.getState();
    setCurrentFromRef(ref);
    await play();
  }, []);

  const playContext = useCallback(
    async (
      refs: TrackRef[],
      startIndex: number,
      meta: {
        type: PlaybackContextType;
        contextId?: string;
        name?: string;
        snapshotId?: string;
      }
    ) => {
      await useAudioStore.getState().startFromContext(refs, startIndex, meta);
    },
    []
  );

  return {
    audioRef,
    error,
    progress,
    playback: playbackState,
    controls,
    volume,
    modes,
    queue: useQueue(),
    formatTime,
    playTrackRef,
    playContext,
  } as const;
}

// -----------------------
// Keyboard shortcuts
// -----------------------
export function useAudioKeyboardShortcuts() {
  const { togglePlay, next, previous, seekBy } = usePlayerControls();
  const { volume, setVolume } = useVolumeControls();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as Element | null;
      if (
        target &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ": // space
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "arrowright":
          if (event.shiftKey) next();
          else seekBy(10);
          break;
        case "arrowleft":
          if (event.shiftKey) previous();
          else seekBy(-10);
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
  }, [togglePlay, next, previous, seekBy, setVolume, volume]);
}

// -----------------------
// Media Session integration
// -----------------------
// export function useMediaSession() {
//   const currentTrack = useCurrentTrack();
//   const isPlaying = useIsPlaying();
//   const { play, pause, next, previous } = usePlayerControls();

//   useEffect(() => {
//     if (!("mediaSession" in navigator)) return;
//     if (!currentTrack) return;

//     navigator.mediaSession.metadata = new MediaMetadata({
//       title: currentTrack.title,
//       artist: currentTrack.artists.find(
//         (a) => a.artist.id === currentTrack.album.artistId
//       )?.artist.name,
//       album: currentTrack.album.title,
//     });

//     navigator.mediaSession.setActionHandler("play", play);
//     navigator.mediaSession.setActionHandler("pause", pause);
//     navigator.mediaSession.setActionHandler("nexttrack", next);
//     navigator.mediaSession.setActionHandler("previoustrack", previous);
//     navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
//   }, [currentTrack, isPlaying, play, pause, next, previous]);
// }
