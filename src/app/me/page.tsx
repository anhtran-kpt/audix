import { getMyProfile } from "@/features/me/data-access/me-repo";
import { BannerSection } from "./_sections/banner-section";
import { getUserIdOrThrow } from "@/lib/auth";
import { PublicPlaylistSection } from "./_sections/public-playlists-section";
import { FollowingSection } from "./_sections/following-section";

export default async function MePage() {
  const userId = await getUserIdOrThrow();
  const profile = await getMyProfile(userId);

  return (
    <>
      <BannerSection
        image={profile.image}
        name={profile.name}
        followingCount={profile._count.likedArtists}
        playlistCount={profile._count.playlists}
      />
      <PublicPlaylistSection playlists={profile.playlists} />
      <FollowingSection artists={profile.likedArtists} />
    </>
  );
}
