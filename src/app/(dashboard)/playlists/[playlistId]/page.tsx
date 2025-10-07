import { BannerSection } from "./_sections/banner-section";
import { TracksSection } from "./_sections/tracks-section";
import { BrowseTrackSection } from "./_sections/browse-track-section";
import { createQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  const qc = createQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...playlistQueryOptions.banner(playlistId) }),
    qc.prefetchQuery({ ...playlistQueryOptions.tracks(playlistId) }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection playlistId={playlistId} />
      <TracksSection playlistId={playlistId} />
      <BrowseTrackSection playlistId={playlistId} />
    </HydrationBoundary>
  );
}
