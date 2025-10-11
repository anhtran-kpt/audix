"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/ui/section-heading";
import AlbumGrid from "@/components/shared/album-grid";
import { useQuery } from "@tanstack/react-query";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";

export const DiscographySection = ({ artistId }: { artistId: string }) => {
  const limit = useResponsiveLimit();

  const { data, status } = useQuery({
    ...artistQueryOptions.discography(artistId, { limit }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  const availableTabs = [
    { key: "popular", label: "Popular Releases", data: data.items.popular },
    { key: "albums", label: "Albums", data: data.items.albums },
    { key: "singles", label: "Singles & EPs", data: data.items.singlesAndEps },
  ].filter((tab) => tab.data && tab.data.length > 0);

  if (availableTabs.length === 0) return null;

  const defaultTab = availableTabs[0].key;

  return (
    <section>
      <SectionHeading
        title="Discography"
        showAllHref={
          data.pagination.hasMore
            ? `/artists/${artistId}/discography`
            : undefined
        }
      />
      <Tabs defaultValue={defaultTab} className="w-full gap-6">
        <TabsList>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            <AlbumGrid albums={tab.data} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};
