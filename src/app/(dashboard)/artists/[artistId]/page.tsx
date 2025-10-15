import { DiscographySection } from "./_sections/discography-section";
import { PopularTracksSection } from "./_sections/popular-tracks-section";
import { AboutSection } from "./_sections/about-section";
import { SuggestionSection } from "./_sections/suggestion-section";
import { createQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { BannerSection } from "./_sections/banner-section";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const qc = createQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...artistQueryOptions.banner(artistId) }),
    qc.prefetchQuery({
      ...artistQueryOptions.popularTracks(artistId, { limit: 5 }),
    }),
    qc.prefetchQuery({
      ...artistQueryOptions.discography(artistId, { limit: 5 }),
    }),
    qc.prefetchQuery({ ...artistQueryOptions.about(artistId) }),
    qc.prefetchQuery({
      ...artistQueryOptions.suggestions(artistId, { limit: 5 }),
    }),
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
