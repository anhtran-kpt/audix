import { z } from "zod";

// Enum khớp với Backend
const ArtistTypeEnum = z.enum(["MAIN", "FEATURED"]);
const CreditRoleEnum = z.enum([
  "PRODUCER",
  "COMPOSER",
  "WRITER",
  "ARRANGER",
  "ENGINEER",
  "BACKGROUND_VOCAL",
]);
export const AlbumTypeEnum = z.enum(["ALBUM", "SINGLE", "EP"]);

// 1. Schema cho Artist trong bài hát
const songArtistSchema = z.object({
  artistId: z.string().min(1, "Artist is required"),
  type: ArtistTypeEnum,
});

// 2. Schema cho Credit (Hybrid: ID hoặc Name)
const songCreditSchema = z.object({
  role: CreditRoleEnum,
  // Lưu ý: UI component CreditSelect trả về object { id?, name }
  // Chúng ta sẽ transform nó lúc submit, nhưng ở form state cứ giữ object cho dễ binding
  value: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
  }),
});

export const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  audioFile: z.instanceof(File, { message: "Audio file is required" }),
  duration: z.number().optional(),
  genres: z.object({ genreId: z.string() }).array().optional(),
  isExplicit: z.boolean(),
  artists: z.array(songArtistSchema).min(1, "At least one artist is required"),
  credits: z.array(songCreditSchema).optional(),
});

// 4. Schema Album (Giữ nguyên phần đầu)
export const albumFormSchema = z.object({
  title: z.string().min(1, "Album title is required"),
  thumbnail: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  artistId: z.string().min(1, "Main artist is required"),
  songs: z.array(songSchema).min(1, "At least one song is required"),
  type: AlbumTypeEnum,
  releaseDate: z.date().optional(),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;
