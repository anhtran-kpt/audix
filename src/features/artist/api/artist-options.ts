import { getApi } from "@/lib/http/request";
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
import { apiFetch } from "@/lib/http/api-fetch";

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
      apiFetch<ArtistBannerReturn>(
        "GET",
        artistEndpoints.artistBanner(artistId)
      ),
    staleTime: 30_000,
  });
};

export const artistPopularTracksOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistPopularTracks(artistId),
    queryFn: () =>
      apiFetch<ArtistPopularTracksReturn>(
        "GET",
        artistEndpoints.artistPopularTracks(artistId)
      ),
    staleTime: 30_000,
  });
};

export const artistDiscographyOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistDiscography(artistId),
    queryFn: () =>
      apiFetch<ArtistDiscographyReturn>(
        "GET",
        artistEndpoints.artistDiscography(artistId)
      ),
    staleTime: 30_000,
  });
};

export const artistAboutOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistAbout(artistId),
    queryFn: () =>
      apiFetch<ArtistAboutReturn>("GET", artistEndpoints.artistAbout(artistId)),
    staleTime: 30_000,
  });
};

export const artistSuggestionsOptions = (artistId: string) => {
  return queryOptions({
    queryKey: artistKeys.artistSuggestions(artistId),
    queryFn: () =>
      apiFetch<ArtistSuggestionsReturn>(
        "GET",
        artistEndpoints.artistSuggestions(artistId)
      ),
    staleTime: 30_000,
  });
};
