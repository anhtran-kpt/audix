"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/lib/axios";
import { toast } from "sonner";
import { useOptimisticCoverUpdate } from "./use-optimistic-cover-update";
import { TrackItem } from "@/features/track/track-types";
import { playlistKeys } from "../api/keys";
import { PlaylistOverview, PlaylistTracks } from "../playlists.type";

type AddTrackToPlaylist = {
  playlistId: string;
  track: TrackItem;
};

export function useAddTrackToPlaylist() {
  const qc = useQueryClient();
  const updateCoverMutation = useOptimisticCoverUpdate();

  return useMutation({
    mutationFn: ({ playlistId, track }: AddTrackToPlaylist) =>
      postApi<TrackItem>(`/playlists/${playlistId}/tracks`, {
        body: { trackId: track.id },
      }),

    onMutate: async ({ playlistId, track }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistKeys.overview(playlistId) }),
        qc.cancelQueries({ queryKey: playlistKeys.tracks(playlistId) }),
      ]);

      const prevInfo = qc.getQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId)
      );
      const prevTracks = qc.getQueryData<PlaylistTracks>(
        playlistKeys.tracks(playlistId)
      )?.tracks;

      if (!prevTracks || !prevInfo) return null;

      const optimisticTrack = {
        ...track,
        addedAt: new Date(),
        trackNumber: prevTracks.length + 1,
      };

      const newTracks = [...prevTracks, optimisticTrack];

      const imageIds = newTracks.map((t) => t.album.imageId);
      const uniqueIds = Array.from(new Set(imageIds));

      if (prevTracks.length === 0 || uniqueIds.length === 4) {
        updateCoverMutation.mutate({
          playlistId,
          imageIds:
            prevTracks.length === 0
              ? [track.album.imageId]
              : uniqueIds.slice(0, 4),
        });
      }

      qc.setQueryData<PlaylistTracks>(
        playlistKeys.tracks(playlistId),
        (old) => old && { ...old, tracks: newTracks }
      );

      qc.setQueryData<PlaylistOverview>(
        playlistKeys.overview(playlistId),
        (old) =>
          old && {
            ...old,
            totalTracks: old.totalTracks + 1,
            duration: old.duration + track.duration,
          }
      );

      return { prevInfo, prevTracks, playlistId, track };
    },

    onError: (_, __, ctx) => {
      if (!ctx) return;
      qc.setQueryData(playlistKeys.tracks(ctx.playlistId), ctx.prevTracks);
      qc.setQueryData(playlistKeys.overview(ctx.playlistId), ctx.prevInfo);
    },

    onSuccess: (track) => {
      toast.success(`Added ${track.title} to playlist.`);
    },
  });
}
