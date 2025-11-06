export const DEFAULT_USER_PLAYLIST_TYPE = "FAVORITE_SONGS";

export const TRACK_LIST_CONTEXT = {
  PLAYLIST: "PLAYLIST",
  ALBUM: "ALBUM",
  ARTIST: "ARTIST",
  SEARCH: "SEARCH",
} as const;

export type TrackListContextType = keyof typeof TRACK_LIST_CONTEXT;
