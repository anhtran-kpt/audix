export const trackKeys = {
  base: ["tracks"] as const,
  detail: (trackId: string) => [...trackKeys.base, trackId] as const,
  list: (trackIds: string[]) =>
    [...trackKeys.base, "list", trackIds.join(",")] as const,
  credits: (trackId: string) => ["tracks", trackId, "credits"] as const,
} as const;
