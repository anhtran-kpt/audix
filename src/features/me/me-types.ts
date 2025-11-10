import { AwaitedReturnType } from "@/utils/type";
import {
  likeAlbum,
  likePlaylist,
  toggleLikeTrack,
  unlikeAlbum,
  unlikePlaylist,
} from "./me-actions";

export type LikeAlbumOutput = AwaitedReturnType<typeof likeAlbum>;
export type UnlikeAlbumOutput = AwaitedReturnType<typeof unlikeAlbum>;
export type LikePlaylistOutput = AwaitedReturnType<typeof likePlaylist>;
export type UnlikePlaylistOutput = AwaitedReturnType<typeof unlikePlaylist>;
export type ToggleLikeTrackOutput = AwaitedReturnType<typeof toggleLikeTrack>;
