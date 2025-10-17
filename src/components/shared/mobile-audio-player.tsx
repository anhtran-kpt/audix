"use client";

import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useShallow } from "zustand/react/shallow";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { TrackItemCompact } from "../shared/track-item-compact";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function MobileAudioPlayer() {
  const {
    session,
    resume,
    pause,
    isLoading,
    currentTrack,
    isPlaying,
    seek,
    duration,
    progressMs,
  } = usePlaybackStore(
    useShallow((s) => ({
      session: s.session,
      toggleShuffle: s.toggleShuffle,
      next: s.next,
      previous: s.previous,
      resume: s.resume,
      pause: s.pause,
      isLoading: s.isLoading,
      currentTrack: s.session?.currentTrack,
      isPlaying: s.isPlaying,
      duration: s.session?.currentTrack.duration ?? 0,
      seek: s.seek,
      progressMs: s.progressMs,
    }))
  );
  const { audioRef } = useAudioPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(progressMs);

  const currentValue = isDragging ? dragValue : progressMs;

  return (
    <>
      {currentTrack && session && (
        <div className="sm:hidden fixed bottom-15 left-0 right-0 bg-player border z-60 px-4 py-2">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center justify-between grow gap-4">
              <TrackItemCompact
                track={currentTrack}
                canHover={false}
                hasMoreDetails={false}
              />
              <IconButton
                icon={
                  isLoading ? Loader2Icon : isPlaying ? PauseIcon : PlayIcon
                }
                iconClassName={cn(
                  "fill-current stroke-0 size-6",
                  isLoading && "stroke-1.5 fill-none animate-spin"
                )}
                tooltipContent={isPlaying ? "Pause" : "Resume"}
                description="Toggle play"
                disabled={isLoading}
                onClick={isPlaying ? pause : resume}
              />
            </div>
          </div>
          <Slider
            value={[currentValue]}
            min={0}
            max={duration * 1000}
            step={1000}
            className="flex-1 absolute bottom-0 left-0 right-0"
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
        </div>
      )}
      <audio ref={audioRef} preload="auto" hidden />
    </>
  );
}
