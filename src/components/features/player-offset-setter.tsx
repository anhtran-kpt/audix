"use client";

import { usenowPlayingRefId } from "@/hooks/use-audio-player";
import { useLayoutEffect } from "react";

export function PlayerOffsetSetter() {
  const nowPlayingRefId = usenowPlayingRefId();

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
