import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { artistKeys } from "./artist-keys";
import { ArtistItem } from "../contracts/artist-dto";
import { artistEndpoints } from "./artist-endpoints";
import { FollowStatus } from "../data-access/artist-repo";

export const artistsListOptions = () => {
  return queryOptions({
    queryKey: artistKeys.list(),
    queryFn: () => getApi<ArtistItem[]>(artistEndpoints.list()),
  });
};

export const followStatusOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.followStatus(artistId),
    queryFn: () => getApi<FollowStatus>(artistEndpoints.followStatus(artistId)),
    staleTime: 30_000,
  });
};
