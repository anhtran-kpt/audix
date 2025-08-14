"use client";

import { useLayoutEffect } from "react";
import { useCurrentTrack } from "@/hooks/use-audio-player";

export function PlayerOffsetSetter() {
  const track = useCurrentTrack();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (track) {
      root.style.setProperty("--player-offset", "84px");
    } else {
      root.style.removeProperty("--player-offset");
    }
  }, [track]);

  return null;
}
