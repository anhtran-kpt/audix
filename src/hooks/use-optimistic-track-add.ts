"use client";

import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import {
  RecommendedTrackItem,
  TrackListItem,
} from "@/features/track/contracts/track-dto";
import { getApi, postApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlaylistDetail } from "@/features/playlist/contracts/playlist-dto";
import { useOptimisticCoverUpdate } from "./use-optimistic-cover-update";
import { toast } from "sonner";

type RecommendedTrackItemWithOptimistic = RecommendedTrackItem & {
  optimistic?: boolean;
};

type PlaylistDetailWithOptimistic = Omit<
  PlaylistDetail,
  "tracks" | "imageUrl"
> & {
  tracks: RecommendedTrackItemWithOptimistic[];
};

type AddTrackToPlaylist = {
  playlistId: zCuidType;
  track: RecommendedTrackItem;
};

export function useOptimisticTrackAdd() {
  const qc = useQueryClient();
  const updateCoverMutation = useOptimisticCoverUpdate();

  const recommendedKey = (playlistId: string) =>
    ["playlists", playlistId, "recommended"] as const;

  return useMutation({
    mutationFn: ({ playlistId, track }: AddTrackToPlaylist) => {
      return postApi<TrackListItem>(`/playlists/${playlistId}/tracks`, {
        trackId: track.id,
      });
    },

    onMutate: async ({ playlistId, track }) => {
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });

      const prev = qc.getQueryData<PlaylistDetailWithOptimistic>(
        playlistKeys.detail(playlistId)
      );

      if (!prev) return null;

      const optimistic: RecommendedTrackItemWithOptimistic = {
        ...track,
        addedAt: new Date(track.addedAt),
        optimistic: true,
      };

      const newTracks = [...prev.tracks, optimistic];

      const newImageIds = newTracks.map((t) => t.album.imageId);
      const imageIdSet = new Set(newImageIds);

      const isFirstTrack = prev.tracks.length === 0;
      const has4UniqueImages = imageIdSet.size === 4;

      if (isFirstTrack || has4UniqueImages) {
        updateCoverMutation.mutate({
          playlistId,
          imageIds: isFirstTrack
            ? [track.album.imageId]
            : Array.from(imageIdSet).slice(0, 4),
        });
      }

      qc.setQueryData(playlistKeys.detail(playlistId), {
        ...prev,
        tracks: newTracks,
      });

      return {
        prev,
        playlistId,
        optimisticIndex: newTracks.length - 1,
        trackId: track.id,
      };
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(playlistKeys.detail(ctx.playlistId), ctx.prev);
      }
    },

    onSuccess: async (newTrack, { playlistId }, ctx) => {
      toast.success(`Added ${newTrack.title} to playlist.`);

      qc.setQueryData(
        playlistKeys.detail(playlistId),
        (old: PlaylistDetailWithOptimistic | undefined) => {
          if (!old) return old;

          const updated = [...old.tracks];
          if (ctx && ctx.optimisticIndex !== undefined) {
            updated[ctx.optimisticIndex] = newTrack;
          } else {
            const idx = updated.findIndex((t) => t.id === newTrack.id);
            if (idx !== -1) updated[idx] = newTrack;
            else updated.push(newTrack);
          }

          return {
            ...old,
            tracks: updated,
            totalTracks: old.totalTracks + 1,
            duration: old.duration + newTrack.duration,
          };
        }
      );

      qc.invalidateQueries({
        queryKey: playlistKeys.userPlaylists(newTrack.id),
      });

      const rk = recommendedKey(playlistId);
      const currentRec =
        qc.getQueryData<RecommendedTrackItem[] | undefined>(rk) ?? [];

      const filteredRec = currentRec.filter((t) => t.id !== ctx?.trackId);
      const excludeSet = new Set([
        ...filteredRec.map((t) => t.id),
        ctx?.trackId ?? "",
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
        filteredRec.unshift(replacement);
      }

      const deduped = Array.from(
        new Map(filteredRec.map((t) => [t.id, t])).values()
      );

      qc.setQueryData(rk, deduped);
    },
  });
}
