"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import { postApi } from "@/lib/http/request";
import { useSession } from "next-auth/react";

export function useScrobble() {
  const { data } = useSession();

  const { nowPlaying, listenedSec, durationSec, playbackContext } =
    useAudioStore(
      useShallow((s) => ({
        nowPlaying: s.nowPlaying,
        listenedSec: s.currentTime,
        durationSec: s.duration,
        playbackContext: s.playbackContext,
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

    if (listenedSec >= threshold) {
      scrobbledRef.current = nowPlaying.id;
      void postApi<void>("/api/plays", {
        userId: data?.user.id,
        trackId: nowPlaying.id,
        listenedSec: Math.floor(listenedSec),
        playedAt: new Date(),
        playbackContextType: playbackContext?.type,
        playbackContextId: playbackContext?.contextId,
      });
    }
  }, [nowPlaying?.id, listenedSec, durationSec]);
}
