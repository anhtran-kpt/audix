"use client";

import { useEffect, useRef, useState } from "react";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { PROGRESS_UPDATE_INTERVAL } from "@/lib/constants";

export function useProgress(audioRef: React.RefObject<HTMLAudioElement>) {
  const session = usePlaybackStore((s) => s.session);
  const isPlaying = usePlaybackStore((s) => s.isPlaying());
  const baseProgress = usePlaybackStore((s) => s.getProgressMs());

  const [progress, setProgress] = useState(baseProgress);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    setProgress(baseProgress);
    lastUpdateRef.current = Date.now();

    if (!isPlaying) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = () => {
      if (audioRef?.current) {
        setProgress(audioRef.current.currentTime * 1000);
      } else {
        const now = Date.now();
        const elapsed = now - lastUpdateRef.current;
        lastUpdateRef.current = now;
        setProgress((prev) => prev + elapsed);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, baseProgress, session?.id, audioRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioRef?.current) {
        setProgress(usePlaybackStore.getState().getProgressMs());
      }
    }, PROGRESS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [audioRef]);

  return progress;
}
