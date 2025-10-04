import { queryOptions } from "@tanstack/react-query";
import { albumKeys } from "./album-keys";
import { getApi } from "@/lib/http/request";
import { AlbumItem } from "../contracts/album-dto";
import { albumEndpoints } from "./album-endpoints";

export const albumsListOption = () => {
  return queryOptions({
    queryKey: albumKeys.list(),
    queryFn: () => getApi<AlbumItem[]>(albumEndpoints.list()),
  });
};
