import { requireAuth } from "@/lib/auth";
import { PlaylistSection } from "./_sections/playlists-section";
import { LikedAlbumsSection } from "./_sections/liked-albums-section";
import { BannerSection } from "./_sections/banner-section";
import { getQueryClient } from "@/lib/query-client";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { FollowingArtistsSection } from "./_sections/following-artists-section";
import { FollowingUsersSection } from "./_sections/following-users-section";
import { FollowersSection } from "./_sections/followers-section";
import { LikedPlaylistsSection } from "./_sections/liked-playlists-section";

export default async function MePage() {
  await requireAuth();

  const qc = getQueryClient();

  await Promise.all([
    qc.prefetchQuery({ ...meQueryOptions.banner() }),
    qc.prefetchQuery({ ...meQueryOptions.myPlaylists({ limit: 5 }) }),
    qc.prefetchQuery({ ...meQueryOptions.likedPlaylists({ limit: 5 }) }),
    qc.prefetchQuery({ ...meQueryOptions.likedAlbums({ limit: 5 }) }),
    qc.prefetchQuery({ ...meQueryOptions.followers({ limit: 5 }) }),
    qc.prefetchQuery({ ...meQueryOptions.followedArtists({ limit: 5 }) }),
    qc.prefetchQuery({ ...meQueryOptions.followedUsers({ limit: 5 }) }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection />
      <PlaylistSection />
      <LikedPlaylistsSection />
      <LikedAlbumsSection />
      <FollowersSection />
      <FollowingArtistsSection />
      <FollowingUsersSection />
    </HydrationBoundary>
  );
}
