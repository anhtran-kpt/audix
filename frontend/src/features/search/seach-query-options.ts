import { queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/axios";
import { PaginationParams } from "@/features/shared/shared-types";
import { stableKey } from "@/utils/stable-keys";
import { SearchResults } from "./search-actions";

export const searchQueryOptions = (
  q: string,
  type: string[] = ["tracks", "artists", "albums", "playlists, profiles"],
  params?: Partial<PaginationParams>
) => {
  return queryOptions({
    queryKey: ["search", q, type, stableKey(params)],
    queryFn: () =>
      getApi<SearchResults>(
        `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(
          type.join(",")
        )}`,
        { params }
      ),
    enabled: !!q,
  });
};
