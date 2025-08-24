"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import { postApi } from "@/lib/http/request";
import { useSession } from "next-auth/react";
import { RecordPlayInput } from "@/contracts/track";

export function useScrobble() {
  const { data } = useSession();

  const { nowPlayingRef, listenedSec, durationSec, playbackContext } =
    useAudioStore(
      useShallow((s) => ({
        nowPlayingRef: s.nowPlayingRef,
        listenedSec: s.currentTime,
        durationSec: s.duration,
        playbackContext: s.playbackContext,
      }))
    );

  const scrobbledRef = useRef<string | null>(null);

  useEffect(() => {
    scrobbledRef.current = null;
  }, [nowPlayingRef?.id]);

  useEffect(() => {
    if (!nowPlayingRef?.id || !durationSec) return;
    if (scrobbledRef.current === nowPlayingRef.id) return;

    const thresholdA = 30;
    const thresholdB = durationSec * 0.5;
    const threshold = Math.min(thresholdA, thresholdB);

    if (listenedSec >= threshold) {
      scrobbledRef.current = nowPlayingRef.id;
      void postApi<void, RecordPlayInput>("/plays", {
        userId: data!.user.id,
        trackId: nowPlayingRef.id,
        listenedSec: Math.floor(listenedSec),
        playedAt: new Date(),
        sourceType: playbackContext!.type,
        sourceId: playbackContext?.contextId ?? null,
        snapshotId: playbackContext?.snapshotId,
      });
    }
  }, [nowPlayingRef?.id, listenedSec, durationSec]);
}
