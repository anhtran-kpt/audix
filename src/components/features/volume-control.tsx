"use client";

import { Slider } from "@/components/ui/slider";
import { Volume2Icon, VolumeXIcon, Volume1Icon } from "lucide-react";
import { IconButton } from "../ui/icon-button";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export default function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeXIcon;
    if (volume < 0.5) return Volume1Icon;
    return Volume2Icon;
  };

  const VolumeIcon = getVolumeIcon();

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0] / 100);
  };

  return (
    <div className="min-w-0 flex-shrink-0 flex items-center gap-2">
      <IconButton
        icon={VolumeIcon}
        onClick={onToggleMute}
        tooltipContent={isMuted ? "Unmute" : "Mute"}
      />
      <Slider
        value={[isMuted ? 0 : volume * 100]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="w-20"
      />
    </div>
  );
}
