import { HotAlbumsSection } from "@/components/sections/discovery/hot-albums-section";
import { NewReleasesSection } from "@/components/sections/discovery/new-releases-section";
import { getHotAlbums } from "@/features/album/data-access/album-repos";
import { getNewReleases } from "@/features/track/data-access/track-repos";

export default async function DiscoveryPage() {
  const [tracks, albums] = await Promise.all([
    getNewReleases(),
    getHotAlbums(),
  ]);

  return (
    <>
      <NewReleasesSection tracks={tracks} />
      <HotAlbumsSection albums={albums} />
    </>
  );
}
