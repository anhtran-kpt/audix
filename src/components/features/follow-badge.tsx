"use client";

import { useQuery } from "@tanstack/react-query";
import { followStatusOptions } from "@/react-query/query-options/follow";
import pluralize from "pluralize";

export function FollowersBadge({ artistId }: { artistId: string }) {
  const { data } = useQuery(followStatusOptions(artistId));

  return (
    <span>
      {data?.followersCount} {pluralize("followers", data?.followersCount)}
    </span>
  );
}
