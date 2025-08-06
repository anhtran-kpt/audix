"use client";

import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/use-player-store";
import { Thumb, Track, Range } from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

export default function ProgressBar() {
  const { currentTime, duration, seekTo } = usePlayerStore();
  const [value, setValue] = useState<number[]>([0]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setValue([currentTime]);
    }
  }, [currentTime, isDragging]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground w-full max-w-lg">
      <span className="text-xs">{formatTime(value[0])}</span>
      <Slider
        className="flex-1"
        min={0}
        max={duration || 0}
        step={0.01}
        value={value}
        onValueChange={(val) => {
          setIsDragging(true);
          setValue(val);
        }}
        onValueCommit={(val) => {
          seekTo(val[0]);
          setIsDragging(false);
        }}
      >
        <Track className="bg-gray-200 h-1 rounded-full">
          <Range className="bg-gray-400 h-full rounded-full group-hover:bg-green-500 transition-colors" />
        </Track>
        <Thumb
          className={`
            w-3 h-3 bg-white border-2 border-gray-400 rounded-full 
            transition-all
            ${
              isDragging
                ? "opacity-100 scale-110"
                : "opacity-0 group-hover:opacity-100"
            }
          `}
        />
      </Slider>
      <span className="text-xs text-right">{formatTime(duration)}</span>
    </div>
  );
}
