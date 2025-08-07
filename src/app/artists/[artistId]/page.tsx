import { AboutSection } from "@/components/sections/artist-detail/about-section";
import { ActionsSection } from "@/components/sections/artist-detail/actions-section";
import { BannerSection } from "@/components/sections/artist-detail/banner-section";
import { DiscographySection } from "@/components/sections/artist-detail/discography-section";
import { OtherArtistsSection } from "@/components/sections/artist-detail/other-artists-section";
import { PopularTracksSection } from "@/components/sections/artist-detail/popular-tracks-section";
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
    popularTracks,
    popularReleases,
    albumReleases,
    singleAndEpReleases,
    otherArtists,
  ] = await Promise.all([
    prisma.track.findMany({
      where: {
        artists: {
          some: {
            artistId: artist.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        audioId: true,
        duration: true,
        trackNumber: true,
        isExplicit: true,
        playCount: true,
        album: {
          select: {
            artistId: true,
            id: true,
            imageId: true,
            title: true,
          },
        },
        artists: {
          select: {
            artist: {
              select: {
                id: true,
                name: true,
              },
            },
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
    prisma.$queryRaw<{
      id: string;
      name: string;
      imageId: string;
    }>`
  SELECT "id", "name", "imageId"
    FROM "artists"
   WHERE "id" <> ${artist.id}
   ORDER BY RANDOM()
   LIMIT 5;
`,
  ]);

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
      <PopularTracksSection tracks={popularTracks} />
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
