import { zCuidType } from "@/contracts/common";

export const artistKeys = {
  artists: () => ["artists"] as const,
  artistDetail: (artistId: zCuidType) => ["artists", artistId] as const,
  followStatus: (artistId: zCuidType) =>
    ["artists", artistId, "follow"] as const,
} as const;
