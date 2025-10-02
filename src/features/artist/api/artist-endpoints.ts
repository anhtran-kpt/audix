export const artistEndpoints = {
  list: () => `/artists` as const,
  followStatus: (artistId: string) => `/artists/${artistId}/follow` as const,
} as const;
