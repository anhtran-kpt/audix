import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/use-audio-store";

export function useScrobble() {
  const { nowPlaying, progressSec, durationSec, source } = useAudioStore(
    (s) => ({
      nowPlaying: s.currentTrack, // { id, ... }
      progressSec: s.currentTime, // số giây đã nghe
      durationSec: s.duration, // length của track
      source: s.playbackContext, // { type, contextId }
    })
  );

  const scrobbledRef = useRef<string | null>(null);

  useEffect(() => {
    scrobbledRef.current = null;
  }, [nowPlaying?.id]);

  useEffect(() => {
    if (!nowPlaying?.id || !durationSec) return;
    if (scrobbledRef.current === nowPlaying.id) return;

    const thresholdA = 30; // 30s
    const thresholdB = durationSec * 0.5; // 50% (tuỳ chọn)
    const threshold = Math.min(thresholdA, thresholdB); // chọn luật bạn muốn

    if (progressSec >= threshold) {
      scrobbledRef.current = nowPlaying.id;
      void fetch("/api/plays", {
        method: "POST",
        body: JSON.stringify({
          trackId: nowPlaying.id,
          listenedSec: Math.floor(progressSec),
          playedAt: new Date().toISOString(),
          sourceType: source?.type, // 'playlist' | 'album' | ...
          sourceId: source?.contextId ?? null,
        }),
      });
    }
  }, [
    nowPlaying?.id,
    progressSec,
    durationSec,
    source?.type,
    source?.contextId,
  ]);
}
