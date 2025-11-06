"use client";

import { useToggleLikeTrack } from "@/features/me/hooks/use-toggle-like-track";
import { HeartIcon } from "lucide-react";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

export const ToggleLikeTrackButton = ({ track }: { track: TrackItem }) => {
  const { mutate: toggleLike, isPending: toggleLikePending } =
    useToggleLikeTrack();
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
      className="text-current"
    >
      {track.isLiked ? (
        <HeartIcon className="stroke-0 fill-red-500 size-5" />
      ) : (
        <HeartIcon className="size-5 text-current" />
      )}
    </Button>
  );
};
