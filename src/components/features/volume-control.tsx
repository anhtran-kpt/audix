"use client";

import { Slider } from "@/components/ui/slider";
import { Volume2Icon, VolumeXIcon, Volume1Icon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { usePlayerStore } from "@/stores/use-player-store";

export default function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeXIcon;
    if (volume < 0.5) return Volume1Icon;
    return Volume2Icon;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="min-w-0 flex-shrink-0 flex items-center gap-2">
      <IconButton
        icon={VolumeIcon}
        onClick={toggleMute}
        tooltipContent={<>{isMuted ? "Unmute" : "Mute"}</>}
      />
      <Slider
        value={[isMuted ? 0 : volume * 100]}
        onValueChange={(value: number[]) => setVolume(value[0] / 100)}
        max={100}
        step={1}
        className="w-20"
      />
    </div>
  );
}
