import { DiscographySection } from "./components/discography-section";
import { AboutSection } from "./components/about-section";
import { OverviewSection } from "./components/overview-section";
import { RelatedArtistsSection } from "./components/related-artists-section";
import {
  getAllStaticArtists,
  getArtistBySlug,
} from "@/features/artists/api/server";

export const revalidate = 3600;

export async function generateStaticParams() {
  const artists = await getAllStaticArtists();

  return artists.map((artist) => ({
    slug: artist.slug,
  }));
}

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const artist = await getArtistBySlug(slug);

  return (
    <>
      <OverviewSection artist={artist} />
      {/* <DiscographySection artistId={artistId} /> */}
      <AboutSection artist={artist} />
      {/* <RelatedArtistsSection artistId={artistId} /> */}
    </>
  );
}
