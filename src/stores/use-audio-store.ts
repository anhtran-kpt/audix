import { getAudioUrl } from "@/lib/helpers/get-audio-url";
import { TTrack } from "@/types/track";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type RepeatMode = "off" | "one" | "all";
export type PlaybackContextType =
  | "album"
  | "playlist"
  | "artist"
  | "liked"
  | "queue"
  | null;

export interface PlaybackState {
  // Current playback state
  currentTrack: TTrack | null;
  currentTrackIndex: number;

  // Playback status
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  // crossfadeDuration: number;
  playbackContext: {
    type: PlaybackContextType;
    id: string | null;
    name: string | null;
  };

  // Player modes
  isShuffled: boolean;
  repeatMode: RepeatMode;

  // Queue management
  queue: TTrack[];
  originalQueue: TTrack[];
  queueIndex: number;
  recentlyPlayed: TTrack[];

  // Error handling
  error: string | null;

  audioElement: HTMLAudioElement | null;
}

export interface AudioActions {
  // Basic playback controls
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  togglePlay: () => Promise<void>;

  // Track navigation
  next: () => Promise<void>;
  previous: () => Promise<void>;
  skipTo: (index: number) => Promise<void>;

  // Seek controls
  seek: (time: number) => void;
  seekBy: (seconds: number) => void;

  // Volume controls
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Mode controls
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleRepeat: () => void;

  // Track/Queue management
  setCurrentTrack: (
    track: TTrack,
    context?: {
      type: PlaybackContextType;
      id: string | null;
      name: string | null;
    }
  ) => void;
  addToQueue: (track: TTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;

  // Internal state management
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  // setCrossfadeDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Audio element management
  setAudioElement: (audio: HTMLAudioElement | null) => void;
}

type AudioStore = PlaybackState & AudioActions;

const STORAGE_KEYS = {
  VOLUME: "music-player-volume",
  REPEAT_MODE: "music-player-repeat",
  CROSSFADE: "music-player-crossfade",
  SHUFFLE: "music-player-shuffle",
};

export const useAudioStore = create<AudioStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentTrack: null,
    currentTrackIndex: 0,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume:
      typeof window !== "undefined"
        ? Number(localStorage.getItem(STORAGE_KEYS.VOLUME)) || 0.8
        : 0.8,
    isMuted: false,

    queue: [],
    originalQueue: [],
    queueIndex: 0,

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
    // crossfadeDuration:
    //   typeof window !== "undefined"
    //     ? Number(localStorage.getItem(STORAGE_KEYS.CROSSFADE)) || 0
    //     : 0,

    playbackContext: {
      type: null,
      id: null,
      name: null,
    },

    recentlyPlayed: [],
    error: null,
    audioElement: null,

    setAudioElement: (audio) => set({ audioElement: audio }),

    play: async () => {
      const { audioElement, currentTrack, setLoading, setError } = get();

      if (!audioElement || !currentTrack) {
        console.warn("Cannot play: missing audioElement or currentTrack");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await audioElement.play();
        set({ isPlaying: true });
      } catch (error) {
        console.error("Error playing audio:", error);
        setError("Failed to play audio");
        set({ isPlaying: false });
      } finally {
        setLoading(false);
      }
    },

    pause: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.pause();
        set({ isPlaying: false });
      }
    },

    stop: () => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        set({ isPlaying: false, currentTime: 0 });
      }
    },

    togglePlay: async () => {
      const { isPlaying, play, pause } = get();
      if (isPlaying) {
        pause();
      } else {
        await play();
      }
    },

    next: async () => {
      const { queue, queueIndex, repeatMode } = get();

      if (queue.length === 0) return;

      let nextIndex = queueIndex + 1;

      // Handle repeat modes
      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else if (repeatMode === "one") {
          nextIndex = queueIndex; // Stay on current track
        } else {
          return; // End of queue
        }
      }

      await get().skipTo(nextIndex);
    },

    previous: async () => {
      const { queue, queueIndex, currentTime } = get();

      if (queue.length === 0) return;

      // If more than 3 seconds played, restart current track
      if (currentTime > 3) {
        get().seek(0);
        return;
      }

      let prevIndex = queueIndex - 1;

      // Wrap to end if at beginning
      if (prevIndex < 0) {
        prevIndex = queue.length - 1;
      }

      await get().skipTo(prevIndex);
    },

    skipTo: async (index) => {
      const { queue, setCurrentTrack } = get();

      if (index < 0 || index >= queue.length) return;

      const track = queue[index];
      set({ queueIndex: index });
      setCurrentTrack(track);

      // Auto-play if currently playing
      if (get().isPlaying) {
        await get().play();
      }
    },

    seek: (time) => {
      const { audioElement, duration } = get();
      if (audioElement && duration > 0) {
        const clampedTime = Math.max(0, Math.min(time, duration));
        audioElement.currentTime = clampedTime;
        set({ currentTime: clampedTime });
      }
    },

    seekBy: (seconds) => {
      const { currentTime, seek } = get();
      seek(currentTime + seconds);
    },

    // Volume controls
    setVolume: (volume) => {
      const { audioElement } = get();
      const clampedVolume = Math.max(0, Math.min(1, volume));

      if (audioElement) {
        audioElement.volume = clampedVolume;
      }

      set({
        volume: clampedVolume,
        isMuted: clampedVolume === 0,
      });
    },

    toggleMute: () => {
      const { audioElement, isMuted, volume } = get();

      if (audioElement) {
        if (isMuted) {
          audioElement.volume = volume;
          set({ isMuted: false });
        } else {
          audioElement.volume = 0;
          set({ isMuted: true });
        }
      }
    },

    // Mode controls
    toggleShuffle: () => {
      const { isShuffled, queue, originalQueue, currentTrack, queueIndex } =
        get();

      if (!isShuffled) {
        // Enable shuffle
        const shuffled = [...queue];
        const currentTrackItem = shuffled[queueIndex];

        // Remove current track from array before shuffling
        shuffled.splice(queueIndex, 1);

        // Shuffle remaining tracks
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Put current track at the beginning
        shuffled.unshift(currentTrackItem);

        set({
          isShuffled: true,
          originalQueue: queue,
          queue: shuffled,
          queueIndex: 0,
        });
      } else {
        const currentTrackId = currentTrack?.id;
        const originalIndex = originalQueue.findIndex(
          (track) => track.id === currentTrackId
        );

        set({
          isShuffled: false,
          queue: originalQueue,
          queueIndex: Math.max(0, originalIndex),
          originalQueue: [],
        });
      }
    },

    setRepeatMode: (mode) => set({ repeatMode: mode }),

    toggleRepeat: () => {
      const { repeatMode } = get();
      const modes: RepeatMode[] = ["off", "all", "one"];
      const currentIndex = modes.indexOf(repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      set({ repeatMode: nextMode });
    },

    setCurrentTrack: (track, context) => {
      const { audioElement } = get();

      if (audioElement) {
        const audioUrl = getAudioUrl(track.audioId);
        audioElement.src = audioUrl;
        audioElement.load();
      }

      set({
        currentTrack: track,
        playbackContext: context,
        currentTime: 0,
        duration: 0,
        isLoading: true,
        error: null,
      });
    },

    addToQueue: (track) => {
      const { queue } = get();
      set({ queue: [...queue, track] });
    },

    removeFromQueue: (index) => {
      const { queue, queueIndex } = get();
      const newQueue = queue.filter((_, i) => i !== index);

      let newQueueIndex = queueIndex;
      if (index < queueIndex) {
        newQueueIndex = queueIndex - 1;
      } else if (index === queueIndex && index >= newQueue.length) {
        newQueueIndex = Math.max(0, newQueue.length - 1);
      }

      set({
        queue: newQueue,
        queueIndex: newQueueIndex,
      });
    },

    clearQueue: () => {
      set({
        queue: [],
        originalQueue: [],
        queueIndex: 0,
        currentTrack: null,
        isPlaying: false,
      });
    },

    reorderQueue: (fromIndex, toIndex) => {
      const { queue, queueIndex } = get();
      const newQueue = [...queue];
      const [moved] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, moved);

      let newQueueIndex = queueIndex;
      if (fromIndex === queueIndex) {
        newQueueIndex = toIndex;
      } else if (fromIndex < queueIndex && toIndex >= queueIndex) {
        newQueueIndex = queueIndex - 1;
      } else if (fromIndex > queueIndex && toIndex <= queueIndex) {
        newQueueIndex = queueIndex + 1;
      }

      set({
        queue: newQueue,
        queueIndex: newQueueIndex,
      });
    },

    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // setCrossfadeDuration: (duration) => {
    //   const clampedDuration = Math.max(0, Math.min(12, duration));
    //   set({ crossfadeDuration: clampedDuration });
    //   localStorage.setItem(STORAGE_KEYS.CROSSFADE, clampedDuration.toString());
    // },
  }))
);

useAudioStore.subscribe(
  (state) => state.audioElement,
  (audioElement, previousAudioElement) => {
    const handleTrackEnd = () => {
      const { repeatMode, next, play } = useAudioStore.getState();
      if (repeatMode === "one") {
        play();
      } else {
        next();
      }
    };

    const handleTimeUpdate = (event: Event) => {
      const audio = event.target as HTMLAudioElement;
      useAudioStore.getState().setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = (event: Event) => {
      const audio = event.target as HTMLAudioElement;
      useAudioStore.getState().setDuration(audio.duration);
    };

    const handleError = (event: Event) => {
      useAudioStore.getState().setError("Failed to load audio");
      useAudioStore.getState().setLoading(false);
    };

    if (previousAudioElement) {
      previousAudioElement.removeEventListener("ended", handleTrackEnd);
      previousAudioElement.removeEventListener("timeupdate", handleTimeUpdate);
      previousAudioElement.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      previousAudioElement.removeEventListener("error", handleError);
    }

    if (audioElement) {
      audioElement.addEventListener("ended", handleTrackEnd);
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("error", handleError);
    }
  }
);
