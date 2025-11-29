import { z } from "zod";
import { AlbumTypeEnum, songSchema } from "./album-form.schema";

export const albumInfoSchema = z.object({
  title: z.string().min(1),
  type: AlbumTypeEnum,
  thumbnail: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  artistId: z.string().min(1),
  genreIds: z.array(z.string()),
  releaseDate: z.date().optional(),
});

export const songMutationSchema = z.object({
  title: z.string().min(1),
  audioFile: z.instanceof(File).optional(),
  duration: z.number().optional(),
  genreIds: z.array(z.string()),
  isExplicit: z.boolean(),
  artists: songSchema.shape.artists,
  credits: songSchema.shape.credits,
});

export type AlbumInfoValues = z.infer<typeof albumInfoSchema>;
export type SongMutationValues = z.infer<typeof songMutationSchema>;
