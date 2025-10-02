import { useQuery } from "@tanstack/react-query";
import { playlistsListOption } from "../api/playlist-options";

export const usePlaylistsList = () => {
  return useQuery({
    ...playlistsListOption(),
  });
};
