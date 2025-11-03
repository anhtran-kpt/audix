import { BannerSection } from "./_sections/banner-section";
import { getUserOverview } from "@/lib/data/user-data";
import { UserPlaylistsSection } from "./_sections/user-playlists-section";
import { FollowersSection } from "./_sections/followers-section";
import { FollowingArtistsSection } from "./_sections/following-artists-section";
import { FollowingUsersSection } from "./_sections/following-users-section";

export default async function UserPage({
  params,
}: {
  params: Promise<{ targetUserId: string }>;
}) {
  const { targetUserId } = await params;
  const data = await getUserOverview(targetUserId);

  return (
    <>
      <BannerSection initialData={data} />
      <UserPlaylistsSection targetUserId={targetUserId} />
      <FollowersSection targetUserId={targetUserId} />
      <FollowingArtistsSection targetUserId={targetUserId} />
      <FollowingUsersSection targetUserId={targetUserId} />
    </>
  );
}
