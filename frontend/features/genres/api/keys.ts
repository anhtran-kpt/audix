export const genreKeys = {
  all: ["genres"] as const,
  detail: (id: string) => [...genreKeys.all, id] as const,
} as const;
