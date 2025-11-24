import { z } from "zod";

export const genreFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type GenreFormValues = z.infer<typeof genreFormSchema>;
