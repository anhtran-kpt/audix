import { DiscographySection } from "./_sections/discography-section";
import {
  getArtistDetailPage,
  getArtistReleases,
} from "@/features/artist/data-access/artist-repo";
import { PopularTracksSection } from "./_sections/popular-tracks-section";
import { AboutSection } from "./_sections/about-section";
import { SuggestionSection } from "./_sections/suggestion-section";
import { BannerSection } from "./_sections/banner-section";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const [
    { artist, suggestions, popularTracks },
    { popular, albums, singlesAndEps },
  ] = await Promise.all([
    getArtistDetailPage(artistId),
    getArtistReleases(artistId),
  ]);

  return (
    <>
      <BannerSection
        imageId={artist.imageId}
        name={artist.name}
        isVerified={artist.isVerified}
        artistId={artistId}
      />
      <PopularTracksSection tracks={popularTracks} artistId={artistId} />
      <DiscographySection
        artistId={artistId}
        popular={popular}
        albums={albums}
        singlesAndEps={singlesAndEps}
      />
      <AboutSection
        bio={artist.bio}
        artistId={artistId}
        name={artist.name}
        bannerId={artist.bannerId}
      />
      <SuggestionSection artists={suggestions} />
    </>
  );
}
