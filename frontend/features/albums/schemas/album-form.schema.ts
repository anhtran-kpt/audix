import { z } from "zod";

export const ArtistTypeEnum = z.enum(["MAIN", "FEATURED"]);
export const CreditRoleEnum = z.enum([
  "PRODUCER",
  "COMPOSER",
  "WRITER",
  "ARRANGER",
  "ENGINEER",
  "BACKGROUND_VOCAL",
]);
export const AlbumTypeEnum = z.enum(["ALBUM", "SINGLE", "EP"]);

const songArtistSchema = z.object({
  artistId: z.string().min(1, "Artist is required"),
  type: ArtistTypeEnum,
});

const songCreditSchema = z.object({
  role: CreditRoleEnum,
  value: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
  }),
});

export const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  audioFile: z.instanceof(File, { message: "Audio file is required" }),
  duration: z.number().optional(),
  isExplicit: z.boolean(),
  artists: z.array(songArtistSchema).min(1, "At least one artist is required"),
  credits: z.array(songCreditSchema).optional(),
  genreIds: z.array(z.string()).min(1, "At least one genre is required"),
});

export const albumFormSchema = z.object({
  title: z.string().min(1, "Album title is required"),
  thumbnail: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  artistId: z.string().min(1, "Main artist is required"),
  genreIds: z.array(z.string()).min(1, "At least one genre is required"),
  songs: z.array(songSchema).min(1, "At least one song is required"),
  type: AlbumTypeEnum,
  releaseDate: z.date().optional(),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
