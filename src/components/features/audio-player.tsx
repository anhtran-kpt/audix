"use client";

import {
  MicVocalIcon,
  PlusCircleIcon,
  MonitorSpeakerIcon,
  Minimize2Icon,
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
import PlayerControls from "./player-controls";
import VolumeControl from "./volume-control";
import { useRightPanel } from "@/stores/use-right-panel";
import { useScrobble } from "@/hooks/use-scrobble";
import { useShallow } from "zustand/react/shallow";
import { useTrack } from "@/features/track/hooks/use-tracks";
import TrackItem from "./track-item";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/helpers/format-time";
import { Slider } from "../ui/slider";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { ProgressBar } from "../shared/progress-bar";

export default function AudioPlayer() {
  const {
    isLoading,
    session,
    setRepeatMode,
    setShuffle,
    next,
    previous,
    resume,
    pause,
  } = usePlaybackStore(
    useShallow((s) => ({
      isLoading: s.isLoading,
      session: s.session,
      setRepeatMode: s.setRepeatMode,
      setShuffle: s.setShuffle,
      next: s.next,
      previous: s.previous,
      resume: s.resume,
      pause: s.pause,
    }))
  );
  const { audioRef } = useAudioPlayer();

  // useScrobble();

  const { toggle, active } = useRightPanel(
    useShallow((s) => ({ toggle: s.toggle, active: s.active }))
  );

  console.log(session?.progressMs);

  return (
    <>
      {session && (
        <div className="fixed bottom-0 left-0 right-0 bg-player border z-60 px-4 py-2">
          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center">
              <div className="w-3xs">
                <TrackItem
                  track={session.currentTrack}
                  canHover={false}
                  imageSize="large"
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
                {/* <IconButton
                  icon={ShuffleIcon}
                  onClick={setShuffle}
                  tooltipContent={
                    isShuffled ? "Disable shuffle" : "Enable shuffle"
                  }
                  description={
                    isShuffled ? "Disable shuffle" : "Enable shuffle"
                  }
                  iconClassName={isShuffled ? "stroke-primary" : ""}
                  disabled={false}
                /> */}
                <IconButton
                  icon={SkipBackIcon}
                  onClick={previous}
                  iconClassName="fill-current"
                  tooltipContent="Previous"
                />
                <IconButton
                  icon={
                    isLoading
                      ? Loader2Icon
                      : session.isPlaying
                      ? PauseIcon
                      : PlayIcon
                  }
                  iconClassName={cn(
                    "fill-current stroke-0 size-6",
                    isLoading && "stroke-1.5 fill-none animate-spin"
                  )}
                  className="p-2.25 rounded-full bg-muted cursor-pointer"
                  tooltipContent={session.isPlaying ? "Pause" : "Resume"}
                  description="Toggle play"
                  disabled={isLoading}
                  onClick={session.isPlaying ? pause : resume}
                />
                <IconButton
                  icon={SkipForwardIcon}
                  onClick={next}
                  iconClassName="fill-current"
                  tooltipContent="Next"
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
                  // onClick={setRepeatMode}
                />
              </div>
              <ProgressBar />
              {/* <div className="flex items-center gap-4 text-sm text-muted-foreground w-full max-w-xl">
                <span className="text-xs">
                  {formatTime(session.progressMs)}
                </span>

                <Slider
                  value={[session.progressMs]}
                  onValueCommit={() => handleSeek}
                  max={session.currentTrack.duration * 1000}
                  step={1000}
                  className="flex-1"
                />

                <span className="text-xs text-right">
                  {formatTime(session.currentTrack.duration * 1000)}
                </span>
              </div> */}
              {/* <PlayerControls
                isPlaying={isPlaying}
                isLoading={isLoading}
                hasNext={false}
                hasPrev={false}
                onTogglePlay={controls.togglePlay}
                onNext={next}
                onPrevious={previous}
                repeatMode={session?.repeatMode}
                isShuffled={session?.isShuffled}
                setRepeatMode={setRepeatMode}
                setShuffle={setShuffle}
              />
              <ProgressBar
                progress={progress}
                currentTime={currentTime}
                duration={duration}
                onSeek={controls.seek}
                formatTime={formatTime}
              /> */}
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
                <IconButton icon={MicVocalIcon} tooltipContent="Lyrics" />
                <IconButton
                  icon={MonitorSpeakerIcon}
                  tooltipContent="Connect to a device"
                />
                <IconButton
                  icon={Minimize2Icon}
                  tooltipContent="Open miniplayer"
                />
                <VolumeControl
                  volume={session.volume}
                  isMuted={session.isMuted}
                  // onVolumeChange={session.s}
                  // onToggleMute={volume.toggleMute}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} preload="auto" hidden />
    </>
  );
}
