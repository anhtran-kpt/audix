export const userEndpoints = {
  overview: (targetUserId: string) =>
    `/users/${targetUserId}/overview` as const,
  playlists: (targetUserId: string) =>
    `/users/${targetUserId}/playlists` as const,
  followingArtists: (targetUserId: string) =>
    `/users/${targetUserId}/following/artists` as const,
  followingUsers: (targetUserId: string) =>
    `/users/${targetUserId}/following/users` as const,
  followers: (targetUserId: string) =>
    `/users/${targetUserId}/followers` as const,
  followersCount: (targetUserId: string) =>
    `/users/${targetUserId}/follow` as const,
  follow: (targetUserId: string) => `/users/${targetUserId}/follow` as const,
};
