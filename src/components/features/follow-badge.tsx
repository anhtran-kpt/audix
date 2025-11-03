"use client";

import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useQuery } from "@tanstack/react-query";
import pluralize from "pluralize";
import { FollowStatus } from "@/features/artist/data-access/artist-repo";

type FollowersBadgeProps = {
  artistId: string;
  initialData: FollowStatus;
};

export const FollowersBadge = ({
  artistId,
  initialData,
}: FollowersBadgeProps) => {
  const { data, status } = useQuery({
    ...artistQueryOptions.followStatus(artistId),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  if (status === "error") {
    return null;
  }

  return (
    <span>
      {data.followersCount} {pluralize("followers", data.followersCount)}
    </span>
  );
};
