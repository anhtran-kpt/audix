"use client";

import { deleteApi, putApi } from "@/lib/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meEndpoints } from "../api/me-endpoints";
import { meKeys } from "../api/me-keys";

export function useLikePlaylist(playlistId: string) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => putApi(meEndpoints.toggleLikePlaylist(playlistId), {}),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.libraryPlaylists() });

      const previousData = queryClient.getQueryData<string[]>(
        meKeys.libraryPlaylists()
      );

      queryClient.setQueryData<string[]>(meKeys.libraryPlaylists(), (old) => {
        if (!old) return [playlistId];
        if (old.includes(playlistId)) return old;
        return [...old, playlistId];
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          meKeys.libraryPlaylists(),
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.libraryPlaylists() });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => deleteApi(meEndpoints.toggleLikePlaylist(playlistId)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: meKeys.libraryPlaylists() });

      const previousData = queryClient.getQueryData<string[]>(
        meKeys.libraryPlaylists()
      );

      queryClient.setQueryData<string[]>(meKeys.libraryPlaylists(), (old) => {
        if (!old) return [];
        return old.filter((id) => id !== playlistId);
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          meKeys.libraryPlaylists(),
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.libraryPlaylists() });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}
