export const artistKeys = {
  list: () => ["artists", "list"] as const,
  followStatus: (artistId: string) => ["artists", artistId, "follow"] as const,
} as const;
