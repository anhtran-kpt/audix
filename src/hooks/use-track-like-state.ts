"use client";

import { useBaseUserOverlay } from "@/hooks/use-base-user-overlay";

export function useTrackLikeState(trackId: string) {
  const { map } = useBaseUserOverlay("tracks");
  const isLiked = !!map[trackId];

  return isLiked;
}
