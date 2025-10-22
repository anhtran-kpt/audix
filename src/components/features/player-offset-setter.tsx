"use client";

import { usePlaybackStore } from "@/stores/use-playback-store";
import { useLayoutEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

export function PlayerOffsetSetter() {
  const session = usePlaybackStore((s) => !!s.session);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (session) {
      root.style.setProperty("--player-offset", isMobile ? "128px" : "84px");
    } else {
      root.style.removeProperty("--player-offset");
    }
  }, [session, isMobile]);

  return null;
}
