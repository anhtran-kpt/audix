export const trackEndpoints = {
  list: (trackIds: string[]) => `/tracks/$}`
  credits: (trackId: string) => `/tracks/${trackId}/credits`,
} as const;
