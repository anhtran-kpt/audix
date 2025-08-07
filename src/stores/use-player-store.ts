import { TTrack } from "@/types/track";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;

  currentTrack: TTrack | null;
  queue: TTrack[];
  originalQueue: TTrack[];
  currentIndex: number;

  isShuffled: boolean;
  repeatMode: "off" | "all" | "one";

  crossfadeDuration: number; // seconds

  playbackContext: {
    type: "album" | "playlist" | "artist" | "liked" | "queue" | null;
    id: string | null;
    name: string | null;
  };

  recentlyPlayed: TTrack[];

  audioRef: HTMLAudioElement | null;
}

export interface PlayerActions {
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;

  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seekTo: (time: number) => void;

  playTrack: (
    track: TTrack,
    context?: { type: string; id: string; name: string }
  ) => Promise<void>;
  playQueue: (
    tracks: TTrack[],
    index?: number,
    context?: { type: string; id: string; name: string }
  ) => Promise<void>;
  addToQueue: (track: TTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;

  toggleShuffle: () => void;
  toggleRepeat: () => void;

  setVolume: (volume: number) => void;
  toggleMute: () => void;

  setCrossfadeDuration: (duration: number) => void;

  setAudioRef: (audio: HTMLAudioElement | null) => void;

  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;

  setPlaybackContext: (context: {
    type: string;
    id: string;
    name: string;
  }) => void;
}

type PlayerStore = PlaybackState & PlayerActions;

const STORAGE_KEYS = {
  VOLUME: "music-player-volume",
  REPEAT_MODE: "music-player-repeat",
  CROSSFADE: "music-player-crossfade",
  SHUFFLE: "music-player-shuffle",
};

export const usePlayerStore = create<PlayerStore>()(
  subscribeWithSelector((set, get) => ({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume:
      typeof window !== "undefined"
        ? Number(localStorage.getItem(STORAGE_KEYS.VOLUME)) || 0.8
        : 0.8,
    isMuted: false,

    currentTrack: null,
    queue: [],
    originalQueue: [],
    currentIndex: -1,

    isShuffled:
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.SHUFFLE) === "true"
        : false,
    repeatMode:
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEYS.REPEAT_MODE) as
            | "off"
            | "all"
            | "one") || "off"
        : "off",
    crossfadeDuration:
      typeof window !== "undefined"
        ? Number(localStorage.getItem(STORAGE_KEYS.CROSSFADE)) || 0
        : 0,

    playbackContext: {
      type: null,
      id: null,
      name: null,
    },

    recentlyPlayed: [],
    audioRef: null,

    setAudioRef: (audio) => set({ audioRef: audio }),

    play: async () => {
      const { audioRef, currentTrack } = get();
      console.log("Audio ref:", audioRef);
      console.log("Current track:", currentTrack);
      if (!audioRef || !currentTrack) return;

      try {
        set({ isLoading: true });
        // await audioRef.play();
        set({ isPlaying: true, isPaused: false });
      } catch (error) {
        console.error("Error playing audio:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    pause: () => {
      const { audioRef } = get();
      if (!audioRef) return;

      audioRef.pause();
      set({ isPlaying: false, isPaused: true });
    },

    togglePlay: () => {
      const { isPlaying, play, pause } = get();
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    },

    stop: () => {
      const { audioRef } = get();
      if (!audioRef) return;

      audioRef.pause();
      audioRef.currentTime = 0;
      set({
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
      });
    },

    seekTo: (time) => {
      const { audioRef, duration } = get();
      if (!audioRef) return;

      const clampedTime = Math.max(0, Math.min(time, duration));
      audioRef.currentTime = clampedTime;
      set({ currentTime: clampedTime });
    },

    nextTrack: async () => {
      const { queue, currentIndex, repeatMode, play } = get();

      if (queue.length === 0) return;

      let nextIndex: number;

      if (repeatMode === "one") {
        // Repeat current track
        nextIndex = currentIndex;
      } else if (currentIndex === queue.length - 1) {
        // At end of queue
        if (repeatMode === "all") {
          nextIndex = 0; // Loop back to start
        } else {
          return; // Stop playing
        }
      } else {
        nextIndex = currentIndex + 1;
      }

      set({
        currentIndex: nextIndex,
        currentTrack: queue[nextIndex],
      });

      await play();
    },

    previousTrack: async () => {
      const { queue, currentIndex, currentTime, play } = get();

      if (queue.length === 0) return;

      // If we're more than 3 seconds into the track, restart it
      if (currentTime > 3) {
        get().seekTo(0);
        return;
      }

      let prevIndex: number;

      if (currentIndex === 0) {
        prevIndex = queue.length - 1; // Loop to end
      } else {
        prevIndex = currentIndex - 1;
      }

      set({
        currentIndex: prevIndex,
        currentTrack: queue[prevIndex],
      });

      await play();
    },

    playTrack: async (track, context) => {
      set({
        currentTrack: track,
        queue: [track],
        originalQueue: [track],
        currentIndex: 0,
        playbackContext: context || { type: null, id: null, name: null },
      });

      // Add to recently played
      const { recentlyPlayed } = get();
      const filteredRecent = recentlyPlayed.filter((t) => t.id !== track.id);
      set({
        recentlyPlayed: [track, ...filteredRecent].slice(0, 50), // Keep last 50
      });

      await get().play();
    },

    playQueue: async (tracks, index = 0, context) => {
      if (tracks.length === 0) return;

      const shuffledTracks = get().isShuffled ? shuffleArray(tracks) : tracks;
      const playIndex = get().isShuffled ? 0 : index;

      set({
        queue: shuffledTracks,
        originalQueue: tracks,
        currentIndex: playIndex,
        currentTrack: shuffledTracks[playIndex],
        playbackContext: context || { type: null, id: null, name: null },
      });

      await get().play();
    },

    addToQueue: (track) => {
      const { queue } = get();
      set({ queue: [...queue, track] });
    },

    removeFromQueue: (index) => {
      const { queue, currentIndex } = get();
      const newQueue = queue.filter((_, i) => i !== index);

      let newCurrentIndex = currentIndex;
      if (index < currentIndex) {
        newCurrentIndex = currentIndex - 1;
      } else if (index === currentIndex) {
        // If removing current track, move to next or stop if last
        newCurrentIndex = Math.min(currentIndex, newQueue.length - 1);
      }

      set({
        queue: newQueue,
        currentIndex: newCurrentIndex,
        currentTrack: newQueue[newCurrentIndex] || null,
      });
    },

    clearQueue: () => {
      set({
        queue: [],
        originalQueue: [],
        currentIndex: -1,
        currentTrack: null,
      });
      get().stop();
    },

    reorderQueue: (fromIndex, toIndex) => {
      const { queue, currentIndex } = get();
      const newQueue = [...queue];
      const [moved] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, moved);

      // Update current index if needed
      let newCurrentIndex = currentIndex;
      if (fromIndex === currentIndex) {
        newCurrentIndex = toIndex;
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        newCurrentIndex = currentIndex - 1;
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        newCurrentIndex = currentIndex + 1;
      }

      set({
        queue: newQueue,
        currentIndex: newCurrentIndex,
      });
    },

    toggleShuffle: () => {
      const { isShuffled, queue, originalQueue, currentTrack } = get();
      const newShuffleState = !isShuffled;

      if (newShuffleState) {
        // Enable shuffle
        const shuffledQueue = shuffleArray(originalQueue);
        // Ensure current track stays at current position
        if (currentTrack) {
          const currentTrackIndex = shuffledQueue.findIndex(
            (t) => t.id === currentTrack.id
          );
          if (currentTrackIndex > 0) {
            [shuffledQueue[0], shuffledQueue[currentTrackIndex]] = [
              shuffledQueue[currentTrackIndex],
              shuffledQueue[0],
            ];
          }
        }

        set({
          isShuffled: newShuffleState,
          queue: shuffledQueue,
          currentIndex: currentTrack ? 0 : -1,
        });
      } else {
        // Disable shuffle - restore original order
        let newCurrentIndex = -1;
        if (currentTrack) {
          newCurrentIndex = originalQueue.findIndex(
            (t) => t.id === currentTrack.id
          );
        }

        set({
          isShuffled: newShuffleState,
          queue: originalQueue,
          currentIndex: newCurrentIndex,
        });
      }

      localStorage.setItem(STORAGE_KEYS.SHUFFLE, newShuffleState.toString());
    },

    toggleRepeat: () => {
      const { repeatMode } = get();
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIndex = modes.indexOf(repeatMode);
      const newMode = modes[(currentIndex + 1) % modes.length];

      set({ repeatMode: newMode });
      localStorage.setItem(STORAGE_KEYS.REPEAT_MODE, newMode);
    },

    setVolume: (volume) => {
      const { audioRef } = get();
      const clampedVolume = Math.max(0, Math.min(1, volume));

      if (audioRef) {
        audioRef.volume = clampedVolume;
      }

      set({
        volume: clampedVolume,
        isMuted: clampedVolume === 0,
      });
      localStorage.setItem(STORAGE_KEYS.VOLUME, clampedVolume.toString());
    },

    toggleMute: () => {
      const { isMuted, volume, audioRef } = get();

      if (audioRef) {
        audioRef.muted = !isMuted;
      }

      set({ isMuted: !isMuted });
    },

    setCrossfadeDuration: (duration) => {
      const clampedDuration = Math.max(0, Math.min(12, duration));
      set({ crossfadeDuration: clampedDuration });
      localStorage.setItem(STORAGE_KEYS.CROSSFADE, clampedDuration.toString());
    },

    updateCurrentTime: (time) => set({ currentTime: time }),
    updateDuration: (duration) => set({ duration }),
    setIsLoading: (loading) => set({ isLoading: loading }),

    setPlaybackContext: (context) => set({ playbackContext: context }),
  }))
);

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
