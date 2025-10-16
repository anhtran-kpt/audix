"use client";

import { meKeys } from "@/features/me/api/me-keys";
import { MyPlaylists } from "@/features/me/data-access/me-repo";
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

      const prevData = {
        banner: qc.getQueryData<PlaylistBanner>(
          playlistKeys.banner(playlistId)
        ),
        myPlaylists: qc.getQueryData<MyPlaylists>(meKeys.myPlaylists()),
        list: qc.getQueryData<PlaylistItem[]>(playlistKeys.list()),
      };

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

      return { prevData };
    },

    onError: (_err, { playlistId }, ctx) => {
      if (!ctx) return;

      qc.setQueryData(playlistKeys.banner(playlistId), ctx.prevData.banner);
      qc.setQueryData(meKeys.myPlaylists(), ctx.prevData.myPlaylists);
      qc.setQueryData(playlistKeys.list(), ctx.prevData.list);
    },

    onSettled: (_, __, { playlistId }) => {
      qc.invalidateQueries({ queryKey: playlistKeys.banner(playlistId) });
      qc.invalidateQueries({ queryKey: meKeys.myPlaylists() });
      qc.invalidateQueries({ queryKey: playlistKeys.list() });
    },
  });
};
