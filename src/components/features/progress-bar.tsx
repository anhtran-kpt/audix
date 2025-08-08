"use client";

import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/stores/use-audio-store";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
  progress: number;
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
  formatTime,
  progress,
}: ProgressBarProps) {
  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    onSeek(newTime);
  };

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground w-full max-w-lg">
      <span className="text-xs">{formatTime(currentTime)}</span>
      <Slider
        value={[progress]}
        onValueChange={handleSeek}
        max={100}
        step={0.1}
        className="flex-1"
      />
      <span className="text-xs text-right">{formatTime(duration)}</span>
    </div>
  );
}
