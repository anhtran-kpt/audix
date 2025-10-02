export const trackKeys = {
  credits: (trackId: string) => ["tracks", trackId, "credits"] as const,
} as const;
