import {
  AboutSection,
  BannerSection,
  DiscographySection,
  OtherArtistsSection,
  PopularTracksSection,
} from "@/components/sections/artist-detail";
import db from "@/lib/db";
import { trackDetailSelect } from "@/server/modules/track/presets";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const artist = await db.artist
    .findUniqueOrThrow({
      where: {
        id: artistId,
      },
      select: {
        name: true,
        isVerified: true,
        imageId: true,
        bannerId: true,
        bio: true,
        followersCount: true,
        genres: {
          select: {
            genre: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        tracks: {
          select: {
            track: {
              select: trackDetailSelect,
            },
          },
          take: 5,
        },
      },
    })
    .then((artist) => ({
      ...artist,
      genres: artist.genres.map((data) => data.genre),
      tracks: artist.tracks.map((data) => data.track),
    }));

  const [popularReleases, albumReleases, singleAndEpReleases, otherArtists] =
    await Promise.all([
      db.album.findMany({
        where: {
          artistId,
        },
        take: 5,
        orderBy: {
          releaseDate: "desc",
        },
      }),
      db.album.findMany({
        where: {
          artistId,
          albumType: "ALBUM",
        },
        take: 5,
        orderBy: {
          releaseDate: "desc",
        },
      }),
      db.album.findMany({
        where: {
          artistId,
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
   WHERE "id" <> ${artistId}
   ORDER BY RANDOM()
   LIMIT 5;
`,
    ]);

  return (
    <>
      <BannerSection
        imageId={artist.imageId}
        name={artist.name}
        isVerified={artist.isVerified}
        genres={artist.genres}
        artistId={artistId}
        trackRefs={artist.tracks.map((track) => ({
          id: track.id,
          audioId: track.audioId,
        }))}
      />
      <PopularTracksSection tracks={artist.tracks} artistId={artistId} />
      <DiscographySection
        popularReleases={popularReleases}
        albumReleases={albumReleases}
        singleAndEpReleases={singleAndEpReleases}
      />
      <AboutSection
        bio={artist.bio}
        followersCount={artist.followersCount}
        name={artist.name}
        bannerId={artist.bannerId}
      />
      <OtherArtistsSection artists={otherArtists} />
    </>
  );
}
