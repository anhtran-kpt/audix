export const artistKeys = {
  artists: () => ["artists"] as const,
  artistDetail: (artistId: string) => ["artists", artistId] as const,
  followStatus: (artistId: string) => ["artists", artistId, "follow"] as const,
  sidebarArtists: () => ["me", "sidebar", "artists"] as const,
} as const;
