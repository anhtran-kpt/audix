"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ToggleLikeTrackButton } from "./toggle-like-track-button";
import { TrackItem } from "@/features/track/track-types";
import { useTrackLikeState } from "@/features/shared/hooks/use-track-like-state";

export function TrackLikeCell({ track }: { track: TrackItem }) {
  const isLiked = useTrackLikeState(track.id);

  return (
    <div
      className={cn(
        "flex justify-end items-center",
        "select-none opacity-0 sm:group-hover/table-row:select-auto sm:group-hover/table-row:opacity-100",
        isLiked && "select-auto opacity-100"
      )}
    >
      <ToggleLikeTrackButton track={track} />
    </div>
  );
}
