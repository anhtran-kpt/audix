import { ActionsSection } from "@/components/sections/album-detail/actions-section";
import { BannerSection } from "@/components/sections/album-detail/banner-section";
import { OtherAlbumsSection } from "@/components/sections/album-detail/other-albums-section";
import { TracksSection } from "@/components/sections/album-detail/tracks-section";
import prisma from "@/lib/prisma";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  const album = await prisma.album.findUniqueOrThrow({
    where: {
      id: albumId,
    },
    include: {
      tracks: {
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
      },
      artist: {
        select: {
          id: true,
          name: true,
          imageId: true,
        },
      },
    },
  });

  const otherAlbums = await prisma.album.findMany({
    where: {
      artistId: album.artistId,
      id: {
        not: album.id,
      },
    },
    include: {
      tracks: {
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
      },
      artist: {
        select: {
          id: true,
          name: true,
          imageId: true,
        },
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <BannerSection
        imageId={album.imageId}
        title={album.title}
        albumType={album.albumType}
        releaseDate={album.releaseDate}
        artist={album.artist}
        totalTracks={album.totalTracks}
        duration={album.duration}
      />
      <ActionsSection title={album.title} />
      <TracksSection tracks={album.tracks} />
      <OtherAlbumsSection artist={album.artist} albums={otherAlbums} />
    </>
  );
}
