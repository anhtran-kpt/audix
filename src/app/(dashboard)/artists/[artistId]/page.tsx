import { DiscographySection } from "./_sections/discography-section";
import { PopularTracksSection } from "./_sections/popular-tracks-section";
import { AboutSection } from "./_sections/about-section";
import { SuggestionSection } from "./_sections/suggestion-section";
import { BannerSection } from "./_sections/banner-section";
import { createQueryClient } from "@/lib/query-client";
import { artistQueries } from "@/features/artist/api/artist-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const qc = createQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...artistQueries.banner(artistId) }),
    qc.prefetchQuery({
      ...artistQueries.popularTracks(artistId, { limit: 5 }),
    }),
    qc.prefetchQuery({ ...artistQueries.discography(artistId, { limit: 5 }) }),
    qc.prefetchQuery({ ...artistQueries.about(artistId) }),
    qc.prefetchQuery({ ...artistQueries.suggestions(artistId, { limit: 5 }) }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection artistId={artistId} />
      <PopularTracksSection artistId={artistId} />
      <DiscographySection artistId={artistId} />
      <AboutSection artistId={artistId} />
      <SuggestionSection artistId={artistId} />
    </HydrationBoundary>
  );
}
