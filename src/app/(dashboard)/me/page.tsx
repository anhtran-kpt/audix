import { requireAuth } from "@/lib/auth";
import { PlaylistSection } from "./_sections/playlists-section";
import { AlbumSection } from "./_sections/albums-section";
import { BannerSection } from "./_sections/banner-section";
import { getQueryClient } from "@/lib/query-client";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { FollowingArtistsSection } from "./_sections/following-artists-section";
import { FollowingUsersSection } from "./_sections/following-users-section";
import { FollowersSection } from "./_sections/followers-section";

export default async function MePage() {
  await requireAuth();

  const qc = getQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...meQueryOptions.banner() }),
    qc.prefetchQuery({ ...meQueryOptions.myPlaylists() }),
    qc.prefetchQuery({ ...meQueryOptions.likedAlbums() }),
    qc.prefetchQuery({ ...meQueryOptions.followers() }),
    qc.prefetchQuery({ ...meQueryOptions.followedArtists() }),
    qc.prefetchQuery({ ...meQueryOptions.followedUsers() }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection />
      <PlaylistSection />
      <AlbumSection />
      <FollowersSection />
      <FollowingArtistsSection />
      <FollowingUsersSection />
    </HydrationBoundary>
  );
}
