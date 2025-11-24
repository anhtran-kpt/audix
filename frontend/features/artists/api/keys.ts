export const artistKeys = {
  all: ["artists"] as const,
  details: (id: string) => [...artistKeys.all, id] as const,
} as const;
