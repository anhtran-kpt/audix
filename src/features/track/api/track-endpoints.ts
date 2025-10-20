export const trackEndpoints = {
  list: () => "/tracks" as const,
  credits: (trackId: string) => `/tracks/${trackId}/credits`,
} as const;
