"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApi, putApi } from "@/lib/api";
import { MyLikedAlbums } from "@/features/me/me-data";
import { AlbumItem } from "@/features/album/album-types";
import { meEndpoints } from "../me-endpoints";
import { meKeys } from "../me-keys";
import { useBaseUserOverlay } from "@/features/shared/hooks/use-base-user-overlay";

export function useToggleLikeAlbum() {
  const qc = useQueryClient();

  const { map, optimisticToggle, revert, getPrev } =
    useBaseUserOverlay("albums");

  const mutation = useMutation({
    mutationFn: async ({
      album,
      isCurrentlyLiked,
    }: {
      album: AlbumItem;
      isCurrentlyLiked: boolean;
    }) => {
      return isCurrentlyLiked
        ? await deleteApi(meEndpoints.toggleLikeAlbum(album.id))
        : await putApi(meEndpoints.toggleLikeAlbum(album.id));
    },

    onMutate: async ({ album }) => {
      await qc.cancelQueries({ queryKey: meKeys.likedAlbums() });

      const prevLikes = getPrev();
      const isCurrentlyLiked = !!prevLikes[album.id];
      const optimisticLiked = !isCurrentlyLiked;

      optimisticToggle(album.id);

      const prevLikedAlbums = qc.getQueryData<MyLikedAlbums>(
        meKeys.likedAlbums()
      );

      qc.setQueryData<MyLikedAlbums>(meKeys.likedAlbums(), (old) => {
        if (!old) return;

        return optimisticLiked
          ? {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total + 1,
              },
              items: [album, ...old.items],
            }
          : {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total - 1,
              },
              items: old.items.filter((item) => item.id !== album.id),
            };
      });

      return { prevLikes, prevLikedAlbums };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      revert(ctx.prevLikes);
      qc.setQueryData(meKeys.likedAlbums(), ctx.prevLikedAlbums);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.likedAlbums() });
    },
  });

  return {
    isLiked: (id: string) => !!map[id],
    isPending: mutation.isPending,
    toggleLike: (album: AlbumItem) => {
      const isCurrentlyLiked = !!map[album.id];
      mutation.mutate({ album, isCurrentlyLiked });
    },
  };
}
