"use client";

import { getAudioUrl } from "@/lib/helpers/get-audio-url";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useEffect, useRef } from "react";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { session, pause, resume, seek, next, sync } = usePlaybackStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
  }, []);

  const audio = audioRef.current;

  useEffect(() => {
    if (!audio || !session?.currentTrack.audioId) return;

    audio.src = getAudioUrl(session.currentTrack.audioId);
    audio.currentTime = (session.progressMs ?? 0) / 1000;
    audio.load();

    if (session.isPlaying) {
      audio.play().catch((err) => {
        console.error("Auto play failed:", err);
      });
    } else {
      audio.pause();
    }
  }, [session, audio]);

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      usePlaybackStore.setState((state) => ({
        session: state.session
          ? {
              ...state.session,
              progressMs: audio.currentTime * 1000,
              lastPositionUpdatedAt: new Date(),
            }
          : null,
      }));
    };

    const handleEnded = () => {
      if (session?.repeatMode === "ONE") {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      sync();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audio, session, next, sync]);

  const controls = {
    play: resume,
    pause,
    seek: (ms: number) => {
      if (!audio) return;
      audio.currentTime = ms / 1000;
      seek(ms);
    },
    setVolume: (v: number) => {
      if (!audio) return;
      audio.volume = v / 100;
      usePlaybackStore.setState((state) => ({
        session: state.session ? { ...state.session, volume: v } : null,
      }));
    },
    mute: (flag: boolean) => {
      if (!audio) return;
      audio.muted = flag;
      usePlaybackStore.setState((state) => ({
        session: state.session ? { ...state.session, isMuted: flag } : null,
      }));
    },
  };

  return { audioRef, controls };
}
