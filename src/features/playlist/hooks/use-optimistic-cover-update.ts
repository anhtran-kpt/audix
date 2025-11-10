"use client";

import { MyPlaylists } from "@/features/me/me-data";
import { postApi } from "@/lib/api";
import { buildPlaylistCoverUrl } from "@/utils/string";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistKeys } from "../playlist-keys";
import { meKeys } from "@/features/me/me-keys";
import { PlaylistOverview } from "../playlist-types";

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
      await qc.cancelQueries({ queryKey: playlistKeys.overview(playlistId) });
      await qc.cancelQueries({ queryKey: meKeys.myPlaylists() });

      const prevData = {
        overview: qc.getQueryData<PlaylistOverview>(
          playlistKeys.overview(playlistId)
        ),
        myPlaylists: qc.getQueryData<MyPlaylists>(meKeys.myPlaylists()),
      };

      let optimisticImageId;

      if (imageIds.length === 0) {
        optimisticImageId = process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!;
      } else if (imageIds.length === 1) {
        optimisticImageId = imageIds[0];
      } else {
        optimisticImageId = buildPlaylistCoverUrl(imageIds);
      }

      qc.setQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId),
        (prevoverview) =>
          prevoverview
            ? { ...prevoverview, imageId: optimisticImageId }
            : prevoverview
      );

      qc.setQueryData<MyPlaylists>(meKeys.myPlaylists(), (prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((pl) =>
                pl.id === playlistId
                  ? { ...pl, imageId: optimisticImageId }
                  : pl
              ),
            }
          : prev
      );

      return { prevData };
    },

    onError: (_err, { playlistId }, ctx) => {
      if (!ctx) return;

      qc.setQueryData(playlistKeys.overview(playlistId), ctx.prevData.overview);
      qc.setQueryData(meKeys.myPlaylists(), ctx.prevData.myPlaylists);
    },

    onSettled: (_, __, { playlistId }) => {
      qc.invalidateQueries({ queryKey: playlistKeys.overview(playlistId) });
      qc.invalidateQueries({ queryKey: meKeys.myPlaylists() });
    },
  });
};
