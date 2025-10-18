"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyLikedPlaylist } from "../data-access/me-repo";
import { meKeys } from "../api/me-keys";
import { deleteApi, putApi } from "@/lib/http/api";
import { meEndpoints } from "../api/me-endpoints";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";

export function useToggleLikePlaylist(playlist: PlaylistItem) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const liked = qc
        .getQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists())
        ?.some((p) => p.id === playlist.id);

      if (liked) {
        await deleteApi(meEndpoints.toggleLikePlaylist(playlist.id));
      } else {
        await putApi(meEndpoints.toggleLikePlaylist(playlist.id), {});
      }
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: meKeys.likedPlaylists() });

      const prev = qc.getQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists());

      qc.setQueryData<MyLikedPlaylist[]>(meKeys.likedPlaylists(), (old) => {
        if (!old) return [playlist];

        const exists = old.some((p) => p.id === playlist.id);

        return exists
          ? old.filter((p) => p.id !== playlist.id)
          : [...old, playlist];
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
