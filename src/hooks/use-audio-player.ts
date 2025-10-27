"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";
import { getAudioUrl } from "@/utils/string";
import { useQueryClient } from "@tanstack/react-query";
import { playbackKeys } from "@/features/playback/api/playback-keys";

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadingNewTrack = useRef(false);
  const lastProgressUpdate = useRef(0);

  const listenAccumulated = useRef(0);
  const hasReportedListen = useRef(false);
  const qc = useQueryClient();

  const {
    progressMs,
    isPlaying,
    next,
    hydrate,
    currentTrack,
    volume,
    isMuted,
    seek,
    pause,
  } = usePlaybackStore(
    useShallow((s) => ({
      progressMs: s.progressMs,
      isPlaying: s.isPlaying,
      next: s.next,
      previous: s.previous,
      hydrate: s.hydrate,
      currentTrack: s.session?.currentTrack,
      volume: s.volume,
      isMuted: s.isMuted,
      seek: s.seek,
      pause: s.pause,
      resume: s.resume,
    }))
  );

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      audioRef.current.crossOrigin = "anonymous";
    }

    hydrate();
  }, [hydrate]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current || isLoadingNewTrack.current) return;

    const audio = audioRef.current;
    const currentTimeSec = audio.currentTime;
    const delta = currentTimeSec - lastProgressUpdate.current / 1000;

    if (delta > 0 && !audio.paused && !audio.seeking) {
      listenAccumulated.current += delta;
    }

    const currentTimeMs = Math.floor(currentTimeSec * 1000);
    if (Math.abs(currentTimeMs - lastProgressUpdate.current) >= 100) {
      lastProgressUpdate.current = currentTimeMs;
      seek(currentTimeMs);
    }

    const durationSec = audio.duration || 0;
    const threshold30s = listenAccumulated.current >= 30;
    const thresholdHalf =
      durationSec > 0 && listenAccumulated.current >= durationSec * 0.5;

    if (!hasReportedListen.current && (threshold30s || thresholdHalf)) {
      hasReportedListen.current = true;

      const historyId = usePlaybackStore.getState().session?.playHistoryId;
      const listenedSec = Math.floor(listenAccumulated.current);

      if (historyId) {
        usePlaybackStore
          .getState()
          .updatePlayHistoryListen(historyId, listenedSec);
      }
    }
  }, [seek]);

  const handleEnded = useCallback(() => {
    next();
  }, [next]);

  const handleError = useCallback(
    (e: Event) => {
      console.error("Audio playback error:", e);
      pause();
    },
    [pause]
  );

  const handleLoadStart = useCallback(() => {
    isLoadingNewTrack.current = true;
  }, []);

  const handleCanPlay = useCallback(() => {
    isLoadingNewTrack.current = false;

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to resume playback:", error);
        pause();
      });
    }
  }, [isPlaying, pause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [
    handleTimeUpdate,
    handleEnded,
    handleError,
    handleLoadStart,
    handleCanPlay,
  ]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack?.audioId) return;

    const audio = audioRef.current;
    const newSrc = getAudioUrl(currentTrack.audioId);

    if (audio.src !== newSrc) {
      audio.pause();
      audio.src = newSrc;
      const targetTime = progressMs / 1000;

      audio.load();

      const setInitialTime = () => {
        if (audio.duration && targetTime <= audio.duration) {
          audio.currentTime = targetTime;
        }
        audio.removeEventListener("loadedmetadata", setInitialTime);
      };

      audio.addEventListener("loadedmetadata", setInitialTime);
    }
  }, [currentTrack?.audioId, progressMs]);

  useEffect(() => {
    if (!audioRef.current || isLoadingNewTrack.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      if (audio.src && audio.readyState >= 2) {
        audio.play().catch((error) => {
          console.error("Failed to start playback:", error);
          pause();
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, pause]);

  useEffect(() => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!audioRef.current || isLoadingNewTrack.current) return;

    const audio = audioRef.current;
    const targetTime = progressMs / 1000;

    if (Math.abs(audio.currentTime - targetTime) >= 1) {
      audio.currentTime = targetTime;
      lastProgressUpdate.current = progressMs;
    }
  }, [progressMs]);

  useEffect(() => {
    listenAccumulated.current = 0;
    hasReportedListen.current = false;

    qc.invalidateQueries({ queryKey: playbackKeys.history() });
  }, [currentTrack?.id, qc]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      }
    };
  }, []);

  return { audioRef };
};
