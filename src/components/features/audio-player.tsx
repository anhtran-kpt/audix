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
import PlayerControls from "./player-controls";
import VolumeControl from "./volume-control";
import { useRightPanel } from "@/stores/use-right-panel";
import { useScrobble } from "@/hooks/use-scrobble";
import { useShallow } from "zustand/react/shallow";
import { useTrack } from "@/features/track/hooks/use-tracks";
import TrackItem from "./track-item";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { ProgressBar } from "./progress-bar";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export default function AudioPlayer() {
  const { isLoading, session, setRepeatMode, setShuffle, next, previous } =
    usePlaybackStore();
  const { audioRef } = useAudioPlayer();

  const { data: currentTrack } = useTrack(session?.currentTrackId);

  // useScrobble();

  const { toggle, active } = useRightPanel(
    useShallow((s) => ({ toggle: s.toggle, active: s.active }))
  );

  return (
    <>
      {session && currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-player border z-60 px-4 py-2">
          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center">
              <div className="w-3xs">
                <TrackItem
                  track={currentTrack}
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
              <PlayerControls
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
              />
            </div>
            {/* <div className="flex items-center">
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
            </div> */}
          </div>
        </div>
      )}
      <audio ref={audioRef} preload="metadata" />
    </>
  );
}
