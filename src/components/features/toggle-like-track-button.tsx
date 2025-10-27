"use client";

import { useToggleLikeTrack } from "@/features/me/hooks/use-toggle-like-track";
import { IconButton } from "../ui/icon-button";
import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { useSession } from "next-auth/react";

export const ToggleLikeTrackButton = ({ track }: { track: TrackItem }) => {
  const { mutate: toggleLike, isPending: toggleLikePending } =
    useToggleLikeTrack();
  const { data: session } = useSession();
  const likedPlaylistId = session?.user?.likedPlaylistId;

  if (!likedPlaylistId) {
    return null;
  }

  return (
    <IconButton
      icon={track.isLiked ? CheckCircle2Icon : PlusCircleIcon}
      disabled={toggleLikePending}
      onClick={() => toggleLike({ track, likedPlaylistId })}
      iconClassName="size-5"
      tooltipContent={
        track.isLiked ? (
          <>
            Remove from <strong>Liked Tracks</strong>
          </>
        ) : (
          <>
            Add to <strong>Liked Tracks</strong>
          </>
        )
      }
    />
  );
};
