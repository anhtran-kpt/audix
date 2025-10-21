export const userKeys = {
  base: ["users"] as const,
  detail: (targetUserId: string) => [...userKeys.base, targetUserId] as const,
  banner: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "banner"] as const,
  playlists: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "playlists"] as const,
  follow: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "follow"] as const,
  followStatus: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "follow"] as const,
  followers: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "followers"] as const,
  followingUsers: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "following", "users"] as const,
  followingArtists: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "following", "artists"] as const,
} as const;
