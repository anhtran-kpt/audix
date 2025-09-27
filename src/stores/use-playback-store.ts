"use client";

import {
  NextPlaybackOutput,
  PlaybackSessionExtended,
  PreviousPlaybackOutput,
  ShufflePlaybackOutput,
  StartPlaybackInput,
} from "@/features/playback/contracts/playback-dto";
import { RepeatMode } from "@/features/shared/contracts/shared-enum";

import { getApi, patchApi, postApi } from "@/lib/http/request";
import { create } from "zustand";

interface PlaybackState {
  isLoading: boolean;
  session: PlaybackSessionExtended | null;
  isPlaying: boolean;
  progressMs: number;
  volume: number;
  isMuted: boolean;

  hydrate: () => Promise<void>;
  start: (input: StartPlaybackInput) => Promise<void>;
  pause: () => void;
  resume: () => void;
  seek: (positionMs: number) => void;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  toggleMute: () => void;
  toggleShuffle: () => Promise<void>;
  cycleRepeatMode: (repeatMode: RepeatMode) => Promise<void>;
  setVolume: (volume: number) => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  isLoading: false,
  session: null,
  isPlaying: false,
  progressMs: 0,
  volume: 1,
  isMuted: false,

  async hydrate() {
    try {
      const session = await getApi<PlaybackSessionExtended | null>(
        "/playback/session"
      );

      if (!session) {
        return;
      }

      set({ session });
    } catch (err) {
      console.error("Failed to hydrate playback session:", err);
    }
  },

  async start(input) {
    set({ isLoading: true });
    try {
      const session = await postApi<PlaybackSessionExtended>(
        "/playback/start",
        input
      );

      set({ session: session, isLoading: false, progressMs: 0 });
      get().resume();
    } catch (err) {
      console.error("Error starting playback:", err);
      set({ isLoading: false });
    }
  },

  pause() {
    set({ isPlaying: false });
  },

  resume() {
    set({ isPlaying: true });
  },

  seek(positionMs) {
    set({ progressMs: positionMs });
  },

  async next() {
    set({ isLoading: true });
    const { session } = get();

    if (!session) {
      return;
    }

    try {
      const response = await postApi<NextPlaybackOutput>("/playback/next");
      set({
        session: { ...session, ...response },
        progressMs: 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Next failed:", err);
      set({ isLoading: false });
    }
  },

  async previous() {
    set({ isLoading: true });
    const { session, progressMs } = get();

    if (!session) {
      return;
    }

    try {
      const response = await postApi<PreviousPlaybackOutput>(
        "/playback/previous",
        {
          positionMs: progressMs,
        }
      );
      set({
        session: { ...session, ...response },
        progressMs: 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Previous failed:", err);
      set({ isLoading: false });
    }
  },

  toggleMute() {
    set((s) => ({
      ...s,
      isMuted: !s.isMuted,
    }));
  },

  async toggleShuffle() {
    const { session } = get();
    if (!session) return;

    const prev = session.isShuffled;
    const next = !prev;

    set({ session: { ...session, isShuffled: next } });

    try {
      await patchApi<ShufflePlaybackOutput>("/playback/shuffle", {
        isShuffled: next,
      });
    } catch (err) {
      console.error("Toggle shuffle failed:", err);

      set({ session: { ...session, isShuffled: prev } });
    }
  },

  async cycleRepeatMode() {
    const { session } = get();
    if (!session) return;

    const prev = session.repeatMode;
    const next = getNextRepeatMode(prev);

    set({ session: { ...session, repeatMode: next } });

    try {
      await patchApi<NextPlaybackOutput>("/playback/repeat", {
        repeatMode: next,
      });
    } catch (err) {
      console.error("Set repeat mode failed:", err);

      set({ session: { ...session, repeatMode: prev } });
    }
  },

  setVolume(volume) {
    set({ volume });
  },
}));

export function getNextRepeatMode(current: RepeatMode): RepeatMode {
  switch (current) {
    case "OFF":
      return "ALL";
    case "ALL":
      return "ONE";
    case "ONE":
      return "OFF";
    default:
      return "OFF";
  }
}
