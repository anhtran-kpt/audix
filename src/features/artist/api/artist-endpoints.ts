export const artistEndpoints = {
  artistBanner: (artistId: string) => `/artists/${artistId}/banner` as const,
  artistPopularTracks: (artistId: string) =>
    `/artists/${artistId}/popular-tracks` as const,
  artistDiscography: (artistId: string) =>
    `/artists/${artistId}/discography` as const,
  artistAbout: (artistId: string) => `/artists/${artistId}/about` as const,
  artistSuggestions: (artistId: string) =>
    `/artists/${artistId}/suggestions` as const,
  list: () => `/artists` as const,
  followStatus: (artistId: string) => `/artists/${artistId}/follow` as const,
} as const;
