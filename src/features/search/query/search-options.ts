import { queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/http/request";
import { SearchResult } from "../contracts/search-dtos";

export const searchOptions = (
  q: string,
  type: string[] = ["tracks", "artists", "albums", "playlists, profiles"],
  limit = 5,
  offset = 0
) => {
  return queryOptions({
    queryKey: ["search", q, type],
    queryFn: () =>
      getApi<SearchResult>(
        `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(
          type.join(",")
        )}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(
          offset
        )}`
      ),
    enabled: !!q,
  });
};
