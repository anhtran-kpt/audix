"use client";

import { useAddTrackToPlaylist } from "./use-add-track-to-playlist";
import { useQueryClient } from "@tanstack/react-query";
import { getApi } from "@/lib/axios";
import { TrackItem } from "@/features/track/track-types";

type RecommendedTrackItem = TrackItem & { optimistic?: boolean };

export function useAddRecommendedTrackToPlaylist() {
  const qc = useQueryClient();
  const base = useAddTrackToPlaylist();

  return {
    ...base,
    mutateAsync: async (vars: { playlistId: string; track: TrackItem }) => {
      const ctx = await base.mutateAsync(vars);
      const { playlistId, track } = vars;
      const rk = ["playlists", playlistId, "recommended"] as const;

      const current = qc.getQueryData<RecommendedTrackItem[]>(rk) ?? [];
      const filtered = current.filter((t) => t.id !== track.id);
      const excludeSet = new Set(filtered.map((t) => t.id));

      try {
        const candidates = await getApi<RecommendedTrackItem[]>(
          `/playlists/${playlistId}/recommended?take=8`
        );
        const replacement = candidates.find((c) => !excludeSet.has(c.id));
        if (replacement) filtered.unshift(replacement);
      } catch {}

      const deduped = Array.from(
        new Map(filtered.map((t) => [t.id, t])).values()
      );
      qc.setQueryData(rk, deduped);

      return ctx;
    },
  };
}
