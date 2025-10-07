"use client";

import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useQuery } from "@tanstack/react-query";
import pluralize from "pluralize";
import { Skeleton } from "../ui/skeleton";

export function FollowersBadge({ artistId }: { artistId: string }) {
  const { data, status } = useQuery(artistQueryOptions.followStatus(artistId));

  if (status === "error") {
    return null;
  }

  if (status === "pending") {
    return <Skeleton className="w-16 h-5" />;
  }

  return (
    <span>
      {data.followersCount} {pluralize("followers", data.followersCount)}
    </span>
  );
}
