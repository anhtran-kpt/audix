import z from "zod";
import { ArtistGridItemSchema, MiniArtistSchema } from "./artist-schema";

export type MiniArtist = z.infer<typeof MiniArtistSchema>;
export type ArtistGridItem = z.infer<typeof ArtistGridItemSchema>;
