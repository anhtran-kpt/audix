"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./search-results";

const SEARCH_TABS = [
  { value: "all", label: "All" },
  { value: "tracks", label: "Tracks" },
  { value: "artists", label: "Artists" },
  { value: "albums", label: "Albums" },
  { value: "playlists", label: "Playlists" },
  { value: "profiles", label: "Profiles" },
];

export function SearchTabs({ q, type }: { q: string; type: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <Tabs value={type} onValueChange={handleChange} className="w-full gap-6">
      <TabsList>
        {SEARCH_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {SEARCH_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <SearchResults q={q} type={tab.value} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
