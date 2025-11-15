"use client";

import {
  SkipBackIcon,
  SkipForwardIcon,
  Repeat1Icon,
  ShuffleIcon,
  Loader2Icon,
  RepeatIcon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { cn } from "@/lib/utils";
import { RepeatMode } from "@/app/generated/prisma";

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
  setRepeatMode: () => void;
  setShuffle: () => void;
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
  setRepeatMode,
  setShuffle,
}: PlayerControlsProps) {
  return (
    <div className="space-x-6 flex items-center">
      <IconButton
        icon={ShuffleIcon}
        onClick={setShuffle}
        tooltipContent={isShuffled ? "Disable shuffle" : "Enable shuffle"}
        description={isShuffled ? "Disable shuffle" : "Enable shuffle"}
        iconClassName={isShuffled ? "stroke-primary" : ""}
        disabled={false}
      />
      <IconButton
        icon={SkipBackIcon}
        onClick={onPrevious}
        disabled={!hasPrev}
        iconClassName="fill-current"
        tooltipContent="Previous"
      />
      <IconButton
        icon={isLoading ? Loader2Icon : isPlaying ? PauseIcon : PlayIcon}
        iconClassName={cn(
          "fill-current stroke-0 size-6",
          isLoading && "stroke-1.5 fill-none animate-spin"
        )}
        className="p-2.25 rounded-full bg-muted cursor-pointer"
        tooltipContent={isPlaying ? "Pause" : "Play"}
        description="Play/pause"
        disabled={isLoading}
        onClick={onTogglePlay}
      />
      <IconButton
        icon={SkipForwardIcon}
        onClick={onNext}
        disabled={!hasNext}
        iconClassName="fill-current"
        tooltipContent="Next"
      />
      <IconButton
        icon={repeatMode === "ONE" ? Repeat1Icon : RepeatIcon}
        iconClassName={cn(repeatMode !== "OFF" && "stroke-primary")}
        tooltipContent={
          repeatMode === "ONE"
            ? "Disable repeat"
            : repeatMode === "OFF"
            ? "Enable repeat"
            : "Enable repeat one"
        }
        description={
          repeatMode === "ONE"
            ? "Disable repeat"
            : repeatMode === "OFF"
            ? "Enable repeat"
            : "Enable repeat one"
        }
        onClick={setRepeatMode}
      />
    </div>
  );
}
