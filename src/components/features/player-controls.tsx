"use client";

import { Button } from "@/components/ui/button";
import {
  SkipBackIcon,
  SkipForwardIcon,
  Repeat1Icon,
  ShuffleIcon,
  Loader2Icon,
  CirclePlayIcon,
  CirclePauseIcon,
  RepeatIcon,
} from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { usePlayerStore } from "@/stores/use-player-store";

export default function PlayerControls() {
  const {
    isPlaying,
    isLoading,
    isShuffled,
    repeatMode,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  return (
    <div className="space-x-3 flex items-center">
      <Button
        variant={isShuffled ? "default" : "ghost"}
        size="sm"
        onClick={toggleShuffle}
      >
        <ShuffleIcon className="size-4" />
      </Button>
      <IconButton
        icon={SkipBackIcon}
        onClick={previousTrack}
        // disabled={!hasPrev}
        iconClassName="fill-current"
        tooltipContent="Previous"
      />
      <Button
        variant="ghost"
        size="icon"
        className=""
        onClick={togglePlay}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2Icon className="size-9 animate-spin" />
        ) : isPlaying ? (
          <CirclePauseIcon className="size-9 stroke-1" />
        ) : (
          <CirclePlayIcon className="size-9 stroke-1" />
        )}
      </Button>
      <IconButton
        icon={SkipForwardIcon}
        onClick={nextTrack}
        // disabled={!hasNext}
        iconClassName="fill-current"
        tooltipContent="Next"
      />
      <Button
        variant={repeatMode !== "off" ? "default" : "ghost"}
        size="sm"
        onClick={toggleRepeat}
      >
        {repeatMode === "one" ? (
          <Repeat1Icon className="size-4" />
        ) : repeatMode === "all" ? (
          <RepeatIcon className="size-4" />
        ) : (
          <RepeatIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
