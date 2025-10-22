"use client";

import { useAudioPlayer } from "@/hooks/use-audio-player";

export const AudioElement = () => {
  const { audioRef } = useAudioPlayer();

  return <audio ref={audioRef} preload="auto" hidden />;
};
