import { DiscographySection } from "./_sections/discography-section";
import { AboutSection } from "./_sections/about-section";
import { getArtistOverview } from "@/features/artist/artist-data";
import { OverviewSection } from "./_sections/overview-section";
import { requireAuth } from "@/lib/auth";
import { RelatedArtistsSection } from "./_sections/related-artists-section";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;
  const user = await requireAuth();

  const artist = await getArtistOverview({ artistId, userId: user.id });

  return (
    <>
      <OverviewSection artist={artist} />
      <DiscographySection artistId={artistId} />
      <AboutSection artist={artist} />
      <RelatedArtistsSection artistId={artistId} />
    </>
  );
}
