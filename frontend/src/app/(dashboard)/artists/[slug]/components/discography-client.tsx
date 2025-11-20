"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtistDiscography } from "@/features/artist/artist-data";
import { Section } from "@/components/shared/section";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { AlbumItem } from "@/features/albums/components/album-item";

type DiscographyClientProps = {
  initialData: ArtistDiscography;
  artistId: string;
};

export const DiscographyClient = ({
  artistId,
  initialData,
}: DiscographyClientProps) => {
  const availableTabs = [
    {
      key: "popular",
      label: "Popular Releases",
      data: initialData.items.popular,
    },
    { key: "albums", label: "Albums", data: initialData.items.albums },
    {
      key: "singles",
      label: "Singles & EPs",
      data: initialData.items.singlesAndEps,
    },
  ].filter((tab) => tab.data && tab.data.length > 0);

  if (availableTabs.length === 0) return null;

  const defaultTab = availableTabs[0].key;

  return (
    <Section
      title="Discography"
      showAllHref={
        initialData.pagination.hasMore
          ? `/artists/${artistId}/discography`
          : undefined
      }
    >
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
            <EntityCarousel
              data={tab.data}
              renderItem={(album) => <AlbumItem album={album} key={album.id} />}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
};
