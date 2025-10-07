import { queryOptions } from "@tanstack/react-query";
import { artistKeys } from "./artist-keys";
import { ArtistItem } from "../contracts/artist-dto";
import { artistEndpoints } from "./artist-endpoints";
import {
  ArtistAboutReturn,
  ArtistBannerReturn,
  ArtistDiscographyReturn,
  ArtistPopularTracksReturn,
  ArtistSuggestionsReturn,
  FollowStatus,
} from "../data-access/artist-repo";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getApi } from "@/lib/http/api";
import { artistFactory } from "../artist-factory";

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

export const artistBannerOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistBanner(artistId),
    queryFn: () =>
      getApi<ArtistBannerReturn>(artistEndpoints.artistBanner(artistId)),
    staleTime: 30_000,
  });
};

export const artistPopularTracksOptions = (
  artistId: string,
  params?: Partial<PaginationParams>
) => {
  return queryOptions({
    queryKey: artistKeys.artistPopularTracks(artistId),
    queryFn: () =>
      getApi<ArtistPopularTracksReturn>(
        artistEndpoints.artistPopularTracks(artistId),
        { params }
      ),
    staleTime: 30_000,
  });
};

export const artistDiscographyOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistDiscography(artistId),
    queryFn: () =>
      getApi<ArtistDiscographyReturn>(
        artistEndpoints.artistDiscography(artistId)
      ),
    staleTime: 30_000,
  });
};

export const artistAboutOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistAbout(artistId),
    queryFn: () =>
      getApi<ArtistAboutReturn>(artistEndpoints.artistAbout(artistId)),
    staleTime: 30_000,
  });
};

export const artistSuggestionsOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistSuggestions(artistId),
    queryFn: () =>
      getApi<ArtistSuggestionsReturn>(
        artistEndpoints.artistSuggestions(artistId)
      ),
    staleTime: 30_000,
  });
};

export const artistQueries = {
  banner: (artistId: string) =>
    artistFactory.createQuery<ArtistBannerReturn>({
      id: artistId,
      subKey: "banner",
      subPath: "banner",
      params: undefined,
      extraOptions: {
        enabled: !!artistId,
      },
    }),

  popularTracks: (artistId: string, params?: Partial<PaginationParams>) =>
    artistFactory.createQuery<ArtistPopularTracksReturn>({
      id: artistId,
      subKey: "popular-tracks",
      subPath: "popular-tracks",
      params: params,
      extraOptions: {
        enabled: !!artistId,
      },
    }),

  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    artistFactory.createQuery<ArtistDiscographyReturn>({
      id: artistId,
      subKey: "discography",
      subPath: "discography",
      params: params,
      extraOptions: {
        enabled: !!artistId,
      },
    }),

  about: (artistId: string) =>
    artistFactory.createQuery<ArtistAboutReturn>({
      id: artistId,
      subKey: "about",
      subPath: "about",
      params: undefined,
      extraOptions: {
        enabled: !!artistId,
        staleTime: Infinity,
      },
    }),

  suggestions: (artistId: string, params?: Partial<PaginationParams>) =>
    artistFactory.createQuery<ArtistSuggestionsReturn>({
      id: artistId,
      subKey: "suggestions",
      subPath: "suggestions",
      params,
      extraOptions: { enabled: !!artistId },
    }),
};
