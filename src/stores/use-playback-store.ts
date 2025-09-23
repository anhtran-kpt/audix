// use-playback-store.ts
"use client";

import {
  PlaybackSession,
  PlaybackContextSnapshot,
} from "@/features/playback/contracts/playback-dto";
import { RepeatMode } from "@/features/shared/contracts/shared-enum";
import { getApi, patchApi, postApi } from "@/lib/http/request";
import { create } from "zustand";

interface PlaybackState {
  session: PlaybackSession | null;
  isLoading: boolean;

  // Local-only markers for seeks
  lastLocalSeekAt: number | null; // timestamp ms when client last requested a seek
  lastLocalSeekPositionMs: number | null;

  // Selectors
  getCurrentTrackId: () => string | undefined;
  isPlaying: () => boolean;
  getProgressMs: () => number;
  getVolume: () => number;
  isMuted: () => boolean;
  repeatMode: () => RepeatMode;
  isShuffled: () => boolean;

  // Actions
  play: (input: PlaybackContextSnapshot) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  toggleMute: (isMuted: boolean) => Promise<void>;
  toggleShuffle: (isShuffled: boolean) => Promise<void>;
  setRepeatMode: (repeatMode: RepeatMode) => Promise<void>;
  sync: () => Promise<void>;

  // Local-only update
  updateProgressLocal: (progressMs: number) => void;

  // clear local seek marker (called by audio hook after it applied the seek)
  clearLocalSeek: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  session: null,
  isLoading: false,

  // local-only seek markers
  lastLocalSeekAt: null,
  lastLocalSeekPositionMs: null,

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
        lastPositionUpdatedAt: null,
      },
    });
    try {
      await postApi("/playback/pause");
      // do not force sync() to avoid audio jank
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
      // do not sync immediately
    } catch (err) {
      console.error("Resume failed:", err);
    }
  },

  async seek(positionMs) {
    const { session } = get();
    if (!session) return;

    const now = Date.now();
    set({
      session: {
        ...session,
        progressMs: positionMs,
        // if playing, we mark position updated now; if paused, it's still fine
        lastPositionUpdatedAt: new Date(),
      },
      // local-only markers used to tell audio element to jump
      lastLocalSeekAt: now,
      lastLocalSeekPositionMs: positionMs,
    });

    try {
      await postApi("/playback/seek", { positionMs });
      // do NOT call sync() here — avoid overwriting local audio immediately
    } catch (err) {
      console.error("Seek failed:", err);
    }
  },

  async next() {
    try {
      await postApi<void>("/playback/next");
      // next changes track — doing a sync is OK here to get new session
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

  async toggleMute(isMuted) {
    try {
      await patchApi<void>("/playback/mute", { isMuted });
      await get().sync();
    } catch (err) {
      console.error("Toggle mute failed:", err);
    }
  },

  async toggleShuffle(isShuffled) {
    try {
      await patchApi<void>("/playback/shuffle", { isShuffled });
      await get().sync();
    } catch (err) {
      console.error("Toggle shuffle failed:", err);
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

  // --- Local only ---
  updateProgressLocal(progressMs) {
    const { session } = get();
    if (!session) return;
    set({
      session: {
        ...session,
        progressMs,
        lastPositionUpdatedAt: new Date(),
      },
    });
  },

  clearLocalSeek() {
    set({ lastLocalSeekAt: null, lastLocalSeekPositionMs: null });
  },
}));

export function calcProgress(session: PlaybackSession | null): number {
  if (!session) return 0;
  if (!session.isPlaying || !session.lastPositionUpdatedAt) {
    return session.progressMs;
  }
  const elapsed =
    Date.now() - new Date(session.lastPositionUpdatedAt).getTime();
  // keep returned value as integer ms
  return session.progressMs + elapsed;
}
