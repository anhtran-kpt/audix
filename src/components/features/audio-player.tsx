"use client";

import {
  MicVocalIcon,
  PlusCircleIcon,
  MonitorSpeakerIcon,
  Minimize2Icon,
  SquarePlayIcon,
  ListMusicIcon,
} from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { NavLink } from "../ui/nav-link";
import Explicit from "../ui/explicit";
import { ItemTitle } from "../ui/item-title";
import { CoverImage } from "../ui/cover-image";
import PlayerControls from "./player-controls";
import VolumeControl from "./volume-control";
import ProgressBar from "./progress-bar";
import {
  useAudioKeyboardShortcuts,
  useAudioPlayer,
  useNowPlayingRefId,
} from "@/hooks/use-audio-player";
import { useRightPanel } from "@/stores/use-right-panel";
import { useScrobble } from "@/hooks/use-scrobble";
import { useShallow } from "zustand/react/shallow";
import { useTrack } from "@/features/track/hooks/use-tracks";
import TrackItem from "./track-item";

function AudioPlayer() {
  const {
    audioRef,
    playback,
    progress,
    controls,
    formatTime,
    queue,
    modes,
    volume,
  } = useAudioPlayer();

  const nowPlayingRefId = useNowPlayingRefId();

  const { data: nowPlayingTrack } = useTrack(nowPlayingRefId);

  useAudioKeyboardShortcuts();

  useScrobble();

  const { toggle, active } = useRightPanel(
    useShallow((s) => ({ toggle: s.toggle, active: s.active }))
  );

  return (
    <>
      {nowPlayingTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-player border z-60 px-4 py-2">
          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center">
              <div className="w-3xs">
                <TrackItem
                  track={nowPlayingTrack}
                  canHover={false}
                  coverSize="lg"
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
              <PlayerControls
                isPlaying={playback.isPlaying}
                isLoading={playback.isLoading}
                hasNext={queue.hasNext}
                hasPrev={queue.hasPrev}
                onTogglePlay={controls.togglePlay}
                onNext={controls.next}
                onPrevious={controls.previous}
                repeatMode={modes.repeatMode}
                isShuffled={modes.isShuffled}
                onToggleRepeat={modes.toggleRepeat}
                onToggleShuffle={modes.toggleShuffle}
              />
              <ProgressBar
                progress={progress}
                currentTime={playback.currentTime}
                duration={playback.duration}
                onSeek={controls.seek}
                formatTime={formatTime}
              />
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
                  volume={volume.volume}
                  isMuted={volume.isMuted}
                  onVolumeChange={volume.setVolume}
                  onToggleMute={volume.toggleMute}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} preload="metadata" />
    </>
  );
}

export default AudioPlayer;
