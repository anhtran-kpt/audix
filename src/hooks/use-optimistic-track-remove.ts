import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { deleteApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RecommendedTrackItem = {
  id: string;
  title: string;
  duration: number;
  playCount: number;
  album: {
    id: string;
    title: string;
    imageId: string;
  };
  artists: { artist: { id: string; name: string } }[];
  addedAt: Date;
  isExplicit?: boolean;
};

type PlaylistDetail = {
  id: string;
  tracks: RecommendedTrackItem[];
};

type RemoveTrackInput = {
  playlistId: string;
  trackId: string;
};

export function useOptimisticTrackRemove() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, trackId }: RemoveTrackInput) =>
      deleteApi(`/playlists/${playlistId}/tracks/${trackId}`),

    onMutate: async ({ playlistId, trackId }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetail>(
        playlistKeys.detail(playlistId)
      );

      qc.setQueryData(
        playlistKeys.detail(playlistId),
        (old: PlaylistDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            tracks: old.tracks.filter((t) => t.id !== trackId),
          };
        }
      );

      return { prev, playlistId };
    },

    onError: (err, _, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.detail(ctx.playlistId), ctx.prev);
      }
    },
  });
}
