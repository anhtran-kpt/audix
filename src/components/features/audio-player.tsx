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
import {
  useAudioKeyboardShortcuts,
  useMediaSession,
  useAudioPlayer,
} from "@/hooks/use-audio-player";
import { IconButton } from "../ui/icon-button";
import { NavLink } from "../ui/nav-link";
import Explicit from "../ui/explicit";
import { ItemTitle } from "../ui/item-title";
import { CoverImage } from "../ui/cover-image";
import PlayerControls from "./player-controls";
import VolumeControl from "./volume-control";
import ProgressBar from "./progress-bar";

function AudioPlayer() {
  const player = useAudioPlayer();

  useMediaSession();
  useAudioKeyboardShortcuts();

  if (!player.currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-accent z-50 px-4 py-2">
      <div className="flex items-center justify-between gap-12">
        <div className="flex items-center">
          <div className="flex items-center gap-3 grow min-w-0">
            <CoverImage
              src={player.currentTrack.album.coverPublicId}
              alt={player.currentTrack.title}
            />
            <div className="flex flex-col gap-0.5 w-full overflow-hidden">
              <ItemTitle title={player.currentTrack.title} />
              <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
                {player.currentTrack.isExplicit && <Explicit />}
                {player.currentTrack.artists.map(
                  (artist, index, originalArr) => (
                    <span key={artist.slug}>
                      <NavLink href={`/artists/${artist.slug}`}>
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
            isPlaying={player.playback.isPlaying}
            isLoading={player.playback.isLoading}
            hasNext={player.hasNext}
            hasPrev={player.hasPrev}
            onTogglePlay={player.controls.togglePlay}
            onNext={player.controls.next}
            onPrevious={player.controls.previous}
            repeatMode={player.modes.repeatMode}
            isShuffled={player.modes.isShuffled}
            onToggleRepeat={player.modes.toggleRepeat}
            onToggleShuffle={player.modes.toggleShuffle}
          />
          <ProgressBar
            currentTime={player.playback.currentTime}
            duration={player.playback.duration}
            onSeek={player.controls.seek}
            formatTime={player.formatTime}
            className="w-full max-w-lg"
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
              volume={player.volume.volume}
              isMuted={player.volume.isMuted}
              onVolumeChange={player.volume.setVolume}
              onToggleMute={player.volume.toggleMute}
            />
            <Separator orientation="vertical" className="w-1 h-full" />
            <Button variant="ghost" size="icon" className="">
              <ListMusicIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
