"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { useAddTrackToPlaylist } from "@/features/playlist/hooks/use-add-track-to-playlist";
import { useRemoveTrackFromPlaylist } from "@/features/playlist/hooks/use-remove-track-from-playlist";
import { artistKeys } from "@/features/artist/api/artist-keys";
import { albumKeys } from "@/features/album/api/album-keys";
import { usePlaybackStore } from "@/stores/use-playback-store";

export function useToggleLikeTrack() {
  const qc = useQueryClient();
  const { updateTrackLikeStatus } = usePlaybackStore();
  const addTrack = useAddTrackToPlaylist();
  const removeTrack = useRemoveTrackFromPlaylist();

  return useMutation({
    mutationFn: async ({
      track,
      likedPlaylistId,
    }: {
      track: TrackItem;
      likedPlaylistId: string;
    }) => {
      if (track.isLiked) {
        await removeTrack.mutateAsync({
          playlistId: likedPlaylistId,
          trackId: track.id,
        });
        return { isLiked: false };
      } else {
        await addTrack.mutateAsync({
          playlistId: likedPlaylistId,
          track,
        });
        return { isLiked: true };
      }
    },

    onSuccess: (response, { track }) => {
      track.artists.forEach((artist) =>
        qc.invalidateQueries({ queryKey: artistKeys.popularTracks(artist.id) })
      );
      qc.invalidateQueries({ queryKey: albumKeys.tracks(track.album.id) });

      updateTrackLikeStatus(track.id, response.isLiked);
    },
  });
}
