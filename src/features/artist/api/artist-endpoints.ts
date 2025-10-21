export const artistEndpoints = {
  list: () => `/artists` as const,
  banner: (artistId: string) => `/artists/${artistId}/banner` as const,
  popularTracks: (artistId: string) =>
    `/artists/${artistId}/popular-tracks` as const,
  discography: (artistId: string) =>
    `/artists/${artistId}/discography` as const,
  about: (artistId: string) => `/artists/${artistId}/about` as const,
  suggestions: (artistId: string) =>
    `/artists/${artistId}/suggestions` as const,
  followStatus: (artistId: string) => `/artists/${artistId}/follow` as const,
  follow: (artistId: string) => `/artists/${artistId}/follow` as const,
} as const;
