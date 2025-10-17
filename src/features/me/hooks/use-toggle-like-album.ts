"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyLikedAlbum } from "../data-access/me-repo";
import { meKeys } from "../api/me-keys";
import { deleteApi, putApi } from "@/lib/http/api";
import { meEndpoints } from "../api/me-endpoints";

export function useToggleLikeAlbum(albumId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const liked = qc
        .getQueryData<MyLikedAlbum[]>(meKeys.likedAlbums())
        ?.some((p) => p.id === albumId);

      if (liked) {
        await deleteApi(meEndpoints.toggleLikeAlbum(albumId));
      } else {
        await putApi(meEndpoints.toggleLikeAlbum(albumId), {});
      }
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: meKeys.likedAlbums() });
      const prev = qc.getQueryData<MyLikedAlbum[]>(meKeys.likedAlbums());
      qc.setQueryData<MyLikedAlbum[]>(meKeys.likedAlbums(), (old) => {
        if (!old) return [{ id: albumId }];
        const exists = old.some((p) => p.id === albumId);
        return exists
          ? old.filter((p) => p.id !== albumId)
          : [...old, { id: albumId }];
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(meKeys.likedAlbums(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.likedAlbums() });
    },
  });
}
