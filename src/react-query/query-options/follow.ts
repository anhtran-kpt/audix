import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { artistKeys } from "../keys/artist";
import { zCuidType } from "@/contracts/common";
import { FollowStatus } from "@/contracts/artist";

export const followStatusOptions = (artistId: zCuidType) => {
  return queryOptions({
    queryKey: artistKeys.followStatus(artistId),
    queryFn: () => getApi<FollowStatus>(`/artists/${artistId}/follow`),
    staleTime: 30_000,
  });
};
