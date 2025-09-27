import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/ui/section-heading";
import AlbumGrid from "@/components/shared/album-grid";
import { AlbumGridItem } from "@/features/album/contracts/album-dto";

type DiscographySectionProps = {
  artistId: string;
  popular: AlbumGridItem[];
  albums: AlbumGridItem[];
  singlesAndEps: AlbumGridItem[];
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
