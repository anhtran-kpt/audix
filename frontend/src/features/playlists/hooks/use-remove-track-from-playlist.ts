"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticCoverUpdate } from "./use-optimistic-cover-update";
import { toast } from "sonner";
import { playlistKeys } from "../api/keys";
import { PlaylistOverview, PlaylistTracks } from "../playlists.type";
import { removeTrackFromPlaylist } from "../playlist-actions";

type RemoveTrackInput = {
  playlistId: string;
  trackId: string;
};

export function useRemoveTrackFromPlaylist() {
  const qc = useQueryClient();
  const updateCoverMutation = useOptimisticCoverUpdate();

  return useMutation({
    mutationFn: async ({ playlistId, trackId }: RemoveTrackInput) =>
      await removeTrackFromPlaylist({ playlistId, trackId }),

    onMutate: async ({ playlistId, trackId }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistKeys.overview(playlistId) }),
        qc.cancelQueries({ queryKey: playlistKeys.tracks(playlistId) }),
      ]);

      const prevOverview = qc.getQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId)
      );

      const prevTracks = qc.getQueryData<PlaylistTracks>(
        playlistKeys.tracks(playlistId)
      )?.tracks;

      if (!prevTracks || !prevOverview) return null;

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

      qc.setQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId),
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

      return { prevTracks, prevOverview, playlistId };
    },

    onError: (_err, _input, ctx) => {
      if (!ctx) return null;

      qc.setQueryData(playlistKeys.overview(ctx.playlistId), ctx.prevOverview);
      qc.setQueryData(playlistKeys.tracks(ctx.playlistId), ctx.prevTracks);
    },

    onSuccess: () => {
      toast.success(`Removed successfully!`);
    },

    onSettled: (_, __, { trackId }) => {
      qc.invalidateQueries({
        queryKey: playlistKeys.overview(trackId),
      });
      qc.invalidateQueries({
        queryKey: playlistKeys.tracks(trackId),
      });
    },
  });
}
