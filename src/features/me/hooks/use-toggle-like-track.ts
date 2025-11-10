"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrackItem } from "@/features/track/track-types";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { deleteApi, postApi } from "@/lib/api";
import { MyFavoriteSongsPlaylist } from "@/features/me/me-data";
import { meKeys } from "../me-keys";
import { playlistKeys } from "@/features/playlist/playlist-keys";
import { useBaseUserOverlay } from "@/features/shared/hooks/use-base-user-overlay";
import { trackKeys } from "@/features/track/track-keys";
import {
  PlaylistOverview,
  PlaylistTracks,
} from "@/features/playlist/playlist-types";

export function useToggleLikeTrack() {
  const qc = useQueryClient();
  const { updateTrackLikeStatus } = usePlaybackStore();

  const { map, optimisticToggle, revert, getPrev } =
    useBaseUserOverlay("tracks");

  const mutation = useMutation({
    mutationKey: ["toggle-like-track"],
    mutationFn: async ({
      likedPlaylistId,
      track,
      isCurrentlyLiked,
    }: {
      track: TrackItem;
      likedPlaylistId: string;
      isCurrentlyLiked: boolean;
    }) => {
      return isCurrentlyLiked
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
        qc.cancelQueries({ queryKey: playlistKeys.overview(likedPlaylistId) }),
        qc.cancelQueries({ queryKey: playlistKeys.tracks(likedPlaylistId) }),
        qc.cancelQueries({ queryKey: meKeys.favoriteSongsPlaylist() }),
        qc.cancelQueries({ queryKey: trackKeys.detail(track.id) }),
      ]);

      const prevLikes = getPrev();
      const isCurrentlyLiked = !!prevLikes[track.id];
      const optimisticLiked = !isCurrentlyLiked;

      optimisticToggle(track.id);
      updateTrackLikeStatus(track.id, optimisticLiked);

      qc.setQueryData(
        trackKeys.detail(track.id),
        (old: TrackItem | undefined) =>
          old ? { ...old, isLiked: optimisticLiked } : old
      );

      const prevInfo = qc.getQueryData<PlaylistOverview>(
        playlistKeys.overview(likedPlaylistId)
      );
      const prevTracks = qc.getQueryData<PlaylistTracks>(
        playlistKeys.tracks(likedPlaylistId)
      )?.tracks;
      const prevFavoriteSongsPlaylist =
        qc.getQueryData<MyFavoriteSongsPlaylist>(
          meKeys.favoriteSongsPlaylist()
        );

      if (!prevTracks || !prevInfo || !prevFavoriteSongsPlaylist) return null;

      if (isCurrentlyLiked) {
        qc.setQueryData<PlaylistTracks>(
          playlistKeys.tracks(likedPlaylistId),
          (old) =>
            old && {
              ...old,
              tracks: old.tracks.filter((t) => t.id !== track.id),
            }
        );

        qc.setQueryData<PlaylistOverview>(
          playlistKeys.overview(likedPlaylistId),
          (old) =>
            old && {
              ...old,
              totalTracks: old.totalTracks - 1,
              duration: old.duration - track.duration,
            }
        );

        qc.setQueryData<MyFavoriteSongsPlaylist>(
          meKeys.favoriteSongsPlaylist(),
          (old) => old && { ...old, totalTracks: old.totalTracks - 1 }
        );
      } else {
        qc.setQueryData<PlaylistTracks>(
          playlistKeys.tracks(likedPlaylistId),
          (old) =>
            old && {
              ...old,
              tracks: [
                ...old.tracks,
                {
                  ...track,
                  addedAt: new Date(),
                  trackNumber: prevTracks.length + 1,
                  isLiked: true,
                },
              ],
            }
        );

        qc.setQueryData<PlaylistOverview>(
          playlistKeys.overview(likedPlaylistId),
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

      return {
        prevLikes,
        prevTracks,
        prevInfo,
        prevFavoriteSongsPlaylist,
        track,
        likedPlaylistId,
        isCurrentlyLiked,
      };
    },

    onError: (_, __, ctx) => {
      if (!ctx) return;
      revert(ctx.prevLikes);
      qc.setQueryData(playlistKeys.tracks(ctx.likedPlaylistId), {
        tracks: ctx.prevTracks,
      });
      qc.setQueryData(playlistKeys.overview(ctx.likedPlaylistId), ctx.prevInfo);
      qc.setQueryData(
        meKeys.favoriteSongsPlaylist(),
        ctx.prevFavoriteSongsPlaylist
      );
      qc.setQueryData(trackKeys.detail(ctx.track.id), ctx.track);
      updateTrackLikeStatus(ctx.track.id, ctx.isCurrentlyLiked);
    },

    onSettled: (_res, _err, { likedPlaylistId, track }) => {
      qc.invalidateQueries({ queryKey: playlistKeys.tracks(likedPlaylistId) });
      qc.invalidateQueries({
        queryKey: playlistKeys.overview(likedPlaylistId),
      });
      qc.invalidateQueries({ queryKey: meKeys.favoriteSongsPlaylist() });
      qc.invalidateQueries({ queryKey: trackKeys.detail(track.id) });
    },
  });

  return {
    isLiked: (id: string) => !!map[id],
    isPending: mutation.isPending,
    toggleLike: ({
      likedPlaylistId,
      track,
    }: {
      likedPlaylistId: string;
      track: TrackItem;
    }) => {
      const isCurrentlyLiked = !!map[track.id];
      mutation.mutate({ likedPlaylistId, track, isCurrentlyLiked });
    },
  };
}
