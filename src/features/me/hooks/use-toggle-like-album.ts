"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LikedAlbumStatus, MyLikedAlbum } from "../data-access/me-repo";
import { meKeys } from "../api/me-keys";
import { deleteApi, putApi } from "@/lib/http/api";
import { meEndpoints } from "../api/me-endpoints";
import { AlbumItem } from "@/features/album/contracts/album-dto";

export function useToggleLikeAlbum(album: AlbumItem) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) {
        await deleteApi(meEndpoints.toggleLikeAlbum(album.id));
      } else {
        await putApi(meEndpoints.toggleLikeAlbum(album.id));
      }
    },

    onMutate: async () => {
      await Promise.all([
        qc.cancelQueries({ queryKey: meKeys.likedAlbums() }),
        qc.cancelQueries({ queryKey: meKeys.likedAlbumStatus(album.id) }),
      ]);

      const prevData = {
        likedAlbums: qc.getQueryData<MyLikedAlbum[]>(meKeys.likedAlbums()),

        likedAlbumStatus: qc.getQueryData<LikedAlbumStatus>(
          meKeys.likedAlbumStatus(album.id)
        ),
      };

      qc.setQueryData<MyLikedAlbum[]>(meKeys.likedAlbums(), (old) => {
        if (!old) return [album];

        const exists = old.some((p) => p.id === album.id);

        return exists ? old.filter((p) => p.id !== album.id) : [...old, album];
      });

      qc.setQueryData<LikedAlbumStatus>(
        meKeys.likedAlbumStatus(album.id),
        (old) => ({ isLiked: !old?.isLiked })
      );

      return { prevData };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      qc.setQueryData(meKeys.likedAlbums(), ctx.prevData.likedAlbums);
      qc.setQueryData(
        meKeys.likedAlbumStatus(album.id),
        ctx.prevData.likedAlbumStatus
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.likedAlbums() });
      qc.invalidateQueries({
        queryKey: meKeys.likedAlbumStatus(album.id),
      });
    },
  });
}
