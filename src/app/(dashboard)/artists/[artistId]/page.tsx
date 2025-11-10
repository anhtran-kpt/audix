import { DiscographySection } from "./_sections/discography-section";
import { AboutSection } from "./_sections/about-section";
import { getArtistOverview } from "@/features/artist/artist-data";
import { OverviewSection } from "./_sections/overview-section";
import { RelatedArtistsSection } from "./_sections/related-artists-section";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;
  const user = await getAuthenticatedUser();

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
