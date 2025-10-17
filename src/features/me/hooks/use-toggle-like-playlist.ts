"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyLikedPlaylist } from "../data-access/me-repo";
import { meKeys } from "../api/me-keys";
import { deleteApi, putApi } from "@/lib/http/api";
import { meEndpoints } from "../api/me-endpoints";

export function useToggleLikePlaylist(playlistId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const liked = qc
        .getQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists())
        ?.some((p) => p.id === playlistId);

      if (liked) {
        await deleteApi(meEndpoints.toggleLikePlaylist(playlistId));
      } else {
        await putApi(meEndpoints.toggleLikePlaylist(playlistId), {});
      }
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: meKeys.likedPlaylists() });
      const prev = qc.getQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists());
      qc.setQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists(), (old) => {
        if (!old) return [{ id: playlistId }];
        const exists = old.some((p) => p.id === playlistId);
        return exists
          ? old.filter((p) => p.id !== playlistId)
          : [...old, { id: playlistId }];
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(meKeys.likedPlaylists(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.likedPlaylists() });
    },
  });
}
