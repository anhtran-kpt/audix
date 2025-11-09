import { deleteApi } from "@/lib/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticCoverUpdate } from "./use-optimistic-cover-update";
import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { PlaylistBanner } from "@/features/playlist/data-access/playlist-repo";
import { toast } from "sonner";
import { PlaylistTracks } from "@/lib/data/playlist-data";

type RemoveTrackInput = {
  playlistId: string;
  trackId: string;
};

export function useRemoveTrackFromPlaylist() {
  const qc = useQueryClient();
  const updateCoverMutation = useOptimisticCoverUpdate();

  return useMutation({
    mutationFn: ({ playlistId, trackId }: RemoveTrackInput) =>
      deleteApi(`/playlists/${playlistId}/tracks/${trackId}`),

    onMutate: async ({ playlistId, trackId }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistKeys.banner(playlistId) }),
        qc.cancelQueries({ queryKey: playlistKeys.tracks(playlistId) }),
      ]);

      const prevBanner = qc.getQueryData<PlaylistBanner>(
        playlistKeys.banner(playlistId)
      );

      const prevTracks = qc.getQueryData<PlaylistTracks>(
        playlistKeys.tracks(playlistId)
      )?.tracks;

      if (!prevTracks || !prevBanner) return null;

      const newTracks = prevTracks.filter((t) => t.id !== trackId);
      const newImageIds = newTracks.map((t) => t.album.imageId);
      const imageIdSet = new Set(newImageIds);

      if (newTracks.length === 0) {
        updateCoverMutation.mutate({ playlistId, imageIds: [] });
      } else if (imageIdSet.size < 4) {
        updateCoverMutation.mutate({
          playlistId,
          imageIds: [newTracks[0].album.imageId],
        });
      }

      const removedTrack = prevTracks.find((t) => t.id === trackId);
      const removedTrackDuration = removedTrack?.duration ?? 0;

      qc.setQueryData<PlaylistBanner>(
        playlistKeys.banner(playlistId),
        (old) => {
          if (!old) return;

          return {
            ...old,
            totalTracks: (old.totalTracks ?? prevTracks.length) - 1,
            duration:
              (old.duration ?? prevTracks.reduce((a, t) => a + t.duration, 0)) -
              removedTrackDuration,
          };
        }
      );

      qc.setQueryData<PlaylistTracks>(
        playlistKeys.tracks(playlistId),
        (old) => {
          if (!old) return;

          return { ...old, tracks: newTracks };
        }
      );

      return { prevTracks, prevBanner, playlistId };
    },

    onError: (_err, _input, ctx) => {
      if (!ctx) return null;

      qc.setQueryData(playlistKeys.banner(ctx.playlistId), ctx.prevBanner);
      qc.setQueryData(playlistKeys.tracks(ctx.playlistId), ctx.prevTracks);
    },

    onSuccess: () => {
      toast.success(`Removed successfully!`);
    },

    onSettled: (_, __, { trackId }) => {
      qc.invalidateQueries({
        queryKey: playlistKeys.banner(trackId),
      });
      qc.invalidateQueries({
        queryKey: playlistKeys.tracks(trackId),
      });
    },
  });
}
