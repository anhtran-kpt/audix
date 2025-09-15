import {
  PlaylistDetail,
  SidebarPlaylist,
  UpdatePlaylistInput,
  UpdatePlaylistOutput,
  UserPlaylist,
} from "@/features/playlist/contracts/playlist-dto";
import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { patchApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useOptimisticPlaylistUpdate = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      input,
    }: {
      playlistId: zCuidType;
      input: UpdatePlaylistInput;
    }) => patchApi<UpdatePlaylistOutput>(`/playlists/${playlistId}`, input),

    onMutate: async ({ playlistId, input }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetail>(
        playlistKeys.detail(playlistId)
      );

      qc.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (prev) =>
        prev
          ? {
              ...prev,
              title: input.title ?? prev.title,
              description: input.description ?? prev.description,
            }
          : prev
      );

      qc.setQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists(),
        (prev) =>
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
        qc.setQueryData(playlistKeys.detail(playlistId), ctx.prev);
      }
    },

    onSuccess: (updatedPlaylist, { playlistId }) => {
      toast.success("Playlist updated successful!");
      qc.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (prev) =>
        prev
          ? {
              ...prev,
              title: updatedPlaylist.title ?? prev.title,
              description: updatedPlaylist.description ?? prev.description,
            }
          : prev
      );

      qc.setQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists(),
        (prev) =>
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

      qc.setQueryData<UserPlaylist[]>(
        playlistKeys.userPlaylists(playlistId),
        (prev) =>
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
