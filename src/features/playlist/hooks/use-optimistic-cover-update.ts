"use client";

import { meKeys } from "@/features/me/api/me-keys";
import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { PlaylistBanner } from "@/features/playlist/data-access/playlist-repo";
import { postApi } from "@/lib/http/api";
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
        body: { imageIds },
      }),

    onMutate: async ({ playlistId, imageIds }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.banner(playlistId) });
      await qc.cancelQueries({ queryKey: playlistKeys.list() });
      await qc.cancelQueries({ queryKey: meKeys.myPlaylists() });

      const prevBanner = qc.getQueryData<PlaylistBanner>(
        playlistKeys.banner(playlistId)
      );

      const optimisticImageId =
        imageIds.length === 1 ? imageIds[0] : buildPlaylistCoverUrl(imageIds);

      qc.setQueryData<PlaylistBanner>(
        playlistKeys.banner(playlistId),
        (prevBanner) =>
          prevBanner
            ? { ...prevBanner, imageId: optimisticImageId }
            : prevBanner
      );

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (prev) =>
        prev
          ? prev.map((pl) =>
              pl.id === playlistId ? { ...pl, imageId: optimisticImageId } : pl
            )
          : prev
      );

      qc.setQueryData<PlaylistItem[]>(meKeys.myPlaylists(), (prev) =>
        prev
          ? prev.map((pl) =>
              pl.id === playlistId ? { ...pl, imageId: optimisticImageId } : pl
            )
          : prev
      );

      return { prevBanner };
    },

    onError: (_err, { playlistId }, ctx) => {
      if (ctx?.prevBanner) {
        qc.setQueryData(playlistKeys.banner(playlistId), ctx.prevBanner);
      }
    },

    onSuccess: ({ imageId }, { playlistId }) => {
      qc.setQueryData<PlaylistBanner>(
        playlistKeys.banner(playlistId),
        (prevBanner) => (prevBanner ? { ...prevBanner, imageId } : prevBanner)
      );

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (prevBanner) =>
        prevBanner
          ? prevBanner.map((pl) =>
              pl.id === playlistId ? { ...pl, imageId } : pl
            )
          : prevBanner
      );
    },
  });
};
