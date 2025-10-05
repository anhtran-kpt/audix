import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useLikeAlbum } from "@/features/me/hooks/use-like-album";
import { useQueryClient } from "@tanstack/react-query";
import { meKeys } from "@/features/me/api/me-keys";

type LikeButtonProps = {
  albumId: string;
};

export const LikeButton = ({ albumId }: LikeButtonProps) => {
  const { like, unlike, isLiking, isUnliking } = useLikeAlbum(albumId);
  const queryClient = useQueryClient();

  const likedAlbums =
    queryClient.getQueryData<string[]>(meKeys.likedAlbums()) ?? [];
  const isLiked = likedAlbums.includes(albumId);

  return (
    <IconButton
      icon={isLiked ? CheckCircle2Icon : PlusCircleIcon}
      size="xl"
      disabled={isLiking || isUnliking}
      onClick={() => {
        if (isLiked) {
          unlike();
        } else {
          like();
        }
      }}
      tooltipContent={
        <>
          Save to <strong>Your Library</strong>
        </>
      }
    />
  );
};
