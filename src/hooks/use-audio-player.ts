// use-audio-player.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { getAudioUrl } from "@/lib/helpers/get-audio-url";

/**
 * Important:
 * - Subscribe only to a few fields (so this hook doesn't rerender for every progressMs update).
 * - Use usePlaybackStore.getState() to read progress once when needed (no subscription).
 * - Throttle local -> store updates (PROGRESS_UPDATE_INTERVAL_MS).
 */

const PROGRESS_UPDATE_INTERVAL_MS = 1000; // throttle interval for updateProgressLocal

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Select primitive fields only
  const currentTrackId = usePlaybackStore((s) => s.session?.currentTrackId);
  const currentTrackAudioId = usePlaybackStore(
    (s) => s.session?.currentTrack?.audioId
  );
  const isPlaying = usePlaybackStore((s) => !!s.session?.isPlaying);
  const volume = usePlaybackStore((s) => s.session?.volume ?? 80);
  const isMuted = usePlaybackStore((s) => !!s.session?.isMuted);

  // local seek markers (subscribe to these so we can react when user seeks)
  const lastLocalSeekAt = usePlaybackStore((s) => s.lastLocalSeekAt);
  const lastLocalSeekPositionMs = usePlaybackStore(
    (s) => s.lastLocalSeekPositionMs
  );
  const clearLocalSeek = usePlaybackStore((s) => s.clearLocalSeek);

  // actions (stable references from store)
  const pause = usePlaybackStore((s) => s.pause);
  const next = usePlaybackStore((s) => s.next);
  const updateProgressLocal = usePlaybackStore((s) => s.updateProgressLocal);
  const sync = usePlaybackStore((s) => s.sync);

  // refs to remember last applied values (prevent redundant DOM ops)
  const lastTrackIdRef = useRef<string | null>(null);
  const lastIsPlayingRef = useRef<boolean | null>(null);
  const lastVolumeRef = useRef<number | null>(null);
  const lastProgressUpdateAtRef = useRef<number>(0);

  // 0) expose audioRef for top-level <audio> element usage (return it)
  // 1) Handle track change: set src + initial time only when trackId actually changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackId) return;

    // if track did not change => do nothing here
    if (lastTrackIdRef.current === currentTrackId) return;
    lastTrackIdRef.current = currentTrackId;

    // read progress once from store (no subscription)
    const progressMs =
      usePlaybackStore.getState().session?.progressMs ??
      0; /* server progress at moment of track change */

    const url = getAudioUrl(currentTrackAudioId ?? currentTrackId);

    // set src (only when change)
    // for safety set dataset trackId for quick identity
    if (audio.dataset.trackId !== currentTrackId) {
      audio.src = url;
      audio.dataset.trackId = currentTrackId;
    }

    // set starting time if differs reasonably
    const expected = progressMs / 1000;
    if (
      Number.isFinite(expected) &&
      Math.abs(audio.currentTime - expected) > 1 // larger threshold for safety on track change
    ) {
      audio.currentTime = expected;
    }

    // play if needed (user-initiated play should have happened earlier)
    if (isPlaying) {
      audio.play().catch((err) => {
        // autoplay can be blocked if no user gesture — ignore but log
        console.warn("Audio play failed (maybe autoplay blocked):", err);
      });
    }
  }, [currentTrackId, currentTrackAudioId, isPlaying]);

  // 1.5) react to local client seek events: set audio.currentTime immediately
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !lastLocalSeekAt || lastLocalSeekPositionMs == null) return;

    try {
      const sec = lastLocalSeekPositionMs / 1000;
      // set currentTime directly
      // note: setting currentTime triggers timeupdate events
      audio.currentTime = sec;
    } catch (err) {
      console.warn("Failed setting audio.currentTime on local seek:", err);
    } finally {
      // clear local marker — audio element has been instructed
      clearLocalSeek();
    }
  }, [lastLocalSeekAt, lastLocalSeekPositionMs, clearLocalSeek]);

  // 2) Toggle play/pause — only handle when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (lastIsPlayingRef.current === isPlaying) return;
    lastIsPlayingRef.current = isPlaying;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Play failed:", err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // 3) Volume / mute updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const v = isMuted ? 0 : (volume ?? 80) / 100;
    if (lastVolumeRef.current === v) return;
    lastVolumeRef.current = v;
    audio.volume = v;
  }, [volume, isMuted]);

  // 4) timeupdate listener -> update local store, THROTTLED
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      // if paused do nothing
      if (audio.paused) return;

      const now = Date.now();
      if (
        now - lastProgressUpdateAtRef.current >=
        PROGRESS_UPDATE_INTERVAL_MS
      ) {
        lastProgressUpdateAtRef.current = now;
        updateProgressLocal(Math.floor(audio.currentTime * 1000));
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [updateProgressLocal]);

  // 5) ended & error
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => next();
    const onError = (e: any) => {
      console.error("Audio error:", e);
      pause();
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [next, pause]);

  // 6) periodic sync (server) — doesn't cause audio resets because above handlers guard by trackId/isPlaying
  useEffect(() => {
    sync();

    const id = setInterval(() => {
      sync();
    }, 10000);
    return () => clearInterval(id);
  }, [sync]);

  return { audioRef };
}
