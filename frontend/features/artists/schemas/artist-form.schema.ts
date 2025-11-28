import { z } from "zod";

export const artistFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  avatar: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  banner: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  genreIds: z.array(z.string()).min(1, "At least one genre is required"),
});

export type ArtistFormValues = z.infer<typeof artistFormSchema>;
