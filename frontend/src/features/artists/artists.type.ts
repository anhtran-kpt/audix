import z from "zod";
import { ArtistItemSchema, MiniArtistSchema } from "./artist-schemas";
import { components } from "@/types/api-schema";

export type MiniArtist = z.infer<typeof MiniArtistSchema>;
export type ArtistItem = z.infer<typeof ArtistItemSchema>;

export type FullArtist = components["schemas"]["FullArtist"];
export type ArtistSlug = components["schemas"]["ArtistSlug"];
