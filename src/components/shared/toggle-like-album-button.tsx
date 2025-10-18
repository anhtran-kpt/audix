"use client";

import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useToggleLikeAlbum } from "@/features/me/hooks/use-toggle-like-album";
import { AlbumItem } from "@/features/album/contracts/album-dto";
import { useLikedAlbumStatus } from "@/features/me/hooks/use-liked-album-status";

export const ToggleLikeAlbumButton = ({ album }: { album: AlbumItem }) => {
  const { data, isPending: likedStatusPending } = useLikedAlbumStatus(album.id);
  const { mutate: toggleLike, isPending: toggleLikePending } =
    useToggleLikeAlbum(album);

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
