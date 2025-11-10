import { getAuthenticatedUser } from "@/lib/auth";
import { LikedAlbumsSection } from "./_sections/liked-albums-section";
import { BannerSection } from "./_sections/banner-section";
import { getMyOverview } from "@/features/me/me-data";
import { MyPlaylistsSection } from "./_sections/my-playlists-section";
import { LikedPlaylistsSection } from "./_sections/liked-playlists-section";
import { FollowingArtistsSection } from "./_sections/following-artists-section";

export default async function MePage() {
  const user = await getAuthenticatedUser();
  const data = await getMyOverview(user.id);

  return (
    <>
      <BannerSection initialData={data} />
      <MyPlaylistsSection userId={user.id} />
      <LikedPlaylistsSection userId={user.id} />
      <LikedAlbumsSection userId={user.id} />
      <FollowingArtistsSection userId={user.id} />
    </>
  );
}
