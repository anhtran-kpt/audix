import { OverviewSection } from "./_sections/overview-section";
import { RelatedAlbumsSection } from "./_sections/related-section";
import { getAlbumOverview } from "@/features/album/album-data";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  const album = await getAlbumOverview(albumId);

  return (
    <>
      <OverviewSection album={album} />
      <RelatedAlbumsSection albumId={albumId} />
    </>
  );
}
