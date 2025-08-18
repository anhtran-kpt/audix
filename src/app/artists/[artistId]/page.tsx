import {
  AboutSection,
  BannerSection,
  DiscographySection,
  OtherArtistsSection,
  PopularTracksSection,
} from "@/components/sections/artist-detail";
import { requireAuth } from "@/server/auth";
import db from "@/server/db";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;
  const user = await requireAuth();

  const artist = await db.artist.findUniqueOrThrow({
    where: {
      id: artistId,
    },
    include: {
      _count: {
        select: {
          likedBy: true,
        },
      },
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
    isFollowing,
  ] = await Promise.all([
    db.track.findMany({
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
            artist: {
              select: {
                name: true,
                bannerId: true,
                bio: true,
              },
            },
            _count: {
              select: {
                likedBy: true,
              },
            },
          },
        },
        artists: {
          select: {
            artistId: true,
            role: true,
            order: true,
            artist: { select: { id: true, name: true } },
          },
          orderBy: { order: "asc" },
        },
        credits: {
          select: {
            id: true,
            artistId: true,
            name: true,
            order: true,
            role: true,
            details: true,
            artist: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      take: 5,
      orderBy: {
        playCount: "desc",
      },
    }),
    db.album.findMany({
      where: {
        artistId: artist.id,
      },
      take: 5,
      orderBy: {
        releaseDate: "desc",
      },
    }),
    db.album.findMany({
      where: {
        artistId: artist.id,
        albumType: "ALBUM",
      },
      take: 5,
      orderBy: {
        releaseDate: "desc",
      },
    }),
    db.album.findMany({
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
    db.$queryRaw<{
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
    user.id
      ? db.userLikedArtist
          .findUnique({
            where: { userId_artistId: { userId: user.id, artistId } },
          })
          .then(Boolean)
      : Promise.resolve(false),
  ]);

  return (
    <>
      <BannerSection
        imageId={artist.imageId}
        name={artist.name}
        isVerified={artist.isVerified}
        genres={artist.genres}
        artistId={artistId}
        initialFollowing={isFollowing}
        initialCount={artist._count.likedBy}
      />
      <PopularTracksSection tracks={popularTracks} artistId={artistId} />
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
