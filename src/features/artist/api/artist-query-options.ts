import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { artistKeys } from "./artist-keys";
import { ArtistItem } from "../contracts/artist-dto";
import { artistEndpoints } from "./artist-endpoints";
import { FollowStatus, HotArtists } from "../data-access/artist-repo";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getApi } from "@/lib/http/api";
import { ArtistDiscography, RelatedArtists } from "@/lib/data/artist-data";

export const artistQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: artistKeys.list(),
      queryFn: () => getApi<ArtistItem[]>(artistEndpoints.list()),
    }),

  followStatus: (artistId: string) =>
    queryOptions({
      queryKey: artistKeys.followStatus(artistId),
      queryFn: () =>
        getApi<FollowStatus>(artistEndpoints.followStatus(artistId)),
      staleTime: 30_000,
      enabled: !!artistId,
    }),

  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.discography(artistId, params),
      queryFn: () =>
        getApi<ArtistDiscography>(artistEndpoints.discography(artistId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),

  related: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.related(artistId, params),
      queryFn: () =>
        getApi<RelatedArtists>(artistEndpoints.related(artistId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),

  hotArtists: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.hotArtists(params),
      queryFn: () =>
        getApi<HotArtists>(artistEndpoints.hotArtists(), {
          params,
        }),
      placeholderData: keepPreviousData,
    }),
};
