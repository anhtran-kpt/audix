"use server";
import {
  getMyFollowedArtistIds,
  getMyLikedAlbumIds,
  getMyLikedPlaylistIds,
  getMyLikedTrackIds,
} from "@/features/me/me-data";

export async function getOverlayData(userId: string) {
  const [likedTracks, followedArtists, likedAlbums, likedPlaylists] =
    await Promise.all([
      getMyLikedTrackIds(userId),
      getMyFollowedArtistIds(userId),
      getMyLikedAlbumIds(userId),
      getMyLikedPlaylistIds(userId),
    ]);

  return { likedTracks, followedArtists, likedAlbums, likedPlaylists };
}
