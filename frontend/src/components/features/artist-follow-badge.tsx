"use client";

import { ArtistFollowersCount } from "@/features/artist/artist-data";
import { artistQueryOptions } from "@/features/artist/artist-query-options";
import { useQuery } from "@tanstack/react-query";
import pluralize from "pluralize";

type ArtistFollowersBadgeProps = {
  artistId: string;
  initialData: ArtistFollowersCount;
};

export const ArtistFollowersBadge = ({
  artistId,
  initialData,
}: ArtistFollowersBadgeProps) => {
  const { data: followersCount } = useQuery({
    ...artistQueryOptions.followersCount(artistId),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <span>
      {followersCount} {pluralize("followers", followersCount)}
    </span>
  );
};
