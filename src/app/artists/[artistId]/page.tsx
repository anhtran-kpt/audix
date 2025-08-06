import { AboutSection } from "@/components/sections/artist-detail/about-section";
import { ActionsSection } from "@/components/sections/artist-detail/actions-section";
import { BannerSection } from "@/components/sections/artist-detail/banner-section";
import { DiscographySection } from "@/components/sections/artist-detail/discography-section";
import { OtherArtistsSection } from "@/components/sections/artist-detail/other-artists-section";
import { PopularSongsSection } from "@/components/sections/artist-detail/popular-songs-section";
import prisma from "@/lib/prisma";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const artist = await prisma.artist.findUniqueOrThrow({
    where: {
      id: artistId,
    },
    include: {
      genres: {
        select: {
          genre: {
            select: {
              color: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const [
    popularSongs,
    popularReleases,
    albumReleases,
    singleAndEpReleases,
    otherArtists,
  ] = await Promise.all([
    prisma.song.findMany({
      where: {
        artists: {
          some: {
            artistId: artist.id,
          },
        },
      },
      take: 5,
      orderBy: {
        playCount: "desc",
      },
    }),
    prisma.album.findMany({
      where: {
        artistId: artist.id,
      },
      take: 5,
      orderBy: {
        releaseDate: "desc",
      },
    }),
    prisma.album.findMany({
      where: {
        artistId: artist.id,
        albumType: "ALBUM",
      },
      take: 5,
      orderBy: {
        releaseDate: "desc",
      },
    }),
    prisma.album.findMany({
      where: {
        artistId: artist.id,
        albumType: {
          in: ["EP", "SINGLE"],
        },
      },
      take: 5,
      orderBy: {
        releaseDate: "desc",
      },
    }),
    prisma.artist.findMany({
      where: {
        id: {
          not: artist.id,
        },
      },
      select: {
        id: true,
        name: true,
        imageId: true,
      },
      take: 5,
    }),
  ]);

  console.log(otherArtists);

  return (
    <>
      <BannerSection
        imageId={artist.imageId}
        name={artist.name}
        monthlyListeners={artist.monthlyListeners}
        isVerified={artist.isVerified}
        genres={artist.genres}
      />
      <ActionsSection name={artist.name} />
      <PopularSongsSection songs={popularSongs} />
      <DiscographySection
        popularReleases={popularReleases}
        albumReleases={albumReleases}
        singleAndEpReleases={singleAndEpReleases}
      />
      <AboutSection
        bio={artist.bio}
        monthlyListeners={artist.monthlyListeners}
        name={artist.name}
        bannerId={artist.bannerId}
      />
      <OtherArtistsSection artists={otherArtists} />
    </>
  );
}
