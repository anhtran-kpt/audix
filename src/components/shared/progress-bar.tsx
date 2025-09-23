"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { formatTime } from "@/lib/helpers/format-time";

export function ProgressBar() {
  const session = usePlaybackStore((s) => s.session);
  const seek = usePlaybackStore((s) => s.seek);

  const [localValue, setLocalValue] = useState<number | null>(null);

  const currentValue = localValue ?? session?.progressMs ?? 0;

  if (!session?.currentTrack) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground w-full max-w-xl">
      <span className="w-10 text-right">{formatTime(currentValue)}</span>

      <Slider
        value={[currentValue]}
        min={0}
        max={session.currentTrack.duration * 1000}
        className="flex-1"
        onValueChange={(value) => setLocalValue(value[0])}
        onValueCommit={(value) => {
          const positionMs = value[0];
          seek(positionMs);
          setLocalValue(null);
        }}
      />

      <span className="w-10 text-left">
        {formatTime(session.currentTrack.duration * 1000)}
      </span>
    </div>
  );
}
