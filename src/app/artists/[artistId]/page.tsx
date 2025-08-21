import {
  AboutSection,
  BannerSection,
  DiscographySection,
  OtherArtistsSection,
  PopularTracksSection,
} from "@/components/sections/artist-detail";
import { getUserIdOrThrow } from "@/lib/auth";
import db from "@/lib/db";
import { trackDetailSelect } from "@/server/modules/track/presets";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;
  const userId = await getUserIdOrThrow();

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
      select: trackDetailSelect,
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
    userId
      ? db.userLikedArtist
          .findUnique({
            where: { userId_artistId: { userId, artistId } },
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
        trackRefs={popularTracks.map((track) => ({
          id: track.id,
          audioId: track.audioId,
        }))}
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
