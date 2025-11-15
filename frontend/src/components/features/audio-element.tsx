"use client";

import { useAudioPlayer } from "@/features/playback/hooks/use-audio-player";

export const AudioElement = () => {
  const { audioRef } = useAudioPlayer();

  return <audio ref={audioRef} preload="auto" hidden />;
};
