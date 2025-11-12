import { OverviewSection } from "./_sections/overview-section";
import { RelatedAlbumsSection } from "./_sections/related-section";
import { getAlbumOverview, getAllAlbums } from "@/features/album/album-data";

export const revalidate = 60 * 60;

export async function generateStaticParams() {
  const albums = await getAllAlbums();

  return albums.map((album) => ({
    albumId: album.id,
  }));
}

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
