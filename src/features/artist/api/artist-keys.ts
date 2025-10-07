import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";

export const artistKeys = {
  banner: (artistId: string) => ["artists", artistId, "banner"] as const,
  popularTracks: (artistId: string, params?: Partial<PaginationParams>) =>
    ["artists", artistId, "popular-tracks", stableKey(params)] as const,
  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    ["artists", artistId, "discography", stableKey(params)] as const,
  about: (artistId: string) => ["artists", artistId, "about"] as const,
  suggestions: (artistId: string, params?: Partial<PaginationParams>) =>
    ["artists", artistId, "suggestions", stableKey(params)] as const,
  list: () => ["artists", "list"] as const,
  followStatus: (artistId: string) => ["artists", artistId, "follow"] as const,
} as const;
