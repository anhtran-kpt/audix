import { requireAuth } from "@/lib/auth";
import { LikedAlbumsSection } from "./_sections/liked-albums-section";
import { BannerSection } from "./_sections/banner-section";
import { getMyOverview } from "@/lib/data/me-data";
import { MyPlaylistsSection } from "./_sections/my-playlists-section";
import { LikedPlaylistsSection } from "./_sections/liked-playlists-section";
import { FollowingArtistsSection } from "./_sections/following-artists-section";
import { FollowingUsersSection } from "./_sections/following-users-section";
import { FollowersSection } from "./_sections/followers-section";

export default async function MePage() {
  const user = await requireAuth();
  const data = await getMyOverview(user.id);

  return (
    <>
      <BannerSection initialData={data} />
      <MyPlaylistsSection userId={user.id} />
      <LikedPlaylistsSection userId={user.id} />
      <LikedAlbumsSection userId={user.id} />
      <FollowingArtistsSection userId={user.id} />
      <FollowingUsersSection userId={user.id} />
      <FollowersSection userId={user.id} />
    </>
  );
}
