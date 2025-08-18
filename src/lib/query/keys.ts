export const qk = {
  recently: {
    tracks: (limit = 30) => ["recently", "tracks", { limit }] as const,
  },
};
