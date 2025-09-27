import {
  getAlbumDetail,
  getSuggestionAlbums,
} from "@/features/album/data-access/album-repo";
import { BannerSection } from "./_sections/banner-section";
import { TracksSection } from "./_sections/tracks-section";
import { SuggestionSection } from "./_sections/suggestion-section";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  const album = await getAlbumDetail(albumId);
  const suggestions = await getSuggestionAlbums({
    albumId,
    artistId: album.artistId,
  });

  return (
    <>
      <BannerSection
        imageId={album.imageId}
        title={album.title}
        albumType={album.albumType}
        releaseDate={album.releaseDate}
        artist={album.artist}
        totalTracks={album.totalTracks}
        duration={album.duration}
        genres={album.genres}
        albumId={album.id}
      />
      <TracksSection tracks={album.tracks} albumId={albumId} />
      <SuggestionSection artist={album.artist} albums={suggestions} />
    </>
  );
}
