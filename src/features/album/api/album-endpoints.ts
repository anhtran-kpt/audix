export const albumEndpoints = {
  list: () => `/albums` as const,
  detail: (albumId: string) => `/albums/${albumId}` as const,

  tracks: (albumId: string) => `/albums/${albumId}/tracks` as const,
  suggestions: (albumId: string) => `/albums/${albumId}/suggestions` as const,
} as const;
