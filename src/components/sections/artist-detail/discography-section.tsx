"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/ui/section-heading";
import { AlbumGrid } from "@/components/features/album-grid";
import { AlbumBase } from "@/features/album/contracts/album-dto";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

type AlbumItem = Pick<
  AlbumBase,
  "id" | "imageId" | "title" | "releaseDate" | "albumType"
>;

type DiscographySectionProps = {
  artistId: zCuidType;
  popular: AlbumItem[];
  albums: AlbumItem[];
  singlesAndEps: AlbumItem[];
};

export const DiscographySection = ({
  artistId,
  popular,
  albums,
  singlesAndEps,
}: DiscographySectionProps) => {
  const availableTabs = [
    { key: "popular", label: "Popular Releases", data: popular },
    { key: "albums", label: "Albums", data: albums },
    { key: "singles", label: "Singles & EPs", data: singlesAndEps },
  ].filter((tab) => tab.data && tab.data.length > 0);

  if (availableTabs.length === 0) return null;

  const defaultTab = availableTabs[0].key;

  return (
    <section>
      <SectionHeading
        title="Discography"
        hasShowAll
        href={`/artists/${artistId}/discography`}
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
