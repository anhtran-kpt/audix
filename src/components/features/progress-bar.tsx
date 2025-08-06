"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
  className?: string;
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
  formatTime,
  className,
}: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    onSeek(newTime);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 text-sm text-muted-foreground",
        className
      )}
    >
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
