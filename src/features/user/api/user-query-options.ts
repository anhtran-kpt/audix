import { queryOptions } from "@tanstack/react-query";
import { userKeys } from "./user-keys";
import { userEndpoints } from "./user-endpoints";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";
import { getApi } from "@/lib/http/api";
import {
  FollowStatus,
  UserBanner,
  UserPlaylist,
} from "../data-access/user-repo";
import { UserItem } from "../contracts/user-dto";

export const userQueryOptions = {
  banner: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.banner(targetUserId),
      queryFn: () => getApi<UserBanner>(userEndpoints.banner(targetUserId)),
    }),

  playlists: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.playlists(targetUserId),
      queryFn: () =>
        getApi<UserPlaylist[]>(userEndpoints.playlists(targetUserId)),
    }),

  followers: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.followers(targetUserId),
      queryFn: () =>
        getApi<UserItem[]>(userEndpoints.followers(targetUserId)),
    }),

  followingArtists: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.followingArtists(targetUserId),
      queryFn: () =>
        getApi<ArtistItem[]>(userEndpoints.followingArtists(targetUserId)),
    }),

  followingUsers: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.followingUsers(targetUserId),
      queryFn: () =>
        getApi<UserItem[]>(userEndpoints.followingUsers(targetUserId)),
    }),

  followStatus: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.followStatus(targetUserId),
      queryFn: () =>
        getApi<FollowStatus>(userEndpoints.followStatus(targetUserId)),
    }),
} as const;
