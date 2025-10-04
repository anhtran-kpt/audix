"use client";

import { deleteApi, putApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meEndpoints } from "../api/me-endpoints";
import { meKeys } from "../api/me-keys";

export function useLikeAlbum(albumId: string) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => putApi(meEndpoints.toggleLikeAlbum(albumId), {}),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.libraryAlbums() });

      const previousData = queryClient.getQueryData<string[]>(
        meKeys.libraryAlbums()
      );

      queryClient.setQueryData<string[]>(meKeys.libraryAlbums(), (old) => {
        if (!old) return [albumId];
        if (old.includes(albumId)) return old;
        return [...old, albumId];
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(meKeys.libraryAlbums(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.libraryAlbums() });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => deleteApi(meEndpoints.toggleLikeAlbum(albumId)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.libraryAlbums() });

      const previousData = queryClient.getQueryData<string[]>(
        meKeys.libraryAlbums()
      );

      queryClient.setQueryData<string[]>(meKeys.libraryAlbums(), (old) => {
        if (!old) return [];
        return old.filter((id) => id !== albumId);
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(meKeys.libraryAlbums(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.libraryAlbums() });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
