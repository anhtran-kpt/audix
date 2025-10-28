import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { albumQueryOptions } from "@/features/album/api/album-query-options";
import { NewReleasesSection } from "./_sections/new-releases-section";
import { PopularAlbumSections } from "./_sections/popular-albums-sections";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { HotArtistsSection } from "./_sections/hot-artists-section";

export default async function DiscoveryPage() {
  const qc = getQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...albumQueryOptions.newReleases({ limit: 5 }) }),
    qc.prefetchQuery({ ...artistQueryOptions.hotArtists({ limit: 5 }) }),
    qc.prefetchQuery({ ...albumQueryOptions.popularAlbums({ limit: 5 }) }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NewReleasesSection />
      <HotArtistsSection />
      <PopularAlbumSections />
    </HydrationBoundary>
  );
}
