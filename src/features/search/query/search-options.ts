import { queryOptions } from "@tanstack/react-query";
import { getApi } from "@/lib/http/request";
import { SearchResult } from "../contracts/search-dtos";

export const searchOptions = (
  q: string,
  type: string[] = ["track", "artist", "album", "playlist"]
) => {
  return queryOptions({
    queryKey: ["search", q, type],
    queryFn: () =>
      getApi<SearchResult>(
        `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(
          type.join(",")
        )}&limit=10`
      ),
    enabled: !!q,
  });
};
