import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/stores/use-player-store";
import { getAudioUrl } from "@/lib/helpers/get-audio-url";

export interface UseAudioPlayerOptions {
  crossfadeEnabled?: boolean;
  enableKeyboardControls?: boolean;
  enableMediaSession?: boolean;
  autoPlay?: boolean;
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const {
    crossfadeEnabled = true,
    enableKeyboardControls = true,
    enableMediaSession = true,
    autoPlay = true,
  } = options;

  const audioRef = useRef<HTMLAudioElement>(null);
  const crossfadeAudioRef = useRef<HTMLAudioElement>(null);
  const isCrossfading = useRef(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    crossfadeDuration,
    repeatMode,
    nextTrack,
    updateCurrentTime,
    updateDuration,
    setIsLoading,
    setAudioRef,
    pause,
    play,
  } = usePlayerStore();

  // Initialize audio element
  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [currentTrack?.id]);

  // Load new track
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;

    setIsLoading(true);

    audio.src = `${getAudioUrl(currentTrack.audioId)}`;
    audio.load();

    // Auto-play if enabled and user has interacted with page
    if (autoPlay && isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Auto-play was prevented, user will need to click play
          pause();
        });
      }
    }
  }, [currentTrack?.id, autoPlay, isPlaying, setIsLoading, pause]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Crossfade functionality
  const handleCrossfade = useCallback(async () => {
    if (!crossfadeEnabled || crossfadeDuration === 0 || isCrossfading.current) {
      await nextTrack();
      return;
    }

    const currentAudio = audioRef.current;
    const crossfadeAudio = crossfadeAudioRef.current;

    if (!currentAudio || !crossfadeAudio) {
      await nextTrack();
      return;
    }

    isCrossfading.current = true;

    try {
      // Prepare next track
      await nextTrack();

      // Setup crossfade audio
      crossfadeAudio.src = currentAudio.src;
      crossfadeAudio.volume = 0;
      crossfadeAudio.currentTime = 0;

      const fadeOutStep = volume / (crossfadeDuration * 20); // 20 steps per second
      const fadeInStep = volume / (crossfadeDuration * 20);

      // Start crossfade
      await crossfadeAudio.play();

      const fadeInterval = setInterval(() => {
        // Fade out current track
        if (currentAudio.volume > 0) {
          currentAudio.volume = Math.max(0, currentAudio.volume - fadeOutStep);
        }

        // Fade in next track
        if (crossfadeAudio.volume < volume) {
          crossfadeAudio.volume = Math.min(
            volume,
            crossfadeAudio.volume + fadeInStep
          );
        }

        // Check if crossfade is complete
        if (currentAudio.volume === 0 && crossfadeAudio.volume === volume) {
          clearInterval(fadeInterval);

          // Swap audio elements
          currentAudio.pause();
          currentAudio.src = crossfadeAudio.src;
          currentAudio.currentTime = crossfadeAudio.currentTime;
          currentAudio.volume = volume;

          crossfadeAudio.pause();
          crossfadeAudio.src = "";

          isCrossfading.current = false;
        }
      }, 50); // 20fps for smooth crossfade
    } catch (error) {
      console.error("Crossfade error:", error);
      isCrossfading.current = false;
      await nextTrack();
    }
  }, [crossfadeEnabled, crossfadeDuration, volume, nextTrack]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      updateDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      updateCurrentTime(audio.currentTime);

      // Check for crossfade trigger (last N seconds)
      if (crossfadeEnabled && crossfadeDuration > 0) {
        const timeLeft = audio.duration - audio.currentTime;
        if (timeLeft <= crossfadeDuration && !isCrossfading.current) {
          handleCrossfade();
        }
      }
    };

    const handleEnded = async () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        await play();
      } else if (!crossfadeEnabled || crossfadeDuration === 0) {
        await nextTrack();
      }
    };

    const handleError = () => {
      setIsLoading(false);
      console.error("Audio playback error");
    };

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [
    updateCurrentTime,
    updateDuration,
    setIsLoading,
    nextTrack,
    play,
    repeatMode,
    crossfadeEnabled,
    crossfadeDuration,
    handleCrossfade,
  ]);

  // Keyboard controls
  useEffect(() => {
    if (!enableKeyboardControls) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

      const { togglePlay, nextTrack, previousTrack, setVolume, volume } =
        usePlayerStore.getState();

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          if (event.shiftKey) {
            event.preventDefault();
            nextTrack();
          }
          break;
        case "ArrowLeft":
          if (event.shiftKey) {
            event.preventDefault();
            previousTrack();
          }
          break;
        case "ArrowUp":
          if (event.shiftKey) {
            event.preventDefault();
            setVolume(Math.min(1, volume + 0.1));
          }
          break;
        case "ArrowDown":
          if (event.shiftKey) {
            event.preventDefault();
            setVolume(Math.max(0, volume - 0.1));
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardControls]);

  // Media Session API for system media controls
  useEffect(() => {
    if (
      !enableMediaSession ||
      !("mediaSession" in navigator) ||
      !currentTrack
    ) {
      return;
    }

    const { togglePlay, nextTrack, previousTrack } = usePlayerStore.getState();

    // Set metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artists.map(({ artist }) => artist.name).join(", "),
      album: currentTrack.album.title,
      artwork: [
        {
          src: `/api/images/${currentTrack.album.imageId}?size=96`,
          sizes: "96x96",
          type: "image/jpeg",
        },
        {
          src: `/api/images/${currentTrack.album.imageId}?size=128`,
          sizes: "128x128",
          type: "image/jpeg",
        },
        {
          src: `/api/images/${currentTrack.album.imageId}?size=256`,
          sizes: "256x256",
          type: "image/jpeg",
        },
        {
          src: `/api/images/${currentTrack.album.imageId}?size=512`,
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    });

    // Set action handlers
    navigator.mediaSession.setActionHandler("play", () => {
      togglePlay();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      togglePlay();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      previousTrack();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      nextTrack();
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [enableMediaSession, currentTrack]);

  // Update Media Session playback state
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  return {
    audioRef,
    crossfadeAudioRef,
  };
}
