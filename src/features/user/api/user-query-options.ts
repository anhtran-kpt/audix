import { queryOptions } from "@tanstack/react-query";
import { userKeys } from "./user-keys";
import { userEndpoints } from "./user-endpoints";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";
import { getApi } from "@/lib/http/api";
import { UserBanner, UserPlaylist } from "../data-access/user-repo";
import { UserItem } from "../data-access/user-dto";

export const userQueryOptions = {
  banner: (userId: string) =>
    queryOptions({
      queryKey: userKeys.banner(userId),
      queryFn: () => getApi<UserBanner>(userEndpoints.banner(userId)),
    }),

  playlists: (userId: string) =>
    queryOptions({
      queryKey: userKeys.playlists(userId),
      queryFn: () => getApi<UserPlaylist[]>(userEndpoints.playlists(userId)),
    }),

  followingArtists: (userId: string) =>
    queryOptions({
      queryKey: userKeys.followingArtists(userId),
      queryFn: () =>
        getApi<ArtistItem[]>(userEndpoints.followingArtists(userId)),
    }),

  followingUsers: (userId: string) =>
    queryOptions({
      queryKey: userKeys.followingUsers(userId),
      queryFn: () => getApi<UserItem[]>(userEndpoints.followingUsers(userId)),
    }),
} as const;
