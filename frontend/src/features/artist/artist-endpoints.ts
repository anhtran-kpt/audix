export const artistEndpoints = {
  list: () => `/artists` as const,
  hotArtists: () => `/artists/hot-artists` as const,
  followersCount: (artistId: string) => `/artists/${artistId}/follow` as const,
} as const;
