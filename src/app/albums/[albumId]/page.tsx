import {
  BannerSection,
  OtherAlbumsSection,
  TracksSection,
} from "@/components/sections/album-detail";
import db from "@/lib/db";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  const album = await db.album.findUniqueOrThrow({
    where: {
      id: albumId,
    },
    include: {
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
          id: true,
          title: true,
          audioId: true,
          duration: true,
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

  const otherAlbums = await db.album.findMany({
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
        genres={album.genres}
      />
      <TracksSection tracks={album.tracks} albumId={albumId} />
      <OtherAlbumsSection artist={album.artist} albums={otherAlbums} />
    </>
  );
}
