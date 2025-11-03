import { NewReleasesSection } from "./_sections/new-releases-section";
import { PopularAlbumSections } from "./_sections/popular-albums-sections";
import { HotArtistsSection } from "./_sections/hot-artists-section";
import { getAlbumNewReleases, getPopularAlbums } from "@/lib/data/album-data";
import { getHotArtists } from "@/lib/data/artist-data";

export default async function DiscoveryPage() {
  const [albumNewReleases, hotArtists, popularAlbums] = await Promise.all([
    getAlbumNewReleases({ limit: 8, offset: 0 }),
    getHotArtists({ limit: 8, offset: 0 }),
    getPopularAlbums({ limit: 8, offset: 0 }),
  ]);
  return (
    <>
      <NewReleasesSection initialData={albumNewReleases} />
      <HotArtistsSection initialData={hotArtists} />
      <PopularAlbumSections initialData={popularAlbums} />
    </>
  );
}
