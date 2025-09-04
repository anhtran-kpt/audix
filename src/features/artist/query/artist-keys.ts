import { zCuidType } from "@/features/shared/contracts/shared-dto";

export const artistKeys = {
  artists: () => ["artists"] as const,
  artistDetail: (artistId: zCuidType) => ["artists", artistId] as const,
  followStatus: (artistId: zCuidType) =>
    ["artists", artistId, "follow"] as const,
  sidebarArtists: () => ["me", "sidebar", "artists"] as const,
} as const;
