import { stableKey } from "@/utils/stable-keys";

export const trackKeys = {
  base: ["tracks"] as const,
  list: (trackIds: string[]) =>
    [...trackKeys.base, stableKey(trackIds)] as const,
  history: () => [...trackKeys.base, "history"] as const,
  detail: (trackId: string) => [...trackKeys.base, trackId] as const,
  credits: (trackId: string) =>
    [...trackKeys.base, trackId, "credits"] as const,
} as const;
