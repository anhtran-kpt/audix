"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { deleteApi, postApi } from "@/lib/http/api";
import { PlaylistBanner, PlaylistTracks } from "@/lib/data/playlist-data";
import { meKeys } from "../api/me-keys";
import { MyFavoriteSongsPlaylist } from "@/lib/data/me-data";
import { trackKeys } from "@/features/track/api/track-keys";

export function useToggleLikeTrack() {
  const qc = useQueryClient();
  const { updateTrackLikeStatus } = usePlaybackStore();

  return useMutation({
    mutationKey: ["toggle-like-track"],
    mutationFn: async ({
      likedPlaylistId,
      track,
    }: {
      track: TrackItem;
      likedPlaylistId: string;
    }) => {
      return track.isLiked
        ? deleteApi(`/playlists/${likedPlaylistId}/tracks/${track.id}`)
        : postApi(`/playlists/${likedPlaylistId}/tracks`, {
            body: { trackId: track.id },
          });
    },
    onMutate: async ({
      track,
      likedPlaylistId,
    }: {
      track: TrackItem;
      likedPlaylistId: string;
    }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistKeys.banner(likedPlaylistId) }),
        qc.cancelQueries({ queryKey: playlistKeys.tracks(likedPlaylistId) }),
        qc.cancelQueries({ queryKey: meKeys.favoriteSongsPlaylist() }),
        qc.cancelQueries({ queryKey: trackKeys.detail(track.id) }),
      ]);

      const prevInfo = qc.getQueryData<PlaylistBanner>(
        playlistKeys.banner(likedPlaylistId)
      );

      const prevTracks = qc.getQueryData<PlaylistTracks>(
        playlistKeys.tracks(likedPlaylistId)
      )?.tracks;

      const prevFavoriteSongsPlaylist =
        qc.getQueryData<MyFavoriteSongsPlaylist>(
          meKeys.favoriteSongsPlaylist()
        );

      const prevTrack = qc.getQueryData<TrackItem>(trackKeys.detail(track.id));

      if (!prevTracks || !prevInfo || !prevFavoriteSongsPlaylist || !prevTrack)
        return null;

      if (track.isLiked) {
        const newTracks = prevTracks.filter((t) => t.id !== track.id);
        const removedTrack = prevTracks.find((t) => t.id === track.id);
        const removedTrackDuration = removedTrack?.duration ?? 0;

        qc.setQueryData<PlaylistBanner>(
          playlistKeys.banner(likedPlaylistId),
          (old) => {
            if (!old) return;

            return {
              ...old,
              totalTracks: (old.totalTracks ?? prevTracks.length) - 1,
              duration:
                (old.duration ??
                  prevTracks.reduce((a, t) => a + t.duration, 0)) -
                removedTrackDuration,
            };
          }
        );

        qc.setQueryData<PlaylistTracks>(
          playlistKeys.tracks(likedPlaylistId),
          (old) => {
            if (!old) return;

            return { ...old, tracks: newTracks };
          }
        );

        qc.setQueryData<MyFavoriteSongsPlaylist>(
          meKeys.favoriteSongsPlaylist(),
          (old) => old && { ...old, totalTracks: old.totalTracks - 1 }
        );
      } else {
        const optimisticTrack = {
          ...track,
          addedAt: new Date(),
          trackNumber: prevTracks.length + 1,
          isLiked: !track.isLiked,
        };

        const newTracks = [...prevTracks, optimisticTrack];

        qc.setQueryData<PlaylistTracks>(
          playlistKeys.tracks(likedPlaylistId),
          (old) => old && { ...old, tracks: newTracks }
        );

        qc.setQueryData<PlaylistBanner>(
          playlistKeys.banner(likedPlaylistId),
          (old) =>
            old && {
              ...old,
              totalTracks: old.totalTracks + 1,
              duration: old.duration + track.duration,
            }
        );

        qc.setQueryData<MyFavoriteSongsPlaylist>(
          meKeys.favoriteSongsPlaylist(),
          (old) => old && { ...old, totalTracks: old.totalTracks + 1 }
        );
      }

      updateTrackLikeStatus(track.id, !track.isLiked);
      qc.setQueryData(
        trackKeys.detail(track.id),
        (old: TrackItem | undefined) =>
          old ? { ...old, isLiked: !old.isLiked } : old
      );

      return {
        prevInfo,
        prevTracks,
        prevFavoriteSongsPlaylist,
        prevTrack,
        likedPlaylistId,
        track,
      };
    },

    onError: (_, __, ctx) => {
      if (ctx) {
        qc.setQueryData(
          playlistKeys.tracks(ctx.likedPlaylistId),
          ctx.prevTracks
        );
        qc.setQueryData(playlistKeys.banner(ctx.likedPlaylistId), ctx.prevInfo);
        qc.setQueryData(
          meKeys.favoriteSongsPlaylist(),
          ctx.prevFavoriteSongsPlaylist
        );
        qc.setQueryData(trackKeys.detail(ctx.track.id), ctx.prevTrack);
      }
    },

    onSettled: (_res, _err, { likedPlaylistId, track }) => {
      qc.invalidateQueries({ queryKey: playlistKeys.tracks(likedPlaylistId) });
      qc.invalidateQueries({ queryKey: playlistKeys.banner(likedPlaylistId) });
      qc.invalidateQueries({ queryKey: meKeys.favoriteSongsPlaylist() });
      qc.invalidateQueries({ queryKey: trackKeys.detail(track.id) });
    },
  });
}
