import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import { getAudioUrl } from "@/lib/helpers/get-audio-url";

export type RepeatMode = "off" | "one" | "all";
export type PlaybackContextType =
  | "album"
  | "playlist"
  | "artist"
  | "liked"
  | "queue"
  | "radio"
  | "ad-hoc"
  | null;

export type TrackRef = { id: string; audioId: string };

export interface PlaybackContext {
  type: PlaybackContextType;
  contextId?: string;
  snapshotId?: string;
  name?: string;

  // Canonical order snapshot at start time
  trackRefs: TrackRef[]; // giữ cả id + audioId để phát không cần resolver
  contextIndex: number; // pointer in canonical order
  shuffledOrder?: number[]; // permutation of indices; 0 is pinned current
}

export interface PlaybackState {
  // Now playing (minimal info to play and identify)
  nowPlaying: TrackRef | null;

  // Status
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;

  // Context & modes
  playbackContext: PlaybackContext | null;
  isShuffled: boolean;
  repeatMode: RepeatMode;

  // Explicit queues (TrackRef so không cần resolver)
  explicitNext: TrackRef[];
  explicitLater: TrackRef[];
  radio: TrackRef[];
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
  enqueueNext: (refs: TrackRef[]) => void;
  addToQueue: (refs: TrackRef[]) => void;
  removeFromExplicitById: (id: string) => void;
  clearExplicit: () => void;

  // Set current track
  setCurrentFromRef: (ref: TrackRef) => void;

  // Low-level
  setError: (err: string | null) => void;
  setLoading: (loading: boolean) => void;
  setDuration: (duration: number) => void;
}

export type AudioStore = PlaybackState & AudioActions;

// Helpers
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makePinnedShuffle(n: number, pin: number) {
  if (n <= 1) return [0];
  const arr = Array.from({ length: n }, (_, i) => i);
  if (pin < 0 || pin >= n) pin = 0;
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

export function buildUpNextRefs(s: PlaybackState): TrackRef[] {
  const ctx = s.playbackContext;
  const order = ctx ? getContextOrderRefs(ctx) : [];
  const after = (() => {
    if (!ctx) return order;
    if (!s.nowPlaying) return order.slice(ctx.contextIndex + 1);
    const idx = order.findIndex((r) => r.id === s.nowPlaying!.id);
    return idx >= 0 ? order.slice(idx + 1) : order;
  })();
  return [...s.explicitNext, ...after, ...s.explicitLater, ...s.radio];
}

export const selectUpNextRefs = (s: PlaybackState) => buildUpNextRefs(s);

export const selectHasPrev = (s: PlaybackState) => s.history.length > 0;

export const selectHasNext = (s: PlaybackState) =>
  buildUpNextRefs(s).length > 0;

const _useAudioStore = create<AudioStore>()(
  persist(
    subscribeWithSelector<AudioStore>((set, get) => ({
      // initial
      nowPlaying: null,
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,

      playbackContext: null,
      isShuffled: false,
      repeatMode: "off",

      explicitNext: [],
      explicitLater: [],
      radio: [],
      history: [],

      error: null,
      audioElement: null,

      // wiring
      setAudioElement: (audio) => set({ audioElement: audio }),

      // controls
      play: async () => {
        const a = get().audioElement;
        if (!a) return;
        try {
          set({ isLoading: true, error: null });
          await a.play();
          set({ isPlaying: true });
        } catch {
          set({ isPlaying: false, error: "Failed to play audio" });
        } finally {
          set({ isLoading: false });
        }
      },
      pause: () => {
        const a = get().audioElement;
        if (a) {
          a.pause();
          set({ isPlaying: false });
        }
      },
      stop: () => {
        const a = get().audioElement;
        if (a) {
          a.pause();
          a.currentTime = 0;
          set({ isPlaying: false, currentTime: 0 });
        }
      },
      togglePlay: async () => (get().isPlaying ? get().pause() : get().play()),

      // navigation
      next: async () => {
        const s = get();
        const cur = s.nowPlaying;
        if (s.repeatMode === "one" && cur) {
          const a = s.audioElement;
          if (a) {
            a.currentTime = 0;
            await get().play();
          }
          return;
        }
        if (s.explicitNext.length) {
          const [ref, ...rest] = s.explicitNext;
          set({
            explicitNext: rest,
            history: cur ? [...s.history, cur] : s.history,
          });
          get().setCurrentFromRef(ref);
          await get().play();
          return;
        }
        const ctx = s.playbackContext;
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
              history: cur ? [...s.history, cur] : s.history,
            });
            get().setCurrentFromRef(nextRef);
            await get().play();
            return;
          }
        }
        if (s.explicitLater.length) {
          const [ref, ...rest] = s.explicitLater;
          set({
            explicitLater: rest,
            history: cur ? [...s.history, cur] : s.history,
          });
          get().setCurrentFromRef(ref);
          await get().play();
          return;
        }
        if (s.radio.length) {
          const [ref, ...rest] = s.radio;
          set({ radio: rest, history: cur ? [...s.history, cur] : s.history });
          get().setCurrentFromRef(ref);
          await get().play();
          return;
        }
        if (s.repeatMode === "all" && s.playbackContext) {
          const order = getContextOrderRefs(s.playbackContext);
          if (order.length > 0) {
            const firstRef = order[0];
            const canonicalIdx = s.playbackContext.trackRefs.findIndex(
              (r) => r.id === firstRef.id
            );
            set({
              playbackContext: {
                ...s.playbackContext,
                contextIndex: Math.max(0, canonicalIdx),
              },
              history: cur ? [...s.history, cur] : s.history,
            });
            get().setCurrentFromRef(firstRef);
            await get().play();
            return;
          }
        }
        set({ isPlaying: false });
      },
      previous: async () => {
        const s = get();
        const a = s.audioElement;
        if (!a) return;
        if (s.currentTime > 3) {
          a.currentTime = 0;
          return;
        }
        const prev = s.history[s.history.length - 1];
        if (!prev) return;
        set({ history: s.history.slice(0, -1) });
        get().setCurrentFromRef(prev);
        await get().play();
      },
      skipToUpNextIndex: async (index) => {
        const ids = buildUpNextRefs(get());
        if (index < 0 || index >= ids.length) return;
        const ref = ids[index];
        const cur = get().nowPlaying;
        if (cur) set({ history: [...get().history, cur] });
        set((state) => ({
          explicitNext: state.explicitNext.filter((x) => x.id !== ref.id),
          explicitLater: state.explicitLater.filter((x) => x.id !== ref.id),
        }));
        const ctx = get().playbackContext;
        if (ctx && ctx.trackRefs.some((r) => r.id === ref.id))
          set({
            playbackContext: {
              ...ctx,
              contextIndex: ctx.trackRefs.findIndex((r) => r.id === ref.id),
            },
          });
        get().setCurrentFromRef(ref);
        await get().play();
      },
      jumpToTrackId: async (id) => {
        const s = get();
        const cur = s.nowPlaying;
        if (cur) set({ history: [...s.history, cur] });
        // prefer explicit if exists
        const exp = s.explicitNext
          .concat(s.explicitLater)
          .find((r) => r.id === id);
        if (exp) {
          set({
            explicitNext: s.explicitNext.filter((x) => x.id !== id),
            explicitLater: s.explicitLater.filter((x) => x.id !== id),
          });
          get().setCurrentFromRef(exp);
          await get().play();
          return;
        }
        // context fallback
        const ctx = s.playbackContext;
        if (ctx) {
          const idx = ctx.trackRefs.findIndex((r) => r.id === id);
          if (idx >= 0) set({ playbackContext: { ...ctx, contextIndex: idx } });
          const ref = ctx?.trackRefs[idx];
          if (ref) {
            get().setCurrentFromRef(ref);
            await get().play();
          }
        }
      },

      // seek
      seek: (time) => {
        const a = get().audioElement;
        const d = get().duration;
        if (!a) return;
        const t = clamp(time, 0, d || Number.MAX_SAFE_INTEGER);
        a.currentTime = t;
        set({ currentTime: t });
      },
      seekBy: (sec) => {
        const t = get().currentTime;
        get().seek(t + sec);
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
        const modes: RepeatMode[] = ["off", "all", "one"];
        const i = modes.indexOf(get().repeatMode);
        set({ repeatMode: modes[(i + 1) % modes.length] });
      },
      toggleShuffle: () => {
        const s = get();
        const ctx = s.playbackContext;
        if (!ctx) return set({ isShuffled: !s.isShuffled });
        const curId = s.nowPlaying?.id ?? ctx.trackRefs[ctx.contextIndex]?.id;
        const pin = ctx.trackRefs.findIndex((r) => r.id === curId);
        if (!s.isShuffled)
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
        else
          set({
            isShuffled: false,
            playbackContext: { ...ctx, shuffledOrder: undefined },
          });
      },

      // context/queue
      startFromContext: async (refs, startIndex, meta) => {
        const i = clamp(startIndex, 0, Math.max(0, refs.length - 1));
        const ctx: PlaybackContext = {
          type: meta.type,
          contextId: meta.contextId,
          snapshotId: meta.snapshotId,
          name: meta.name,
          trackRefs: refs,
          contextIndex: i,
          shuffledOrder: get().isShuffled
            ? makePinnedShuffle(refs.length, i)
            : undefined,
        };
        set({
          playbackContext: ctx,
          nowPlaying: refs[i] ?? null,
          isLoading: true,
          error: null,
        });
        get().setCurrentFromRef(refs[i]);
        await get().play();
      },
      enqueueNext: (refs) =>
        set({ explicitNext: [...refs, ...get().explicitNext] }),
      addToQueue: (refs) =>
        set({ explicitLater: [...get().explicitLater, ...refs] }),
      removeFromExplicitById: (id) =>
        set({
          explicitNext: get().explicitNext.filter((x) => x.id !== id),
          explicitLater: get().explicitLater.filter((x) => x.id !== id),
        }),
      clearExplicit: () => set({ explicitNext: [], explicitLater: [] }),

      // set current
      setCurrentFromRef: (ref) => {
        const a = get().audioElement;
        if (a) {
          a.src = getAudioUrl(ref.audioId);
          a.load();
        }
        set({
          nowPlaying: ref,
          currentTime: 0,
          duration: 0,
          isLoading: true,
          error: null,
        });
      },

      setError: (e) => set({ error: e }),
      setLoading: (b) => set({ isLoading: b }),
      setDuration: (d) => set({ duration: d }),
    })),
    {
      name: "audix:player",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        nowPlaying: s.nowPlaying,
        isShuffled: s.isShuffled,
        repeatMode: s.repeatMode,
        currentTime: s.currentTime,
        volume: s.volume,
        isMuted: s.isMuted,
        playbackContext: s.playbackContext, // includes trackRefs snapshot (id + audioId)
        explicitNext: s.explicitNext,
        explicitLater: s.explicitLater,
        radio: s.radio,
        history: s.history,
      }),
      merge: (p: any, c) => ({
        ...c,
        ...p,
        isLoading: false,
        error: null,
        audioElement: null,
        duration: 0,
      }),
    }
  )
);

export type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (cb: (s: AudioStore) => void) => () => void;
  onHydrate: (cb: (s: AudioStore) => void) => () => void;
  clearStorage: () => Promise<void>;
  rehydrate: () => void;
};
export const useAudioStore = _useAudioStore as typeof _useAudioStore & {
  persist: PersistApi;
};
