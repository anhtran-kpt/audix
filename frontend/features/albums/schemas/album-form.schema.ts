import { z } from "zod";

export const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  audioFile: z.instanceof(File, { message: "Audio file is required" }),
  duration: z.number().optional(),
  artistId: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
});

export const albumFormSchema = z.object({
  title: z.string().min(1, "Album title is required"),
  thumbnail: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  artistId: z.string().min(1, "Main artist is required"),
  songs: z.array(songSchema).min(1, "At least one song is required"),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
export type SongFormValues = z.infer<typeof songSchema>;
