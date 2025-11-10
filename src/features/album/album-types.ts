import z from "zod";
import { AlbumItemSchema, MiniAlbumSchema } from "./album-schemas";
import { AwaitedReturnType } from "@/utils/type";
import {
  getAlbumNewReleases,
  getAlbumOverview,
  getPopularAlbums,
  getRelatedAlbums,
} from "./album-data";

export type MiniAlbum = z.infer<typeof MiniAlbumSchema>;
export type AlbumItem = z.infer<typeof AlbumItemSchema>;

export type AlbumOverview = AwaitedReturnType<typeof getAlbumOverview>;
export type RelatedAlbums = AwaitedReturnType<typeof getRelatedAlbums>;
export type AlbumNewReleases = AwaitedReturnType<typeof getAlbumNewReleases>;
export type PopularAlbums = AwaitedReturnType<typeof getPopularAlbums>;
