"use client";

import { Slider } from "@/components/ui/slider";
import { Volume2Icon, VolumeXIcon, Volume1Icon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useShallow } from "zustand/react/shallow";
import { PlaybackSession } from "@/features/playback/contracts/playback-dto";

export default function VolumeControl() {
  const { session, toggleMute } = usePlaybackStore(
    useShallow((s) => ({
      session: s.session,
      toggleMute: s.toggleMute,
    }))
  );

  if (!session) {
    return null;
  }

  const getVolumeIcon = (session: PlaybackSession) => {
    if (session.isMuted || session.volume === 0) return VolumeXIcon;
    if (session.volume < 0.5) return Volume1Icon;
    return Volume2Icon;
  };

  const VolumeIcon = getVolumeIcon(session);

  // const handleVolumeChange = (value: number[]) => {
  //   onVolumeChange(value[0] / 100);
  // };

  return (
    <div className="min-w-0 flex-shrink-0 flex items-center gap-2">
      <IconButton
        icon={VolumeIcon}
        onClick={() => toggleMute(!session.isMuted)}
        tooltipContent={session.isMuted ? "Unmute" : "Mute"}
      />
      <Slider
        value={[session.isMuted ? 0 : session.volume * 100]}
        // onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="w-20"
      />
    </div>
  );
}
