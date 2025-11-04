"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { artistKeys } from "../api/artist-keys";
import { deleteApi, postApi } from "@/lib/http/api";
import { meKeys } from "@/features/me/api/me-keys";
import { ArtistItem } from "../contracts/artist-dto";
import { artistEndpoints } from "../api/artist-endpoints";
import { FollowStatus } from "@/lib/data/artist-data";
import { MyFollowedArtists } from "@/lib/data/me-data";

export function useToggleFollowArtist(artist: ArtistItem) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ nextIsFollowing }: { nextIsFollowing: boolean }) => {
      const res = nextIsFollowing
        ? await postApi<FollowStatus>(artistEndpoints.follow(artist.id))
        : await deleteApi<FollowStatus>(artistEndpoints.follow(artist.id));
      return res;
    },

    onMutate: async ({ nextIsFollowing }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: artistKeys.followStatus(artist.id) }),
        qc.cancelQueries({ queryKey: meKeys.followedArtists() }),
      ]);

      const prevData = {
        followStatus: qc.getQueryData<FollowStatus>(
          artistKeys.followStatus(artist.id)
        ),
        followedArtists: qc.getQueryData<MyFollowedArtists>(
          meKeys.followedArtists()
        ),
      };

      qc.setQueryData<FollowStatus>(
        artistKeys.followStatus(artist.id),
        (old) => {
          const base = old ?? { isFollowing: false, followersCount: 0 };
          const delta = nextIsFollowing
            ? base.isFollowing
              ? 0
              : 1
            : base.isFollowing
            ? -1
            : 0;

          return {
            isFollowing: nextIsFollowing,
            followersCount: Math.max(0, (base.followersCount ?? 0) + delta),
          };
        }
      );

      qc.setQueryData<MyFollowedArtists>(meKeys.followedArtists(), (old) => {
        if (!old)
          return nextIsFollowing
            ? {
                pagination: { limit: 5, offset: 0, total: 1, hasMore: false },
                items: [artist],
              }
            : {
                pagination: { limit: 5, offset: 0, total: 1, hasMore: false },
                items: [],
              };

        if (nextIsFollowing) {
          const exists = old.items.some((a) => a.id === artist.id);
          return exists
            ? old
            : {
                ...old,
                pagination: {
                  ...old.pagination,
                  total: old.pagination.total + 1,
                },
                items: [artist, ...old.items],
              };
        }

        return {
          ...old,
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
          items: old.items.filter((a) => a.id !== artist.id),
        };
      });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      qc.setQueryData(
        artistKeys.followStatus(artist.id),
        ctx.prevData.followStatus
      );
      qc.setQueryData(meKeys.followedArtists(), ctx.prevData.followedArtists);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: artistKeys.followStatus(artist.id) });
      qc.invalidateQueries({ queryKey: meKeys.followedArtists() });
    },
  });
}
