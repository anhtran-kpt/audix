"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyFollowedArtists } from "@/features/me/me-data";
import { ArtistFollowersCount } from "@/features/artist/artist-data";
import { ArtistItem } from "../artist-types";
import { artistKeys } from "../artist-keys";
import { useBaseUserOverlay } from "@/features/shared/hooks/use-base-user-overlay";
import { meKeys } from "@/features/me/me-keys";
import { followArtist, unfollowArtist } from "../artist-actions";

export function useToggleFollowArtist() {
  const qc = useQueryClient();

  const { map, optimisticToggle, revert, getPrev } =
    useBaseUserOverlay("artists");

  const mutation = useMutation({
    mutationKey: ["toggle-follow-artist"],
    mutationFn: async ({
      artist,
      isCurrentlyFollowed,
    }: {
      artist: ArtistItem;
      isCurrentlyFollowed: boolean;
    }) => {
      return isCurrentlyFollowed
        ? await unfollowArtist(artist.id)
        : await followArtist(artist.id);
    },

    onMutate: async ({ artist }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: artistKeys.followersCount(artist.id) }),
        qc.cancelQueries({ queryKey: meKeys.followedArtists() }),
      ]);

      const prevFollows = getPrev();
      const isCurrentlyFollowed = !!prevFollows[artist.id];
      const optimisticFollowed = !isCurrentlyFollowed;

      optimisticToggle(artist.id);

      const prevFollowersCount = qc.getQueryData<ArtistFollowersCount>(
        artistKeys.followersCount(artist.id)
      );

      const prevFollowedArtists = qc.getQueryData<MyFollowedArtists>(
        meKeys.followedArtists()
      );

      if (!prevFollowersCount || !prevFollowedArtists) return null;

      qc.setQueryData<ArtistFollowersCount>(
        artistKeys.followersCount(artist.id),
        (old) => old && old + (optimisticFollowed ? 1 : -1)
      );

      qc.setQueryData<MyFollowedArtists>(meKeys.followedArtists(), (old) => {
        if (!old) return;

        return isCurrentlyFollowed
          ? {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total - 1,
              },
              items: old.items.filter((a) => a.id !== artist.id),
            }
          : {
              ...old,
              pagination: {
                ...old.pagination,
                total: old.pagination.total + 1,
              },
              items: [artist, ...old.items],
            };
      });

      return { prevFollowersCount, prevFollows, prevFollowedArtists };
    },

    onError: (_err, vars, ctx) => {
      if (!ctx) return;
      revert(ctx.prevFollows);
      qc.setQueryData(
        artistKeys.followersCount(vars.artist.id),
        ctx.prevFollowersCount
      );
      qc.setQueryData(meKeys.followedArtists(), ctx.prevFollowedArtists);
    },

    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: artistKeys.followersCount(vars.artist.id),
      });
      qc.invalidateQueries({ queryKey: meKeys.followedArtists() });
    },
  });

  return {
    isFollowed: (id: string) => !!map[id],
    isPending: mutation.isPending,
    toggleFollow: (artist: ArtistItem) => {
      const isCurrentlyFollowed = !!map[artist.id];
      mutation.mutate({ artist, isCurrentlyFollowed });
    },
  };
}
