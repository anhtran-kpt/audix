"use client";

import {
  MicVocalIcon,
  PlusCircleIcon,
  MonitorSpeakerIcon,
  Minimize2Icon,
  SquarePlayIcon,
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
  useCurrentTrack,
  useMediaSession,
} from "@/hooks/use-audio-player";
import { useNowPlayingPanel } from "@/stores/use-now-playing-panel";

function AudioPlayer() {
  const currentTrack = useCurrentTrack();
  const {
    audioRef,
    playback,
    progress,
    controls,
    formatTime,
    hasNext,
    hasPrev,
    modes,
    volume,
  } = useAudioPlayer();
  useMediaSession();
  useAudioKeyboardShortcuts();
  const isOpen = useNowPlayingPanel((s) => s.isOpen);
  const toggle = useNowPlayingPanel((s) => s.toggle);

  return (
    <>
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-player border z-60 px-4 py-2">
          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center">
              <div className="flex items-center gap-3 grow">
                <CoverImage
                  src={currentTrack.album.imageId}
                  alt={currentTrack.title}
                  size="sm"
                />
                <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                  <ItemTitle title={currentTrack.title} />
                  <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
                    {currentTrack.isExplicit && <Explicit />}
                    {currentTrack.artists.map(
                      ({ artist }, index, originalArr) => (
                        <span key={artist.id}>
                          <NavLink href={`/artists/${artist.id}`}>
                            {artist.name}
                          </NavLink>
                          {index < originalArr.length - 1 && ", "}
                        </span>
                      )
                    )}
                  </div>
                </div>
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
                hasNext={hasNext}
                hasPrev={hasPrev}
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
                    isOpen ? "Hide now playing view" : "Open now playing view"
                  }
                  onClick={toggle}
                  iconClassName={isOpen ? "text-primary" : ""}
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
