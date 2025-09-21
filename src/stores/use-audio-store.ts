"use client";

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import { getAudioUrl } from "@/lib/helpers/get-audio-url";
import {
  PlaybackContextType,
  RepeatMode,
} from "@/features/shared/contracts/shared-enum";
import { TrackRef } from "@/features/playback/contracts/playback-dto";

// ---------- Types ----------
export interface UserQueue {
  next: TrackRef[]; // high priority: play immediately after current
  later: TrackRef[]; // low priority: appended after playback context
}

export interface PlaybackContext {
  type: PlaybackContextType;
  contextId?: string;
  snapshotId?: string;
  name?: string;
  trackRefs: TrackRef[]; // canonical order
  contextIndex: number; // pointer in canonical order
  shuffledOrder?: number[]; // permutation mapping
}

export interface PlaybackState {
  nowPlayingRef: TrackRef | null;

  // Status
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;

  // Context (PlaybackQueue)
  playbackContext: PlaybackContext | null;
  isShuffled: boolean;
  repeatMode: RepeatMode;

  // UserQueue (merged)
  userQueue: UserQueue;

  // History
  history: TrackRef[];

  // Errors & engine
  error: string | null;
  audioElement: HTMLAudioElement | null;
}

export interface AudioActions {
  // Engine wiring
  setAudioElement: (audio: HTMLAudioElement | null) => void;

  // Playback controls
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  togglePlay: () => Promise<void>;

  // Navigation
  next: () => Promise<void>;
  previous: () => Promise<void>;
  skipToUpNextIndex: (index: number) => Promise<void>;
  skipToContextIndex: (orderIndex: number) => Promise<void>;
  jumpToTrackId: (id: string) => Promise<void>;

  // Seek
  seek: (time: number) => void;
  seekBy: (seconds: number) => void;

  // Volume
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Modes
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleRepeat: () => void;

  // Context/queue
  startFromContext: (
    refs: TrackRef[],
    startIndex: number,
    meta: {
      type: PlaybackContextType;
      contextId?: string;
      name?: string;
      snapshotId?: string;
    }
  ) => Promise<void>;
  queueNext: (refs: TrackRef[]) => void;
  queueLater: (refs: TrackRef[]) => void;
  removeFromUserQueueById: (id: string) => void;
  clearUserQueue: () => void;

  // Set current track
  setCurrentFromRef: (ref: TrackRef) => void;

  // Low-level
  setError: (err: string | null) => void;
  setLoading: (loading: boolean) => void;
  setDuration: (duration: number) => void;
}

export type AudioStore = PlaybackState & AudioActions;

// ---------- Helpers ----------
const HISTORY_MAX = 50;
function pushHistory(list: TrackRef[], ref: TrackRef) {
  return list.length >= HISTORY_MAX
    ? [...list.slice(-HISTORY_MAX + 1), ref]
    : [...list, ref];
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makePinnedShuffle(n: number, pin: number) {
  if (n <= 1) {
    return [0];
  }

  const arr = Array.from({ length: n }, (_, i) => i);

  if (pin < 0 || pin >= n) {
    pin = 0;
  }

  [arr[0], arr[pin]] = [arr[pin], arr[0]];

  for (let i = n - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function getContextOrderRefs(ctx: PlaybackContext): TrackRef[] {
  if (!ctx.shuffledOrder) return ctx.trackRefs;
  return ctx.shuffledOrder.map((i) => ctx.trackRefs[i]);
}

// Build Up Next using userQueue + playback context
export function buildUpNextRefs(state: PlaybackState): TrackRef[] {
  const ctx = state.playbackContext;
  const order = ctx ? getContextOrderRefs(ctx) : [];

  const after = (() => {
    if (!ctx) return order;
    if (!state.nowPlayingRef) return order.slice(ctx.contextIndex + 1);

    const idx = order.findIndex((r) => r.id === state.nowPlayingRef!.id);
    return idx >= 0 ? order.slice(idx + 1) : order;
  })();

  return [...state.userQueue.next, ...after, ...state.userQueue.later];
}

export const selectUpNextRefs = (s: PlaybackState) => buildUpNextRefs(s);
export const selectHasPrev = (s: PlaybackState) => s.history.length > 0;
export const selectHasNext = (s: PlaybackState) => {
  const upNext = buildUpNextRefs(s);
  if (upNext.length > 0) return true;
  if (s.repeatMode === "ALL" && (s.playbackContext?.trackRefs.length ?? 0) > 0)
    return true;
  return false;
};

const _useAudioStore = create<AudioStore>()(
  persist(
    subscribeWithSelector<AudioStore>((set, get) => {
      // helper to centralize play-from-ref
      async function playFromRef(
        ref: TrackRef,
        opts?: { pushHistory?: boolean }
      ) {
        const cur = get().nowPlayingRef;
        if (opts?.pushHistory && cur) {
          set({ history: [...get().history, cur] });
        }

        get().setCurrentFromRef(ref);
        await get().play();
      }

      return {
        // initial
        nowPlayingRef: null,
        isPlaying: false,
        isLoading: false,
        currentTime: 0,
        duration: 0,
        volume: 0.8,
        isMuted: false,

        playbackContext: null,
        isShuffled: false,
        repeatMode: "OFF",

        userQueue: { next: [], later: [] },
        history: [],

        error: null,
        audioElement: null,

        // engine
        setAudioElement: (audio) => set({ audioElement: audio }),

        setCurrentFromRef: (ref) => {
          const audio = get().audioElement;

          if (audio) {
            const nextSrc = getAudioUrl(ref.audioId);
            if (audio.src !== nextSrc) {
              try {
                audio.pause();
              } catch {}
              audio.src = nextSrc;
            }
          }

          set({
            nowPlayingRef: ref,
            currentTime: 0,
            duration: 0,
            isLoading: true,
            error: null,
          });
        },

        // playback controls
        play: async () => {
          const a = get().audioElement;
          if (!a) return;

          set({ error: null });
          try {
            await a.play();
            set({ isPlaying: true });
          } catch (err: unknown) {
            if (!String(err).includes("Abort")) {
              set({ isPlaying: false, error: "Failed to play audio" });
            }
          } finally {
            set({ isLoading: false });
          }
        },

        pause: () => {
          const audioElement = get().audioElement;
          if (audioElement) {
            audioElement.pause();
            set({ isPlaying: false });
          }
        },

        stop: () => {
          const audioElement = get().audioElement;
          if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            set({ isPlaying: false, currentTime: 0 });
          }
        },

        togglePlay: async () =>
          get().isPlaying ? get().pause() : get().play(),

        // navigation
        next: async () => {
          const state = get();
          const cur = state.nowPlayingRef;

          if (state.repeatMode === "ONE" && cur) {
            const audioElement = state.audioElement;
            if (audioElement) {
              audioElement.currentTime = 0;
              await get().play();
            }
            return;
          }

          // 1) userQueue.next priority
          if (state.userQueue.next.length) {
            const [ref, ...rest] = state.userQueue.next;
            set({
              userQueue: { ...state.userQueue, next: rest },
              history: cur ? [...state.history, cur] : state.history,
            });
            await playFromRef(ref);
            return;
          }

          // 2) playback context
          const ctx = state.playbackContext;
          if (ctx) {
            const order = getContextOrderRefs(ctx);
            const i = cur
              ? order.findIndex((r) => r.id === cur.id)
              : ctx.contextIndex;

            if (i >= 0 && i + 1 < order.length) {
              const nextRef = order[i + 1];
              const canonicalIdx = ctx.trackRefs.findIndex(
                (r) => r.id === nextRef.id
              );

              set({
                playbackContext: {
                  ...ctx,
                  contextIndex: Math.max(0, canonicalIdx),
                },
                history: cur ? [...state.history, cur] : state.history,
              });

              await playFromRef(nextRef);
              return;
            }
          }

          // 3) userQueue.later
          if (state.userQueue.later.length) {
            const [ref, ...rest] = state.userQueue.later;
            set({
              userQueue: { ...state.userQueue, later: rest },
              history: cur ? [...state.history, cur] : state.history,
            });
            await playFromRef(ref);
            return;
          }

          // 4) repeat ALL
          if (state.repeatMode === "ALL" && state.playbackContext) {
            const order = getContextOrderRefs(state.playbackContext);
            if (order.length > 0) {
              const firstRef = order[0];
              const canonicalIdx = state.playbackContext.trackRefs.findIndex(
                (ref) => ref.id === firstRef.id
              );
              set({
                playbackContext: {
                  ...state.playbackContext,
                  contextIndex: Math.max(0, canonicalIdx),
                },
                history: cur ? pushHistory(state.history, cur) : state.history,
              });
              await playFromRef(firstRef);
              return;
            }
          }

          // nothing left
          set({ isPlaying: false });
        },

        previous: async () => {
          const state = get();
          const audioElement = state.audioElement;
          if (!audioElement) return;

          if (state.currentTime > 3) {
            audioElement.currentTime = 0;
            return;
          }

          const prev = state.history[state.history.length - 1];
          if (!prev) return;

          set({ history: state.history.slice(0, -1) });
          await playFromRef(prev);
        },

        skipToUpNextIndex: async (index) => {
          const nextRefs = buildUpNextRefs(get());
          if (index < 0 || index >= nextRefs.length) return;

          const ref = nextRefs[index];
          const cur = get().nowPlayingRef;
          if (cur) set({ history: [...get().history, cur] });

          // remove from userQueue if present
          set((state) => ({
            userQueue: {
              next: state.userQueue.next.filter((x) => x.id !== ref.id),
              later: state.userQueue.later.filter((x) => x.id !== ref.id),
            },
          }));

          const ctx = get().playbackContext;
          if (ctx && ctx.trackRefs.some((r) => r.id === ref.id)) {
            set({
              playbackContext: {
                ...ctx,
                contextIndex: ctx.trackRefs.findIndex((r) => r.id === ref.id),
              },
            });
          }

          await playFromRef(ref);
        },

        skipToContextIndex: async (orderIndex) => {
          const state = get();
          const ctx = state.playbackContext;
          if (!ctx) return;

          const order = getContextOrderRefs(ctx);
          if (order.length === 0) return;

          const i = clamp(orderIndex, 0, order.length - 1);
          const ref = order[i];
          if (!ref) return;

          if (state.nowPlayingRef?.id === ref.id) {
            await get().togglePlay();
            return;
          }

          const cur = state.nowPlayingRef;
          if (cur) set({ history: [...state.history, cur] });

          // remove from userQueue if present
          set((state) => ({
            userQueue: {
              next: state.userQueue.next.filter((x) => x.id !== ref.id),
              later: state.userQueue.later.filter((x) => x.id !== ref.id),
            },
          }));

          const canonicalIdx = ctx.trackRefs.findIndex((r) => r.id === ref.id);
          set({
            playbackContext: {
              ...ctx,
              contextIndex: Math.max(0, canonicalIdx),
            },
          });

          await playFromRef(ref);
        },

        jumpToTrackId: async (id) => {
          const state = get();
          const cur = state.nowPlayingRef;
          if (cur) set({ history: [...state.history, cur] });

          // prefer userQueue
          const fromNext = state.userQueue.next.find((r) => r.id === id);
          const fromLater = state.userQueue.later.find((r) => r.id === id);
          const exp = fromNext ?? fromLater;

          if (exp) {
            set((state) => ({
              userQueue: {
                next: state.userQueue.next.filter((x) => x.id !== id),
                later: state.userQueue.later.filter((x) => x.id !== id),
              },
            }));
            await playFromRef(exp);
            return;
          }

          // context fallback
          const ctx = state.playbackContext;
          if (ctx) {
            const idx = ctx.trackRefs.findIndex((r) => r.id === id);
            if (idx >= 0)
              set({ playbackContext: { ...ctx, contextIndex: idx } });
            const ref = ctx?.trackRefs[idx];
            if (ref) {
              await playFromRef(ref);
            }
          }
        },

        // seek
        seek: (time) => {
          const audioElement = get().audioElement;
          const duration = get().duration;
          if (!audioElement) return;

          const t = clamp(time, 0, duration || Number.MAX_SAFE_INTEGER);
          audioElement.currentTime = t;
          set({ currentTime: t });
        },

        seekBy: (sec) => {
          const time = get().currentTime;
          get().seek(time + sec);
        },

        // volume
        setVolume: (v) => {
          const a = get().audioElement;
          const vol = clamp(v, 0, 1);
          if (a) a.volume = vol;
          set({ volume: vol, isMuted: vol === 0 });
        },

        toggleMute: () => {
          const { isMuted, volume, audioElement } = get();
          if (!audioElement) return set({ isMuted: !isMuted });
          if (isMuted) {
            audioElement.volume = volume;
            set({ isMuted: false });
          } else {
            audioElement.volume = 0;
            set({ isMuted: true });
          }
        },

        // modes
        setRepeatMode: (m) => set({ repeatMode: m }),

        toggleRepeat: () => {
          const modes: RepeatMode[] = ["OFF", "ALL", "ONE"];
          const i = modes.indexOf(get().repeatMode);
          set({ repeatMode: modes[(i + 1) % modes.length] });
        },

        toggleShuffle: () => {
          const state = get();
          const ctx = state.playbackContext;
          if (!ctx) return;

          const curId =
            state.nowPlayingRef?.id ?? ctx.trackRefs[ctx.contextIndex]?.id;
          const pin = ctx.trackRefs.findIndex((r) => r.id === curId);

          if (!state.isShuffled) {
            set({
              isShuffled: true,
              playbackContext: {
                ...ctx,
                shuffledOrder: makePinnedShuffle(
                  ctx.trackRefs.length,
                  Math.max(0, pin)
                ),
              },
            });
          } else {
            set({
              isShuffled: false,
              playbackContext: { ...ctx, shuffledOrder: undefined },
            });
          }
        },

        // context/queue
        startFromContext: async (refs, startIndex, meta) => {
          const i = clamp(startIndex, 0, Math.max(0, refs.length - 1));

          set({
            playbackContext: {
              type: meta.type,
              contextId: meta.contextId,
              snapshotId: meta.snapshotId,
              name: meta.name,
              trackRefs: refs,
              contextIndex: i,
              shuffledOrder: get().isShuffled
                ? makePinnedShuffle(refs.length, i)
                : undefined,
            },
            nowPlayingRef: refs[i] ?? null,
            isLoading: true,
            error: null,
          });

          get().setCurrentFromRef(refs[i]);
          await get().play();
        },

        queueNext: (refs) =>
          set((s) => {
            const exists = new Set(s.userQueue.next.map((r) => r.id));
            const dedup = refs.filter((r) => !exists.has(r.id));
            return {
              userQueue: {
                ...s.userQueue,
                next: [...dedup, ...s.userQueue.next],
              },
            };
          }),

        queueLater: (refs) =>
          set((s) => {
            const exists = new Set(s.userQueue.later.map((r) => r.id));
            const dedup = refs.filter((r) => !exists.has(r.id));
            return {
              userQueue: {
                ...s.userQueue,
                later: [...s.userQueue.later, ...dedup],
              },
            };
          }),

        removeFromUserQueueById: (id) =>
          set((state) => ({
            userQueue: {
              next: state.userQueue.next.filter((x) => x.id !== id),
              later: state.userQueue.later.filter((x) => x.id !== id),
            },
          })),

        clearUserQueue: () => set({ userQueue: { next: [], later: [] } }),

        setError: (e) => set({ error: e }),
        setLoading: (b) => set({ isLoading: b }),
        setDuration: (d) => set({ duration: d }),
      };
    }),
    {
      name: "audix:player",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        nowPlayingRef: s.nowPlayingRef,
        isShuffled: s.isShuffled,
        repeatMode: s.repeatMode,
        currentTime: s.currentTime,
        volume: s.volume,
        isMuted: s.isMuted,
        playbackContext: s.playbackContext,
        userQueue: s.userQueue,
        history: s.history,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted ?? {}),
        isLoading: false,
        error: null,
        audioElement: null,
        duration: 0,
      }),
    }
  )
);

export const useAudioStore = _useAudioStore as typeof _useAudioStore & {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (cb: (s: AudioStore) => void) => () => void;
    onHydrate: (cb: (s: AudioStore) => void) => () => void;
    clearStorage: () => Promise<void>;
    rehydrate: () => void;
  };
};
