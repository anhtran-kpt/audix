export const albumEndpoints = {
  base: "/albums" as const,
  list: () => albumEndpoints.base,
  detail: (albumId: string) => [...albumEndpoints.base, albumId].join("/"),
} as const;
