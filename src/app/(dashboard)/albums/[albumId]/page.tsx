import { requireAuth } from "@/lib/auth";
import { getAlbumOverview } from "@/lib/data/album-data";
import { OverviewSection } from "./_sections/overview-section";
import { RelatedAlbumsSection } from "./_sections/related-section";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;
  const user = await requireAuth();

  const album = await getAlbumOverview({ albumId, userId: user.id });

  return (
    <>
      <OverviewSection album={album} />
      <RelatedAlbumsSection albumId={albumId} />
    </>
  );
}
