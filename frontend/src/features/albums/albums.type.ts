import { AwaitedReturnType } from "@/utils/type";
import {
  getAlbumNewReleases,
  getAlbumOverview,
  getPopularAlbums,
  getRelatedAlbums,
} from "./album-data";

export type AlbumOverview = AwaitedReturnType<typeof getAlbumOverview>;
export type RelatedAlbums = AwaitedReturnType<typeof getRelatedAlbums>;
export type AlbumNewReleases = AwaitedReturnType<typeof getAlbumNewReleases>;
export type PopularAlbums = AwaitedReturnType<typeof getPopularAlbums>;
