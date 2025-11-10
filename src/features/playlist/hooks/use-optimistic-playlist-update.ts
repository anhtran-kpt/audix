"use client";

import { patchApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PlaylistItem,
  PlaylistOverview,
  UpdatePlaylistInput,
  UpdatePlaylistOutput,
} from "../playlist-types";
import { playlistKeys } from "../playlist-keys";

export const useOptimisticPlaylistUpdate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      input,
    }: {
      playlistId: string;
      input: UpdatePlaylistInput;
    }) =>
      patchApi<UpdatePlaylistOutput>(`/playlists/${playlistId}`, {
        body: input,
      }),

    onMutate: async ({ playlistId, input }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.overview(playlistId) });

      const prev = qc.getQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId)
      );

      qc.setQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId),
        (prev) =>
          prev
            ? {
                ...prev,
                title: input.title ?? prev.title,
                description: input.description ?? prev.description,
              }
            : prev
      );

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (prev) =>
        prev
          ? prev.map((pl) =>
              pl.id === playlistId
                ? {
                    ...pl,
                    title: input.title ?? pl.title,
                  }
                : pl
            )
          : prev
      );

      return { prev };
    },

    onError: (_err, { playlistId }, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.overview(playlistId), ctx.prev);
      }
    },

    onSuccess: (updatedPlaylist, { playlistId }) => {
      toast.success("Playlist updated successful!");
      qc.setQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId),
        (prev) =>
          prev
            ? {
                ...prev,
                title: updatedPlaylist.title ?? prev.title,
                description: updatedPlaylist.description ?? prev.description,
              }
            : prev
      );

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (prev) =>
        prev
          ? prev.map((pl) =>
              pl.id === playlistId
                ? {
                    ...pl,
                    title: updatedPlaylist.title ?? pl.title,
                  }
                : pl
            )
          : prev
      );
    },
  });
};
