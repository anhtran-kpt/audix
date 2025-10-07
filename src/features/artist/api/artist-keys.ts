export const artistKeys = {
  artistBanner: (artistId: string) => ["artists", artistId, "banner"] as const,
  artistPopularTracks: (artistId: string, limit = 5) =>
    ["artists", artistId, "popular-tracks", limit] as const,
  artistDiscography: (artistId: string) =>
    ["artists", artistId, "discography"] as const,
  artistAbout: (artistId: string) => ["artists", artistId, "about"] as const,
  artistSuggestions: (artistId: string) =>
    ["artists", artistId, "suggestions"] as const,
  list: () => ["artists", "list"] as const,
  followStatus: (artistId: string) => ["artists", artistId, "follow"] as const,
} as const;
