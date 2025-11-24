export const albumKeys = {
  all: ["albums"] as const,
  details: (id: string) => [...albumKeys.all, id] as const,
} as const;
