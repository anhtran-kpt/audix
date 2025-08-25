"use client";

import { useAudioStore } from "@/stores/use-audio-store";
import { postApi } from "@/lib/http/request";
import {} from "@/contracts/playback";
import { IconButton } from "../ui/icon-button";
import { useIsPlaying, useNowPlayingRefId } from "@/hooks/use-audio-player";
import { PauseIcon, PlayIcon } from "lucide-react";
import { zCuidType } from "@/contracts/common";

export function RecentlyPlayedPlayButton({ trackId }: { trackId: zCuidType }) {
  const isPlaying = useIsPlaying();
  const nowPlayingRefId = useNowPlayingRefId();
  const isThisTrack = nowPlayingRefId === trackId;

  const { startFromContext, clearExplicit } = useAudioStore((s) => ({
    startFromContext: s.startFromContext,
    clearExplicit: s.clearExplicit,
  }));

  const onClick = async () => {
    const data = await postApi("/api/playback/resolve-history", {
      trackId: trackId,
    });

    if (!data?.refs?.length) return;

    clearExplicit();
    await startFromContext(data.refs, data.index, data.meta);
  };

  return (
    <IconButton
      aria-pressed={isThisTrack && isPlaying}
      icon={isThisTrack && isPlaying ? PauseIcon : PlayIcon}
      size="sm"
      onClick={onClick}
      iconClassName="fill-foreground stroke-0"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
    />
  );
}
