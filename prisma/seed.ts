/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { genres as genreData } from "./genres.json";
import { artists as artistData } from "./artists.json";
import { albums as albumData } from "./albums.json";
import { songs as songData } from "./songs.json";
import { AlbumType, ArtistRole, CreditRole } from "@/app/generated/prisma";

async function main() {
  await prisma.$transaction(async (tx) => {
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

    const artistMap = Object.fromEntries(allArtists.map((a) => [a.slug, a.id]));

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

    const songsPure = songData.map((s) => ({
      title: s.title,
      slug: s.slug,
      audioId: s.audioId,
      duration: s.duration,
      trackNumber: s.trackNumber,
      isExplicit: s.isExplicit,
      albumId: albumMap[s.albumSlug],
    }));

    await tx.song.createMany({
      data: songsPure,
      skipDuplicates: true,
    });

    const allSongs = await tx.song.findMany({
      select: { id: true, slug: true },
    });
    const songMap = Object.fromEntries(allSongs.map((s) => [s.slug, s.id]));

    await tx.songArtist.createMany({
      data: songData.flatMap((s) =>
        s.artists.map((ar) => ({
          songId: songMap[s.slug],
          artistId: artistMap[ar.slug],
          role: ar.role as ArtistRole,
          order: ar.order,
        }))
      ),
      skipDuplicates: true,
    });

    await tx.songGenre.createMany({
      data: songData.flatMap((s) =>
        s.genreSlugs.map((gs) => ({
          songId: songMap[s.slug],
          genreId: genreMap[gs],
        }))
      ),
      skipDuplicates: true,
    });

    await tx.songCredit.createMany({
      data: songData.flatMap((s) =>
        s.credits.map((c) => ({
          songId: songMap[s.slug],
          artistId: c.slug ? artistMap[c.slug] : null,
          name: c.name || "",
          role: c.role as CreditRole,
          order: c.order,
        }))
      ),
      skipDuplicates: true,
    });

    for (const alb of albumData) {
      const relatedSongs = songData.filter((s) => s.albumSlug === alb.slug);
      const totalTracks = relatedSongs.length;
      const duration = relatedSongs.reduce((sum, s) => sum + s.duration, 0);

      await tx.album.update({
        where: { slug: alb.slug },
        data: {
          totalTracks,
          duration,
        },
      });
    }
  });

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
