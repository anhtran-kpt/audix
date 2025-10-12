import { queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/http/api";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";
import { SearchResults } from "../data-access/search-repo";

export const searchOptions = (
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
