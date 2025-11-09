"use client";

import { useToggleLikePlaylist } from "@/features/me/hooks/use-toggle-like-playlist";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { ToggleLikeButton } from "../ui/toggle-like-button";

export const ToggleLikePlaylistButton = ({
  playlist,
}: {
  playlist: PlaylistItem;
}) => {
  const { toggleLike, isPending, isLiked } = useToggleLikePlaylist();

  return (
    <ToggleLikeButton
      isLiked={isLiked(playlist.id)}
      disabled={isPending}
      onClick={() => toggleLike(playlist)}
    />
  );
};
