"use client";

import {
  PlaybackSession,
  StartPlaybackInput,
} from "@/features/playback/contracts/playback-dto";
import { RepeatMode } from "@/features/shared/contracts/shared-enum";
import { getApi, patchApi, postApi } from "@/lib/http/request";
import { create } from "zustand";

interface PlaybackState {
  session: PlaybackSession | null;
  isLoading: boolean;

  // Selectors
  getCurrentTrackId: () => string | undefined;
  isPlaying: () => boolean;
  getProgressMs: () => number;
  getVolume: () => number;
  isMuted: () => boolean;
  repeatMode: () => RepeatMode;
  isShuffled: () => boolean;

  // Actions
  play: (input: StartPlaybackInput) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setShuffle: (isShuffled: boolean) => Promise<void>;
  setRepeatMode: (repeatMode: RepeatMode) => Promise<void>;
  sync: () => Promise<void>;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  session: null,
  isLoading: false,

  // --- Selectors ---
  getCurrentTrackId: () => get().session?.currentTrackId,
  isPlaying: () => !!get().session?.isPlaying,
  getProgressMs: () => calcProgress(get().session),
  getVolume: () => get().session?.volume ?? 80,
  isMuted: () => !!get().session?.isMuted,
  repeatMode: () => get().session?.repeatMode ?? "OFF",
  isShuffled: () => !!get().session?.isShuffled,

  // --- Actions ---
  async play(input) {
    set({ isLoading: true });
    try {
      const data = await postApi<PlaybackSession>("/playback/start", input);
      set({ session: data, isLoading: false });
    } catch (err) {
      console.error("Error starting playback:", err);
      set({ isLoading: false });
    }
  },

  async pause() {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        isPlaying: false,
        progressMs: calcProgress(session),
      },
    });

    try {
      await postApi("/playback/pause");
      await get().sync();
    } catch (err) {
      console.error("Pause failed:", err);
    }
  },

  async resume() {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        isPlaying: true,
        lastPositionUpdatedAt: new Date(),
      },
    });

    try {
      await postApi("/playback/resume");
      await get().sync();
    } catch (err) {
      console.error("Resume failed:", err);
    }
  },

  async seek(positionMs) {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        progressMs: positionMs,
        lastPositionUpdatedAt: new Date(),
      },
    });

    try {
      await postApi("/playback/seek", { positionMs });
      await get().sync();
    } catch (err) {
      console.error("Seek failed:", err);
    }
  },

  async next() {
    try {
      await postApi<void>("/playback/next");
      await get().sync();
    } catch (err) {
      console.error("Next failed:", err);
    }
  },

  async previous() {
    try {
      await postApi<void>("/playback/previous");
      await get().sync();
    } catch (err) {
      console.error("Previous failed:", err);
    }
  },

  async setShuffle(isShuffled) {
    try {
      await patchApi<void>("/playback/shuffle", { isShuffled });
      await get().sync();
    } catch (err) {
      console.error("Set shuffle failed:", err);
    }
  },

  async setRepeatMode(repeatMode) {
    try {
      await patchApi<void>("/playback/repeat", { repeatMode });
      await get().sync();
    } catch (err) {
      console.error("Set repeat mode failed:", err);
    }
  },

  async sync() {
    try {
      const data = await getApi<PlaybackSession>("/playback/session");
      set({ session: data });
    } catch (err) {
      console.error("Sync failed:", err);
    }
  },
}));

// Helper: tính progress với elapsed time
function calcProgress(session: PlaybackSession | null): number {
  if (!session) return 0;
  if (!session.isPlaying || !session.lastPositionUpdatedAt) {
    return session.progressMs;
  }
  const elapsed =
    Date.now() - new Date(session.lastPositionUpdatedAt).getTime();
  return session.progressMs + elapsed;
}
