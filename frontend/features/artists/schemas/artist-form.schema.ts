import { z } from "zod";

export const artistFormSchema = z.object({
  name: z.string().min(1),
  bio: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
});

export type ArtistFormInput = z.input<typeof artistFormSchema>;
export type ArtistFormOutput = z.output<typeof artistFormSchema>;
