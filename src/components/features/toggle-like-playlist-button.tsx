"use client";

import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useToggleLikePlaylist } from "@/features/me/hooks/use-toggle-like-playlist";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { useLikedPlaylistStatus } from "@/features/me/hooks/use-liked-playlist-status";

export const ToggleLikePlaylistButton = ({
  playlist,
}: {
  playlist: PlaylistItem;
}) => {
  const { data, isPending: likedStatusPending } = useLikedPlaylistStatus(
    playlist.id
  );
  const { mutate: toggleLike, isPending: toggleLikePending } =
    useToggleLikePlaylist(playlist);

  return (
    <IconButton
      icon={data?.isLiked ? CheckCircle2Icon : PlusCircleIcon}
      size="xl"
      disabled={toggleLikePending || likedStatusPending}
      onClick={() => toggleLike(data?.isLiked ?? false)}
      tooltipContent={
        <>
          Save to <strong>Your Library</strong>
        </>
      }
    />
  );
};
