"use client";

import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { FollowStatus } from "@/lib/data/artist-data";
import { useQuery } from "@tanstack/react-query";
import pluralize from "pluralize";
import { Skeleton } from "../ui/skeleton";

type FollowersBadgeProps = {
  artistId: string;
  initialData?: FollowStatus;
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

  if (status === "pending") {
    return <Skeleton className="w-18 h-5" />;
  }

  if (status === "error") {
    return null;
  }

  return (
    <span>
      {data.followersCount} {pluralize("followers", data.followersCount)}
    </span>
  );
};
