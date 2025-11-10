import { BannerSection } from "./_sections/banner-section";
import { getUserOverview } from "@/features/user/user-data";
import { UserPlaylistsSection } from "./_sections/user-playlists-section";
import { FollowingArtistsSection } from "./_sections/following-artists-section";

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
      <FollowingArtistsSection targetUserId={targetUserId} />
    </>
  );
}
