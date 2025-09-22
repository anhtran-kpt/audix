"use client";

import { usePlaybackStore } from "@/stores/use-playback-store";
import { useLayoutEffect } from "react";

export function PlayerOffsetSetter() {
  const session = usePlaybackStore((s) => !!s.session);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (session) {
      root.style.setProperty("--player-offset", "84px");
    } else {
      root.style.removeProperty("--player-offset");
    }
  }, [session]);

  return null;
}
