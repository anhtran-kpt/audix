"use client";

import { useNowPlayingId } from "@/hooks/use-audio-player";
import { useLayoutEffect } from "react";

export function PlayerOffsetSetter() {
  const nowPlayingId = useNowPlayingId();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (nowPlayingId) {
      root.style.setProperty("--player-offset", "84px");
    } else {
      root.style.removeProperty("--player-offset");
    }
  }, [nowPlayingId]);

  return null;
}
