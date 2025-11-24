export const artistKeys = {
  all: ["artists"] as const,
  detail: (id: string) => [...artistKeys.all, id] as const,
} as const;
