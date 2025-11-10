import { queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/api";
import { albumEndpoints } from "./album-endpoints";
import { PaginationParams } from "@/features/shared/shared-types";
import { albumKeys } from "./album-keys";
import { AlbumItem } from "./album-types";

export const albumQueryOptions = {
  list: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: albumKeys.list(params),
      queryFn: () => getApi<AlbumItem[]>(albumEndpoints.list()),
    }),

  detail: (albumId: string) =>
    queryOptions({
      queryKey: albumKeys.detail(albumId),
      queryFn: () => getApi<AlbumItem[]>(albumEndpoints.detail(albumId)),
    }),
} as const;
