import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { PlaylistDetail } from "@/features/playlist/data-access/playlist-repo";
import { postApi } from "@/lib/http/request";
import { buildPlaylistCoverUrl } from "@/utils/string";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useOptimisticCoverUpdate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      imageIds,
    }: {
      playlistId: string;
      imageIds: string[];
    }) =>
      postApi<{ imageId: string }>(`/playlists/${playlistId}/cover`, {
        imageIds,
      }),

    onMutate: async ({ playlistId, imageIds }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetail>(
        playlistKeys.detail(playlistId)
      );

      const optimisticImageId =
        imageIds.length === 1 ? imageIds[0] : buildPlaylistCoverUrl(imageIds);

      qc.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (prev) =>
        prev ? { ...prev, imageId: optimisticImageId } : prev
      );

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (prev) =>
        prev
          ? prev.map((pl) =>
              pl.id === playlistId ? { ...pl, imageId: optimisticImageId } : pl
            )
          : prev
      );

      return { prev };
    },

    onError: (_err, { playlistId }, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.detail(playlistId), ctx.prev);
      }
    },

    onSuccess: ({ imageId }, { playlistId }) => {
      qc.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (prev) =>
        prev ? { ...prev, imageId } : prev
      );

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (prev) =>
        prev
          ? prev.map((pl) => (pl.id === playlistId ? { ...pl, imageId } : pl))
          : prev
      );
    },
  });
};
