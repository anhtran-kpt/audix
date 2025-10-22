"use client";

import { Slider } from "@/components/ui/slider";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { formatTime } from "@/utils/date";
import { cn } from "@/lib/utils";

type AudioProgressBarProps = {
  containerClassName?: string;
  sliderClassName?: string;
};

export const AudioProgressBar = ({
  sliderClassName,
  containerClassName,
}: AudioProgressBarProps) => {
  const { duration, seek, progressMs } = usePlaybackStore(
    useShallow((s) => ({
      duration: s.session?.currentTrack.duration ?? 0,
      seek: s.seek,
      progressMs: s.progressMs,
    }))
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(progressMs);

  const currentValue = isDragging ? dragValue : progressMs;

  return (
    <div
      className={cn(
        "flex items-center sm:gap-3 text-xs text-muted-foreground grow sm:w-full sm:max-w-xl",
        containerClassName
      )}
    >
      <span className="text-right w-6 max-sm:hidden">
        {formatTime(currentValue)}
      </span>

      <Slider
        value={[currentValue]}
        min={0}
        max={duration * 1000}
        step={1000}
        className={cn("flex-1", sliderClassName)}
        onValueChange={(value) => {
          setIsDragging(true);
          setDragValue(value[0]);
        }}
        onValueCommit={(value) => {
          const positionMs = value[0];
          setIsDragging(false);
          seek(positionMs);
        }}
      />

      <span className="text-left w-6 max-sm:hidden">
        {formatTime(duration * 1000)}
      </span>
    </div>
  );
};
