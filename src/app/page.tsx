import { getHotAlbums } from "@/features/album/data-access/album-repos";
import { getNewReleases } from "@/features/track/data-access/track-repos";

export default async function DiscoveryPage() {
  const [tracks, albums] = await Promise.all([
    getNewReleases(),
    getHotAlbums(),
  ]);

  return <></>;
}
