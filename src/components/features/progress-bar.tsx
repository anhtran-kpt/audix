"use client";

import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useProgress } from "@/hooks/use-progress";
import { formatTime } from "@/lib/helpers/format-time";
import { usePlaybackStore } from "@/stores/use-playback-store";

export const ProgressBar = () => {
  const session = usePlaybackStore((s) => s.session);
  const { audio, controls } = useAudioPlayer();

  const progress = useProgress({
    updateInterval: 1000,
    audioRef: { current: audio },
  });

  if (!session?.currentTrack?.durationMs) return null;

  const duration = session.currentTrack.durationMs;

  const handleSeek = (value: number[]) => {
    const newTimeMs = value[0];
    controls.seek(newTimeMs);
  };

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground w-full max-w-xl">
      <span className="text-xs">{formatTime(progress)}</span>

      <Slider
        value={[progress]}
        onValueCommit={handleSeek}
        max={duration}
        step={1000}
        className="flex-1"
      />

      <span className="text-xs text-right">{formatTime(duration)}</span>
    </div>
  );
};
