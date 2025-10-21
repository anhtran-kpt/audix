"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikedPlaylistStatus, MyLikedPlaylists } from "../data-access/me-repo";
import { meKeys } from "../api/me-keys";
import { deleteApi, putApi } from "@/lib/http/api";
import { meEndpoints } from "../api/me-endpoints";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";

export function useToggleLikePlaylist(playlist: PlaylistItem) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) {
        await deleteApi(meEndpoints.toggleLikePlaylist(playlist.id));
      } else {
        await putApi(meEndpoints.toggleLikePlaylist(playlist.id));
      }
    },

    onMutate: async () => {
      await Promise.all([
        qc.cancelQueries({ queryKey: meKeys.likedPlaylists() }),
        qc.cancelQueries({ queryKey: meKeys.likedPlaylistStatus(playlist.id) }),
      ]);

      const prevData = {
        likedPlaylists: qc.getQueryData<MyLikedPlaylists>(
          meKeys.likedPlaylists()
        ),

        likedPlaylistStatus: qc.getQueryData<LikedPlaylistStatus>(
          meKeys.likedPlaylistStatus(playlist.id)
        ),
      };

      qc.setQueryData<MyLikedPlaylists>(meKeys.likedPlaylists(), (old) => {
        if (!old)
          return {
            pagination: { offset: 0, limit: 5, hasMore: false, total: 1 },
            items: [playlist],
          };

        const exists = old.items.some((item) => item.id === playlist.id);

        return exists
          ? {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total - 1,
              },
              items: old.items.filter((item) => item.id !== playlist.id),
            }
          : {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total + 1,
              },
              items: [...old.items, playlist],
            };
      });

      qc.setQueryData<LikedPlaylistStatus>(
        meKeys.likedPlaylistStatus(playlist.id),
        (old) => ({ isLiked: !old?.isLiked })
      );

      return { prevData };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      qc.setQueryData(meKeys.likedPlaylists(), ctx.prevData.likedPlaylists);
      qc.setQueryData(
        meKeys.likedPlaylistStatus(playlist.id),
        ctx.prevData.likedPlaylistStatus
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.likedPlaylists() });
      qc.invalidateQueries({
        queryKey: meKeys.likedPlaylistStatus(playlist.id),
      });
    },
  });
}
