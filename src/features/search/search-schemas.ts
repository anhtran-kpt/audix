import z from "zod";

export const searchTypeSchema = z.enum([
  "tracks",
  "artists",
  "albums",
  "playlists",
  "profiles",
]);

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Query is required"),
  type: z
    .string()
    .default("tracks,artists,albums,playlists,profiles")
    .transform((val) => val.split(",")),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(5),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(0),
});
