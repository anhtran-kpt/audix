"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  SquarePlayIcon,
  MicVocalIcon,
  ListMusicIcon,
  CastIcon,
  PlusCircleIcon,
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

  return (
    <>
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-accent z-50 px-4 py-2">
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
            <div className="flex flex-col space-y-4 items-center grow">
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
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="">
                  <SquarePlayIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="">
                  <MicVocalIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="">
                  <CastIcon className="size-4" />
                </Button>
                <VolumeControl
                  volume={volume.volume}
                  isMuted={volume.isMuted}
                  onVolumeChange={volume.setVolume}
                  onToggleMute={volume.toggleMute}
                />
                <Separator orientation="vertical" className="w-1 h-full" />
                <Button variant="ghost" size="icon" className="">
                  <ListMusicIcon className="size-4" />
                </Button>
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
