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
import { RepeatMode, useAudioStore } from "@/stores/use-audio-store";

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
}

export default function PlayerControls({
  isPlaying,
  isLoading,
  hasNext,
  hasPrev,
  repeatMode,
  isShuffled,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleRepeat,
  onToggleShuffle,
}: PlayerControlsProps) {
  return (
    <div className="space-x-3 flex items-center">
      <Button
        variant={isShuffled ? "default" : "ghost"}
        size="sm"
        onClick={onToggleShuffle}
      >
        <ShuffleIcon className="size-4" />
      </Button>
      <IconButton
        icon={SkipBackIcon}
        onClick={onPrevious}
        disabled={!hasPrev}
        iconClassName="fill-current"
        tooltipContent="Previous"
      />
      <Button
        variant="ghost"
        size="icon"
        className=""
        onClick={onTogglePlay}
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
        onClick={onNext}
        disabled={!hasNext}
        iconClassName="fill-current"
        tooltipContent="Next"
      />
      <Button
        variant={repeatMode !== "off" ? "default" : "ghost"}
        size="sm"
        onClick={onToggleRepeat}
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
