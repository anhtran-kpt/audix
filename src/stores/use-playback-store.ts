"use client";

import { RepeatMode } from "@/app/generated/prisma";
import {
  NextPlaybackOutput,
  ClientPlaybackSession,
  PreviousPlaybackOutput,
  RepeatPlaybackOutput,
  ShufflePlaybackOutput,
  StartPlaybackInput,
} from "@/features/playback/contracts/playback-dto";
import { getApi, patchApi, postApi } from "@/lib/http/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlaybackState {
  isLoading: boolean;
  session: ClientPlaybackSession | null;
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
  updateTrackLikeStatus: (trackId: string, liked: boolean) => void;
  updatePlayHistoryListen: (
    historyId: string,
    listenedSec: number
  ) => Promise<void>;
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      session: null,
      isPlaying: false,
      progressMs: 0,
      volume: 0.8,
      isMuted: false,

      async hydrate() {
        try {
          const session = await getApi<ClientPlaybackSession>(
            "/playback/session"
          );

          if (JSON.stringify(session) === "{}") {
            return;
          }

          set({ session, isPlaying: false });
        } catch (err) {
          console.error("Failed to hydrate playback session:", err);
        }
      },

      async start(input) {
        set({ isLoading: true });

        try {
          const session = await postApi<ClientPlaybackSession>(
            "/playback/start",
            {
              body: input,
            }
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
              body: {
                positionMs: progressMs,
              },
            }
          );
          set({
            session: { ...session, ...response },
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
          const response = await patchApi<ShufflePlaybackOutput>(
            "/playback/shuffle",
            {
              body: { isShuffled: next },
            }
          );
          set({
            session: { ...session, queue: response.queue, isShuffled: next },
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
          await patchApi<RepeatPlaybackOutput>("/playback/repeat", {
            body: { repeatMode: next },
          });
        } catch (err) {
          console.error("Set repeat mode failed:", err);

          set({ session: { ...session, repeatMode: prev } });
        }
      },

      setVolume(volume) {
        set({ volume });
      },

      updateTrackLikeStatus: (trackId, liked) =>
        set((state) => {
          const session = state.session;
          if (!session) return state;

          const currentTrack =
            session.currentTrack?.id === trackId
              ? { ...session.currentTrack, isLiked: liked }
              : session.currentTrack;

          const queue = {
            next: session.queue.next,
            context: session.queue.context,
            later: session.queue.later,
          };

          return {
            session: {
              ...session,
              currentTrack,
              queue,
            },
          };
        }),

      updatePlayHistoryListen: async (
        historyId: string,
        listenedSec: number
      ) => {
        try {
          await patchApi("/playback/history", {
            body: { historyId, listenedSec },
          });
        } catch (err) {
          console.error("Failed to update play history:", err);
        }
      },
    }),
    {
      name: "playback-storage",
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
      }),
    }
  )
);

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
