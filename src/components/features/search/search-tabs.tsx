"use client";

import { useEffect, useState } from "react";
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

export function SearchTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const typeFromUrl = searchParams.get("type") ?? "all";

  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(typeFromUrl);
  }, [typeFromUrl]);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    router.push(`/search?${params.toString()}`);

    setActiveTab(value);
  };

  if (activeTab === null) {
    return null;
  }

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={handleChange}
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-6 bg-background">
          {SEARCH_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SEARCH_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <SearchResults q={q} type={activeTab} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
