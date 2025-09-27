"use client";

import { Slider } from "@/components/ui/slider";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { formatTime } from "@/lib/helpers/format-time";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";

export function ProgressBar() {
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
    <div className="flex items-center gap-3 text-xs text-muted-foreground w-full max-w-xl">
      <span className="w-10 text-right">{formatTime(currentValue)}</span>

      <Slider
        value={[currentValue]}
        min={0}
        max={duration * 1000}
        step={1000}
        className="flex-1"
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

      <span className="w-10 text-left">{formatTime(duration * 1000)}</span>
    </div>
  );
}
