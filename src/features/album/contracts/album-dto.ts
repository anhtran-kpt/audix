import z from "zod";
import {
  AlbumBaseSchema,
  AlbumGridItemSchema,
  FullAlbumSchema,
} from "./album-schema";

export type AlbumBase = z.infer<typeof AlbumBaseSchema>;
export type FullAlbum = z.infer<typeof FullAlbumSchema>;
export type AlbumGridItem = z.infer<typeof AlbumGridItemSchema>;
