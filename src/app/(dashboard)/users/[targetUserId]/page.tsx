import { PlaylistSection } from "./_sections/playlists-section";
import { FollowingArtistsSection } from "./_sections/following-artists-section";
import { BannerSection } from "./_sections/banner-section";
import { getQueryClient } from "@/lib/query-client";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { FollowingUsersSection } from "./_sections/following-users-section";
import { FollowersSection } from "./_sections/followers-section";

export default async function UserPage({
  params,
}: {
  params: Promise<{ targetUserId: string }>;
}) {
  const { targetUserId } = await params;

  const qc = getQueryClient();

  await Promise.all([
    qc.prefetchQuery({
      ...userQueryOptions.banner(targetUserId),
    }),
    qc.prefetchQuery({
      ...userQueryOptions.playlists(targetUserId, { limit: 5 }),
    }),
    qc.prefetchQuery({
      ...userQueryOptions.followers(targetUserId, { limit: 5 }),
    }),
    qc.prefetchQuery({
      ...userQueryOptions.followingArtists(targetUserId, { limit: 5 }),
    }),
    qc.prefetchQuery({
      ...userQueryOptions.followingUsers(targetUserId, { limit: 5 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <BannerSection userId={targetUserId} />
      <PlaylistSection userId={targetUserId} />
      <FollowersSection userId={targetUserId} />
      <FollowingArtistsSection userId={targetUserId} />
      <FollowingUsersSection userId={targetUserId} />
    </HydrationBoundary>
  );
}
