export const songKeys = {
  all: ["songs"] as const,
  details: (id: string) => [...songKeys.all, id] as const,
} as const;
