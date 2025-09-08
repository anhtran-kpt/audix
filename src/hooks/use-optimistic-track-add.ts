import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import {
  RecommendedTrackItem,
  TrackListItem,
} from "@/features/track/contracts/track-dto";
import { getApi, postApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlaylistDetail } from "@/features/playlist/contracts/playlist-dto";

type RecommendedTrackItemWithOptimistic = RecommendedTrackItem & {
  optimistic?: boolean;
};

type PlaylistDetailWithOptimistic = Omit<PlaylistDetail, "tracks"> & {
  tracks: RecommendedTrackItemWithOptimistic[];
};

type AddTrackToPlaylist = {
  playlistId: zCuidType;
  trackId: zCuidType;
};

export function useOptimisticTrackAdd() {
  const qc = useQueryClient();

  const recommendedKey = (playlistId: string) =>
    ["playlists", playlistId, "recommended"] as const;

  return useMutation({
    mutationFn: ({ playlistId, trackId }: AddTrackToPlaylist) =>
      postApi<TrackListItem>(`/playlists/${playlistId}/tracks`, { trackId }),

    onMutate: async ({ playlistId }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetail>(
        playlistKeys.detail(playlistId)
      );

      const optimistic: RecommendedTrackItemWithOptimistic = {
        id: `optimistic-${Date.now()}`,
        title: "Adding…",
        isExplicit: false,
        duration: 0,
        playCount: 0,
        album: { id: "optimistic", title: "Loading…", imageId: "placeholder" },
        artists: [],
        addedAt: new Date(),
        optimistic: true,
      };

      qc.setQueryData(
        playlistKeys.detail(playlistId),
        (old: PlaylistDetail | undefined) =>
          old ? { ...old, tracks: [...old.tracks, optimistic] } : old
      );

      return { prev, playlistId };
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.detail(ctx.playlistId), ctx.prev);
      }
    },

    onSuccess: async (newTrack, { playlistId, trackId }) => {
      qc.setQueryData(
        playlistKeys.detail(playlistId),
        (old: PlaylistDetailWithOptimistic | undefined) => {
          if (!old) return old;
          const updated = [...old.tracks];
          const optimisticIndex = updated.findIndex((t) => t.optimistic);

          if (optimisticIndex !== -1) {
            updated.splice(optimisticIndex, 1, {
              ...newTrack,
              addedAt: new Date(),
            });
          } else {
            updated.push({ ...newTrack, addedAt: new Date() });
          }

          return {
            ...old,
            tracks: updated,
            totalTracks: old.totalTracks + 1,
            duration: old.duration + newTrack.duration,
          };
        }
      );

      const rk = recommendedKey(playlistId);
      const currentRec =
        qc.getQueryData<RecommendedTrackItem[] | undefined>(rk) ?? [];

      const removedIdx = currentRec.findIndex((t) => t.id === trackId);

      const filteredRec = currentRec.filter((t) => t.id !== newTrack.id);

      const excludeSet = new Set<string>([
        ...filteredRec.map((t) => t.id),
        newTrack.id,
      ]);

      const BATCH = 8;
      let replacement: RecommendedTrackItem | undefined;

      try {
        const candidates = await getApi<RecommendedTrackItem[]>(
          `/playlists/${playlistId}/recommended?take=${BATCH}`
        );

        replacement = candidates.find((c) => !excludeSet.has(c.id));
      } catch (err) {}

      if (replacement) {
        if (removedIdx !== -1 && removedIdx <= filteredRec.length) {
          filteredRec.splice(removedIdx, 0, replacement);
        } else {
          filteredRec.unshift(replacement);
        }
      }

      const deduped = Array.from(
        new Map(filteredRec.map((t) => [t.id, t])).values()
      );

      qc.setQueryData(rk, deduped);
    },
  });
}
