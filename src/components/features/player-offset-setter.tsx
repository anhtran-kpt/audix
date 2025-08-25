"use client";

import { useNowPlayingRefId } from "@/hooks/use-audio-player";
import { useLayoutEffect } from "react";

export function PlayerOffsetSetter() {
  const nowPlayingRefId = useNowPlayingRefId();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (nowPlayingRefId) {
      root.style.setProperty("--player-offset", "84px");
    } else {
      root.style.removeProperty("--player-offset");
    }
  }, [nowPlayingRefId]);

  return null;
}
