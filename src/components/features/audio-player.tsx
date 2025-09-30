"use client";

import {
  PlusCircleIcon,
  SquarePlayIcon,
  ListMusicIcon,
  ShuffleIcon,
  SkipBackIcon,
  Loader2Icon,
  PauseIcon,
  PlayIcon,
  SkipForwardIcon,
  Repeat1Icon,
  RepeatIcon,
} from "lucide-react";
import { IconButton } from "../ui/icon-button";
import VolumeControl from "./volume-control";
import { useRightPanel } from "@/stores/use-right-panel";
import { useShallow } from "zustand/react/shallow";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { ProgressBar } from "../shared/progress-bar";
import { TrackItemCompact } from "../shared/track-item-compact";

export default function AudioPlayer() {
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
  const { audioRef } = useAudioPlayer();

  // useScrobble();

  const { toggle, active } = useRightPanel(
    useShallow((s) => ({ toggle: s.toggle, active: s.active }))
  );

  console.log(session);

  return (
    <>
      {currentTrack && session && (
        <div className="fixed bottom-0 left-0 right-0 bg-player border z-60 px-4 py-2">
          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center">
              <div className="w-3xs">
                <TrackItemCompact
                  track={{
                    ...currentTrack,
                    artists: currentTrack.artists.map((item) => item.artist),
                  }}
                  canHover={false}
                  hasMoreDetails={false}
                />
              </div>
              <IconButton
                className="ml-6"
                icon={PlusCircleIcon}
                tooltipContent={
                  <>
                    Add to <strong>Liked Songs</strong>
                  </>
                }
              />
            </div>
            <div className="flex flex-col space-y-2 items-center grow">
              <div className="space-x-6 flex items-center">
                <IconButton
                  icon={ShuffleIcon}
                  onClick={toggleShuffle}
                  tooltipContent={
                    session.isShuffled ? "Disable shuffle" : "Enable shuffle"
                  }
                  description={
                    session.isShuffled ? "Disable shuffle" : "Enable shuffle"
                  }
                  iconClassName={session.isShuffled ? "stroke-primary" : ""}
                  disabled={false}
                />
                <IconButton
                  icon={SkipBackIcon}
                  onClick={previous}
                  iconClassName="fill-current"
                  tooltipContent="Previous"
                  disabled={!hasPrevious}
                />
                <IconButton
                  icon={
                    isLoading ? Loader2Icon : isPlaying ? PauseIcon : PlayIcon
                  }
                  iconClassName={cn(
                    "fill-current stroke-0 size-6",
                    isLoading && "stroke-1.5 fill-none animate-spin"
                  )}
                  className="p-2.25 rounded-full bg-muted cursor-pointer"
                  tooltipContent={isPlaying ? "Pause" : "Resume"}
                  description="Toggle play"
                  disabled={isLoading}
                  onClick={isPlaying ? pause : resume}
                />
                <IconButton
                  icon={SkipForwardIcon}
                  onClick={next}
                  iconClassName="fill-current"
                  tooltipContent="Next"
                  disabled={!hasNext}
                />
                <IconButton
                  icon={session.repeatMode === "ONE" ? Repeat1Icon : RepeatIcon}
                  iconClassName={cn(
                    session.repeatMode !== "OFF" && "stroke-primary"
                  )}
                  tooltipContent={
                    session.repeatMode === "ONE"
                      ? "Disable repeat"
                      : session.repeatMode === "OFF"
                      ? "Enable repeat"
                      : "Enable repeat one"
                  }
                  description={
                    session.repeatMode === "ONE"
                      ? "Disable repeat"
                      : session.repeatMode === "OFF"
                      ? "Enable repeat"
                      : "Enable repeat one"
                  }
                  onClick={() => cycleRepeatMode(session.repeatMode)}
                />
              </div>
              <ProgressBar />
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-5">
                <IconButton
                  icon={SquarePlayIcon}
                  tooltipContent={
                    active === "now-playing" ? (
                      <>
                        Hide <strong>Now Playing View</strong>
                      </>
                    ) : (
                      <>
                        Open <strong>Now Playing View</strong>
                      </>
                    )
                  }
                  onClick={() => toggle("now-playing")}
                  iconClassName={active === "now-playing" ? "text-primary" : ""}
                />
                <IconButton
                  icon={ListMusicIcon}
                  tooltipContent={
                    active === "queue" ? (
                      <>
                        Hide <strong>Queue</strong>
                      </>
                    ) : (
                      <>
                        Open <strong>Queue</strong>
                      </>
                    )
                  }
                  onClick={() => toggle("queue")}
                  iconClassName={active === "queue" ? "text-primary" : ""}
                />
                <VolumeControl />
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} preload="auto" hidden />
    </>
  );
}
