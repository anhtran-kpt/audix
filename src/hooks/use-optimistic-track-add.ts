import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import {
  RecommendedTrackItem,
  TrackListItem,
} from "@/features/track/contracts/track-dto";
import { getApi, postApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlaylistDetail } from "@/features/playlist/contracts/playlist-dto";
import { shouldUpdateCover } from "@/lib/helpers/should-update-cover";
import { buildPlaylistCoverUrl } from "@/lib/helpers/build-playlist-cover-url";

type RecommendedTrackItemWithOptimistic = RecommendedTrackItem & {
  optimistic?: boolean;
};

type PlaylistDetailWithOptimistic = Omit<
  PlaylistDetail,
  "tracks" | "imageUrl"
> & {
  tracks: RecommendedTrackItemWithOptimistic[];
  optimisticCover?: boolean;
};

type AddTrackToPlaylist = {
  playlistId: zCuidType;
  track: RecommendedTrackItem;
};

export function useOptimisticTrackAdd() {
  const qc = useQueryClient();

  const recommendedKey = (playlistId: string) =>
    ["playlists", playlistId, "recommended"] as const;

  return useMutation({
    mutationFn: ({ playlistId, track }: AddTrackToPlaylist) =>
      postApi<TrackListItem>(`/playlists/${playlistId}/tracks`, {
        trackId: track.id,
      }),

    onMutate: async ({ playlistId, track }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetail>(
        playlistKeys.detail(playlistId)
      );

      const optimistic: RecommendedTrackItemWithOptimistic = {
        ...track,
        addedAt: new Date(track.addedAt),
        optimistic: true,
      };

      const old = qc.getQueryData<PlaylistDetailWithOptimistic>(
        playlistKeys.detail(playlistId)
      );

      if (!old) return { prev, playlistId };

      const newTracks = [...old.tracks, optimistic];

      const newImageIds = newTracks.map((t) => t.album.imageId);

      const nextSet = new Set(newImageIds);

      let newCover = old.imageId;

      if (newTracks.length === 1) {
        newCover = optimistic.album.imageId;
      } else if (nextSet.size === 4) {
        newCover = buildPlaylistCoverUrl(Array.from(nextSet).slice(0, 4));
      }

      qc.setQueryData(playlistKeys.detail(playlistId), {
        ...old,
        tracks: newTracks,
        imageId: newCover,
        optimisticCover: true,
      });

      return { prev, playlistId };
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.detail(ctx.playlistId), ctx.prev);
      }
    },

    onSuccess: async (newTrack, { playlistId, track }) => {
      qc.setQueryData(
        playlistKeys.detail(playlistId),
        (old: PlaylistDetailWithOptimistic | undefined) => {
          if (!old) return old;

          const updated = [...old.tracks];
          const optimisticIndex = updated.findIndex((t) => t.optimistic);

          if (optimisticIndex !== -1) {
            updated[optimisticIndex] = { ...newTrack, optimistic: false };
          } else {
            updated.push(newTrack);
          }

          return {
            ...old,
            tracks: updated,
            totalTracks: old.totalTracks + 1,
            duration: old.duration + newTrack.duration,
            optimisticCover: false,
          };
        }
      );

      const rk = recommendedKey(playlistId);
      const currentRec =
        qc.getQueryData<RecommendedTrackItem[] | undefined>(rk) ?? [];

      const removedIdx = currentRec.findIndex((t) => t.id === track.id);
      const filteredRec = currentRec.filter((t) => t.id !== track.id);

      const excludeSet = new Set<string>([
        ...filteredRec.map((t) => t.id),
        track.id,
      ]);

      const BATCH = 8;
      let replacement: RecommendedTrackItem | undefined;

      try {
        const candidates = await getApi<RecommendedTrackItem[]>(
          `/playlists/${playlistId}/recommended?take=${BATCH}`
        );
        replacement = candidates.find((c) => !excludeSet.has(c.id));
      } catch {}

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
