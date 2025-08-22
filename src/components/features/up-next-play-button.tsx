import { PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import {
  useIsPlaying,
  useNowPlayingId,
  useQueue,
} from "@/hooks/use-audio-player";
import { zCuidType } from "@/contracts/common";

type UpNextPlayButtonProps = {
  trackId: zCuidType;
  trackIndex: number;
};

export default function UpNextPlayButton({
  trackId,
  trackIndex,
}: UpNextPlayButtonProps) {
  const nowPlayingId = useNowPlayingId();
  const isPlaying = useIsPlaying();
  const { skipToUpNextIndex } = useQueue();

  return (
    <IconButton
      icon={isPlaying && nowPlayingId === trackId ? PauseIcon : PlayIcon}
      size="sm"
      onClick={() => skipToUpNextIndex(trackIndex)}
      iconClassName="fill-foreground stroke-0 size-5"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
    />
  );
}
