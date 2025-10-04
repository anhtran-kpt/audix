import z from "zod";
import { AlbumItemSchema, MiniAlbumSchema } from "./album-schema";

export type MiniAlbum = z.infer<typeof MiniAlbumSchema>;
export type AlbumItem = z.infer<typeof AlbumItemSchema>;
