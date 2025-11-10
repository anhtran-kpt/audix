"use client";

import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../../ui/icon-button";
import { useShallow } from "zustand/react/shallow";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { cn } from "@/lib/utils";
import { TrackItemCompact } from "../../shared/track-item-compact";
import { AudioProgressBar } from "@/components/shared/audio-progress-bar";
import { AppImage } from "@/components/shared/app-image";
import { useState } from "react";
import { useImageGradient } from "@/features/shared/hooks/use-image-gradient";

export const MobilePlayer = () => {
  const { session, resume, pause, isLoading, currentTrack, isPlaying } =
    usePlaybackStore(
      useShallow((s) => ({
        session: s.session,
        resume: s.resume,
        pause: s.pause,
        isLoading: s.isLoading,
        currentTrack: s.session?.currentTrack,
        isPlaying: s.isPlaying,
      }))
    );

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  return (
    currentTrack &&
    session && (
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-60 px-4 pt-3 pb-2 transition-colors"
        style={{
          background: gradient
            ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.to} 100%)`
            : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center justify-between grow gap-4">
            <TrackItemCompact
              track={currentTrack}
              canHover={false}
              hasMoreDetails={false}
            />
            <IconButton
              icon={isLoading ? Loader2Icon : isPlaying ? PauseIcon : PlayIcon}
              iconClassName={cn(
                "fill-current stroke-0 size-6",
                isLoading && "stroke-1.5 fill-none animate-spin"
              )}
              tooltipContent={isPlaying ? "Pause" : "Resume"}
              description="Toggle play"
              disabled={isLoading}
              onClick={isPlaying ? pause : resume}
            />
          </div>
        </div>
        <AudioProgressBar containerClassName="absolute top-0 left-0 right-0" />
        <AppImage
          alt={currentTrack.title}
          src={currentTrack.album.imageId}
          containerClassName="hidden"
          sizes="48px"
          onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
        />
      </div>
    )
  );
};
