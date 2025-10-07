"use client";

import { deleteApi, putApi } from "@/lib/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meEndpoints } from "../api/me-endpoints";
import { meKeys } from "../api/me-keys";

export function useLikeAlbum(albumId: string) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => putApi(meEndpoints.toggleLikeAlbum(albumId), {}),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.likedAlbums() });

      const previousData = queryClient.getQueryData<string[]>(
        meKeys.likedAlbums()
      );

      queryClient.setQueryData<string[]>(meKeys.likedAlbums(), (old) => {
        if (!old) return [albumId];
        if (old.includes(albumId)) return old;
        return [...old, albumId];
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(meKeys.likedAlbums(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.likedAlbums() });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => deleteApi(meEndpoints.toggleLikeAlbum(albumId)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.likedAlbums() });

      const previousData = queryClient.getQueryData<string[]>(
        meKeys.likedAlbums()
      );

      queryClient.setQueryData<string[]>(meKeys.likedAlbums(), (old) => {
        if (!old) return [];
        return old.filter((id) => id !== albumId);
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(meKeys.likedAlbums(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.likedAlbums() });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
