import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useQueryClient } from "@tanstack/react-query";
import { meKeys } from "@/features/me/api/me-keys";
import { MyLikedAlbum } from "@/features/me/data-access/me-repo";
import { useToggleLikeAlbum } from "@/features/me/hooks/use-toggle-like-album";

export const ToggleLikeAlbumButton = ({ albumId }: { albumId: string }) => {
  const { mutate: toggleLike, isPending } = useToggleLikeAlbum(albumId);
  const queryClient = useQueryClient();

  const likedAlbums =
    queryClient.getQueryData<MyLikedAlbum[]>(meKeys.likedAlbums()) ?? [];

  const isLiked = likedAlbums.map((album) => album.id).includes(albumId);

  return (
    <IconButton
      icon={isLiked ? CheckCircle2Icon : PlusCircleIcon}
      size="xl"
      disabled={isPending}
      onClick={() => toggleLike()}
      tooltipContent={
        <>
          Save to <strong>Your Library</strong>
        </>
      }
    />
  );
};
