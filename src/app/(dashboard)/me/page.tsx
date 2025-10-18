import { requireAuth } from "@/lib/auth";
import { PlaylistSection } from "./_sections/playlists-section";
import { FollowingSection } from "./_sections/following-section";
import { AlbumSection } from "./_sections/albums-section";
import { BannerSection } from "./_sections/banner-section";
import { getQueryClient } from "@/lib/query-client";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MePage() {
  await requireAuth();

  const qc = getQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...meQueryOptions.banner() }),
    qc.prefetchQuery({ ...meQueryOptions.myPlaylists() }),
    qc.prefetchQuery({ ...meQueryOptions.likedAlbums() }),
    qc.prefetchQuery({ ...meQueryOptions.followedArtists() }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection />
      <PlaylistSection />
      <AlbumSection />
      <FollowingSection />
    </HydrationBoundary>
  );
}
