import { zCuidSchemaType } from "@/features/shared/contracts/shared-dto";

export const artistKeys = {
  artists: () => ["artists"] as const,
  artistDetail: (artistId: zCuidSchemaType) => ["artists", artistId] as const,
  followStatus: (artistId: zCuidSchemaType) =>
    ["artists", artistId, "follow"] as const,
  sidebarArtists: () => ["me", "sidebar", "artists"] as const,
} as const;
