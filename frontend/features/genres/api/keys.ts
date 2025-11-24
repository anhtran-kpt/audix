export const genreKeys = {
  all: ["genres"] as const,
  details: (id: string) => [...genreKeys.all, id] as const,
} as const;
