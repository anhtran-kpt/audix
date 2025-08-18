"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";

export function useScrobble() {
  const { nowPlaying, progressSec, durationSec, source } = useAudioStore(
    useShallow((s) => ({
      nowPlaying: s.currentTrack,
      progressSec: s.currentTime,
      durationSec: s.duration,
      source: s.playbackContext,
    }))
  );

  const scrobbledRef = useRef<string | null>(null);

  useEffect(() => {
    scrobbledRef.current = null;
  }, [nowPlaying?.id]);

  useEffect(() => {
    if (!nowPlaying?.id || !durationSec) return;
    if (scrobbledRef.current === nowPlaying.id) return;

    const thresholdA = 30;
    const thresholdB = durationSec * 0.5;
    const threshold = Math.min(thresholdA, thresholdB);

    if (progressSec >= threshold) {
      scrobbledRef.current = nowPlaying.id;
      void fetch("/api/plays", {
        method: "POST",
        body: JSON.stringify({
          trackId: nowPlaying.id,
          listenedSec: Math.floor(progressSec),
          playedAt: new Date().toISOString(),
          sourceType: source?.type, // 'playlist' | 'album' | ...
          sourceId: source?.id ?? null,
        }),
      });
    }
  }, [nowPlaying?.id, progressSec, durationSec, source?.type, source?.id]);
}
