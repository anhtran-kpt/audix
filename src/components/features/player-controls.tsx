"use client";

import { Button } from "@/components/ui/button";
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
import { RepeatMode } from "@/stores/use-audio-store";
import { cn } from "@/lib/utils";

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
    <div className="space-x-6 flex items-center">
      <IconButton
        icon={ShuffleIcon}
        onClick={onToggleShuffle}
        tooltipContent={isShuffled ? "Disable shuffle" : "Enable shuffle"}
        description={isShuffled ? "Disable shuffle" : "Enable shuffle"}
        iconClassName={isShuffled ? "stroke-primary" : ""}
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
        tooltipContent="Play"
        description="Play"
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
        icon={repeatMode === "one" ? Repeat1Icon : RepeatIcon}
        iconClassName={cn(repeatMode !== "off" && "stroke-primary")}
        tooltipContent={
          repeatMode === "one"
            ? "Disable repeat"
            : repeatMode === "off"
            ? "Enable repeat"
            : "Enable repeat one"
        }
        description={
          repeatMode === "one"
            ? "Disable repeat"
            : repeatMode === "off"
            ? "Enable repeat"
            : "Enable repeat one"
        }
        onClick={onToggleRepeat}
      />
    </div>
  );
}
