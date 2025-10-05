import { deleteApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticCoverUpdate } from "./use-optimistic-cover-update";
import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { PlaylistDetail } from "@/features/playlist/data-access/playlist-repo";

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
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetail>(
        playlistKeys.detail(playlistId)
      );
      if (!prev) return { prev, playlistId };

      const newTracks = prev.tracks.filter((t) => t.id !== trackId);
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

      const removedTrack = prev.tracks.find((t) => t.id === trackId);
      const removedTrackDuration = removedTrack?.duration ?? 0;

      qc.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), {
        ...prev,
        tracks: newTracks,
        totalTracks: (prev.totalTracks ?? prev.tracks.length) - 1,
        duration:
          (prev.duration ?? prev.tracks.reduce((a, t) => a + t.duration, 0)) -
          removedTrackDuration,
      });

      return { prev, playlistId };
    },

    onError: (_err, _input, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.detail(ctx.playlistId), ctx.prev);
      }
    },
    onSuccess: (_, { trackId }) => {
      qc.invalidateQueries({
        queryKey: playlistKeys.detail(trackId),
      });
    },
  });
}
