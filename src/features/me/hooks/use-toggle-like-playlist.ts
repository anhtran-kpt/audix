"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyLikedPlaylists } from "@/features/me/me-data";
import { meKeys } from "../me-keys";
import { PlaylistItem } from "@/features/playlist/playlist-types";
import { useBaseUserOverlay } from "@/features/shared/hooks/use-base-user-overlay";
import { likePlaylist, unlikePlaylist } from "../me-actions";

export function useToggleLikePlaylist() {
  const qc = useQueryClient();

  const { map, optimisticToggle, revert, getPrev } =
    useBaseUserOverlay("playlists");

  const mutation = useMutation({
    mutationFn: async ({
      playlist,
      isCurrentlyLiked,
    }: {
      playlist: PlaylistItem;
      isCurrentlyLiked: boolean;
    }) => {
      return isCurrentlyLiked
        ? await unlikePlaylist(playlist.id)
        : await likePlaylist(playlist.id);
    },

    onMutate: async ({ playlist }) => {
      await qc.cancelQueries({ queryKey: meKeys.likedPlaylists() });

      const prevLikes = getPrev();
      const isCurrentlyLiked = !!prevLikes[playlist.id];
      const optimisticLiked = !isCurrentlyLiked;

      optimisticToggle(playlist.id);

      const prevLikedPlaylists = qc.getQueryData<MyLikedPlaylists>(
        meKeys.likedPlaylists()
      );

      qc.setQueryData<MyLikedPlaylists>(meKeys.likedPlaylists(), (old) => {
        if (!old) return;

        return optimisticLiked
          ? {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total + 1,
              },
              items: [playlist, ...old.items],
            }
          : {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total - 1,
              },
              items: old.items.filter((item) => item.id !== playlist.id),
            };
      });

      return { prevLikedPlaylists, prevLikes };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      revert(ctx.prevLikes);
      qc.setQueryData(meKeys.likedPlaylists(), ctx.prevLikedPlaylists);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.likedPlaylists() });
    },
  });

  return {
    isLiked: (id: string) => !!map[id],
    isPending: mutation.isPending,
    toggleLike: (playlist: PlaylistItem) => {
      const isCurrentlyLiked = !!map[playlist.id];
      mutation.mutate({ playlist, isCurrentlyLiked });
    },
  };
}
