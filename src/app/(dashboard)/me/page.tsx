import { getMyProfile } from "@/features/me/data-access/me-repo";
import { BannerSection } from "./_sections/banner-section";
import { getUserIdOrThrow } from "@/lib/auth";
import { PlaylistSection } from "./_sections/playlists-section";
import { FollowingSection } from "./_sections/following-section";
import { AlbumSection } from "./_sections/albums-section";

export default async function MePage() {
  const userId = await getUserIdOrThrow();
  const profile = await getMyProfile(userId);

  return (
    <>
      <BannerSection
        image={profile.image}
        name={profile.name}
        followingCount={profile._count.followedArtists}
        playlistCount={profile._count.playlists}
      />
      <PlaylistSection initialData={profile.playlists} />
      <AlbumSection albums={profile.likedAlbums} />
      <FollowingSection artists={profile.followedArtists} />
    </>
  );
}
