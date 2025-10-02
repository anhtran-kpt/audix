import z from "zod";
import { ArtistItemSchema, MiniArtistSchema } from "./artist-schema";

export type MiniArtist = z.infer<typeof MiniArtistSchema>;
export type ArtistItem = z.infer<typeof ArtistItemSchema>;
