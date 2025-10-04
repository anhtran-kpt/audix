"use client";

import { SearchTabs } from "@/components/features/search/search-tabs";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "all";

  if (!q) return <p>Type something to search...</p>;

  return <SearchTabs q={q} type={type} />;
}
