import { postApi } from "@/lib/http/request";
import { Button } from "../ui/button";
import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddTrackToPlaylistOutput,
  FullPlaylist,
} from "@/features/playlist/contracts/playlist-dto";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { TrackListItem } from "@/features/track/contracts/track-dto";

type TrackAddingButtonProps = {
  trackId: zCuidType;
  playlistId: zCuidType;
  position: number;
};

export default function TrackAddingButton({
  trackId,
  playlistId,
  position,
}: TrackAddingButtonProps) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (playlistId) =>
      postApi<AddTrackToPlaylistOutput>(`/playlists/${playlistId}/tracks`, {
        trackId,
        position,
      }),

    onMutate: async (playlistId: string) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<FullPlaylist>(
        playlistKeys.detail(playlistId)
      );

      const optimistic: TrackListItem = {
        id: `optimistic-${Date.now()}`,
        title: "",
        isExplicit: false,
        duration: 0,
        playCount: 0,
        album: {
          imageId: "",
        },
        artists: [],
      };

      qc.setQueryData(playlistKeys.detail(playlistId), (old: FullPlaylist) =>
        old ? { ...old, items: [...old.items, { ...optimistic }] } : old
      );

      return { prev };
    },

    onError: (err, _, ctx) => {
      if (ctx?.prev)
        qc.setQueryData(playlistKeys.detail(ctx.prev.id), ctx.prev);
    },

    onSuccess: (res, vars) => {
      qc.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(playlistId)}
    >
      Add
    </Button>
  );
}
