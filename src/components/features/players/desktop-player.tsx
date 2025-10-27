"use client";

import {
  SquarePlayIcon,
  ShuffleIcon,
  SkipBackIcon,
  Loader2Icon,
  PauseIcon,
  PlayIcon,
  SkipForwardIcon,
  Repeat1Icon,
  RepeatIcon,
} from "lucide-react";
import VolumeControl from "../volume-control";
import { useRightPanel } from "@/stores/use-right-panel";
import { useShallow } from "zustand/react/shallow";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { cn } from "@/lib/utils";
import { AudioProgressBar } from "../../shared/audio-progress-bar";
import { TrackItemCompact } from "../../shared/track-item-compact";
import { ToggleLikeTrackButton } from "../toggle-like-track-button";
import { Button } from "@/components/ui/button";
import { QueueIcon } from "@/components/ui/queue-icon";

export const DesktopPlayer = () => {
  const {
    session,
    toggleShuffle,
    next,
    previous,
    resume,
    pause,
    isLoading,
    currentTrack,
    isPlaying,
    hasPrevious,
    hasNext,
    cycleRepeatMode,
  } = usePlaybackStore(
    useShallow((s) => ({
      session: s.session,
      toggleShuffle: s.toggleShuffle,
      next: s.next,
      previous: s.previous,
      resume: s.resume,
      pause: s.pause,
      hasPrevious: s.session?.hasPrevious,
      hasNext: s.session?.hasNext,
      isLoading: s.isLoading,
      currentTrack: s.session?.currentTrack,
      isPlaying: s.isPlaying,
      cycleRepeatMode: s.cycleRepeatMode,
    }))
  );

  const { toggle, active } = useRightPanel(
    useShallow((s) => ({ toggle: s.toggle, active: s.active }))
  );

  if (!currentTrack || !session) {
    return null;
  }

  return (
    <div className="max-sm:hidden fixed bottom-0 left-0 right-0 bg-player border z-60 px-4 py-2">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center">
          <div className="w-fit lg:w-56 xl:w-64">
            <TrackItemCompact
              track={currentTrack}
              canHover={false}
              hasMoreDetails={false}
            />
          </div>
          <ToggleLikeTrackButton track={currentTrack} />
        </div>
        <div className="flex flex-col space-y-2 items-center grow">
          <div className="flex items-center gap-x-5 xl:gap-x-6">
            <Button variant="ghost" size="icon" onClick={toggleShuffle}>
              <ShuffleIcon
                className={cn("size-5", session.isShuffled && "stroke-primary")}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={previous}
              disabled={!hasPrevious}
            >
              <SkipBackIcon
                className={cn(
                  "size-5 fill-current",
                  session.isShuffled && "stroke-primary"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="p-2.25 rounded-full bg-muted cursor-pointer"
              disabled={isLoading}
              onClick={isPlaying ? pause : resume}
            >
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : isPlaying ? (
                <PauseIcon className="size-6 fill-current stroke-0" />
              ) : (
                <PlayIcon className="size-6 fill-current stroke-0" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              disabled={!hasNext}
            >
              <SkipForwardIcon
                className={cn(
                  "size-5 fill-current",
                  session.isShuffled && "stroke-primary"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cycleRepeatMode(session.repeatMode)}
            >
              {session.repeatMode === "ONE" ? (
                <Repeat1Icon className={cn("size-5", "stroke-primary")} />
              ) : (
                <RepeatIcon
                  className={cn(
                    "size-5",
                    session.repeatMode !== "OFF" && "stroke-primary"
                  )}
                />
              )}
            </Button>
          </div>
          <AudioProgressBar />
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-x-3 lg:gap-x-4 xl:gap-x-5">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => toggle("now-playing")}
            >
              <SquarePlayIcon
                className={cn(
                  "size-5",
                  active === "now-playing" && "stroke-primary"
                )}
              />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggle("queue")}>
              <QueueIcon
                className={cn("size-5", active === "queue" && "fill-primary")}
              />
            </Button>
            <VolumeControl />
          </div>
        </div>
      </div>
    </div>
  );
};
