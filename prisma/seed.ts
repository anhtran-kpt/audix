import prisma from "@/lib/prisma";
import { genres as genreData } from "./genres.json";
import { artists as artistData } from "./artists.json";
import { albums as albumData } from "./albums.json";
import { tracks as trackData } from "./tracks.json";
import { AlbumType, ArtistRole, CreditRole } from "@/app/generated/prisma";

async function main() {
  await prisma.$transaction(
    async (tx) => {
      await tx.genre.createMany({
        data: genreData,
        skipDuplicates: true,
      });

      const allGenres = await tx.genre.findMany({
        select: { id: true, slug: true },
      });

      const genreMap = Object.fromEntries(allGenres.map((g) => [g.slug, g.id]));

      const artistsPure = artistData.map(({ genreSlugs, ...rest }) => rest);

      await tx.artist.createMany({
        data: artistsPure,
        skipDuplicates: true,
      });

      const allArtists = await tx.artist.findMany({
        select: { id: true, slug: true },
      });

      const artistMap = Object.fromEntries(
        allArtists.map((a) => [a.slug, a.id])
      );

      await tx.artistGenre.createMany({
        data: artistData.flatMap((artist) =>
          artist.genreSlugs.map((gs) => ({
            artistId: artistMap[artist.slug],
            genreId: genreMap[gs],
          }))
        ),
        skipDuplicates: true,
      });

      const albumsPure = albumData.map(
        ({ genreSlugs, artistSlug, albumType, releaseDate, ...rest }) => ({
          ...rest,
          artistId: artistMap[artistSlug],
          albumType: albumType as AlbumType,
          releaseDate: new Date(releaseDate),
        })
      );

      await tx.album.createMany({
        data: albumsPure,
        skipDuplicates: true,
      });

      const allAlbums = await tx.album.findMany({
        select: { id: true, slug: true },
      });

      const albumMap = Object.fromEntries(allAlbums.map((a) => [a.slug, a.id]));

      await tx.albumGenre.createMany({
        data: albumData.flatMap((album) =>
          album.genreSlugs.map((gs) => ({
            albumId: albumMap[album.slug],
            genreId: genreMap[gs],
          }))
        ),
        skipDuplicates: true,
      });

      const tracksPure = trackData.map((s) => ({
        title: s.title,
        slug: s.slug,
        audioId: s.audioId,
        duration: s.duration,
        trackNumber: s.trackNumber,
        isExplicit: s.isExplicit,
        albumId: albumMap[s.albumSlug],
      }));

      await tx.track.createMany({
        data: tracksPure,
        skipDuplicates: true,
      });

      const allTracks = await tx.track.findMany({
        select: { id: true, slug: true },
      });
      const trackMap = Object.fromEntries(allTracks.map((s) => [s.slug, s.id]));

      await tx.trackArtist.createMany({
        data: trackData.flatMap((s) =>
          s.artists.map((ar) => ({
            trackId: trackMap[s.slug],
            artistId: artistMap[ar.slug],
            role: ar.role as ArtistRole,
            order: ar.order,
          }))
        ),
        skipDuplicates: true,
      });

      await tx.trackGenre.createMany({
        data: trackData.flatMap((s) =>
          s.genreSlugs.map((gs) => ({
            trackId: trackMap[s.slug],
            genreId: genreMap[gs],
          }))
        ),
        skipDuplicates: true,
      });

      await tx.trackCredit.createMany({
        data: trackData.flatMap((s) =>
          s.credits.map((c) => ({
            trackId: trackMap[s.slug],
            artistId: c.slug ? artistMap[c.slug] : null,
            name: c.name || "",
            role: c.role as CreditRole,
            order: c.order,
          }))
        ),
        skipDuplicates: true,
      });

      for (const alb of albumData) {
        const relatedTracks = trackData.filter((s) => s.albumSlug === alb.slug);
        const totalTracks = relatedTracks.length;
        const duration = relatedTracks.reduce((sum, s) => sum + s.duration, 0);

        await tx.album.update({
          where: { slug: alb.slug },
          data: {
            totalTracks,
            duration,
          },
        });
      }
    },
    {
      timeout: 30000,
    }
  );

  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
