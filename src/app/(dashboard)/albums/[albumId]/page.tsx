import { BannerSection } from "./_sections/banner-section";
import { TracksSection } from "./_sections/tracks-section";
import { SuggestionSection } from "./_sections/suggestion-section";
import { createQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { albumQueryOptions } from "@/features/album/api/album-query-options";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  const qc = createQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...albumQueryOptions.banner(albumId) }),
    qc.prefetchQuery({ ...albumQueryOptions.tracks(albumId) }),
    qc.prefetchQuery({ ...albumQueryOptions.suggestions(albumId) }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection albumId={albumId} />
      <TracksSection albumId={albumId} />
      <SuggestionSection albumId={albumId} />
    </HydrationBoundary>
  );
}
