import z from "zod";
import { AlbumGridItemSchema, MiniAlbumSchema } from "./album-schema";

export type MiniAlbum = z.infer<typeof MiniAlbumSchema>;
export type AlbumGridItem = z.infer<typeof AlbumGridItemSchema>;
