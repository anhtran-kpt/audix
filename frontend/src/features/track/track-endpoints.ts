export const trackEndpoints = {
  detail: (trackId: string) => `/tracks/${trackId}` as const,
  list: () => "/tracks" as const,
  credits: (trackId: string) => `/tracks/${trackId}/credits`,
  history: () => `/tracks/history`,
} as const;
