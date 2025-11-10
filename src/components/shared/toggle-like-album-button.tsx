"use client";

import { useToggleLikeAlbum } from "@/features/me/hooks/use-toggle-like-album";
import { AlbumItem } from "@/features/album/album-types";
import { ToggleLikeButton } from "../ui/toggle-like-button";

export const ToggleLikeAlbumButton = ({ album }: { album: AlbumItem }) => {
  const { toggleLike, isPending, isLiked } = useToggleLikeAlbum();

  return (
    <ToggleLikeButton
      isLiked={isLiked(album.id)}
      disabled={isPending}
      onClick={() => toggleLike(album)}
    />
  );
};
