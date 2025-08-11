"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/ui/section-heading";
import { AlbumGrid } from "@/components/features/album-grid";
import { TFullArtist } from "@/types";

type DiscographySectionProps = Pick<TFullArtist, "id">;

export const DiscographySection = ({
  id: artistId,
  popularReleases,
  albumReleases,
  singleAndEpReleases,
}: DiscographySectionProps) => {
  const availableTabs = [
    { key: "popular", label: "Popular Releases", data: popularReleases },
    { key: "albums", label: "Albums", data: albumReleases },
    { key: "singles", label: "Singles & EPs", data: singleAndEpReleases },
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

// export function ArtistDiscographySkeleton() {
//   return (
//     <section>
//       <div className="flex justify-between items-center">
//         <SectionHeading heading="Discography" />
//         <Skeleton className="h-4 w-6" />
//       </div>
//       <Tabs defaultValue="Popular Releases" className="w-full gap-6">
//         <TabsList>
//           <TabsTrigger value="Popular Releases">Popular Releases</TabsTrigger>
//           <TabsTrigger value="Albums">Albums</TabsTrigger>
//           <TabsTrigger value="Singles">Singles & EPs</TabsTrigger>
//         </TabsList>

//         <TabsContent value="Popular Releases">
//           <AlbumGridSkeleton count={5} />
//         </TabsContent>
//         <TabsContent value="Albums">
//           <AlbumGridSkeleton count={5} />
//         </TabsContent>
//         <TabsContent value="Singles">
//           <AlbumGridSkeleton count={5} />
//         </TabsContent>
//       </Tabs>
//     </section>
//   );
// }
