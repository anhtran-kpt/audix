"use client";

import { useToggleLikeTrack } from "@/features/me/hooks/use-toggle-like-track";
import { HeartIcon } from "lucide-react";
import { TrackItem } from "@/features/track/track-types";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ToggleLikeTrackButtonProps = {
  track: TrackItem;
  className?: string;
};

export const ToggleLikeTrackButton = ({
  track,
  className,
}: ToggleLikeTrackButtonProps) => {
  const {
    toggleLike,
    isPending: toggleLikePending,
    isLiked,
  } = useToggleLikeTrack();
  const { data: session } = useSession();
  const likedPlaylistId = session?.user?.likedPlaylistId;

  if (!likedPlaylistId) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={toggleLikePending}
      onClick={() => toggleLike({ track, likedPlaylistId })}
      className={cn("text-current", className)}
    >
      {isLiked(track.id) ? (
        <HeartIcon className="stroke-0 fill-primary size-5" />
      ) : (
        <HeartIcon className="size-5 text-current" />
      )}
    </Button>
  );
};
