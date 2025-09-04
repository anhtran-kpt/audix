import {
  AboutSection,
  BannerSection,
  DiscographySection,
  OtherArtistsSection,
  PopularTracksSection,
} from "@/components/sections/artist-detail";
import {
  getArtistDetailPage,
  getArtistReleases,
} from "@/features/artist/data-access/artist-repo";

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
        genres={artist.genres}
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
        id={artistId}
        name={artist.name}
        bannerId={artist.bannerId}
      />
      <OtherArtistsSection suggestions={suggestions} />
    </>
  );
}
