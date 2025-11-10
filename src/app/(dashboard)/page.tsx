import { NewReleasesSection } from "./_sections/new-releases-section";
import { PopularAlbumSections } from "./_sections/popular-albums-sections";
import { HotArtistsSection } from "./_sections/hot-artists-section";
import { getHotArtists } from "@/features/artist/artist-data";
import {
  getAlbumNewReleases,
  getPopularAlbums,
} from "@/features/album/album-data";

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
