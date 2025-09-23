"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { formatTime } from "@/lib/helpers/format-time";

export function ProgressBar() {
  // select only the pieces we need (keeps rerenders reasonable)
  const session = usePlaybackStore((s) => s.session);
  const seek = usePlaybackStore((s) => s.seek);

  const [localValue, setLocalValue] = useState<number | null>(null);

  // compute effective progress (ms)
  function computeEffectiveProgress(): number {
    if (localValue != null) return localValue;
    if (!session) return 0;
    if (!session.isPlaying || !session.lastPositionUpdatedAt) {
      return session.progressMs;
    }
    const elapsed =
      Date.now() - new Date(session.lastPositionUpdatedAt).getTime();
    return session.progressMs + elapsed;
  }

  const currentValue = computeEffectiveProgress();

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
          // call seek action — store will set local-seek marker and hook will apply to audio
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
