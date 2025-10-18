import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "../api/me-query-options";

export const useLikedPlaylistStatus = (playlistId: string) =>
  useQuery({ ...meQueryOptions.likedPlaylistStatus(playlistId) });
