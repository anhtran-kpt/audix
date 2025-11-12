import { DiscographySection } from "./components/discography-section";
import { AboutSection } from "./components/about-section";
import {
  getAllArtists,
  getArtistOverview,
} from "@/features/artist/artist-data";
import { OverviewSection } from "./components/overview-section";
import { RelatedArtistsSection } from "./components/related-artists-section";

export const revalidate = 60 * 60;

export async function generateStaticParams() {
  const artists = await getAllArtists();

  return artists.map((artist) => ({
    artistId: artist.id,
  }));
}

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const artist = await getArtistOverview(artistId);

  return (
    <>
      <OverviewSection artist={artist} />
      <DiscographySection artistId={artistId} />
      <AboutSection artist={artist} />
      <RelatedArtistsSection artistId={artistId} />
    </>
  );
}
