"use client";

import { usePlaybackStore } from "@/stores/use-playback-store";
import { Button } from "../ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { usePlayTrackButton } from "@/hooks/use-play-track-button";

export const ContextPlayButton = ({ context }) => {
  const session = usePlaybackStore((s) => s.session);
  const { handlePlay } = usePlayTrackButton();

  if (!session) {
    return null;
  }

  return (
    <Button
      onClick={() => handlePlay(context)}
      className="absolute bottom-2 right-2 opacity-0 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
    >
      {session.isPlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};
