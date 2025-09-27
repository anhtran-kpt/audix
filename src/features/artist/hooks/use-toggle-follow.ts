"use client";

import { deleteApi, postApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowStatus } from "../contracts/artist-schema";
import { artistKeys } from "../query/artist-keys";

export function useToggleFollow(artistId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ nextIsFollowing }: { nextIsFollowing: boolean }) => {
      const res = nextIsFollowing
        ? await postApi<FollowStatus>(`/artists/${artistId}/follow`)
        : await deleteApi<FollowStatus>(`/artists/${artistId}/follow`);

      return res;
    },

    onMutate: async ({ nextIsFollowing }) => {
      await qc.cancelQueries({ queryKey: artistKeys.followStatus(artistId) });

      const prev = qc.getQueryData<FollowStatus>(
        artistKeys.followStatus(artistId)
      );

      qc.setQueryData<FollowStatus>(
        artistKeys.followStatus(artistId),
        (old) => {
          const base = old ?? { isFollowing: false, followersCount: 0 };
          const delta = nextIsFollowing ? 1 : -1;
          return {
            isFollowing: nextIsFollowing,
            followersCount: Math.max(0, (base.followersCount ?? 0) + delta),
          };
        }
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        qc.setQueryData(artistKeys.followStatus(artistId), ctx.prev);
    },

    onSuccess: (server) => {
      qc.setQueryData(artistKeys.followStatus(artistId), server);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: artistKeys.followStatus(artistId) });
      qc.invalidateQueries({ queryKey: artistKeys.sidebarArtists() });
    },
  });
}
