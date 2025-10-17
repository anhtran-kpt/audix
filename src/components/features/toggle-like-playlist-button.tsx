import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useQueryClient } from "@tanstack/react-query";
import { meKeys } from "@/features/me/api/me-keys";
import { MyLikedPlaylist } from "@/features/me/data-access/me-repo";
import { useToggleLikePlaylist } from "@/features/me/hooks/use-toggle-like-playlist";

export const ToggleLikePlaylistButton = ({
  playlistId,
}: {
  playlistId: string;
}) => {
  const { mutate: toggleLike, isPending } = useToggleLikePlaylist(playlistId);
  const queryClient = useQueryClient();

  const likedPlaylists =
    queryClient.getQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists()) ?? [];

  const isLiked = likedPlaylists
    .map((playlist) => playlist.id)
    .includes(playlistId);

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
