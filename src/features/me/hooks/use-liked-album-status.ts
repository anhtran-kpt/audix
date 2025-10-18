import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "../api/me-query-options";

export const useLikedAlbumStatus = (AlbumId: string) =>
  useQuery({ ...meQueryOptions.likedAlbumStatus(AlbumId) });
